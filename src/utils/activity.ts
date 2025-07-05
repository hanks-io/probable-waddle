// 处理活动相关
import { throttle } from "./lodash.local";

export function throttleActivity(fn: (...args: any[]) => any) {
  return throttle(fn, 2000, { trailing: false });
}
