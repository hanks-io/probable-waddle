import { defineStore } from 'pinia'
import { useAppStore } from '@/store/app';
import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import { App, AppInfo } from '@capacitor/app';
import { BROWSER, OS, PLATFORM, SD_MODEL } from '@/enums/device';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { storeDefaultValue } from '@/hooks/StoreDefaultValue';
import { ApkSd, PwaAllowPcBrowser, PwaAllowSd } from '@/common/data';
import { getIsInAppBrowser } from '@/utils/app';
import { AppTypes } from '@/enums/types';
import UAParser from '@/utils/UAParser';
import { getUrlParams, isEqual } from '@/utils';
export const useSystemStore = defineStore({
  id: 'system',
  state: () => ({
    os: '',                             // 平台系统类型
    browser: '',                        // 浏览器
    deviceId: '',                       // 设备id
    modalType: '',                      // 弹窗类型
    deviceModel: '',                    // 设备信息
    platform: Capacitor.getPlatform(),  // 平台
    isInAppBrowser: false,              // 是否在外部app内打开的我们下载页面 比如facebook
    app: storeDefaultValue<AppInfo>(),  // app信息
  }),

  getters: {
    // 是否为App(含PWA)
    isApp(): boolean {
      if (this.app?.build) {
        return !PwaAllowSd.includes(this.app.build);
      } else {
        return false;
      }
    },
    // 是否为可安装PWA环境
    isPwaVisible(): boolean {
      // AndroidH5 应许安装pwa的浏览器
      let pwaAllowBrowser = [BROWSER.CHROME, BROWSER.SAMSUNG_INTERNET]
      if (this.browser === BROWSER.MOBILE_SAFARI || (this.app?.build === SD_MODEL.ANDROID_H5 && pwaAllowBrowser.includes(this.browser as BROWSER)) || (this.app?.build === SD_MODEL.DESKTOP_OS && PwaAllowPcBrowser.includes(this.browser)))
        return true;
      return false;
    },
    // 是否ios
    isIOS(): boolean {
      return this.os === 'iOS';
    },

    // 是否Android
    isAndroid(): boolean {
      return this.os === 'Android';
    },
    // 是否PWA环境
    isPwa(): boolean {
      return this.app?.build === SD_MODEL.PWA;
    },
    // 是否APK环境 APKRelease
    isApk(): boolean {
      return ApkSd.includes(`${this.app?.build}`);
    },
    // 是否为IOS马甲包
    isIosShelfPackage(): boolean {
      return this.app?.build === SD_MODEL.IOS_APP;
    },
    // 
    isApkShelfPackage(): boolean {
      return this.app?.build === 'APKRelease';
    },
    isApkFinal(): boolean {
      return this.app?.build === 'APK';
    },
    isIOSApp(): boolean {
      return this.app?.build === "iOSApp";
    },
    isIOSH5(): boolean {
      return this.app?.build === SD_MODEL.IOS_H5;
    },
    isAndroidH5(): boolean {
      return this.app?.build === SD_MODEL.ANDROID_H5;
    },

    isPC(): boolean {
      return this.app?.build === SD_MODEL.DESKTOP_OS;
    },
    isNative(): boolean {
      return ['APKRelease', 'APK', 'iOSApp'].includes(this.app?.build ?? '');
    }
    
  },

  actions: {
    // 设置app信息
    async setAppInfo(route?: RouteLocationNormalizedLoaded) {
      if (this.platform === PLATFORM.WEB) {
        const result = UAParser.getResult();
        this.browser = result.browser.name;
        this.os = result.os.name;
        if (route && route.query.sd && route.query.sd !== '2') {
          this.app = { build: AppTypes[Number(route.query.sd)], version: '', name: '', id: '' };
        } else {

          if (('standalone' in navigator && navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches) {
            this.app = { build: SD_MODEL.PWA, version: '', name: '', id: '' };
          } else if (result.os.name === OS.IOS) {
            this.app = { build: SD_MODEL.IOS_H5, version: result.os.version, name: '', id: '' };
          } else if (result.os.name === OS.ANDROID) {
            this.app = { build: SD_MODEL.ANDROID_H5, version: result.os.version, name: '', id: '' };
          } else {
            this.app = { build: SD_MODEL.DESKTOP_OS, version: result.os.version, name: '', id: '' };
          }
          if (this.browser === BROWSER.MOBILE_SAFARI) {
            const appStore = useAppStore();
            appStore.setUnStandalone(true);
          }
        }
        
  

      } else {
        this.app = await App.getInfo();
        if (this.platform === PLATFORM.ANDROID) {
          this.app.build = SD_MODEL.APK;
        } else {
          this.app.build = SD_MODEL.IOS_APP;
        }
      }
    },

    // 设置设备信息
    async setDeviceInfo() {
      // 优先使用url参数deviceId 目前只有ios深连接 需要使用url参数deviceId
      // 由于深连接会用自带浏览器 不走safari缓存 所以需要使用url参数deviceId
      const { deviceId, sd } = getUrlParams();
      this.deviceId = isEqual(sd, '4') ? deviceId : (await Device.getId()).identifier;
      const info = await Device.getInfo();
      if (info.platform === PLATFORM.WEB) {
        this.deviceModel = `${info.platform} ${info.model} ${info.operatingSystem} ${info.osVersion}`;
      } else {
        this.deviceModel = `${info.model} ${info.operatingSystem} ${info.osVersion}`;
      };
    },

    // 设置弹窗类型
    setModalType(type: string) {
      this.modalType = type;
    },

    setIsInAppBrowser(){
      this.isInAppBrowser = getIsInAppBrowser()
    }
  },
})
