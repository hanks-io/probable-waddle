import { t } from '@/i18n/index';
import { maxWidth, DEFAULT_FONT_SIZE_LINK_LIST, FIRST_FONT_SIZE_LINK_LIST, SECOND_FONT_SIZE_LINK_LIST,ALL_FONT_SIZE_LINK_LIST } from './data';
import { ref, computed, watchEffect } from 'vue';
import { throttle, buildUrlParam } from '@/utils';
import { emitter } from './utils/event';
import { BROWSER } from './enums/device';
import { getTheme } from './theme/hooks';
import { useAppStore } from './store/app';
import { useAgentStore } from '@/store/agent';
import { useTenantStore } from './store/tenant';
import { useSystemStore } from './store/system';
import { useChannelStore } from './store/channel';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { registerEvent } from '@/utils/event/event-register';
import { setDeferredPrompt } from './utils/pwa/deferredPrompt';
import { permissionModal, showPermissionModal } from './utils/pwa/showPermission';
import { setPermissionPrompt, getPermissionPrompt } from './utils/pwa/permissionPrompt';
import { generateManifestIcon, generateManifestProtocolHandler, generateNewIcon } from './utils/pwa/manifest';
import { getMixinsInfo, getUrlParam, registerSW, isGoogleType, createScript, getVersion, delay } from '@/utils'
import router from '@/router';
import { taskManager } from '@/utils/home.task.manager';
import { getRechargeBonusDetail } from '@/utils/homeEmitActivity'


const isBdomain = isGoogleType();
const isSingleDomain = getUrlParam('unTopWindow') !== "true";



export const isLoaded = ref(false); // 是否加载完成

/**
 * App入口逻辑层
 * @param route
 */
export function useLogic(route: RouteLocationNormalizedLoaded) {

  const appStore = useAppStore();
  const tenantStore = useTenantStore();
  const systemStore = useSystemStore();
  const channelStore = useChannelStore();
  const agentStore = useAgentStore();
  const statusStore = useStatusStore();

  const channelId = route.query.ch as string;

  const tenantsModalVisible = ref(false); // 商户列表模态框是否显示

  const tenants = computed(() => tenantStore.tenants); // 商户列表

  appStore.setStartUrlSearchParams(); // 存储B域名 url

  /**
   * @description 选择商户事件
   */
  async function selectTenantHandle(id: number) {
    tenantsModalVisible.value = false;
    setTimeout(() => {
      tenantStore.setTenantId(`${id}`); // 设置商户ID
    }, 300);
  }

  /**
   * App初始化商户相关配置
   */
  const webAppInit = throttle(
    async () => {
      emitter.emit("system/init-finish", {
        channelId,
        tenantId: Number(tenantStore.tenantId),
      });
      await Promise.all([	// 设置商户信息, 渠道信息(接口获取)
        Promise.all([
          tenantStore.resetTenantInfo(),
          agentStore.setAgentConfig(),
        ]).then(() => skinHandle()),
        channelStore.getChannelInfo(channelId)
      ]);
      if (!await appStore.hasLocale()) {
        appStore.setLocale(tenantStore.tenantInfo?.language); // 设置语言
      }

      document.title = tenantStore.tenantInfo?.name; // 设置标题(非苹果端)

      createWebAppJS(route); // 创建webAppJS
    },
    300, //
    { leading: true, trailing: false },
  );

  /**
   * @description app初始化
   */
  const appInit = async () => {
    systemStore.setDeviceInfo(); // 设置运行系统信息
    systemStore.setAppInfo(route); // 设置app运行环境信息
    systemStore.setIsInAppBrowser()
    appStore.getAppInfo(); // 获取app应用信息

    listenerEvent(); // 监听事件
    registerEvent(); // 注册事件

    const account = route.query.acc as string;
    const password = route.query.pass as string;

    await Promise.all([
      appStore.getToken(route), // 获取token
      appStore.setParentId(route), // 设置邀请人ID
      appStore.setAccount(account, password, false), // 设置账号
    ]);

    await Promise.all([
      tenantStore.requestDomainInfo(), // 设置域名信息(接口获取)
      channelStore.requestChannelInfo(channelId), // 设置渠道信息(接口获取)
    ]);
    appStore.token && useActivityStore().getBindingNewPwaReward(route);
    if (!tenantStore.tenantId) {
      // 判断商户ID是否存在
      await tenantStore.getTenants(); // 获取商户列表
      if (tenants.value.length === 1) {
        // 判断商户列表长度是否大于1
        await selectTenantHandle(tenants.value[0].id); // 如果只有一个商户自动选择第一个商户
      } else if (tenants.value.length > 1) {
        tenantsModalVisible.value = true; // 打开模态框
      }
    }
    await delay(1000);
    statusStore.isMainTreeLoading = true;
  };
 
  /**
   * @description 监听事件
   */
  function listenerEvent() {
    window.addEventListener("beforeinstallprompt", installReady); // 监听安装完成事件
    window.addEventListener("resize", setFontSize); // 监听窗口大小变化
  }


  // 在组件挂载时设置字体大小
  setFontSize()

  /**
   * @description 移除事件监听
   */
  const removeListener = () => {
    window.removeEventListener("beforeinstallprompt", installReady);
    window.removeEventListener("resize", setFontSize);
    emitter.emit("system/exit");
  };

    /**
   * @description 首页任务调度器
   * 
   */
  taskManager
  .run(getRechargeBonusDetail, 'idle')  // 获取充值奖励
  .execute();
  return { isLoaded, channelId, tenants, tenantsModalVisible, selectTenantHandle, webAppInit, appInit, removeListener };
}

/**
 * @description 监听PWA是否可以安装(已安装不会触发)
 */
function installReady(event: any) {
  const appStore = useAppStore();
  const systemStore = useSystemStore();

  event.preventDefault();
  setDeferredPrompt(event);

  if (!systemStore.isApp) {
    // 如果不为app环境则设置不是PWA且可以安装PWA
    appStore.setUnStandalone(true);
    appStore.setPwaBarVisible(true); // 设置PWA顶部栏栏显示
  } else {
    appStore.setPwaBarVisible(false); // 设置PWA顶部栏栏显示
  }

}

/**
 * @description 设置基础字体大小
 */
function setFontSize() {
  const width = window.innerWidth > maxWidth ? maxWidth : window.innerWidth;
  document.documentElement.style.fontSize = `${(width * 16) / 390}px`;


}
const updateHtmlHead = (title: string, removeManifest: boolean) => {

  let meta = document.querySelector('meta[name="apple-mobile-web-app-title"]'); // 设置苹果移动web应用标题
  meta?.setAttribute("content", title);


  const scriptElement = document.getElementById("web-app-script-dynamic");

  if (removeManifest) {
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.parentNode!.removeChild(existingManifest)
    }

  }
  if (scriptElement) {
    scriptElement.parentNode!.removeChild(scriptElement);
  }

  const version = getVersion();

  createScript("/versionControl/progress.js", version, "web-app-script-dynamic");
}
/**
 * @description 创建webAppJS
 */
async function createWebAppJS(route: RouteLocationNormalizedLoaded) {
  const tenantStore = useTenantStore();
  const systemStore = useSystemStore();
  const { appName, icon512, icon192, params } = await getWebAppInfo(route);
  const start_url = `${location.origin}/${params}`; // PWA启动url
  console.log('start_url:', start_url);
  const icons = [
    generateManifestIcon(icon192), // any图标
    generateManifestIcon(icon512, 512), // 512x512图标
  ];

  // 协议处理程序
  const protocolName = appName || tenantStore.tenantId;
  const protocol_handlers = [generateManifestProtocolHandler(protocolName, start_url)];

  if (window) {
    (window as any).webAppManifestSettings = {
      theme_color: "black",
      background_color: "black",
      display: "standalone",
      // orientation: "portrait",
      prefer_related_applications: false,
      related_applications: [],
      id: `${location.origin}/${tenantStore.tenantId}`,
      name: `${appName}`,
      scope: `${location.origin}/`,
      short_name: `${appName}`,
      start_url,
      icons,
      protocol_handlers,
    };

    let removeManifest = systemStore?.browser !== BROWSER.SAMSUNG_INTERNET
    updateHtmlHead(tenantStore.tenantInfo?.name, removeManifest)
  }
}

/**
 * @description 获取webApp名称与图标信息
 */
async function getWebAppInfo(route: RouteLocationNormalizedLoaded) {
  const appStore = useAppStore();
  const tenantStore = useTenantStore();
  const downloadTemplate = computed(() => useChannelStore().downloadTemplate);
  const appName = tenantStore.tenantInfo?.name;
  const icon512 = tenantStore.tenantInfo?.icon;

  const jumpDomainType = ref(downloadTemplate.value?.jumpDomainType);
  const isDownload = route.path.includes('download');

  const icon192 = icon512;
  const acc = await appStore.getAccount();
  const pass = await appStore.getPassword();
  isDownload && await new Promise<void>((resolve) => { // 如果是下载页面，则等待下载模板数据加载完成
    watchEffect(() => {
      if (downloadTemplate.value) {

        jumpDomainType.value = downloadTemplate.value?.jumpDomainType;
        resolve();
      }
    });
    // 设置超时
    setTimeout(resolve, 5000); // 设置超时，避免无限等待
  });
  const { token: urlToken, acc: urlAcc, pass: urlPass, ...rest } = getMixinsInfo(window.location.search);
  const params = buildUrlParam(<PwaParams>{
    ...rest, // 处理特殊加密参数
    token: appStore.token || urlToken,
    sd: 2,
    acc: acc || urlAcc,
    pass: pass || urlPass,
    domainType: jumpDomainType.value, // 域名类型 如果是防封域名，则开启iframe 
  });
  console.log('params:', params, 'isDownload:', isDownload);
  return { appName, icon512, icon192, params };
}
/**
 * @description 初始化推送(极光推送)
 */
export async function MTpushInterfaceHandler() {
  const systemStore = useSystemStore();
  let permissionState;

  if ("Notification" in window) {
    permissionState = Notification.permission;
    //console.log('permissionState:', permissionState);
  }

  if (router.currentRoute.value.query.sd === "2") {
    if (!systemStore.isPwa) return;
    if (permissionState === "default") {
      if (systemStore.browser === BROWSER.MOBILE_SAFARI) {
        const iosPermission = localStorage.getItem("iosPermission");
        if (iosPermission === "false") return;
      }
      setTimeout(() => {
        sessionStorage.isInitPush !== 'true' && showPermissionModal();
      }, 2500);
    } else if (permissionState === "granted") {
      await initMTpush();
    }
  } else if (systemStore.isPwa && permissionState !== "denied") {
    if (systemStore.browser === BROWSER.SAMSUNG_INTERNET) {
      const samsungPermission = localStorage.getItem("samsungPermission");
      if (samsungPermission === "false") return;
    }
    await initMTpush();
  } else {
    if (isBdomain || isSingleDomain) {
      registerSW();
    }
  }
}

/**
 * @description 初始化推送(极光推送)
 */
export async function initMTpush() {
  const tenantStore = useTenantStore();
  let { deviceId } = useSystemStore();

  if (!deviceId) {
    await useSystemStore().setDeviceInfo();
  }

  if ("MTpushInterface" in window) {
    // @ts-ignore
    const pushInterface: any = window.MTpushInterface;

    pushInterface.mtPush.onDisconnect(function () {
      // 断开连接事件回调
      console.log("onDisconnect");
    });

    pushInterface.onMsgReceive((msgData: any) => {
      // 推送消息接收事件回调(数据结构{data:{xxx},type:0} type:0是极光通道，1是系统通道)
      console.log("得到推送消息:", msgData);
    });
    const jpushAppKey = tenantStore.tenantInfo?.jpushAppKey || window.__APP_CONFIG__?.tenantInfo?.result?.data?.json?.jpushAppKey;
    try {
      if (jpushAppKey && (isBdomain || isSingleDomain)) {
        pushInterface.init({
          appkey: jpushAppKey, // 必填，详见上文获取应用信息
          user_str: useSystemStore()?.deviceId, // 必填，用户识别符，用来标识用户
          swUrl: '/sw.produce.min.2.1.6.js', //默认 "/sw.min." + sdkEnv.version + ".js"。该配置项为server worker文件地址，域名必须为当前域名，且路径决定server worker作用域。
          fail(err: any) {
            console.log("在线推送创建失败", err);
          },
          success(data: any) {
            console.log("在线推送创建成功", data, useSystemStore().app?.build);
          },
          webPushcallback(code: any, tip: any) {
            console.log("用户得到的状态码及提示", code, tip);
            permissionModal?.onDidDismiss();
            if (code !== 1) {
              console.log("用户未同意通知权限");
              pushInterface.unSubscribe(); // 取消订阅
            }
            if (code === 2) {
              localStorage.setItem('samsungPermission', 'false');
            }
          },
          canGetInfo(data: any) {
            //此时可以得到通知的一些配置数据，在此回调函数之后可以得到RegId
            const regId = pushInterface.getRegistrationID();
            useAppStore().setWebPushRegId(regId);
            console.log(data); //相关配置信息
            console.log("得到RegId", regId);
          },
          custom: (fuc: any) => {
            //当使用自定义提示配置时，需手动调用fuc()来请求通知权限。只能通过custom得到请求通知权限函数。
            console.log("自定义推送请求权限方法:", getPermissionPrompt());
            setPermissionPrompt(fuc);
          },
        });
      } else if (isBdomain || isSingleDomain) {
        console.log('注册service worker');
        registerSW();
      }

    } catch (e) {
      console.warn(e, 'initMTpush');
    }
  } else {

  }
}

/**
 * @description 皮肤处理
 */
async function skinHandle() {
  const { skin, theme, newSkin } = getTheme();
  [theme, newSkin].filter(Boolean).forEach(item => {
    document.documentElement.classList.toggle(item, true);
  });
  document.body.classList.toggle(skin, true);
  await addDynamicRoute(skin);
  isLoaded.value = true;
}

/**
 * @description 创建字体链接
 * @param url 字体链接
 */
function createStyleLink(url: string) {
  const link = document.createElement("link");
  link.href = url;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}
const createMultipleStyleLink = (urlList: string[]) => {
  urlList.forEach((url) => createStyleLink(url));
}
/**
 * @description 添加动态路由
 */
async function addDynamicRoute(skin: string) {
  let routes;
  createStyleLink('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;0,700;0,900&display=swap');
      createMultipleStyleLink(ALL_FONT_SIZE_LINK_LIST);
  switch (skin) {
    case 'first':
      createMultipleStyleLink(FIRST_FONT_SIZE_LINK_LIST);
      routes = await import(`@/router/modules/first`);
      break;
    case 'second':
      createMultipleStyleLink(SECOND_FONT_SIZE_LINK_LIST);
      routes = await import('@/router/modules/second');
      break;
    default:
      createMultipleStyleLink(DEFAULT_FONT_SIZE_LINK_LIST);
      routes = await import(`@/router/modules/default`);
      break;
  }
  if (router.getRoutes().some((route: any) => route.name === "inicio")) return;
  routes.default.forEach((route: any) => {
    router.addRoute(route);
  });
}
