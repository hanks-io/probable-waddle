/**
 * 降序排列数组
 * @param arr 数组
 */
export function descend(arr: any[]) {
  return arr.sort((a: any, b: any) => b.sort - a.sort)
}