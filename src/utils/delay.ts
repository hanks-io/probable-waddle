/**
 * @description 延迟函数
 * @param duration 延迟时间<毫秒>
 */
export function delay(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
};