import { useRoute } from 'vue-router';


declare global {
  interface WatchRoute {
    use: (...args: any[]) => WatchRoute;
    next: (...rest: any[]) => void;
    execute: (...rest: any[]) => void;
  }
}

export default () => {
  const route = useRoute();

  const cache = ref<Function[]>([]);
  const middlewares = ref<Function[]>([]);

  const watchRoute: WatchRoute = {
    use(...args) {
      args.forEach(item => {
        if (typeof item === 'function') {
          cache.value.push(item)
        }
      })
      return this
    },
    next(...rest) {
      while (middlewares.value.length) {
        const ware = middlewares.value.shift();
        const lock = ware?.call(this, ...rest, this.next.bind(this));
        if (!lock) return;
      }
    },
    execute(...rest) {
      middlewares.value = cache.value.slice(); // 复制一份
      return this.next(...rest);
    },
  };

  /**
   * 发射(触发)事件
   * @param {String} name 事件名称
   * @param {Any} params 回调参数
   */
  provide('watchRoute', watchRoute);

  watch(() => route.path, (newValue, oldValue) => {
    watchRoute.execute(newValue, oldValue)
  });

  return {
    watchRoute
  }
}