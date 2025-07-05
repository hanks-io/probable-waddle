PWA(Progress-Web-App)
====

> 渐进式web开发主要分为两个部分: `应用清单` 与 `Service Worker`
>
> PWA安装条件: 安卓Chrome浏览器，苹果Safari浏览器，桌面系统Chrome与Edge浏览器
>
> 安卓系统安装PWA需要登录谷歌商店，否则安装的PWA被限制: 无法记录登录信息，无法通过域名直接拉起，推送通知受限制



## 应用清单

> 应用清单通过在html入口文件的 `head` 部分添加 `link` 标签进行绑定

#### 清单示例 `JSON`

```json
{
  "theme_color": "black",
  "background_color": "black",
  "display": "standalone",
  "orientation": "portrait",
  "name": "Brazil",
  "scope": "https://3pf.xyz/",
  "short_name": "Brazil",
  "start_url": "https://3pf.xyz",
  "icons": [
    {
      "sizes": "any",
      "src": "https://upload-us.4y4.xyz/1718356732865/192.png",
      "type": "image/png"
    },
    {
      "sizes": "512x512",
      "src": "https://upload-us.4y4.xyz/1718356732865/512.png",
      "type": "image/png"
    }
  ]
}
```

#### 清单参数说明

| 属性                 | 说明 | 其他 |
| - | - | - |
| **theme_color** | 应用的主题颜色，影响浏览器界面的颜色，包括地址栏和任务栏 | 非必须项 |
| **background_color** | 应用启动时屏幕的背景颜色 | 非必须项 |
| **display** | 应用的显示模式: standalone 是PWA常用选项 | 非必须项 |
| **orientation** | 应用的首选显示方向: portrait `竖向` | 非必须项 |
| **name** | 应用名称 | 必须项 |
| **scope** | 应用的作用域，PWA中访问的URL范围 | 非必须项 |
| **short_name** | 应用的简称，用于主屏幕、启动器、或导航中显示 | 非必须项 |
| **start_url** | 应用启动时的URL | 必须项 |
| **icons** | 应用图标的数组，用于主屏幕图标、启动画面 | 推荐定义512及any尺寸配置 |



## 自定义PWA工具包: progress.js 

> `app/pubic/progress.js`
>
> 工具包主要功能查看 `PWA工具包说明`

#### 代码中使用工具包 `动态加载PWA工具包`

```typescript
if (window) {
  	// 配置工具包参数(工具包通过读取windw全局中的webAppManifestSettings对象获取配置)
    (window as any).webAppManifestSettings = {
      name, // 应用名称
      icons, // 应用图标
      scope, // 应用作用域
      start_url, // 应用启动URL
      short_name, // 应用简称
      theme_color: 'black',
      display: 'standalone',
      orientation: 'portrait',
      related_applications: [],
      background_color: 'black',
      prefer_related_applications: false,
    }
  
 		// 设置苹果移动web应用标题
    const meta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    meta?.setAttribute('content', tenantStore.tenantInfo?.name);

  	// 检测是否已存在PWA清单标签以及PWA工具包脚本标签，如果存在先移除(登录后重新配置清单，添加用户信息)
    const existingManifest = document.querySelector('link[rel="manifest"]');
    const scriptElement = document.getElementById('web-app-script-dynamic');
    if (existingManifest) {
      existingManifest.parentNode!.removeChild(existingManifest);
    }
    if (scriptElement) {
      scriptElement.parentNode!.removeChild(scriptElement);
    }

  	// 动态添加PWA工具包脚本标签
    const script = document.createElement('script')
    script.id = 'web-app-script-dynamic'
    script.src = '/progress.js'
    document.head.appendChild(script)
}
```



## 清单安装状态

> 添加PWA工具包脚本标签后等待其安装清单文件
>
> 清单文件安装完成后会触发window全局事件(无法安装pwa或已安装pwa不会触发)

#### 监听安装

```typescript
// 监听安装完成事件(无法安装pwa或已安装不会触发)
window.addEventListener('beforeinstallprompt', installReady);

/**
 * @description 监听PWA是否可以安装
 */
function installReady(event: any) {
  event.preventDefault();	// 阻止默认事件
  setDeferredPrompt(event); // 设置安装pwa安装方法(方便全局获取)
  appStore.setUnStandalone(true); // 设置环境为可安装pwa状态(这里使用状态管理保存)
}

// 定义pwa安装方法
let deferredPrompt: any = null;

// 获取pwa安装方法
export const getDeferredPrompt = () => deferredPrompt;

// 设置pwa安装方法
export const setDeferredPrompt = (e: any) => {
  deferredPrompt = e;
};
```

#### 检测PWA安装环境 `使用轮询检测是否已安装PWA`

```typescript
/**
 * @description 是否有PWA启动按钮
 * @param pollTimes 轮询次数
 * @param duration 延迟时间<毫秒>
 */
export function checkPawLaunchButton(pollTimes: number = 20, duration: number = 300): Promise<boolean>{
  const appStore = useAppStore();
  const systemStore = useSystemStore();

  return new Promise((resolve, _reject) => {
    let times = 0;
    
    
    const interval = setInterval(() => {
      // 如果检测到已标记为可安装，则结束轮询
      if (appStore.unStandalone) {
        clearInterval(interval);
        resolve(false);
      }

      times++;
      // 轮询结束时判断是否已安装
      if (times >= pollTimes) {
        clearInterval(interval);
        // 获取安装pwa时缓存的安装标记
        const installed = localStorage.getItem("webAppInstalled") === "true";
        if (installed) {
          appStore.setPwaLaunchAllow(true); // 设置PWA安装状态为可启动状态
          appStore.setPwaFooterVisible(2);	// 设置底部安装栏为不显示
          resolve(true);
        } else {
          resolve(false);
        }
      }
    }, duration);
  });
}
```



## 自定义安装PWA

> windw会监听清单安装完成事件，并返回安装PWA的方法对象
>
> IOS无法监听，也无自定义安装方法，需引导用户手动安装

#### 安装PWA

```js
// 获取安装PWA方法(监听清单安装完成时保存)
const deferredPrompt = getDeferredPrompt();
deferredPrompt.prompt();

// 等待用户选择是否安装
const { outcome } = await deferredPrompt.userChoice;
if (outcome === 'accepted') { // 用户选择确认安装
  if (systemStore.app?.build === SD_MODEL.ANDROID_H5) {
    localStorage.setItem("webAppInstalled", 'true');
    channelStore.setInstallStatus(1); // 设置正在安装状态，可以模式安装进度
  }
} else { // 用户选择不安装
  // 如果有配置可下载APK, 则跳转下载APK
  if (channelStore.promotionInfo?.installType === 'PWA+APK' && systemStore.app?.build === SD_MODEL.ANDROID_H5) {
    downLoadCheck();
  }
}
```

#### 启动PWA

```js
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
  const queryString = Object.keys(filteredParams).map(key => `${key}=${filteredParams[key]}`).join('&');
  return `?${queryString}`;
}


// 启动PWA
const baseUrl = location.origin;
const query = buildUrlParam({ ...router.currentRoute.value.query, token: appStore.token, sd: 2 })	// 构建url参数

if (systemStore.app?.build === SD_MODEL.ANDROID_H5) {
  window.open(`${baseUrl}${query}`, '_blank'); // 安卓端直接使用window.open方法即可打开已安装的同域名PWA
}
```
