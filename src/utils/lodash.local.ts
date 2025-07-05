import deepEqual from "./deepEqual";

function capitalize(str: string) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function isObject(value: any) {
  const type = typeof value;
  return value != null && (type == "object" || type == "function");
}

function maxBy<T>(array: T[], iteratee: ((value: T) => any) | string): T | undefined {
  if (!array || !array.length) {
    return undefined;
  }

  let result = array[0];
  let computed = -Infinity;
  let current;

  for (const value of array) {
    current = typeof iteratee === "function"
      ? iteratee(value)
      : value[iteratee as keyof T];

    if (current > computed || (current === computed && value > result)) {
      computed = current;
      result = value;
    }
  }

  return result;
}

function isInteger(value: any) {
  return Number.isInteger(value);
}

function random(lower = 0, upper = 1, floating = false) {
  if (arguments.length === 1 && typeof lower !== "boolean") {
    upper = lower;
    lower = 0;
  }
  if (lower > upper) [lower, upper] = [upper, lower];
  if (floating || Number.isFinite(lower) && lower % 1 || Number.isFinite(upper) && upper % 1) {
    return lower + Math.random() * (upper - lower);
  }
  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function isNaN(value: any) {
  return Number.isNaN(value);
}

function isEmpty(value: any) {
  if (value == null) return true; // null 或 undefined
  if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
  if (value instanceof Set || value instanceof Map) return value.size === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false; // 数字、布尔、函数等
}


function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T {
  let leading = true;
  let trailing = true;

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  if (isObject(options)) {
    leading = options.leading ?? leading;
    trailing = options.trailing ?? trailing;
  }

  return debounce(func, wait, {
    leading,
    maxWait: wait,
    trailing
  });
}


function camelCase(str: string = ""): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, char => char.toLowerCase());
}


interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): T & { cancel: () => void; flush: () => ReturnType<T> } {
  let lastArgs: IArguments | undefined;
  let lastThis: any;
  let maxWait: number | undefined;
  let result: ReturnType<T>;
  let timerId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  const leading = !!options.leading;
  const maxing = typeof options.maxWait !== "undefined";
  const trailing = "trailing" in options ? !!options.trailing : true;

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : undefined;

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args as any);
    return result;
  }

  function leadingEdge(time: number): ReturnType<T> {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait! - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait!)
    );
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge(time);
      return;
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number): ReturnType<T> {
    timerId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush(): ReturnType<T> {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: Parameters<T>): ReturnType<T> {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as T & { cancel: () => void; flush: () => ReturnType<T> };
}

function concat<T>(array: T[], ...values: Array<T | T[]>): T[] {
  const result = array ? [...array] : [];
  for (const value of values) {
    if (Array.isArray(value)) {
      result.push(...value);
    } else {
      result.push(value);
    }
  }
  return result;
}

function meanBy<T>(
  array: T[] | null | undefined,
  iteratee: ((value: T) => number) | keyof T = (val: T) => val as any
): number {
  if (!array || !array.length) return NaN;
  const getValue = typeof iteratee === "function"
    ? iteratee
    : (item: T) => item[iteratee] as any;
  const sum = array.reduce((acc, item) => acc + (Number(getValue(item)) || 0), 0);
  return sum / array.length;
}

function pick<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  ...keys: Array<K | K[]>
): Pick<T, K> {
  if (!obj || typeof obj !== "object") return {} as Pick<T, K>;
  const result = {} as Pick<T, K>;
  const flatKeys = keys.flat();
  for (const key of flatKeys) {
    if (key in obj) {
      result[key as K] = obj[key as keyof T] as T[K];
    }
  }
  return result;
}

function shuffle<T>(array: T[] | null | undefined): T[] {
  if (!array || !array.length) return [];
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function floor(number: number, precision: number = 0): number {
  if (isNaN(number) || !isFinite(number)) return NaN;
  const factor = Math.pow(10, precision);
  return Math.floor(number * factor) / factor;
}

function cloneDeep<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return value.map(item => cloneDeep(item)) as any;
  }
  if (value instanceof Date) return new Date(value) as any;
  if (value instanceof RegExp) return new RegExp(value) as any;
  const result: any = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = cloneDeep(value[key]);
    }
  }
  return result;
}

function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

function merge<T extends object, U extends object>(target: T, source: U): T & U {
  const result = { ...target } as T & U;
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
        const targetValue = (target as any)[key];
        result[key as keyof (T & U)] = merge(
          targetValue || {} as any,
          sourceValue as any
        ) as any;
      } else {
        result[key as keyof (T & U)] = sourceValue as any;
      }
    }
  }
  return result;
}

function omit<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  ...keys: Array<K | K[]>
): Omit<T, K> {
  if (!obj || typeof obj !== "object") return {} as Omit<T, K>;
  const result = { ...obj };
  const flatKeys = keys.flat(); // 扁平化keys
  for (const key of flatKeys) {
    delete (result as any)[key];
  }
  return result as Omit<T, K>;
}

function isFunction(value: any): value is Function {
  return typeof value === "function";
}

function isEqual<T>(value: T, other: unknown): value is T {
  return deepEqual(value, other, new WeakMap());
}

function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== "undefined";
}

function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

// 是否是空
function isNull(val: unknown): val is null {
  return val === null;
}

// 是否是空或者未定义
function isNullOrUnDefOrNoth(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val) || val === "";
}

// 转换字符串 \n 为 br 标签
function formatbr(str) {
  if (!str) return "";
  return str.replace(/\n/g, "<br>");
}

export {
  formatbr,
  capitalize,
  maxBy,
  isInteger,
  random,
  isNaN,
  isEmpty,
  throttle,
  camelCase,
  debounce,
  concat,
  meanBy,
  pick,
  shuffle,
  floor,
  cloneDeep,
  isArray,
  merge,
  omit,
  isFunction,
  isEqual,
  is,
  isDef,
  isUnDef,
  isNull,
  isNullOrUnDefOrNoth
};
