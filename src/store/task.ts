// 任务系统
import { defineStore } from 'pinia'
import { TaskListParams, TaskListModel, TaskListItem, TaskType, TaskDetailModel, TaskRewardModel } from '@/api/task/model'
import { taskListApi, taskDetailApi, taskRewardApi, taskReceiveApi } from "@/api/task";
import { convertMoneyToShow, getLocalTimeByString, getCurrentLocalTime } from '@/utils';


export type TaskInfo = TaskListItem & {
  rewardText: string;
  rewardStatus: 'DISTRIBUTED' | 'RECEIVED' | 'EXPIRED' | null;
  awardInfo?: {
    id: number;
    isExpired: boolean;
    isClaimable: boolean;
    rewardAmount: number;
  };
}

export type TaskRulesType = {
  content: string;
  rule: string;
  otherParam: any;
}

export const useTaskStore = defineStore({
  id: 'app-task',
  state: () => ({
    rulesExplanationMap: {} as Record<TaskType, TaskRulesType>,
    taskMap: new Map<TaskType, TaskInfo[]>(),
    installApkTaskDetail: undefined as TaskDetailModel | undefined,
  }),

  getters: {
    flatTaskList(state): TaskInfo[] {
      if (state.taskMap?.size) {
        return Array.from(state.taskMap.values()).flat()
      }
      return []
    },
    completedTheTaskList() {
      if (this.flatTaskList.length) {
          return this.flatTaskList.filter((item: TaskInfo) => item.rewardStatus === 'DISTRIBUTED' && item.awardInfo?.isClaimable)
      }
      return []
    },
    tasksInProgress() {
      if (this.flatTaskList.length) {
        return this.flatTaskList.filter((item: TaskInfo) => item.rewardStatus !== 'RECEIVED')
      }
      return []
    }
  },

  actions: {

    /**
     * @description 更新指定类型任务列表
     * @param type 任务类型
     */
    async updateTaskList(type: TaskType) {
      const isLogin = await useAppStore().checkUserHasLogin();
      if (isLogin) {
        const params: TaskListParams = {
          page: 1,
          pageSize: 999,
          taskType: type,
          order: [{ type: 'desc', key: 'sort' }],
        }
        const res = await taskListApi(params)
        const { taskList, taskRules } = (res as TaskListModel) || { taskList: [], taskRules: {} };
        if (taskList.length) {
          const isClaimableTime = (claimableTime: Date): boolean => {
            const now = getCurrentLocalTime()
            const targetTime = getLocalTimeByString(claimableTime.toISOString())
            return now.isAfter(targetTime);
          };

          const isExpired = (expireTime: Date): boolean => {
            const now = getCurrentLocalTime()
            const targetTime = getLocalTimeByString(expireTime.toISOString())
            return now.isAfter(targetTime);
          };

          const awardRes = await taskRewardApi({})

          taskList.map((task: TaskInfo) => {
            const minReward = convertMoneyToShow(task.rewardMin)
            const maxReward = convertMoneyToShow(task.rewardMax)
            task.rewardText = task.rewardType === "Fixed" ? `${maxReward}` : `${minReward}~${maxReward}`;
            if (task.rewardStatus === 'DISTRIBUTED') {
              const awardInfo = awardRes?.find((award) => award.taskId === task.id)
              if (awardInfo) {
                const { id, claimableTime, expireTime, rewardAmount } = awardInfo
                task.awardInfo = {
                  id,
                  rewardAmount,
                  isExpired: isExpired(expireTime),
                  isClaimable: isClaimableTime(claimableTime),
                }
              }
            }
            return task
          })
          this.setTaskMap(type, taskList)
          this.setRulesExplanationMap(type, taskRules)
        }
      }
    },
    setRulesExplanationMap(type?: TaskType, taskRules?: TaskRulesType) {
      if (type) {
        const newRules = taskRules as TaskRulesType;
        newRules.otherParam = newRules.otherParam ? JSON.parse(newRules.otherParam || '{}') : '';
        this.rulesExplanationMap[type] = newRules
      } else {
        this.rulesExplanationMap = {} as Record<TaskType, TaskRulesType>
      }
    },
    setTaskMap(type?: TaskType, taskList?: TaskInfo[]) {
      if (type) {
        this.taskMap.set(type, taskList || [])
      } else {
        this.taskMap.clear()
      }
    },
    /**
     * @description 获取指定类型任务列表
     * @param type 任务类型
     */
    getTaskListByType(type: TaskType): TaskInfo[] {
      return this.taskMap.get(type) || []
    },

    /**
     * @description 获取安装apk任务配置
     * @param taskId 任务ID
     */
    getInstallApkConfig(): TaskInfo | undefined {
      const rookieTaskList = this.getTaskListByType('NewbieTask')
      return rookieTaskList.find((task) => task.taskTypeSub === 'NewbieTask:InstallAPK')
    },

    /**
     * @description 获取安装apk任务详情
     */
    async getInstallApkTaskDetail(): Promise<TaskDetailModel | undefined> {
      const isLogin = await useAppStore().checkUserHasLogin();
      if (!isLogin) return
      const installApkConfig = await this.getInstallApkConfig()
      if (installApkConfig) {
        const res = await taskDetailApi({ taskId: installApkConfig.id })
        this.installApkTaskDetail = res
      }
      return this.installApkTaskDetail
    },

    /**
     * @description 检查当前是否需要显示新手任务弹窗
     * @param 任务ID
     */
    async checkShowRookieTaskModal(): Promise<boolean> {
      // 当前运行环境是apk或者ios系统
      if (useSystemStore().app?.build === 'APK'||  useSystemStore().isIOSApp || useSystemStore().isIOS ||  useUserStore().isAPKUser) {
        return false
      }
      // 不存在新人任务
      const taskConfig = this.getInstallApkConfig()
      if (!taskConfig) { 
        return false
      }
      // 任务已完成
      if (taskConfig && taskConfig?.isCompleted) { 
        return false
      }
      return true
    },

    /**
     * @description 获取当前新人任务可领取奖励
     */
    async getRookieTaskReward(): Promise<TaskRewardModel> {
      const isLogin = await useAppStore().checkUserHasLogin();
      if (!isLogin) return []
      const taskConfig = this.getInstallApkConfig()
      if (taskConfig) {
        const res = await taskRewardApi({ taskId: taskConfig.id })
        return res as TaskRewardModel
      }
      return []
    },
  },
})

