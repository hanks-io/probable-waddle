import type { ComponentList } from '@/hooks/useLoadComponent';

import { useLoadComponent, useConfiguration } from '@/hooks/useLoadComponent';


export default () => {

  const {
    themeConfig,
    loadComponent,
    themeHomeType,
  } = useLoadComponent();

  const {
    createComponent
  } = useConfiguration();

  const tenantStore = useTenantStore();

  const inicioConfiguration = toRef(tenantStore.themeConfig?.configuration?.inicio)

  const pageComponentOptions = computed(() => {
    if (!inicioConfiguration.value) return { list: [], options: {} };
    const { children, ...options } = inicioConfiguration.value;
    return {
      options,
      list: createComponent(children),
    };
  });

  // 头部pwa推广
  const pwaViewList: ComponentList = {
    'blue-default-GameType': () => import('@/pwa/HeaderBar/Default.vue'),
    'blue-default-Platform': () => import('@/pwa/HeaderBar/Default.vue'),
    'green-default-v01-GameType': () => import('@/pwa/HeaderBar/Default.vue'),
    'green-default-v01-Platform': () => import('@/pwa/HeaderBar/Default2.vue'),
    'green-default-v02-Platform': () => import('@/pwa/HeaderBar/Default2.vue'),
    'forest-green-v01-Platform': () => import('@/pwa/HeaderBar/Default2.vue'),
    'forest-green-v02-Platform': () => import('@/pwa/HeaderBar/Default2.vue'),
    'amber-purple-v01-Platform': () => import('@/pwa/HeaderBar/Default2.vue'),
    'blue-default-v02-Platform': () => import('@/pwa/HeaderBar/Default2.vue'),
    'auroral-yellow-Platform': () => import('@/pwa/HeaderBar/Default.vue'),
  };

  const headerBarList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/default/HeaderBar1/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/default/HeaderBar2/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/default/HeaderBar1/index.vue'),
  };

  // 活动推广
  const activityList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar2/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar4/index.vue'),
    'green-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar1/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar3/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar3/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar3/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar3/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar3/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar3/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar4/index.vue'),
  };

  // 跑马灯
  const marqueeList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView1/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView1/index.vue'),
    'green-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView1/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView2/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView2/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView2/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView2/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView2/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView2/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/default/MarqueeView3/index.vue'),
  };

  // 游戏导航标签
  const segmentList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/Segment/1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/tabs/inicio/components/Segment/2/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/Segment/5/index.vue'),
    'green-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/Segment/1/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/Segment/3/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/Segment/4/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/Segment/3/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/Segment/4/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/Segment/3/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/Segment/3/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/Segment/3/index.vue'),
  };

  // app下载组件
  const appInstallList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall2/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall4/index.vue'),
    'green-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall1/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall3/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall3/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall3/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall3/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall3/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall3/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/AppInstall/default/AppInstall5/index.vue'),
  }

  // 底部文案组件
  const footerContentList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent2/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent4/index.vue'),
    'green-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent1/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent3/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent3/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent3/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent3/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent3/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent3/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/FooterContent/default/FooterContent5/index.vue'),
  }
  // 三方合作组件
  const partViewList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView2/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView4/index.vue'),
    'green-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView1/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView3/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView3/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView3/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView3/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView3/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView3/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/PartView/default/PartView5/index.vue'),
  }
  // 游戏分类列表组件
  const gameClassList: ComponentList = {
    'blue-default-Platform': () => import('@/views/tabbar/tabs/inicio/components/GameClassification/Class1.vue'),
  }

  // 奖池组件
  const bonusPoolList: ComponentList = {
    'blue-default-v01-GameType': () => import('@/components/BonusPool/index.vue'),
    'green-default-v01-Platform': () => import('@/components/BonusPool/index.vue'),
    'green-default-v02-Platform': () => import('@/components/BonusPool/index.vue'),
    'forest-green-v01-Platform': () => import('@/components/BonusPool/index.vue'),
    'forest-green-v02-Platform': () => import('@/components/BonusPool/index.vue'),
    'amber-purple-v01-Platform': () => import('@/components/BonusPool/index.vue'),
    'blue-default-v02-Platform': () => import('@/components/BonusPool/index.vue'),
    'auroral-yellow-Platform': () => import('@/components/BonusPool/index.vue'),
  }

  const gameTabList: ComponentList = {
    'green-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/Tabs/1/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/Tabs/1/index.vue'),
  }

  const customerServiceButtonList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/CustomerServiceButton/1/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/tabs/inicio/components/CustomerServiceButton/2/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/CustomerServiceButton/3/index.vue'),
  }

  const toTopButtonList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/2/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/2/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/2/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/2/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/2/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/2/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/2/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/3/index.vue'),
  }

  // 使用加载器加载组件
  const segmentComponent = loadComponent(segmentList);
  const activityComponent = loadComponent(activityList);
  const appInstallComponent = loadComponent(appInstallList);
  const footerContentComponent = loadComponent(footerContentList);
  const partViewComponent = loadComponent(partViewList);
  const pwaViewComponent = loadComponent(pwaViewList);
  const marqueeComponent = loadComponent(marqueeList);
  const gameClassComponent = loadComponent(gameClassList);
  const bonusPoolComponent = loadComponent(bonusPoolList);
  const gameTabComponent = loadComponent(gameTabList);
  const headerBarComponent = loadComponent(headerBarList);
  const toTopButtonComponent = loadComponent(toTopButtonList);
  const customerServiceButtonComponent = loadComponent(customerServiceButtonList);

  return {
    themeConfig,
    themeHomeType,
    gameTabComponent,
    marqueeComponent,
    pwaViewComponent,
    segmentComponent,
    partViewComponent,
    activityComponent,
    headerBarComponent,
    gameClassComponent,
    bonusPoolComponent,
    appInstallComponent,
    toTopButtonComponent,
    footerContentComponent,
    customerServiceButtonComponent,
    pageComponentOptions,
  }
}
