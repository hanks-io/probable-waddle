import { BROWSER, OS, SOCIAL } from "@/enums/device";
import { useSystemStore } from "@/store/system";
import packageJson from "../../package.json";
import { useAppStore } from "@/store/app";
import { getUrlParams } from '@/hooks/HttpCompletion';
import { isInIframe, IframeTrameTypes, sendPwaPramsToParent, getMixinsInfo, isEqual } from '@/utils';
/**
 * @description 获取当前的构建版本号
 */
export function getBuildVersion(): string {
  return packageJson.version ?? "未知版本";
}

/**
 * @description 获取当前的域名
 */
export function getWebDomain(): string {
  const domain = import.meta.env.VITE_TRPC_HOST || window.location.host;
  if (domain.startsWith("www.")) return domain.replace("www.", "");
  return domain;
}

/**
 * @description 获取当前的完整域名
 */
export function getFullWebDomain(): string {
  return import.meta.env.VITE_TRPC_HOST || window.location.host;
}

/**
 * @description 跳转到指定URL
 * @param url 跳转网址
 */
export function openUrl(url: string, type?: string) {
  const systemStore = useSystemStore();

  // 使用表驱动定义不同场景的处理方式
  const urlHandlerTable = [
    {
      condition: () => systemStore.isApk || systemStore.isIosShelfPackage || systemStore.browser === BROWSER.WEBKIT,
      handler: () => openWindow(url)
    },
    {
      condition: () => (systemStore.os === OS.ANDROID && type === SOCIAL.KWAI) || type === SOCIAL.OPEN_URL,
      handler: () => window.open(url, "_blank")
    },
    {
      condition: () => true,
      handler: () => window.location.href = url
    }
  ];

  // 查表获取对应的处理函数
  const handler = urlHandlerTable.find(item => item.condition())?.handler;

  // 代理所有的外跳链接
  sendPwaPramsToParent(
    { url, type: type || '' },
    IframeTrameTypes.OPEN_URL,
    handler
  );
}

/**
 * 判断URL是否为代理链接
 * @param url 要判断的URL
 * @returns 是否为代理链接
 */
export function isProxyUrl(url: string): boolean {
  try {
    return new URL(url).searchParams.has('pid');
  } catch (error) {
    console.error('Invalid URL:', error);
    return false;
  }
}

/**
 * 在URL链接的点号后面增加一个零宽度的空格符号，防止被识别为链接
 * @param url URL链接
 * @returns 处理后的URL链接
 */
export function addZeroWidthSpace(url: string): string {
  const dotIndices = [...url.matchAll(/\./g)].map((match) => match.index);
  let modifiedUrl = url;
  for (let i = dotIndices.length - 1; i >= 0; i--) {
    modifiedUrl = modifiedUrl.slice(0, dotIndices[i] + 1) + "\u200B" + modifiedUrl.slice(dotIndices[i] + 1);
  }
  return modifiedUrl;
}

/**
 * @description 给一个URL添加查询参数，同时不影响现有的参数
 * @param url 原始URL
 * @param params 要添加的查询参数对象
 * @returns 添加查询参数后的URL
 */
export function addQueryParams(url: string, params: Record<string, string>): string {
  try {
    const urlObj = new URL(url);
    Object.keys(params).forEach(key => {
      urlObj.searchParams.set(key, params[key]);
    });
    return urlObj.toString();
  } catch (error) {
    console.error('Invalid URL:', error);
    return url;
  }
}

/**
 * 调用apk openWindow事件
 * @param url
 * @returns
 * @param url 跳转网址
 */
export function openWindow(url: string) {
  const systemStore = useSystemStore(); // 引入 systemStore
  // @ts-ignore
  if (window.jsBridge) {
    const info = { url: url };
    if (systemStore.browser === BROWSER.WEBKIT) {
      window.open(url, "_blank");
    }
    const jsonStr = JSON.stringify(info);
    // @ts-ignore
    window.jsBridge.postMessage("openWindow", jsonStr);
  } else {
    openUrl(url, SOCIAL.OPEN_URL)
  }
}

/**
 * @description 将登录信息加密为base64字符串
 */
export async function getBase64AccountInfo() {
  const appStore = useAppStore();
  const acc = await appStore.getAccount(); 	// 获取账号
  const pass = await appStore.getPassword(); // 获取密码
  const loginType = appStore.loginType || '';
  const token = appStore.token || '';
  const currentAccountInfo = {
    token,
    acc,
    pass,
    loginType
  }
  // 获取当前路由的完整查询参数
  const urlParams = getMixinsInfo(window.location.search)
  let result = { ...currentAccountInfo }
  if (Object.keys(urlParams).length > 0) {
    if (urlParams.hasOwnProperty("sd")) delete urlParams.sd
    if (urlParams.hasOwnProperty("fromEntry")) {
      urlParams.fromEntry = 'newPwa';
    }
    if (token && pass && acc) {
      result = {
        ...urlParams,
        ...currentAccountInfo
      }
    } else {
      result = { ...result, ...urlParams }
    }
  }
  let rawAccountInfo = ''
  Object.keys(result).forEach((key) => {
    rawAccountInfo += `${key}=${result[key as keyof typeof result] || ''}&`
  })

  return btoa(rawAccountInfo);
}

/**
 * 保存登录信息
 * @param loginType 登录类型
 * @param acc 账号
 * @param pass 密码
 * @param token 令牌
 */
export async function saveCrossPlatformLoginInfo(paramsToken?: string) {
  // @ts-ignore
  const appStore = useAppStore();
  const acc = await appStore.getAccount() 	// 获取账号
  const pass = await appStore.getPassword() // 获取密码

  // 获取当前路由的查询参数
  const urlParams = new URLSearchParams(window.location.search);
  const currentToken = paramsToken || (await appStore.getToken())
  const token = currentToken ? { token: currentToken } : {};
  const urlParamsObj = Object.fromEntries(urlParams);
  const info = {
    loginType: appStore.loginType || '',
    acc: acc || '',
    pass: pass || '',
    ...token, // 优先使用appStore的token
  };
  const resvert = (isUrlParamsFirst: boolean) => isUrlParamsFirst ? { ...urlParamsObj, ...info } : { ...info, ...urlParamsObj }
  const jsonStr = JSON.stringify(resvert(false));
  const jsBridge = window.jsBridge;
  const actions = {
    safetyParent: () => sendPwaPramsToParent(resvert(true) as Record<string, string>),
    unsafetyParent: () => console.warn('unSafetyParent or use top window'),
    jsBridgeAvailable: () => jsBridge?.postMessage && jsBridge.postMessage("saveLoginInfo", jsonStr),
    jsBridgeUnavailable: () => console.warn('jsBridge 不可用,无法保存登录信息')
  };
  actions[isInIframe() ? 'safetyParent' : 'unsafetyParent']();
  actions[jsBridge && jsBridge.postMessage ? 'jsBridgeAvailable' : 'jsBridgeUnavailable']();
}

/**
 * @description 清除登录信息
 */
export async function clearAndroidLoginInfo() {
  // @ts-ignore
  const jsBridge = window.jsBridge;
  if (jsBridge && jsBridge.postMessage) {
    const jsonStr = JSON.stringify("");
    jsBridge.postMessage("clearLoginInfo", jsonStr);
    console.log('清除登录信息')
  } else {
    console.warn('jsBridge 不可用,无法清除登录信息');
  }
}

/**
 * 是否是线上环境
 */
export function isProd(): boolean {
  return import.meta.env.VITE_ENV === "prod";
}

/**
 * 是否为灰度环境
 */
export function isGray(): boolean {
  return import.meta.env.VITE_IS_GRAY || window.location.hostname.includes('gray');
}

/**
 * 是否为测试环境
 */
export function isPre(): boolean {
  return import.meta.env.VITE_ENV === "pre";
}

/**
 * 是否为开发环境
 */
export function isDev(): boolean {
  return import.meta.env.VITE_ENV === "dev";
}

/**
 * @description 跳转到指定URL
 */
export function redirectUrl(url: string, social?: string) {
  const systemStore = useSystemStore();

  // import.meta.env.SWITCH_OPEN_WINDOW
  const type = (systemStore.isApk || systemStore.browser === BROWSER.WEBKIT || social === SOCIAL.KWAI) ? 'Kwai' : '';
  openUrl(url, type);
}

/**
 * @description jsBridge原生方法初始化
 */
export function jsBridgeInit() {
  if (!(window.jsBridge && window.jsBridge.postMessage) && window.Android) {
    if (!window.jsBridge) window.jsBridge = {};
    window.jsBridge.postMessage = (evt, msg) => {
      switch (evt) {
        case "openWindow":
          const j = JSON.parse(msg);
          if (j.url && j.url.indexOf("http") === 0) {
            if (window.Android?.openAndroid) {
              window.Android?.openAndroid(j.url);
            } else {
              window.open(j.url, "_blank");
            }
          }
          break;
        default:
          window.Android?.eventTracker && window.Android?.eventTracker(evt, msg);
      }
    };
  }
}

export const getIsInAppBrowser = () => {
  try {
    const userAgent = window.navigator.userAgent;
    const list = [
      "Line/",
      "FBAN",
      "FBBV",
      "FBAV",
      "FB_IAB",
      "FB4A",
      "FBSV",
      "Instagram",
      "MicroMessenger",
      "Twitter",
      "Kakao",
      "KAKAO",
      'Tiktok',
      'TikTokWebView',
      'Kwai',
      'KwaiWebView',
      "Telegram"
    ];

    return list.some((item) => userAgent.includes(item));
  } catch (a) {
    return false;
  }
};

export const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes('safari') &&
    !ua.includes('chrome') &&
    !ua.includes('android')
  );
};

export const getUserAccountInfo = async (sd?: number) => {
  const appStore = useAppStore();
  const urlParams = new URLSearchParams(location.search);
  const acc = await appStore.getAccount() || urlParams.get('acc') || ''  	// 获取账号
  const pass = await appStore.getPassword() || urlParams.get('pass') || '' // 获取密码
  const deviceId = useSystemStore().deviceId

  // 获取当前路由的查询参数
  const token = await appStore.getToken() || urlParams.get('token') || '';

  const urlParamsObj = Object.fromEntries(urlParams);
  const loginInfo = {
    ...urlParamsObj,
    acc,
    pass,
    sd: sd || 2,
    ...(token ? { token } : {}),
    ...(isEqual(sd?.toString(), '4')  ? { deviceId } : {}) // 深连接需要使用url参数deviceId
  }
  return {
    loginInfo,
    urlParams
  }
};


