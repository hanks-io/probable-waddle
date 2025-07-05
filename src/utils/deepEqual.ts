/**
 * 深度比较两个值是否相等，支持基本类型、对象、数组和特殊类型。
 * @param value 第一个比较值
 * @param other 第二个比较值
 * @returns 如果值深度相等，返回 `true`；否则返回 `false`
 */
// 内部函数，处理递归比较并跟踪循环引用
function deepEqual(value: unknown, other: unknown, visited: WeakMap<object, object>): boolean {
  // 1. 严格相等比较（处理相同引用、null、undefined 和基本类型）
  if (value === other) {
    return true;
  }

  // 2. 处理 NaN 和 0/-0
  if (typeof value === 'number' && typeof other === 'number') {
    if (isNaN(value) && isNaN(other)) return true;
    if (value === 0 && other === 0) return 1 / value === 1 / other; // 区分 0 和 -0
  }

  // 3. 确保两者都是非 null 对象
  if (value == null || other == null || typeof value !== 'object' || typeof other !== 'object') {
    return false;
  }

  // 4. 处理循环引用
  if (visited.has(value)) {
    return visited.get(value) === other;
  }
  visited.set(value, other);

  // 5. 处理特殊类型
  // Date
  if (value instanceof Date && other instanceof Date) {
    return value.getTime() === other.getTime();
  }
  // RegExp
  if (value instanceof RegExp && other instanceof RegExp) {
    return value.source === other.source && value.flags === other.flags;
  }
  // Map
  if (value instanceof Map && other instanceof Map) {
    if (value.size !== other.size) return false;
    for (const [k, v] of value) {
      if (!other.has(k) || !deepEqual(v, other.get(k), visited)) return false;
    }
    return true;
  }
  // Set
  if (value instanceof Set && other instanceof Set) {
    if (value.size !== other.size) return false;
    const arr1 = Array.from(value).sort();
    const arr2 = Array.from(other).sort();
    return deepEqual(arr1, arr2, visited);
  }

  // 6. 处理数组
  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) return false;
    return value.every((item, i) => deepEqual(item, other[i], visited));
  }

  // 7. 处理普通对象
  if (
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.getPrototypeOf(other) === Object.prototype
  ) {
    const keys1 = Object.keys(value);
    const keys2 = Object.keys(other);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => deepEqual((value as any)[key], (other as any)[key], visited));
  }

  // 8. 其他类型（如函数、自定义对象）按引用比较
  return value === other;
}

export default deepEqual;
