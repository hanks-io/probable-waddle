## 自定义 PWA 工具包: progress.js

> `app/pubic/progress.js`

#### 工具包主要功能

##### 检测运行环境方法

```js
function webAppDetection() {
  var s = this;
  // 判断是否安卓系统
  this.isAndroid = function () {
    try {
      var e = /Android/.test(window.navigator.userAgent);
      return e;
    } catch (t) {
      return false;
    }
  };
  // 判断是否IOS系统
  this.isIOS = function () {
    try {
      var e = [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ];
      var t =
        e.includes(navigator.platform) ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document);
      return t;
    } catch (i) {
      return false;
    }
  };
  // 判断是否MAC系统
  this.isMacOs = function () {
    try {
      return (
        window.navigator.platform.toLowerCase().includes("mac") && !s.isIOS()
      );
    } catch (e) {
      return false;
    }
  };
  // 判断是否Windows系统
  this.isWindows = function () {
    try {
      return window.navigator.platform.toLowerCase().includes("win");
    } catch (e) {
      return false;
    }
  };
  // 判断是否Safari浏览器
  this.isSafari = function () {
    try {
      return (
        navigator.vendor &&
        navigator.vendor.includes("Apple") &&
        navigator.userAgent &&
        !navigator.userAgent.includes("CriOS") &&
        !navigator.userAgent.includes("FxiOS") &&
        !navigator.userAgent.includes("EdgiOS")
      );
    } catch (e) {
      return false;
    }
  };
  // 判断是否火狐浏览器
  this.isFirefox = function () {
    try {
      var e = navigator.userAgent.toLowerCase().includes("firefox");
      if (!e) {
        return false;
      }
      var t = window.navigator.platform.toLowerCase();
      var i = t.includes("mac") || t.includes("win");
      if (!i) {
        return false;
      }
      return true;
    } catch (a) {
      return false;
    }
  };
  // 判断是否三星浏览器
  this.isSamsungInternet = function () {
    try {
      return navigator.userAgent.toLowerCase().includes("samsungbrowser");
    } catch (e) {
      return false;
    }
  };
  // 判断是否MAC系统中的Chrome或Edge浏览器
  this.isChromeEdgeOnMacOs = function () {
    try {
      return (
        navigator.vendor.toLowerCase().includes("google") &&
        window.navigator.platform.toLowerCase().includes("mac")
      );
    } catch (e) {
      return false;
    }
  };
  this.isArc = function () {
    try {
      return getComputedStyle(document.documentElement).getPropertyValue(
        "--arc-palette-title"
      );
    } catch (e) {
      return false;
    }
  };
  // 判断是否Edge浏览器
  this.isEdge = function () {
    try {
      return (
        window.navigator.userAgent.includes("Edge") ||
        window.navigator.userAgent.includes("Edg/") ||
        window.navigator.userAgent.includes("EdgiOS")
      );
    } catch (e) {
      return false;
    }
  };
  // 判断是否Chrome浏览器
  this.isChrome = function () {
    try {
      var e = window.navigator.userAgent.toLowerCase();
      var t = window.chrome || e.includes("chrome");
      if (!t) {
        return false;
      }
      var i = s.isEdge();
      if (i) {
        return false;
      }
      var a = e.includes("opr");
      if (a) {
        return false;
      }
      var n = s.isArc();
      if (n) {
        return false;
      }
      return true;
    } catch (r) {
      return false;
    }
  };
  // 判断是否Opera浏览器
  this.isOpera = function () {
    try {
      return window.navigator.userAgent.toLowerCase().includes("opr");
    } catch (e) {
      return false;
    }
  };
  // 判断是否支持IOS推送服务
  this.supportsNativeiOSPush = function () {
    if (!window.webkit) {
      return false;
    }
    if (!window.webkit.messageHandlers) {
      return false;
    }
    if (!window.webkit.messageHandlers["progressier-requests-push-status"]) {
      return false;
    }
    return true;
  };
  this.appstore = function () {
    return s.supportsNativeiOSPush();
  };
  this.supportsPush = function () {
    if (s.supportsNativeiOSPush()) {
      return true;
    }
    if (!window.PushManager) {
      return false;
    }
    if (!navigator.serviceWorker) {
      return false;
    }
    if (!window.Notification) {
      return false;
    }
    return true;
  };
  // 判断是否Twitter应用内浏览器
  this.isFromTwitter = function () {
    if (s.definitelyNotTwitter) {
      return false;
    }
    if (!s.isIOS() && !s.isAndroid()) {
      return false;
    }
    if (s.isIOS() && !s.isSafari()) {
      return false;
    }
    return (
      document.referrer.includes("https://t.co") ||
      window.location.href.includes("progressierreferrer=twitter")
    );
  };
  // 判断是否原生应用内浏览器
  this.isInAppBrowser = function () {
    try {
      var t = window.navigator.userAgent;
      var e = [
        "wv",
        "Line/",
        "FBAN",
        "FBBV",
        "FBAV",
        "FB_IAB",
        "Instagram",
        "MicroMessenger",
        "Twitter",
        "Kakao",
        "KAKAO",
      ];
      var i = false;
      e.forEach(function (e) {
        if (!t.includes(e)) {
          return;
        }
        i = true;
      });
      return i;
    } catch (a) {
      return false;
    }
  };
  // 判断是否Chrome系统
  this.isChromeOS = function () {
    try {
      return (
        window.navigator.platform.toLowerCase().includes("linux") &&
        window.navigator.userAgent.toLowerCase().includes("cros")
      );
    } catch (e) {
      return false;
    }
  };
  // 判断是否桌面系统
  this.isDesktop = function () {
    try {
      if (s.isWindows()) {
        return true;
      }
      if (s.isIOS()) {
        return false;
      }
      if (s.isAndroid()) {
        return false;
      }
      if (s.isMacOs()) {
        return true;
      }
      if (s.isChromeOS()) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };
  this.isSafariWithPushOnMacOs = function () {
    if (!s.isSafari()) {
      return false;
    }
    if (!s.isMacOs()) {
      return false;
    }
    if (!s.supportsPush()) {
      return false;
    }
    return true;
  };
  this.isSafariWithInstallationMacOS = function () {
    try {
      if (!s.isSafari()) {
        return false;
      }
      if (!s.isMacOs()) {
        return false;
      }
      var e = navigator.userAgent;
      var t = /Safari\//i.test(e);
      if (!t) {
        return false;
      }
      var i = e.match(/Version\/(\d+)/i);
      if (i && i[1]) {
        var a = parseInt(i[1], 10);
        if (a >= 17) {
          return true;
        }
      }
      return false;
    } catch (n) {
      return false;
    }
  };
  this.canBePushPrompted = function () {
    if (!s.isIOS() && !s.isAndroid()) {
      return false;
    }
    if (!s.supportsPush()) {
      return false;
    }
    var e = Notification.permission;
    if (e === "denied" || e === "granted") {
      return false;
    }
    return true;
  };
  // 检测是否在PWA中运行
  this.isStandalone = function () {
    return (
      navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.matchMedia("(display-mode: fullscreen)").matches &&
        (s.isAndroid() || s.isIOS())) ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches
    );
  };
  // 检测IOS系统版本
  this.iosVersion = function () {
    if (!s.isIOS()) {
      return false;
    }
    var e = navigator.userAgent;
    if (!/iP(hone|od|ad)/.test(e)) {
      return false;
    }
    var t = e.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (!t || !t[1]) {
      return false;
    }
    var i = parseFloat(t[1] + "." + (t[2] || 0));
    return i;
  };
  this.recentiOS = function () {
    try {
      let e = s.iosVersion();
      if (!e) {
        return false;
      }
      if (e < 16.7) {
        return false;
      }
      let t = navigator.userAgent.match(/CriOS\/(\d+)/);
      if (!t) {
        return false;
      }
      let i = parseInt(t[1], 10);
      if (i < 116) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };
  this.isTWA = function () {
    if (!s.isAndroid()) {
      return false;
    }
    if (!s.isStandalone()) {
      return false;
    }
    try {
      if (
        document.referrer.startsWith("android-app://") ||
        window.sessionStorage.getItem("opened-from-twa")
      ) {
        window.sessionStorage.setItem("opened-from-twa", true);
        return true;
      }
    } catch (e) {}
    return false;
  };
  this.requiresInScopeSw = function () {
    try {
      if (s.isIOS()) {
        return false;
      }
      if (s.isSafari()) {
        return false;
      }
      if (s.isFirefox()) {
        return false;
      }
      if (s.isOpera()) {
        return false;
      }
      if (s.isArc()) {
        return false;
      }
      if (s.isSamsungInternet()) {
        return true;
      }
      let e = window.navigator.userAgent;
      let t = e.match(/Chrome\/(\d+)/);
      let i = parseInt(t[1]);
      if (i >= 111 && e.includes("Android")) {
        return false;
      }
      if (i >= 114) {
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  };
  this.isIframe = function () {
    try {
      if (window.self !== window.top) {
        return true;
      }
      return false;
    } catch (e) {
      return true;
    }
  };
  try {
    s.result = {};
    for (var e in s) {
      if (typeof s[e] !== "function") {
        continue;
      }
      s.result[e] = s[e]();
    }
  } catch (t) {}
}
```

##### 记录状态与方法对象

```js
var obj = {
  installable: false, // 可安装状态
  standalone: false, // 是否在PWA中运行
  detection: new webAppDetection(), // 环境监测方法
  emit: function (event, data) {
    // 发布全局事件方法
    const e = new CustomEvent(event, data);
    window.dispatchEvent(e);
  },
  install: function () {
    // 安装PWA方法
    if (obj.nativePrompt) {
      obj.nativePrompt.prompt();
      obj.nativePrompt.userChoice.then(function (choiceResult) {
        if (choiceResult.outcome === "accepted") {
          localStorage.setItem("webAppInstalled", "true");
        }
      });
    }
  },
};
```

##### 创建清单

```js
function createManifestLink() {
  if ("webAppManifestSettings" in window) {
    // 通过动态设置window全局对象获取清单内容（文本数据格式赋值到link标签）
    const manifest = JSON.stringify(window.webAppManifestSettings);
    let link = document.createElement("link");
    link.rel = "manifest";
    link.href = "data:text/json;charset=utf-8," + encodeURIComponent(manifest);

    const existingManifest = document.querySelector('link[rel="manifest"]');
    // 如果已存在manifest清单标签，则替换，否则添加新标签
    if (existingManifest) {
      document.head.replaceChild(link, existingManifest);
    } else {
      document.head.appendChild(link);
    }
  }
}
```

##### 创建 PWA 应用图标

```js
function generateWebIcon() {
  let icon512 = "";
  let icon192 = "";
  window.webAppManifestSettings.icons.forEach((icon) => {
    if (icon.sizes === "512x512") {
      icon512 = icon.src;
    } else if (icon.sizes === "192x192") {
      icon192 = icon.src;
    }
  });

  icon192 = icon192 || icon512;

  const iconsData = [
    { rel: "shortcut icon", href: icon192 },
    { rel: "apple-touch-icon", href: icon192 },
    { sizes: "180x180", rel: "apple-touch-icon", href: icon192 },
    { rel: "apple-touch-icon-precomposed", href: icon192 },
  ];

  const headElement = document.getElementsByTagName("head")[0];

  iconsData.forEach((icon) => {
    // 查找是否已存在具有相同rel和sizes的link元素
    let selector = `link[rel="${icon.rel}"]`;
    if (icon.sizes) {
      selector += `[sizes="${icon.sizes}"]`;
    }
    let existingLink = document.querySelector(selector);

    const link = document.createElement("link");
    link.rel = icon.rel;
    link.href = icon.href;
    if (icon.sizes) {
      link.setAttribute("sizes", icon.sizes);
    }

    if (existingLink) {
      // 如果存在相同的link标签，则替换
      headElement.replaceChild(link, existingLink);
    } else {
      // 如果不存在，则添加新的link标签
      headElement.appendChild(link);
    }
  });
}
```

##### 检测但前环境是否可以安装 PWA 或已安装 PWA

```js
function checkWebApp(pollTimes = 20, duration = 300) {
  return new Promise((resolve, _reject) => {
    let times = 0;
    const interval = setInterval(() => {
      const available = localStorage.getItem("webAppAvailable") === "true";
      const installed = localStorage.getItem("webAppInstalled") === "true";

      // 判断是否可安装状态，并且未安装，以及是否ios系统且在safari浏览器中运行
      if (
        obj.installable ||
        (available && !installed) ||
        (obj.detection.isIOS() && obj.detection.isSafari())
      ) {
        clearInterval(interval);
        obj.emit("webAppDetected", obj.nativePrompt); // 发送可安装状态事件(应用中使用window.addEventListener添加监听)
        localStorage.setItem("webAppInstalled", "false");
        window.removeEventListener("beforeinstallprompt", installPromptHandler);
        resolve(true);
      }

      times++;
      if (times >= pollTimes) {
        clearInterval(interval);
        window.removeEventListener("beforeinstallprompt", installPromptHandler);
        if (installed) {
          obj.emit("webAppDetected", { detail: "launchAllowed" }); // 发送可启动状态事件(应用中使用window.addEventListener添加监听)
        } else {
          localStorage.setItem("webAppUnavailable", "true"); // 发送不可安装状态事件(应用中使用window.addEventListener添加监听)
          obj.emit("webAppDetected", { detail: "unavailable" });
        }
        resolve(false);
      }
    }, duration);
  });
}
```
