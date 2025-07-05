
// types.d.ts
declare global {
  interface Window {
    fbPixelId?: string; // 使用 ? 表示 fbPixelId 可能不存在
    initAliyunCaptcha?: any; // 阿里云图形验证
    turnstile?: any;
    jsBridge?: {
      postMessage?: (evt: string, msg: string) => void;
    };
    Android?: {
      openAndroid: (url: string) => void;
      eventTracker?: (evt: string, msg: string) => void;
    };
    vConsole?: any;
    __APP_CONFIG__?: {
      domainInfo: string | null;
      channelInfo: string | null;
      tenantInfo: string | null;
      agencyConfig: string | null;
      apiUrl?: string;
      from?: string;
      version?: string;
      VITE_CAPTCHA_SCENE_ID?: string;
      VITE_CAPTCHA_PREFIX?: string;
    };
    isGame?: boolean;
    isFresh?: boolean;
    isOpenMainUI?: boolean;
    Sentry?: any;
  }
  interface PwaParams {
    wakeup?: 'true' | string;
    domainType?: 'main' | 'google';
    token?: string;
    sd?: string | number;
    ch?: string | number;
    fromEntry?: 'sw' | 'newPwa' | 'download' | 'other';
    contenthost?: string;
    acc?: string;
    pass?: string;
    loginType?: string;
    info?: string;
    unTopWindow?: 'true' | string;
    check?: '0' | string;
    [webparmas]?: string;
    [key: string]: string | number | undefined;
  }
}
declare module '@/components/**.vue' {

  import { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;

  export default component;

}

export { } // 导出模块
