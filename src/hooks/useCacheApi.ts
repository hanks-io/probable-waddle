import localForage from "localforage";
import type { Ref } from "vue";
import { cloneDeep } from '@/utils/lodash.local'

localForage.config({
  name: "_api_cache",
  version: 1.0,
  storeName: "_api_cache",
  description: "_api_cache",
});
  

/**
 * @description 缓存api的配置项
 */
type CacheApiOptions<T, P> = Partial<{
  key: string; 
  params: P;
  expireTime: number | null;
  cachePrefixKey: string;
  loading: Ref<boolean>;
  cacheInterceptor: (param: { params: P; data: T }) => boolean;
  success: (data?: T, hasCache?: boolean) => void 
}>

/**
 * @description 使用缓存的api
 * @param {Function} requestFn - 请求函数
 * @param {CacheApiOptions<T, P>} options - 配置项
 * @param {string} [options.key] - 缓存的key，如果不传则根据请求函数名和参数自动生成
 * @param {P | P[] | undefined} [options.params] - 请求参数，可以是单个参数或参数数组
 * @param {number|null} [options.expireTime] - 缓存过期时间（毫秒），null表示不过期
 * @param {string} [options.cachePrefixKey="apiCache"] - 缓存前缀
 * @param {Ref<boolean>} [options.loading] - 加载状态的ref对象，默认为ref(true)
 * @param {Function} [options.cacheInterceptor] - 缓存拦截器，返回true时缓存，false时不缓存
 * @param {Function} [options.success] - 请求成功回调函数，参数为数据和是否命中缓存
 * @returns {Object} 返回包含data、loading、error、refresh、clearCache和clearAllCache属性的对象
 */
export function useCacheApi<T = any, P = any>(requestFn: Function, options: CacheApiOptions<T, P>) {
  const {
    key = "",
    params,
    expireTime = null,
    cachePrefixKey = "apiCache",
    loading = ref(true), // 加载状态, 如果没有传入loading，就在这初始化，否则使用传入的loading
    success = () => {},
    cacheInterceptor = (): boolean => true, // 为true时缓存，为false时不缓存, 传入params和data，以备外部根据数据判断是否缓存
  } = options;

  const data = ref<T>();
  const error = ref();

  /**
   * @description 深拷贝params, 防止外部修改params影响当前请求
   */
  const immutableParams = cloneDeep(params) as P;

  const paramsList = Array.isArray(immutableParams) ? immutableParams : immutableParams ? [immutableParams] : [];

  /**
   * @description 创建缓存key
   * @returns string
   */
  const createKey = () => {
    const { ch: channelId = '', sd = '' } = Object.fromEntries(new URLSearchParams(window.location.search));
    const pos = !channelId && !sd ? '' : `${channelId}_${sd}@`
    if (key) return `${pos}${cachePrefixKey}_${key}`;
    const argsStr = paramsList?.map((item) => JSON.stringify(item)).join("_");
    return `${pos}${cachePrefixKey}_${requestFn.name}_${argsStr}`;
  };

  // 清除指定key的缓存
  const clearCache = () => {
    localForage.removeItem(createKey());
  };

  // 清除所有缓存
  const clearAllCache = () => {
    localForage.clear();
  };

  const fetchData = async (type = "init") => {
    loading.value = true;
    const key = createKey();
    let hasCache = false;
    try {
      // 1. 读取缓存
      const cacheStr = await localForage.getItem(key);
      if (cacheStr) {
        const cache = JSON.parse(cacheStr as string);
        hasCache = true;
        // 如果没有设置过期时间，或者缓存未过期，直接返回
        const isExpired = expireTime
          ? Date.now() - cache.timestamp > expireTime
          : false;
        if (!isExpired) {
          data.value = cache.data;
          success(cache.data);
          if (type === "init") {
            loading.value = false;
          }
          // 如果设置了过期时间且缓存未过期，直接返回
          if (expireTime) {
            return;
          }
        }
      }

      // 2. 发起请求
      const res = await requestFn(...paramsList) as T;
      // debugger;
      data.value = res;
      success(res, hasCache);
      // 3. 更新缓存
      // cacheInterceptor 为了有更多控制方式，使用参数与返回的结果进行判断是否需要缓存
      if (cacheInterceptor({ params: immutableParams, data: res })) {
        const cache = {
          data: res,
          timestamp: Date.now(),
        };
        await localForage.setItem(key, JSON.stringify(cache));
      }
    } catch (err) {
      error.value = err;
      console.error("请求失败:", err);
    } finally {
      loading.value = false;
    }
  };

  const refresh = () => fetchData("refresh");

  // 初始调用
  if (requestFn) {
    fetchData("init");
  }

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
    clearAllCache,
  };
}
