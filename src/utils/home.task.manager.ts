/**
 * 任务优先级类型
 * - busy: 忙碌，例如获取游戏列表、轮播图等
 * - normal: 正常，例如获取各种类型弹出等
 * - idle: 闲时，例如活动、任务等
 */
type TaskPriority = 'busy' | 'normal' | 'idle';

/**
 * 任务接口
 * - task: 任务回调函数，返回一个 Promise
 * - priority: 任务优先级
 * - id: 任务唯一标识
 * - timeout: 可选超时时间（毫秒）
 * - retries: 可选重试次数
 */
interface Task {
  task: (priority: TaskPriority) => Promise<any>;
  priority: TaskPriority;
  id: string;
  timeout?: number;
  retries?: number;
}

/**
 * 任务管理器接口
 * - run: 添加任务，支持超时和重试
 * - wait: 添加等待任务
 * - execute: 执行任务队列
 * - pause: 暂停执行
 * - resume: 恢复执行
 * - cancel: 取消特定任务
 * - clear: 清空队列和资源
 * - on: 事件监听
 */
interface TaskManager {
  run(taskCallback: (priority: TaskPriority) => Promise<any>, priority?: TaskPriority, options?: { timeout?: number; retries?: number }): TaskManager;
  wait(ms: number, priority?: TaskPriority): TaskManager;
  execute(): Promise<void>;
  pause(): void;
  resume(): void;
  cancel(taskId: string): void;
  clear(): void;
  on(event: 'start' | 'complete' | 'error', callback: (data: any) => void): TaskManager;
}

/**
 * HomeTaskManager 类实现了 TaskManager 接口
 */
class HomeTaskManager implements TaskManager {
  private queue: Task[] = [];
  private isRunning = false;
  private isPaused = false;
  private cleanupCallbacks: (() => void)[] = [];
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor() {
    this.eventListeners.set('start', []);
    this.eventListeners.set('complete', []);
    this.eventListeners.set('error', []);
  }

  /**
   * 添加任务，支持超时和重试
   * @param taskCallback 任务回调函数
   * @param priority 任务优先级
   * @param options 可选参数，包含超时和重试次数
   * @returns TaskManager 实例
   */
  run(
    taskCallback: (priority: TaskPriority) => Promise<any>,
    priority: TaskPriority = 'normal',
    options: { timeout?: number; retries?: number } = {}
  ): TaskManager {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const task: Task = {
      task: taskCallback,
      priority,
      id,
      timeout: options.timeout,
      retries: options.retries ?? 0,
    };
    this.insertTask(task);
    return this;
  }

  /**
   * 添加等待任务
   * @param ms 等待时间（毫秒）
   * @param priority 任务优先级
   * @returns TaskManager 实例
   */
  wait(ms: number, priority: TaskPriority = 'normal'): this {
    this.insertTask({
      task: () => new Promise(resolve => setTimeout(resolve, ms)),
      priority,
      id: `wait-${Date.now()}`,
    });
    return this;
  }

  /**
   * 按优先级插入任务
   * @param task 任务对象
   */
  private insertTask(task: Task): void {
    const priorityOrder = { busy: 1, normal: 2, idle: 3 };
    const index = this.queue.findIndex(t => priorityOrder[t.priority] > priorityOrder[task.priority]);
    if (index === -1) this.queue.push(task);
    else this.queue.splice(index, 0, task);
  }

  /**
   * 执行任务队列
   */
  async execute(): Promise<void> {
    if (this.isRunning) {
      console.warn("Task execution is already in progress.");
      return;
    }
    this.isRunning = true;
    this.emit('start', { queueLength: this.queue.length });

    try {
      while (this.queue.length && !this.isPaused) {
        const task = this.queue.shift()!;
        await this.executeTask(task);
      }
    } catch (error) {
      this.emit('error', { error });
      throw error;
    } finally {
      if (!this.isPaused) {
        this.isRunning = false;
        this.emit('complete', { remaining: this.queue.length });
        this.clear();
      }
    }
  }

  /**
   * 执行单个任务，支持超时和重试
   * @param task 任务对象
   */
  private async executeTask(task: Task): Promise<void> {
    let attempts = task.retries! + 1; 
    while (attempts > 0) {
      try {
        const taskPromise = task.priority === 'idle' && 'requestIdleCallback' in window
          ? this.runIdleTask(task.task)
          : task.task(task.priority);

        const timeoutPromise = task.timeout
          ? new Promise((_, reject) => setTimeout(() => reject(new Error("Task timed out")), task.timeout))
          : null; 

        await (timeoutPromise ? Promise.race([taskPromise, timeoutPromise]) : taskPromise);
        return; // 成功则退出
      } catch (error) {
        attempts--;
        if (attempts === 0) {
          console.error(`Task ${task.id} failed after retries: ${error}`);
          this.emit('error', { taskId: task.id, error });
          return;
        }
        await new Promise(resolve => setTimeout(resolve, attempts * 100)); // 重试间隔
      }
    }
  }

  /**
   * 利用 requestIdleCallback 执行 idle 任务
   * @param task 任务回调函数
   * @returns Promise
   */
  private runIdleTask(task: (priority: TaskPriority) => Promise<any>): Promise<void> {
    return new Promise((resolve, reject) => {
      const callback = async () => {
        try {
          await task('idle');
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      const id = 'requestIdleCallback' in window
        ? window.requestIdleCallback(callback)
        : setTimeout(callback, 0);

      this.cleanupCallbacks.push(() => {
        if ('requestIdleCallback' in window) {
          window.cancelIdleCallback(id as number);
        } else {
          clearTimeout(id as NodeJS.Timeout);
        }
      });
    });
  }

  /**
   * 暂停执行
   */
  pause(): void {
    if (this.isRunning && !this.isPaused) {
      this.isPaused = true;
      console.warn("Task execution paused.");
    }
  }

  /**
   * 恢复执行
   */
  resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      console.warn("Task execution resumed.");
      this.execute();
    }
  }

  /**
   * 取消特定任务
   * @param taskId 任务唯一标识
   */
  cancel(taskId: string): void {
    const index = this.queue.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      console.warn(`Task ${taskId} canceled.`);
    }
  }

  /**
   * 清空队列和资源
   */
  clear(): void {
    this.cleanupCallbacks.forEach(cb => cb());
    this.cleanupCallbacks = [];
    this.queue = [];
    console.warn("Task queue cleared.");
  }

  /**
   * 事件监听
   * @param event 事件类型
   * @param callback 回调函数
   * @returns TaskManager 实例
   */
  on(event: 'start' | 'complete' | 'error', callback: (data: any) => void): this {
    const listeners = this.eventListeners.get(event);
    if (listeners) listeners.push(callback);
    return this;
  }

  /**
   * 触发事件
   * @param event 事件类型
   * @param data 事件数据
   */
  private emit(event: 'start' | 'complete' | 'error', data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) listeners.forEach(cb => cb(data));
  }
}

// 使用示例
export const taskManager = new HomeTaskManager();

const getActiveTask = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟异步任务
  console.warn('getActiveTask');
  throw new Error('getActiveTask error');
  return 'task1';
};

const getGameTask = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟异步任务
  console.warn('getGameTask');
  return 'task2';
};

const getNoticeTask1 = async (with3?: string) => {
  await new Promise(resolve => setTimeout(resolve, 200)); // 模拟异步任务
  console.warn('getNoticeTask1', with3 ? `${with3}` : '');
  return 'task3';
};

const getNoticeTask2 = async () => {
  await new Promise(resolve => setTimeout(resolve, 200)); // 模拟异步任务
  console.warn('getNoticeTask2');
  return 'task4';
};

const getNoticeTask3 = async (priority?: TaskPriority) => {
  await getNoticeTask1(`with priority ${priority}`);
  await new Promise(resolve => setTimeout(resolve, 200)); // 模拟异步任务
  console.warn('getNoticeTask3');
  return 'task5';
};

// // 使用案例
// taskManager
//   .run(getActiveTask, 'busy', { retries: 3})
//   .run(getNoticeTask1, 'normal', { timeout: 1000 })
//   .run(getNoticeTask2, 'normal', { retries: 2 })
//   .wait(500) // 如果需要等待 则使用wait 注意wait 默认的优先级是normal 注意下文中busy的场景 会覆盖wait的优先级 导致wait的场景会延迟
//   .run(getGameTask, 'normal')
//   .run(getNoticeTask3, 'busy')
//   .run(getNoticeTask3, 'idle')
//   .on('error', ({ taskId, error }) => console.warn(`任务 ${taskId} 失败: ${error}`))
//   .on('complete', ({ remaining }) => console.warn(`完成，剩余 ${remaining} 个任务`))
//   .on('start', ({ queueLength }) => console.warn(`开始，当前任务数量 ${queueLength}`))
//   .execute();

export default taskManager; 
