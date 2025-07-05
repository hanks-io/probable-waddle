import { decryptData } from "@/utils";

export function getMixinsInfo(urlSearch?: string) {

  const urlParams = new URLSearchParams(urlSearch || window.location.search);
  const entries = Object.fromEntries(urlParams.entries());
  if (!urlParams.has('info')) // 兼容旧版
    return entries;

  const minxinsInfo = decryptData(urlParams.get('info'));
  const params = {
    ...entries,
    ...Object.fromEntries(new URLSearchParams(minxinsInfo || '').entries()),
  };
  delete params.unTopWindow; //排除c域名
  delete params.info; // 排除info
  return params
}

export function getInstallInfo(appStore: AppStore) {
  const urls = Object.fromEntries(new URLSearchParams(window.location.search));
  const token = appStore.token || urls.token;
  const acc = appStore.account || urls.acc;
  const pass = appStore.password || urls.pass;
  const obj = { ...urls, token, acc, pass, fromEntry: 'newPwa' };
  const info = Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('&');
  return info;
}
