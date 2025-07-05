import { buildUrlParam } from '@/utils';
import { openUrl } from '@/utils';

export const IframeTrameTypes = {
  PWA_PARAMS: 'PWA_PARAMS',
  OPEN_URL: 'OPEN_URL',
  IN_SERVICE_WORKER: 'IN_SERVICE_WORKER',
}

export const isSafetyParent = (win: Window = window) => window.name.includes('inner-iframe-app');
// 添加检查是否在 iframe 中的函数
export function isInIframe() {
  try {
    if (isSafetyParent()) {
      return true;
    }
    return window.self !== window.top;
  } catch (e) {
    return false;
  }
}

/**
 * @description 向父窗口发送PWA参数
 * @param params 需要发送的参数对象
 * @param type 消息类型
 * @param cb 回调函数 触发在非iframe中
 */
export const sendPwaPramsToParent = async (params: Record<string, string>, type?: string, cb?: () => void) => {
  if (isInIframe()) {
    await window.parent.postMessage({ type: type || IframeTrameTypes.PWA_PARAMS, params }, '*');
  } else {
    cb && cb();
    console.warn('unSafetyParent or use top window ', params);
  }
}

export const postParent = (win: Window = window) => {
  console.log('iframe: setting postParent');
  const messageHandler = async (event: MessageEvent) => {

    if (event.data) {
      const handlers: { [key: string]: (data: any) => Promise<void> | void } = {
        [IframeTrameTypes.PWA_PARAMS]: async (data) => {
          console.log('iframe: getPwaParams:', data);
          const tenantId = useTenantStore().tenantId;
          if (data && data.params) {
            const { token } = data.params;
            data.params.tenantId = tenantId;
            data.params.unTopWindow = true;
            data.params.token =  !token?  await useAppStore().token : token;
            const params = buildUrlParam({ ...data.params }); // 构建url参数
            console.log('iframe: setReceviceMessage:', params);
            useAppStore().setReceviceMessage(params); // 消息转发
          }
        },
        [IframeTrameTypes.OPEN_URL]: async (data) => {
          console.log('iframe: getShareAgentUrl:', data);
          const { url, type } = data?.params;
          if (url) {
            openUrl(url, type);
          }
        },
        [IframeTrameTypes.IN_SERVICE_WORKER]: async (data) => {
          console.log('iframe: isInIframe:', data);
        }
      };
      handlers[event.data?.type] && await handlers[event.data?.type](event.data);
    }
  };

  win.addEventListener('message', messageHandler, false);

  // 返回一个清理函数，用于移除事件监听器
  return {
    clear: () => {
      console.log('iframe: clearing postParent');
      win.removeEventListener('message', messageHandler, false);
    }
  };
};
