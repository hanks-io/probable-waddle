极光推送
====

> 极光推送分为两个部分: `WebPushSDK `与 `Service Worker` [参考文档](https://www.engagelab.com/zh_CN/docs/web-push/sdk/web-sdk-integration-guide)



## webPushSdk

> SDK通过在html入口文件的 `head` 部分添加 `link` 标签进行绑定

```html
<script type="text/javascript" src="/webPushSdk.produce.min.2.1.6.js"></script>
```

#### 初始化极光推送

```js
function initMTpush() {
  const tenantStore = useTenantStore(); // 使用状态管理数据
  const systemStore = useSystemStore(); // 使用状态管理数据

  // 绑定SDK后window全局会添加 MTpushInterface 对象
  if ('MTpushInterface' in window) {
    // @ts-ignore
    const pushInterface: any = window.MTpushInterface;

    pushInterface.mtPush.onDisconnect(() => { // 断开连接事件回调
      console.log("onDisconnect");
    });
    
		// 推送消息接收事件回调(数据结构{data:{xxx},type:0} type:0是极光通道，1是系统通道)
    pushInterface.onMsgReceive((msgData: any) => {
      console.log("得到推送消息:", msgData);
    });

    try {
      // 极光推送官方提供初始化方法
      pushInterface.init({
        appkey: `${tenantStore.tenantInfo?.jpushAppKey}`, // 必填(这里通过后端接口获取并保存在状态管理中)
        user_str: `${systemStore.deviceId}`, // 必填，用户识别符，用来标识用户(这里使用插件获取唯一标识)
        swUrl: '/sw.produce.min.2.1.6.js', // 极光提供的 Service Worker 工具包
        fail(err: any) {
          console.log("在线推送创建失败", err);
        },
        success(data: any) {
          console.log("在线推送创建成功", data, systemStore.app?.build);
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
        // 在此回调函数可以得到通知的一些配置数据以及RegId
        canGetInfo(data: any) {
          console.log(data); // 相关配置信息
          console.log("得到RegId", pushInterface.getRegistrationID());
        },
        // 当使用自定义提示配置时，需手动调用fuc()来请求通知权限。只能通过custom得到请求通知权限函数。
        custom: (fuc: any) => {
          setPermissionPrompt(fuc); // 保存请求通知权限的方法
        },
      });
    } catch (e) {
      console.warn(e, 'initMTpush');
    }
  }
}
```



## Service Worker

> 项目中使用极光提供的工具包
>
> 极光提供的工具包实现自定义通知跳转路由需调整代码

#### 实现自定义通知跳转路由

```js
// 监听通知点击事件
self.addEventListener("notificationclick", function (t) {
  const e = t.notification.data;
  if (e) {
    const s = "MTPush" === e.engagelab_mesg_type ? "MTPush" : "W3Push";
    a(
      [{ type: "msg_status", msg_id: t.notification.tag, result: 3002 }],
      e,
      s
    );
    let n = null == e ? void 0 : e.engagelab_url;
    t.action &&
      e.engagelab_action_urls &&
      e.engagelab_action_urls[t.action] &&
      (n = e.engagelab_action_urls[t.action]),
      n &&
      // 后端接口配置跳转路径约定参数: redirect, 通过参数 redirect 获取具体跳转路由，在使用SW提供的方法跳转对应路径: waitUntil(self.clients.openWindow(URL))
      (n.includes('redirect=') ? n = self.location.origin + n.split('redirect=')[1] : n = self.location.origin, console.log('跳转页面:', n), t.notification.close(), t.waitUntil(self.clients.openWindow(n)));
  }
}),
```



## 通知权限管理

> 通知权限通过全局对象`Notification`获取状态与方法
>
> Safari浏览器只有在PWA中才有通知权限
>
> 通知权限一旦用户拒绝授权，只能通过重新安装PWA才能再次请求授权
>
> PWA中的通知授权必须在浏览器获取到系统的通知权限后才能请求，浏览器的通知权限与PWA的通知权限不是同一级别的权限

#### 自定义通知权限请求

```js
let permissionState;

// 获取授权状态
if ("Notification" in window) {
  permissionState = Notification.permission;
}

if (permissionState === "default") { // 判断是否未授权
 	// 未选择过授权想执行的方法
} else if (permissionState === "granted") { // 判断是否已授权
  // 授权后想执行的方法
}

// 手动触发请求通知权限
Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      // 用户选择同意通知后想执行的方法
    } else if (permission === "denied") {
      // 用户选择拒绝通知后想执行的方法
    }
  });
```

#### 备注

> IOS与三星浏览器手动添加的PWA，在启动时无法立即获取到准确的通知授权状态 `Notification.permission` , 需延后执行通知授权的相关方法
