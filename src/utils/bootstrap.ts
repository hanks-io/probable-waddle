import { fetchRemoteConfig, createScript, createStyle, getVersion, getCfgVal, matchStandalone } from "@/utils";
import { App } from "vue";
import router from "@/router";

export const bootstrap = async (app: App) => {
  const remoteConfig = await fetchRemoteConfig(); // 同步配置
  const { jumpDomainType } = getCfgVal(remoteConfig, 'domainInfo') || {};
  if (remoteConfig) {
    window.__APP_CONFIG__ = remoteConfig;
  }
  if (jumpDomainType === 'google' && !matchStandalone()) { // 谷歌域名在非Standalone模式下跳转下载
    const { query } = router.currentRoute.value;
    // 删除query中的pass, acc, token 防止在非Standalone下泄露账户信息
    ['pass', 'acc', 'token'].forEach(key => delete query[key]);
    router.push({ path: '/download', query });
  }
  window.isOpenMainUI = true;

  const version = getVersion();
  const isSamsung = window.isSamsungBrowser();

  const scripts = [
    '/versionControl/index.js',
    '/versionControl/adAnalytics.js',
    !isSamsung && '/versionControl/webPushSdk.produce.min.2.1.6.js'
  ].filter(Boolean);

  createStyle('/versionControl/reload.css', version);
  scripts.forEach(script => createScript(script, version));

  await app.mount('#app'); // 挂载app
  const { initVersionPolling } = await import('@/utils/version');
  await initVersionPolling(); // 版本检测

  const { checkLocationSearchLog } = logInfoControl()
  checkLocationSearchLog()
}

export const logInfoControl = () => {  
  const checkLocationSearchLog = () => {
    console.warn('bootstrap with app url', location.search)
  }
  if (['dev', 'pre'].includes(import.meta.env.VITE_ENV)) {
    return {
      checkLocationSearchLog
    }
  }
  return {
    checkLocationSearchLog: () => {}
  }
}

