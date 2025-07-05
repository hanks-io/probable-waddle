import { useAppStore } from '@/store/app';
import { useSystemStore } from '@/store/system';
import { getJumpGoogleUrl } from './getJumpGoogleUrl';
import { getUrlParam } from '@/utils';
/**
 * @description 浏览器检测
 */
export async function checkBrowser() {
  const appStore = useAppStore();         // app信息
  const systemStore = useSystemStore();   // 系统信息

  if (systemStore.app?.build === 'iOSH5') {
    if (!['Chrome', 'Mobile Safari'].includes(systemStore.browser)) {
      let url = 'googlechromes://' + location.href.replace(/^https?:\/\//, '');
      if (appStore.token) {
        if (url.includes('?')) {
          url += '&token=' + appStore.token;
        } else {
          url += '?token=' + appStore.token;
        }
      }
      location.href = url;
    }
  } else if (systemStore.app?.build === 'AndroidH5') {
    if (systemStore.browser !== 'Chrome') {
      const protocol = location.protocol.replace(':', '');

      let intentURL = location.href.replace(`${location.protocol}//`, '');
      if (appStore.token) {
        if (intentURL.includes('?')) {
          if (!intentURL.includes('token=')) {
            intentURL += '&token=' + appStore.token;
          }
        } else {
          intentURL += '?token=' + appStore.token;
        }
      }
      location.href = `intent://${intentURL}#Intent;scheme=${protocol};package=com.android.chrome;end`
    }
  }
}

/**
 * @description webview检测
 */
export function checkWebView() {
  const systemStore = useSystemStore();   // 系统信息

  if (['Facebook', 'TikTok', 'Chrome WebView'].includes(systemStore.browser)) {
    return true;
  } else {
    return false;
  }
}

export function checkIsSwModal() { // true 代表从sw唤起强制弹出 优先级高于任何弹出
  return getUrlParam('fromEntry') === 'sw' && getUrlParam('contenthost');
}

export function hasBottomToolbar() {
  try {
    const viewportHeight = window?.visualViewport?.height;
    const offsetTop = window?.visualViewport?.offsetTop;
    return offsetTop + viewportHeight < window.innerHeight;
  } catch (error) {
    return window.innerHeight < document.documentElement.clientHeight;
  }
}
