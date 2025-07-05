import { isEmpty,decryptData,encryptData } from '@/utils';
/**
 * 获取 URL 参数
 * @param url URL 字符串，如果不传则使用当前页面的 URL
 * @returns 包含所有参数的对象
 */
export function getUrlParams(url?: string): Record<string, string> {
  // 如果没有传入 URL，使用当前页面的 URL
  const urlString = url || window.location.href;
  
  try {
    // 创建 URL 对象
    const urlObj = new URL(urlString);
    const params: Record<string, string> = {};
    
    // 获取所有查询参数
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  } catch (error) {
    // 如果 URL 解析失败，使用正则表达式提取参数
    const params: Record<string, string> = {};
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    let match;
    
    while ((match = regex.exec(urlString))) {
      const [, key, value] = match;
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    
    return params;
  }
}

/**
 * 获取指定参数的值
 * @param name 参数名
 * @param url URL 字符串，如果不传则使用当前页面的 URL
 * @returns 参数值或 null
 */
export function getUrlParam(name: string, url?: string): string | null {
  const params = getUrlParams(url);
  return params[name] || null;
}

/**
 * 检查 URL 是否包含指定参数
 * @param name 参数名
 * @param url URL 字符串，如果不传则使用当前页面的 URL
 * @returns boolean
 */
export function hasUrlParam(name: string, url?: string): boolean {
  const params = getUrlParams(url);
  return name in params;
}

/**
 * 添加或更新 URL 参数
 * @param params 要添加或更新的参数对象
 * @param url URL 字符串，如果不传则使用当前页面的 URL
 * @returns 新的 URL 字符串
 */
export function updateUrlParams(params: Record<string, string>, url?: string): string {
  const urlString = url || window.location.href;
  const urlObj = new URL(urlString);
  
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });
  
  return urlObj.toString();
} 

export function jumpActivityId(activityItem: any) {
  return (activityItem?.hasOwnProperty('activityDetailSelect') && !isEmpty(activityItem.activityDetailSelect)) ? activityItem.id + '@' + activityItem.activityDetailSelect : activityItem.id;
}

export const getImageUrl = (path: string) => new URL(`../assets/${path}`, import.meta.url).href

// 图片预加载缓存
const imageCache = new Map<string, string>();

export const getImageUrlWithCache = (path: string) => {
  // 检查缓存中是否已存在
  if (imageCache.has(path)) {
    return imageCache.get(path)!;
  }
  
  // 生成新的URL并缓存
  const imageUrl = new URL(`../assets/${path}`, import.meta.url).href;
  imageCache.set(path, imageUrl);
  
  // 预加载图片
  const img = new Image();
  img.src = imageUrl;
  
  return imageUrl;
}

export function httpCompletion(url: string) {
  if (['http://', 'https://'].some(item => url.includes(item)))
    return url;
  return `https://${url}`;
}

/**
 * @description 拼接url参数
 * @param params 参数对象
 */
export function buildUrlParam(params: Record<string, any>) {
  const filteredParams: Record<string, any> = {};
  for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== undefined && params[key] !== '') {
        filteredParams[key] = params[key];
      }
  }
  const  keyList = Object.keys(filteredParams)
  if(!keyList.length) return ''
  const queryString = keyList.map(key => `${key}=${filteredParams[key]}`).join('&');
  return `?${queryString}`;
}


