/**
 * url检测
 */
export function urlCheck(url: string) {
  if (url.includes('http://') || url.includes('https://'))
    return url;
  else
    return `http://${url}`;
};