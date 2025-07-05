# app端
```
接口请求使用fetch，见trpc/app.trpc.ts
```
## trpc
前后端采用 [trpc](https://trpc.io/) 进行通信, 提供API端到端类型安全
[tcpc文档](/docs/trpc.md)

## pwa
```
极光推送

```

## Service Worker 域名切换流程

### 检测域名可用性
1. Service Worker 持续监听 fetch 请求,检测当前域名可用性
2. 当检测到域名不可用时:
   - 通过 postMessage 通知主线程
   - 根据配置决定是否显示提示弹窗(fromEntry=sw)
3. 如果未开启弹窗配置,Service Worker 继续运行
4. Service Worker 异常或缓存失效时结束流程

### pwa&h5 url 参数  
- wakeup: 'true' 通过事件唤醒PWA
- domainType: 'main' ｜ 'google' 主域名 ｜ google防封域名
- token: 登录token
- sd: 设备类型
- ch: 渠道ID
- fromEntry: 'sw' | 'newPwa' | 'download' | 'other' 不同域间桥梁拼接参数
- contenthost: 上一次停留的域名
- acc: 账户
- pass: 账户密码
- loginType: 登录类型
- info: 账户相关参数base64加密处理
- unTopWindow: 'true' 是否是顶层窗口
- check: '0' 关闭app浏览器调试工具开启检测
- [webparmas]: 来自web的参数
- ...getMixinsInfo(window.location.search) 其他参数



### 域名切换机制

- B域名的切换通过sw-page实现，具体步骤如下：
  1. 修改sw-page的HTML内容。
  2. 使用build-sw-modules.js编译sw-page的HTML内容。
  3. 编译后的sw-page通过createDynamicOnlinePage函数生成一个动态的HTML页面。
  4. 在sw.production中，通过fetch事件的respondWith捕获B域名的当前环境。
  5. 使用caches.open('online-page').then(cache => cache.put('sw-page.html', html))将动态HTML页面缓存到caches中。
  6. createDynamicOnlinePage返回一个包含iframe的容器。
  7. 如果B域名下缓存的C域名可用且有多条，则选择一条可用的C域名渲染到iframe中。
  8. 在sw作用域中，B域名和C域名会通过URL参数传递同步用户信息，并通过postMessage通知主线程。

## version-polling
```
热更新
```




### 目录结构
```
.
├── App.vue
├── api                                     // 请求接口
├── common                                  // 公共文件，样式
├── components                              // 公共组件
│   └── AccountOperation                    // app中有多套皮肤
│       ├── default                         // default为默认皮肤，使用默认颜色
│       ├── first                           // first为第二套皮肤，有多个颜色可选
│       ├── forgetLogic.ts                  // default和其他皮肤公用的hook方法
│       ├── logic.ts
│       ├── loginLogic.ts
│       └── registerLogic.ts
├── directives                              // 指令
├── enums                                   // enums声明
├── global.d.ts
├── hooks                                   
├── i18n                                    // 国际化
│   ├── index.ts
│   ├── locales
│   │   ├── en_US.json
│   │   ├── id_ID.json
│   │   ├── pt_BR.json
│   │   └── zh_CN.json
│   └── ruleHelper
│       ├── activityRule.ts
│       └── activityRuleType.ts
├── router                                  // 路由
│   ├── hooks.ts
│   ├── index.ts
│   ├── intercept.ts
│   ├── modules
│   │   ├── default.ts                      // 默认皮肤加载路由
│   │   └── first.ts                        // first皮肤加载路由
│   └── routes.ts                           // 公共路由
├── store                                   // store
│   ├── activity.ts
│   ├── agent.ts
│   ├── app.ts
│   ├── channel.ts
│   ├── defaultData.ts
│   ├── element.ts
│   ├── event.ts
│   ├── game.ts
│   ├── model.ts
│   ├── pageParam.ts
│   ├── status.ts
│   ├── system.ts
│   ├── tenant.ts
│   ├── user.ts
│   ├── vip.ts
│   └── withdraw.ts
├── theme                                   // 主题
│   ├── common.css
│   ├── hooks.ts
│   ├── modules                             // 不同主题文件
│   │   ├── green-dark.css
│   │   ├── purple-light.css
│   │   └── yellow-dark.css
│   ├── var.css
│   └── variables.css
├── trpc                                    // api地址，调用nuxt(服务器文件)项目路由
│   ├── app.trpc.ts
│   ├── errorHandlerLink.ts
│   └── toastWhiteList.ts
├── utils                                   // 公共方法
├── views                                   // 页面文件，区分不通皮肤(default,first)
├── logic.ts                                // logic命名多为页面hook
├── main.ts                                 // 入口文件
└── vite-env.d.ts
```

### 环境变量配置

```
# API域名-不同的环境不同的API域名
# VITE_TRPC_URL = https://api.g6b.xyz
# VITE_TRPC_URL = https://api.ycyd123.com
# VITE_TRPC_URL = https://api-dev.g6b.xyz
# VITE_TRPC_URL = https://api.ycyd123.com
# VITE_TRPC_URL = https://api.n-t-v-w.com

# 商户域名-用来获取对应的商户配置信息
# VITE_TRPC_HOST = gray.h-b-l-l.com
# VITE_TRPC_HOST = gr.qu6.xyz
# VITE_TRPC_HOST = yo.qu6.xyz
# VITE_TRPC_HOST = bc.qu6.xyz
# VITE_TRPC_HOST = tt.qu6.xyz
# VITE_TRPC_HOST = gray.3pf.xyz
# VITE_TRPC_HOST = zhu-1.w-x-2-c.com
# VITE_TRPC_HOST = pwaa.qu6.xyz
# VITE_TRPC_HOST = an.qu6.xyz
# VITE_TRPC_HOST = panda77.vip
# VITE_TRPC_HOST = panda6017.vip
# VITE_TRPC_HOST = gray.3pf.xyz
# VITE_TRPC_HOST = 77bbvip.com
# VITE_TRPC_HOST = lv.qu6.xyz
# VITE_TRPC_HOST = 3pf.xyz
# VITE_TRPC_HOST = pur.1b5.xyz
# VITE_TRPC_HOST = pwa.qu6.xyz
# VITE_TRPC_HOST = yn1.qu6.xyz
# VITE_TRPC_HOST = yn-dev.qu6.xyz
# VITE_TRPC_HOST = yo.qu6.xyz

# 皮肤配置-主页布局类型(厂商/游戏类型)
# VITE_HOME_TYPE = GameType

# 皮肤配置-整体布局和颜色
# 1号
# VITE_THEME=Layout2:DarkGreen
# 2号
# VITE_THEME=Layout2:GoldenYellow
# 3号
# VITE_THEME=Layout2:BluePurple
# 4号
# VITE_THEME=Layout3:AmberPurple
# 5号
# VITE_THEME=Layout1:Blue
# 6号
# VITE_THEME=Layout1:Green
# 7号
# VITE_THEME=Layout1:BlueV01
# 8号
# VITE_THEME=Layout1:GreenV01
# 9号
# VITE_THEME=Layout1:GreenV02
# 10号
# VITE_THEME=Layout1:Blue_V01
# 11号
# VITE_THEME=Layout1:AmberPurple
# 12号
# VITE_THEME=Layout1:PineGreenV01
# 13号
# VITE_THEME=Layout1:PineGreenV02
# 14号
# VITE_THEME=Layout1:BlueV02
# 15号
# VITE_THEME=Layout1:AmberPurpleV01
# 16号
# VITE_THEME=Layout1:AuroraYellow
# 17号
# VITE_THEME=Layout2:PhantomBlue
# 18号
# VITE_THEME=Layout2:NeoBlue
# 19号
# VITE_THEME=Layout2:MystLightBlue
# 20号
# VITE_THEME=Layout2:MidnightPurple

# 人机验证配置
VITE_CAPTCHA_SCENE_ID = ssv27i9qr
VITE_CAPTCHA_PREFIX = 11tw943
VITE_TURNSTILE_PUBLIC_KEY = 0x4AAAAAAAiHEkDee-yqSdMj

```
