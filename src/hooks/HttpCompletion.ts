// 移除谷歌浏览器跳转地址(android) 已废弃方法 intentChrome 废弃原因 由于循环依赖导致拆包单独打包 而导致多一次tcp链接 消耗连接数
/**
 * @description 跳转链接补全
 */
export function httpCompletion(url: string) {
  if (['http://', 'https://'].some(item => url.includes(item)))
    return url;
  return `https://${url}`;
}

/**
 * 获取url的参数
 */
export function getUrlParams(url: string) {
  try {
    const params = new URL(url).searchParams;
    const paramsObj: Record<string, any> = {};
    for (const [key, value] of params.entries()) {
      paramsObj[key] = value;
    }
    return paramsObj;
  } catch (error) {
    console.error('Invalid URL:', url);
    window.location.reload(true);
    return {};
  }
}

/**
 * 获取url的路径
 */
/**
 * 获取url的路径
 */
export function getUrlPath(url: string) {
  try {
    return new URL(url).pathname;
  } catch (error) {
    console.error('Invalid URL:', url);
    window.location.reload(true);
    return '';
  }
}
