import { defineStore } from 'pinia';
import { useAppStore } from './app';
import { useUserStore } from '@/store/user';
import { Storage } from '@ionic/storage';
import { getTheme } from '@/theme/hooks';
import { payListApi } from '@/api/assets';
import { bannerListApi } from '@/api/normal/index'
import { getWebDomain, getFullWebDomain, isProd, isGray } from '@/utils/app';
import { getTodayLocalDateStr } from '@/utils/date';
import { announcementLoginInApi } from '@/api/personal';
import { CURRENCY, CURRENCY_TYPE } from '@/enums/currency';
import { storeDefaultValue } from '@/hooks/StoreDefaultValue';
import { AnnouncementLoginInModel } from '@/api/personal/model';
import { RegisterType } from "@/api/normal/model";
import { announcementLoginOutApi, carouselConfigApi } from '@/api/normal';
import { handleInlineNavigation, handleCarouselJumpType } from '@/utils/inlineNavigation'
import { AuthInfoModel, CarouselConfigModel, TenantInfoModel, TenantListModel, CustomerServiceModel } from '@/api/normal/model';
import { authInfoApi, authTenantsApi, domainInfoApi, tenantInfoApi, customerServiceApi, publicCustomerServiceApi } from '@/api/normal';
import { showToast } from '@/utils'
import { showLoading } from '@/utils/loading';
import { AccountStatus } from '@/enums/common'

const setRechargeInfo = (payInfo: any) => {
  const { rechargeMode,
    showTransferName,
    showTransferVoucher,
    transferNameRequired,
    transferOrderRequired } = payInfo;
  useRechargeStore().rechargeMode = rechargeMode || 'ConfigCycle';
  const transferConfig = {
    showTransferName: showTransferName || 'OFF',
    showTransferVoucher: showTransferVoucher || 'OFF',
    transferNameRequired: transferNameRequired || 'OFF',
    transferOrderRequired: transferOrderRequired || 'OFF',
  }
  useRechargeStore().transferConfig = {
    ...transferConfig,
  };
  sessionStorage.setItem('transferConfig', JSON.stringify(transferConfig));
}
const storage = new Storage();
(async () => {
  await storage.create()
})()

export const useTenantStore = defineStore({
  id: 'tenant',
  state: () => ({
    themeConfig: storeDefaultValue<Record<string, any>>(),    // 主题配置
    tenantId: '',                                             // 当前租户id
    announcementVisible: false,                               // 公告弹窗显示状态
    tenants: [] as TenantListModel,                           // 租户列表
    rechargeInfo: storeDefaultValue<any>(),                   // 充值信息
    carouselList: [] as CarouselConfigModel,                  // 轮播图列表
    marqueeContent: [] as CarouselConfigModel,                // 跑马灯内容
    authInfo: storeDefaultValue<AuthInfoModel>(),             // 自动登录信息
    announcementList: [] as AnnouncementLoginInModel,         // 公告列表
    tenantInfo: storeDefaultValue<Record<string, any>>(),     // 当前租户信息
    payListInfo: storeDefaultValue<Record<string, any>>(),    // 支付方式列表
    domainInfo: storeDefaultValue<Record<string, any>>(),    // 域名信息
    serviceConfig: storeDefaultValue<CustomerServiceModel>(), // 客服配置
    withdrawalConfig: '',                                     // 提现方式 先提后绑”和 “先绑后提” WithdrawFirst  BindFirst
    phoneCode: '',                                     // 提现方式 先提后绑”和 “先绑后提” WithdrawFirst  BindFirst
    isLoadedDomainInfo: false,                        // 是否加载域名信息
    rechargeRatio: 10000
  }),
  getters: {
    isVirtualCurrency(state) {
      return state.tenantInfo?.currencySymbol === 'game'
    },
  },

  actions: {
    // 主题改变
    setThemeConfig(info: any) {
      const { color, skin, home, ...rest } = getTheme();
      const homeType = import.meta.env.VITE_HOME_TYPE || info.homeType
      this.themeConfig = {
        ...rest,
        skin,
        home,
        homeType,  // 游戏商户类型
      };
      // 设置手机状态栏
      let metaEl = document.querySelectorAll('meta[name="theme-color"]')[0];
      if (!metaEl) {
        metaEl = document.createElement('meta');
        metaEl.setAttribute('name', 'theme-color');
        document.head.appendChild(metaEl)
      }
      metaEl.setAttribute('content', color);
      // 获取主题对应的css
      import(`@/theme/modules/${skin}/${rest.theme}.css`);
      // 添加唯一标识
      let currentClassNames = document.body.className;
      const addPlatformType = () => {
        const regex = /home-type-\S+/g;
        // 新的标识
        const newClassName = 'home-type-' + homeType;
        if (regex.test(currentClassNames)) {
          currentClassNames = currentClassNames.replace(regex, newClassName);
          document.body.className = currentClassNames;
        } else {
          document.body.classList.add(newClassName);
        }
      }
      const addSkin = () => {
        // 添加skin标识
        const regSkin = /default|first|second/g;
        if (regSkin.test(currentClassNames)) {
          currentClassNames = currentClassNames.replace(regSkin, skin);
          document.body.className = currentClassNames;
        } else {
          document.body.classList.add(skin);
        }
      }
      const addHomeStyleMarker = () => {
        // 添加home标识
        const regHome = /v\d+/g;
        if (home) {
          if (regHome.test(currentClassNames)) {
            currentClassNames = currentClassNames.replace(regHome, home);
            document.body.className = currentClassNames;
          } else {
            document.body.classList.add(home);
          }
        } else {
          // 清空
          if (regHome.test(currentClassNames)) {
            currentClassNames = currentClassNames.replace(regHome, '');
            document.body.className = currentClassNames;
          }
        }
      }
      addPlatformType();
      addSkin();
      addHomeStyleMarker();
    },
    // 设置租户列表
    setTenants(tenants: any[]) {
      this.tenants = tenants;
    },
    // 获取租户列表
    async getTenants() {
      if (this.tenants.length) {
        return this.tenants;
      } else {
        return await onGetTenants() || [];
      }
    },
    // 设置当前租户id
    async setTenantId(tenantId: string) {
      this.tenantId = tenantId;
      await storage.set('tenantId', tenantId);
    },
    // 获取当前租户id
    async getTenantId() {
      if (!this.tenantId) {
        this.tenantId = await storage.get('tenantId');
      };
      return this.tenantId;
    },
    // 设置当前租户信息
    setTenantInfo(tenantInfo: TenantInfoModel['region'] | undefined) {
      this.tenantInfo = tenantInfo;
      if (tenantInfo) {
        storage.set('tenantInfo', tenantInfo);
      } else {
        storage.remove('tenantInfo');
      }
    },
    // 获取当前租户信息
    async getTenantInfo() {
      if (!this.tenantInfo) {
        const tenantInfo = await storage.get('tenantInfo');
        if (tenantInfo) {
          this.tenantInfo = tenantInfo;
        } else {
          await this.resetTenantInfo();
        }
      };
      return this.tenantInfo;
    },
    // 获取当前商户的可切换语言列表
    getTenantLanguageList() {
      let languageList = this.tenantInfo?.appLanguage ?? [];
      languageList = languageList.length > 1 ? languageList : [];
      return languageList
    },
    // 重置商户信息
    async resetTenantInfo() {
      await onGetTenant();
      this.withdrawalConfig = this.tenantInfo?.withdrawalConfig
      this.phoneCode = this.tenantInfo?.phoneCode
      this.rechargeRatio = this.tenantInfo?.rechargeRatio
      return this.tenantInfo;
    },
    // 加载本地商户信息
    async loadTenantInfo() {
      this.tenantInfo = await storage.get('tenantInfo');
    },
    // 获取商户充值列表
    async getPayList() {
      if (!this.payListInfo)
        this.payListInfo = await onGetPayList() || [];
      setRechargeInfo(this.payListInfo);
      return this.payListInfo;
    },
    // 设置商户充值列表
    async setPayList() {
      this.payListInfo = await onGetPayList() || [];

      setRechargeInfo(this.payListInfo);
      return this.payListInfo;
    },
    // 获取认证信息
    async getAuthInfo() {
      if (!this.authInfo)
        this.authInfo = await this.resetAuthInfo();
      return this.authInfo;
    },
    // 重置认证信息
    async resetAuthInfo() {
      await showLoading();
      this.authInfo = await authInfoApi();
      return this.authInfo;
    },
    // 获取登录方式
    getLoginTypes(isThirdParty: boolean = false) {
      const normalLogin = ['Phone', 'Account'];
      return this.authInfo?.loginType?.filter((item) => {
        return isThirdParty ? !normalLogin.includes(item) : normalLogin.includes(item);
      }) ?? [];
    },
    // 获取注册方式
    getRegisterTypes() {
      let registerTypes: RegisterType[] = [];
      if (this.authInfo?.accountRegisterSwitch) {
        registerTypes.push('Account');
      }
      if (this.authInfo?.phoneRegisterSwitch) {
        registerTypes.push('Phone');
      }
      return registerTypes;
    },
    // 设置商户通道信息
    async requestDomainInfo() {
      const domainInfo = await getDomainInfoRequest();
      this.domainInfo = domainInfo;
      if (this.domainInfo) {
        await this.setTenantId(this.domainInfo?.tenantId?.toString());
        await storage.set('domainInfo', domainInfo);
      } else {
        await this.getTenantId();
      }
      await this.loadTenantInfo();  // 加载商户信息(各页面需要商户信息，如区域语言)
      this.isLoadedDomainInfo = true;
      return this.domainInfo;
    },
    // 获取商户通道信息
    async getDomainInfo() {
      if (!this.domainInfo) {
        const domainInfo = await storage.get('domainInfo');
        if (!domainInfo)
          this.domainInfo = await this.requestDomainInfo();
      }
      return this.domainInfo;
    },
    // 载入本地商户通道信息
    async loadDomainInfo() {
      return this.domainInfo = await storage.get('domainInfo');
    },
    // 清楚公告弹窗列表
    clearAnnouncementList() {
      this.announcementList = [];
    },
    // 设置公告弹窗显示状态
    setAnnouncementVisible(visible: boolean = true) {
      this.announcementVisible = visible;
    },
    // 获取公告弹窗列表
    async getAnnouncementList() {
      if (!this.announcementList.length) {
        this.announcementList = await announcementRequest();
      }
      return this.announcementList;
    },
    // 设置公告弹窗隐藏列表(今日)
    async setAnnouncementHide(id: number) {
      const today = getTodayLocalDateStr();
      let announcementHide: Record<string, number[]> = await storage.get(`announcementHide`) || {};
      let announcementHideList: number[] = [];
      if (today in announcementHide) {
        announcementHideList = announcementHide[today];
      } else {
        announcementHide = {};
      }
      announcementHideList.push(id);
      announcementHide[today] = announcementHideList;
      storage.set(`announcementHide`, announcementHide);
    },
    // 移除公告弹窗列表
    shiftAnnouncementList() {
      this.announcementList.shift();
    },
    // 设置公告弹窗不可见列表(临时)
    setAnnouncementInvisible(id: number) {
      const announcementInvisible: number[] = JSON.parse(sessionStorage.getItem('announcementInvisible') || '[]');
      if (announcementInvisible.includes(id)) return;
      announcementInvisible.push(id);
      sessionStorage.setItem('announcementInvisible', JSON.stringify(announcementInvisible));
    },
    // 清除公告弹窗不可见列表(临时)
    clearAnnouncementInvisible() {
      sessionStorage.removeItem('announcementInvisible');
    },
    // 请求跑马灯列表
    async requestMarqueeList(type: 'image' | 'text') {
      if (type === 'image') {
        this.carouselList = await getCarouselRequest(type);
        return this.carouselList;
      } else {
        this.marqueeContent = await getCarouselRequest(type);
        // 非线上环境或灰度环境时在跑马灯中显示当前使用的域名
        if (!isProd() || isGray()) {
          const domain = getFullWebDomain();
          this.marqueeContent.unshift({
            id: 999999,
            name: "1",
            content: `current domain: ${domain}`,
            linkType: "none",
            linkValue: ""
          });
        }
        return this.marqueeContent;
      }
    },
    // 请求首页轮播图列表
    async requestCarouselList() {
      const carouselInfo: any = await bannerListApi({ bannerType: 'lobby_carousel' });
      let newArr = [];
      if (carouselInfo?.length) {
        newArr = carouselInfo.map((item: any) => {
          const linkType: any = handleCarouselJumpType(item.targetType);
          let linkValue: any = '';
          if (item.targetType == 'internal') {
            const targetValue = JSON.parse(item.targetValue);
            linkValue = handleInlineNavigation(targetValue);
          } else {
            linkValue = item.targetValue
          }
          return {
            id: item.id,
            name: item.name,
            content: item.imageUrl,
            sort: item.sort,
            linkType,
            linkValue
          }
        })
      }
      await storage.set('carouselList', newArr);
      this.carouselList = newArr;
      return this.carouselList;
    },
    // 载入本地轮播图列表
    async loadCarouselList() {
      this.carouselList = await storage.get('carouselList') || [];
      this.marqueeContent = await storage.get('marqueeContent') || [];
    },
    // 获取客服配置
    async getCustomerService() {
      try {
        const isLogin = await useAppStore().getToken();
        if (isLogin && useUserStore().accountStatus === AccountStatus.NORMAL) {
          this.serviceConfig = await customerServiceApi();
        }
        else {
          this.serviceConfig = await publicCustomerServiceApi();
        }
      } catch (error) {
        // 在客服页面账号异常时，使用公共客服配置
        if (useUserStore().accountStatus !== AccountStatus.NORMAL) {
          this.serviceConfig = await publicCustomerServiceApi();
        }
      }
      return this.serviceConfig;
    },
  }
})

/**     
 * @description 获取商户列表
 */
async function onGetTenants() {
  const res = await authTenantsApi();
  useTenantStore().setTenants(res)
  return res;
}

/**
 * @description 获取商户信息
 */
async function onGetTenant() {
  const res = await tenantInfoApi();
  const legalTender = CURRENCY[(res.region.currency || 'USD') as CURRENCY_TYPE];
  const merchantCy = res.currencySymbol === 'game' ? '' : legalTender;
  const { region, appIcon, siteName, siteLogo, ...rest } = res;

  const info = {
    ...rest,
    merchantCy,
    legalTender,
    icon: res.appIcon,
    logo: res.siteLogo,
    ...res.region,
    name: res.siteName,
  }
  useTenantStore().setTenantInfo(info)
  // 设置主题相关
  useTenantStore().setThemeConfig(info)
  const locale = await storage.get('locale') || res.appDefaultLanguage || res.region.language;
  if (res.appLanguage.includes(locale)) {
    useAppStore().setLocale(locale);
  }
  else {
    useAppStore().setLocale(res.appLanguage[0]);
  }
}

/**
 * @description 获取充值方式列表
 */
export async function onGetPayList() {
  const res = await payListApi();
  res.tenantPayTypeList = res.tenantPayTypeList.filter((item: any) => item.payTypeSubList.length > 0).sort((a: any, b: any) => {
    return b.sort - a.sort;
  });
  return res;
}

/**
 * @description 通过域名获取商户信息
 */
export async function getDomainInfoRequest() {
  const maxRetries = isProd() ? 5 : 0;
  const domain = getWebDomain();
  let retries = 0;
  let backoff = 1000;

  while (retries <= maxRetries) {
    try {
      const res = await domainInfoApi(domain, true); // 获取当前域名(8zh.xyz)
      if (res && 'info' in res) {
        useAppStore().setAppInfo(res.configList);
        if (res.info) {
          return res.info;
        }
      } else {
        showToast('Failed to obtain merchant information');
        throw new Error('Failed to obtain merchant information');
      }
    } catch (err) {
      if (retries === maxRetries) {
        // console.error(err);
        break;
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, retries * backoff));
    }
  }
}

/**
 * @description 获取公告信息(已登录||未登陆)
 */
export async function announcementRequest() {
  let res: AnnouncementLoginInModel;
  const appStore = useAppStore();
  if (await appStore.getToken()) {
    res = await announcementLoginInApi();
  } else {
    res = await announcementLoginOutApi();
  }
  if (res.length) {
    const today = getTodayLocalDateStr();
    const announcementInvisible: number[] = JSON.parse(sessionStorage.getItem('announcementInvisible') || '[]');  // 临时不可见公告列表
    const announcementHide: Record<string, number[]> = await storage.get(`announcementHide`) || {};               // 今日隐藏公告列表
    let announcementHideList: number[] = [];
    let announcementHideIds: number[] = [];
    if (today in announcementHide) {
      announcementHideIds = announcementHide[today];
    }
    announcementHideList = [...announcementHideIds, ...announcementInvisible];
    return res.filter(item => !announcementHideList.includes(item.id));
  } else {
    return [];
  }
}

/**
 * @description 获取轮数据
 */
export async function getCarouselRequest(type: 'image' | 'text') {
  const res = await carouselConfigApi({ type });
  if (type === 'image')
    storage.set('carouselList', res);
  else
    storage.set('marqueeContent', res);
  return res;
}
