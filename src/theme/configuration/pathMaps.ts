import { getImageUrl } from '@/utils/url'
// 定义平台类型
type PlatformType = keyof typeof platformImagePosition;
type CategoryType = keyof typeof categoryImagePosition;

// 图片位置和UI商议好
const platformImagePosition: Record<string, string> = {
  slots_cq9: 'background-position: 0 0',
  ONE_API_CQ9: 'background-position: 0 0',
  ELECTRONIC_tada: 'background-position: -100% 0',
  ONE_API_Tada: 'background-position: -100% 0',
  PP: 'background-position: -200% 0',
  ONE_API_PP: 'background-position: -200% 0',
  ELECTRONIC_PP: 'background-position: -200% 0',
  PG: 'background-position: -300% 0',
  KKGAME: 'background-position: -300% 0',
  ELECTRONIC_kk: 'background-position: -300% 0',
  ONE_API_PG: 'background-position: -300% 0',
  slots_Evoplay: 'background-position: -400% 0',
  ONE_API_Evoplay: 'background-position: -400% 0',
  Betby: 'background-position: -500% 0',
  slots_jdb: 'background-position: -600% 0',
  ONE_API_JDB: 'background-position: -600% 0',
  slots_Spinix: 'background-position: -700% 0',
  ONE_API_Spinix: 'background-position: -700% 0',
  live_evolutoin: 'background-position: 0 -100%',
  ONE_API_Evolution: 'background-position: 0 -100%',
  SPRIBE: 'background-position: -100% -100%',
  ONE_API_Spribe: 'background-position: -100% -100%',
  M8SPORTS: 'background-position: -200% -100%',
  basha: 'background-position: -300% -100%',
  slots_jili: 'background-position: -400% -100%',
  ONE_API_Jili: 'background-position: -400% -100%',
  slots_fc: 'background-position: -500% -100%',
  ONE_API_FaChai: 'background-position: -500% -100%',
  TBGame: 'background-position: -600% -100%',
  CP: 'background-position: -700% -100%',
  G759: 'background-position: -200% -200%',
  SEXYBCRT: 'background-position: -500% -200%',
  ONE_API_Sexy: 'background-position: -500% -200%',
  EVOLive: 'background-position: 0 -100%',
  WM_LIVE: 'background-position: -700% -200%',
  FBSports: 'background-position: 0 -300%',
  ONE_API_AG: 'background-position: -100% -300%',
  POPOK: 'background-position: -300% -300%',
}

const categoryImagePosition: Record<string, string> = {
  ONE_API_HOT: 'background-position: 0 0',
  ELECTRONIC: 'background-position: -100% 0',
  CHESS: 'background-position: -200% 0',
  FISHING: 'background-position: -300% 0',
  VIDEO: 'background-position: -400% 0',
  SPORTS: 'background-position: -500% 0',
  LOTTERY: 'background-position: -600% 0',
}

export default {
  /*    components     */
  BonusPool: {
    1: () => import('@/components/BonusPool/index.vue'),
    2: () => import('@/components/BonusPool/2/index.vue'),
    3: () => import('@/components/BonusPool/3/index.vue'),
    icon1: {
      1: new URL('@/assets/img/inicio/bonus1.png', import.meta.url).href,
      2: new URL('@/assets/img/inicio/bonus2.jpg', import.meta.url).href,
    }
  },
  lazyImages: {
    1: () => import('@/components/GameCard/lazyImages.vue'),
    icon1: {
      1: new URL('@/assets/img/inicio/badge1.png', import.meta.url).href,
      2: new URL('@/assets/img/inicio/badge2.png', import.meta.url).href,
    }
  },
  pwa_HeaderBar: {
    1: () => import('@/pwa/HeaderBar/PwaHeader.vue'),

  },
  pwa_footerModal: {
    1: () => import('@/pwa/footerModal/PwaFooter.vue'),
  },

  /*    tabbar     */
  tabbar_layout_contentBox: {
    1: () => import('@/views/tabbar/components/layout/contentBox/index.vue'),
    icon1: {
      1: new URL('@/assets/img/inicio/content-bg1.png', import.meta.url).href,
      2: new URL('@/assets/img/inicio/content-bg2.png', import.meta.url).href,
    }
  },
  tabbar_layout_toolbar: {
    1: () => import('@/views/tabbar/components/layout/toolbar.vue'),
  },
  tabbar_layout_buttons: {
    1: () => import('@/views/tabbar/components/layout/buttons.vue'),
  },
  tabbar_DrawerLeft: {
    1: () => import('@/views/tabbar/components/DrawerLeft/index.vue'),
  },
  tabbar_DrawerLeft_backHeader: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/backHeader/1/index.vue'),
    close: {
      1: '/first/svg/close.svg',
    }
  },
  tabbar_DrawerLeft_gameList_categories: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/gameList/categories/1/index.vue'),
    icon: {
      1: (key: string) => `/first/svg/sort/${key}.svg`,
      2: '',
    }
  },
  tabbar_DrawerLeft_gameList_platform: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/gameList/platform/1/index.vue'),
    icon: {

    },
    image: {
      1: (key: PlatformType) => {
        if (key === 'ONE_API_HOT') {
          return '/first/svg/sort/POPULAR.svg'
        }
        const position = platformImagePosition[key]
        if (position) {
          const imageUrl = new URL('@/assets/img/inicio/platform1.png', import.meta.url)
          return `background-image: url(${imageUrl.href});${position}`
        }
        return ''
      },
      2: (key: PlatformType) => {
        if (key === 'ONE_API_HOT') {
          return '/first/svg/sort/POPULAR.svg'
        }
        const position = platformImagePosition[key]
        if (position) {
          const imageUrl = new URL('@/assets/img/inicio/platform2.png', import.meta.url)
          return `background-image: url(${imageUrl.href});${position}`
        }
        return ''
      },
    }
  },
  tabbar_DrawerLeft_hotGame: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/hotGame/1/index.vue'),
  },
  tabbar_DrawerLeft_hotGame_gameList: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/hotGame/components/gameList/1/index.vue'),
  },
  tabbar_DrawerLeft_hotGame_title: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/hotGame/components/title/1/index.vue'),
    2: () => import('@/views/tabbar/components/DrawerLeft/components/hotGame/components/title/2/index.vue'),
  },
  tabbar_DrawerLeft_language: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/language/1/index.vue'),
  },
  tabbar_DrawerLeft_activityList: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/activityList/index.vue'),
    image: {
      1: async (key: string) => {
        if (!key) {
          console.error('Image key is undefined')
          return ''
        }
        try {
          const imageModule = await import(`@/assets/img/inicio/${key}.png`)
          return imageModule.default
        } catch (error) {
          console.warn('Failed to load image:', error)
          return Promise.reject(error)
        }
      },
    }
  },
  tabbar_DrawerLeft_depositAndWithdrawal: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/depositAndWithdrawal/1/index.vue'),
  },
  tabbar_DrawerLeft_customerService: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/customerService/1/index.vue'),
    2: () => import('@/views/tabbar/components/DrawerLeft/components/customerService/2/index.vue'),
    3: () => import('@/views/tabbar/components/DrawerLeft/components/customerService/3/index.vue'),
    icon1: {
      1: '/images/support.png',
      2: '/first/svg/support.svg',
      3: getImageUrl('svg/support.svg'),
    },
  },
  tabbar_DrawerLeft_nav: {
    1: () => import('@/views/tabbar/components/DrawerLeft/components/nav/1/index.vue'),
  },
  tabbar_tabBar: {
    1: () => import('@/views/tabbar/components/tabBar/components/colorWrap/index.vue'),
    2: () => import('@/views/tabbar/components/tabBar/components/imageWrap/index.vue'),
    bgImg: {
      1: '/first/svg/tabbar/bg-purple-light.svg',
      2: '/first/svg/tabbar/bg-phantom-blue.svg',
      3: getImageUrl('svg/bg-mystlight-blue.svg'),
      4: getImageUrl('svg/bg-midnight-purple.svg'),
    }
  },
  tabbar_tabBar_tabItem: {
    1: () => import('@/views/tabbar/components/tabBar/components/tabItem/1/index.vue'),
    2: () => import('@/views/tabbar/components/tabBar/components/tabItem/2/index.vue'),
    3: () => import('@/views/tabbar/components/tabBar/components/tabItem/3/index.vue'),
    icon1: {
      1: (key: string) => `/first/svg/tabbar/${key}-1.svg`,
      2: (key: string) => `/first/svg/tabbar/${key}_2.svg`,
      3: (key: string) => getImageUrl(`img/inicio/${key}-1.png`),
      4: (key: string) => getImageUrl(`img/inicio/${key}-2.png`),
    },
  },
  tabbar_tabBar_flexibleTab: {
    2: () => import('@/views/tabbar/components/tabBar/components/flexibleTab/2/index.vue'),
    3: () => import('@/views/tabbar/components/tabBar/components/flexibleTab/3/index.vue'),
    4: () => import('@/views/tabbar/components/tabBar/components/flexibleTab/4/index.vue'),
    icon: {
      1: '/first/svg/tabbar/deposit_on.svg',
    },
    icon1: {
      1: new URL('@/assets/img/inicio/flexible-1.png', import.meta.url).href,
      2: new URL('@/assets/img/inicio/to-top-2.png', import.meta.url).href,
    },
    icon2: {
      1: new URL('@/assets/img/inicio/tab-move1.png', import.meta.url).href,
    },
  },
  tabbar_inicio_HeaderBar_menu: {
    1: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/menu/index.vue'),
    icon1: {
      1: '/first/svg/menu2.svg',
    }
  },
  tabbar_inicio_HeaderBar_logo: {
    1: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/logo/index.vue'),
  },
  tabbar_inicio_HeaderBar_assets: {
    1: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/assets/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/assets/2/index.vue'),
    3: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/assets/3/index.vue'),
    icon1: {
      1: '/first/svg/tabbar/deposit_on.svg',
    },
    icon2: {
      1: '/icons/tabbar/withdraw3.png',
    },
  },
  tabbar_inicio_HeaderBar_buttonWrap: {
    1: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/buttonWrap/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/buttonWrap/2/index.vue'),
  },
  tabbar_inicio_loginButton: {
    1: () => import('@/views/tabbar/tabs/inicio/components/button/index.vue'),
  },
  tabbar_inicio_iconButton: {
    1: () => import('@/views/tabbar/tabs/inicio/components/button/iconButton/1/index.vue'),
    icon1: {
      1: '/svg/search.svg',
    }
  },
  tabbar_inicio_dropdown: {
    1: () => import('@/views/tabbar/tabs/inicio/components/dropdown/1/index.vue'),
    beforeIcon: {
      1: new URL('@/assets/svg/crown.svg', import.meta.url).href,
    },
    afterIcon: {
      1: {
        up: '/first/svg/select-icon.svg',
        down: '/first/svg/select-icon.svg',
      },
    }
  },
  tabbar_inicio_HeaderBar_registerButton: {
    1: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/registerButton/index.vue'),
  },
  tabbar_inicio_HeaderBar_languageButton: {
    1: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/languageButton/index.vue'),
    icon1: {
      1: '/first/svg/earth.svg',
    }
  },
  tabbar_inicio_HeaderBar_searchButton: {
    1: () => import('@/views/tabbar/tabs/inicio/components/HeaderBar/components/searchButton/index.vue'),
    search: {
      1: '/svg/search.svg',
    }
  },
  tabbar_inicio_SwiperView: {
    1: () => import('@/views/tabbar/tabs/inicio/components/SwiperView/1/index.vue'),
  },
  tabbar_inicio_SwiperView_badge: {
    1: () => import('@/views/tabbar/tabs/inicio/components/SwiperView/components/badge/1/index.vue'),
  },
  tabbar_inicio_ActivityBar: {
    1: () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/1/index.vue'),
    5: () => import('@/views/tabbar/tabs/inicio/components/ActivityBar/5/index.vue'),
    activity: {
      1: [new URL('@/assets/img/inicio/event-promotion0-1.png', import.meta.url).href, new URL('@/assets/img/inicio/event-promotion1-1.png', import.meta.url).href, new URL('@/assets/img/inicio/event-promotion2-1.png', import.meta.url).href],
    }
  },
  tabbar_inicio_MarqueeView: {
    1: () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/index.vue'),
  },
  tabbar_inicio_MarqueeView_marquee: {
    1: () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/components/marquee/index.vue'),
    megaphone: {
      1: '/first/svg/broadcast.svg',
      2: new URL('@/assets/img/inicio/broadcast2.png', import.meta.url).href
    }
  },
  tabbar_inicio_MarqueeView_message: {
    1: () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/components/message/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/components/message/2/index.vue'),
    3: () => import('@/views/tabbar/tabs/inicio/components/MarqueeView/components/message/3/index.vue'),
    icon1: {
      1: '/svg/message1.svg',
      2: '/svg/message2.svg',
    }
  },
  tabbar_inicio_userInfo_account: {
    1: () => import('@/views/tabbar/tabs/inicio/components/userInfo/components/account/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/userInfo/components/account/2/index.vue'),
    icon1: {
      1: new URL('@/assets/img/inicio/treasure-box.png', import.meta.url).href,
    }
  },
  tabbar_inicio_userInfo_cardWrap: {
    1: () => import('@/views/tabbar/tabs/inicio/components/userInfo/components/cardWrap/1/index.vue'),
  },
  tabbar_inicio_userInfo_cardButton: {
    1: () => import('@/views/tabbar/tabs/inicio/components/userInfo/components/cardButton/1/index.vue'),
    icon1: {
      1: (key: string) => getImageUrl(`img/inicio/${key}1.png`),
    }
  },
  tabbar_inicio_Segment: {
    1: () => import('@/views/tabbar/tabs/inicio/components/Segment/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/Segment/swiperWrap/index.vue'),
    5: () => import('@/views/tabbar/tabs/inicio/components/Segment/5/index.vue'),
  },
  tabbar_inicio_Ranking: {
    1: () => import('@/views/tabbar/tabs/inicio/components/Ranking/index.vue'),
    icon1: {
      1: getImageUrl('img/inicio/ranking-top-three.png'),
      2: getImageUrl('img/inicio/ranking-top-three-21.png'),
    }
  },
  tabbar_inicio_Segment_segmentLayout: {
    1: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/platform/columnLayout/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/platform/rowLayout/index.vue'),
    3: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/category/columnLayout/index.vue'),
    4: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/category/rowLayout/index.vue'),
    5: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/swiper/platform/index.vue'),
    6: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/swiper/category/index.vue'),
  },
  tabbar_inicio_Segment_nav: {
    1: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/nav/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/nav/2/index.vue'),
    3: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/nav/3/index.vue'),
    4: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/nav/4/index.vue'),
    5: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/nav/5/index.vue'),
    6: () => import('@/views/tabbar/tabs/inicio/components/Segment/components/nav/6/index.vue'),
    icon: {
      1: (key: string) => `/svg/sort/${key}1.svg`,
      2: '/svg/gamepad.svg',
    },
    icon1: {
      1: (key: PlatformType) => {
        if (key === 'ONE_API_HOT') {
          return '/first/svg/sort/POPULAR.svg'
        }
        const position = platformImagePosition[key]
        if (position) {
          const imageUrl = new URL('@/assets/img/inicio/platform1.png', import.meta.url)
          return `background-image: url(${imageUrl.href});${position}`
        }
        return ''
      },
      2: (key: PlatformType) => {
        if (key === 'ONE_API_HOT') {
          return '/first/svg/sort/POPULAR.svg'
        }
        const position = platformImagePosition[key]
        if (position) {
          const imageUrl = new URL('@/assets/img/inicio/platform2.png', import.meta.url)
          return `background-image: url(${imageUrl.href});${position}`
        }
        return ''
      },
      3: (key: CategoryType) => {
        const position = categoryImagePosition[key]
        if (position) {
          const imageUrl = new URL('@/assets/img/inicio/category1.png', import.meta.url)
          return `background-image: url(${imageUrl.href});${position}`
        }
        return ''
      },
      4: (key: PlatformType) => {
        const position = platformImagePosition[key]
        if (position) {
          const imageUrl = new URL('@/assets/img/inicio/platform4.png', import.meta.url)
          return `background-image: url(${imageUrl.href});${position}`
        }
        return ''
      },
    },
    icon2: {
      1: '/icons/platform/ONE_API_HOT-2.png',
      2: '/first/svg/sort/POPULAR.svg',
    },
    icon3: {
      1: getImageUrl('img/inicio/tab-bg2.png'),
      2: getImageUrl('img/inicio/tab-bg4.png'),
      3: getImageUrl('img/inicio/tab-bg5.png'),
    }
  },
  tabbar_inicio_GameWrapper: {
    1: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/index.vue'),
  },
  tabbar_inicio_GameWrapper_Wrapper: {
    2: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapper/2/index.vue'),
  },
  tabbar_inicio_GameWrapper_ShowAll: {
    1: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/showAll/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/showAll/2/index.vue'),
  },
  tabbar_inicio_GameWrapper_WrapperHead: {
    1: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/index.vue'),
  },
  tabbar_inicio_GameWrapper_WrapperHead_start: {
    1: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/components/start/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/components/start/2/index.vue'),
    3: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/components/start/3/index.vue'),
  },
  tabbar_inicio_GameWrapper_WrapperHead_center: {
    1: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/components/center/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/components/center/2/index.vue'),
    3: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/components/center/3/index.vue'),
    4: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/components/center/4/index.vue'),
  },
  tabbar_inicio_GameWrapper_WrapperHead_end: {
    1: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/components/end/1/index.vue'),
    icon: {
      2: '/svg/arrow-left2.svg',
    }
  },
  tabbar_inicio_GameWrapper_Header: {
    1: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/header/index.vue'),
  },
  tabbar_inicio_GameWrapper_Header_start: {
    2: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/header/components/start/2/index.vue'),
  },
  tabbar_inicio_GameWrapper_Header_center: {
    4: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/header/components/center/4/index.vue'),
  },
  tabbar_inicio_GameWrapper_Header_end: {
    1: () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/header/components/end/index.vue'),
    icon1: {
      2: '/svg/arrow-left2.svg',
    }
  },
  tabbar_inicio_video: {
    1: () => import('@/views/tabbar/tabs/inicio/components/video/index.vue'),
  },
  tabbar_inicio_PartView: {
    1: () => import('@/views/tabbar/tabs/inicio/components/PartView/index.vue'),
  },
  tabbar_inicio_PartView_gamePlatform: {
    1: () => import('@/views/tabbar/tabs/inicio/components/PartView/components/gamePlatform/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/PartView/components/gamePlatform/2/index.vue'),
    icon: {
      1: '/svg/game-platform-logo-1.svg',
    },
    subIcon: {
      1: '/svg/star.svg',
    }
  },
  tabbar_inicio_PartView_socialMedia: {
    1: () => import('@/views/tabbar/tabs/inicio/components/PartView/components/socialMedia/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/PartView/components/socialMedia/2/index.vue'),
  },
  tabbar_inicio_PartView_paymentPartner: {
    1: () => import('@/views/tabbar/tabs/inicio/components/PartView/components/paymentPartner/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/PartView/components/paymentPartner/2/index.vue'),
  },
  tabbar_inicio_AppInstall: {
    1: () => import('@/views/tabbar/tabs/inicio/components/AppInstall/components/buttonBox/1/index.vue'),
    2: () => import('@/views/tabbar/tabs/inicio/components/AppInstall/components/buttonBox/2/index.vue'),
    ios: {
      1: '/svg/apple.svg',
    },
    android: {
      1: '/svg/android.svg',
    }
  },
  tabbar_inicio_AppInstall_badge: {
    1: () => import('@/views/tabbar/tabs/inicio/components/AppInstall/components/badge/1/index.vue'),
    icon1: {
      1: new URL('@/assets/svg/badge1.svg', import.meta.url).href,
    }
  },
  tabbar_inicio_AppInstall_introduction: {
    1: () => import('@/views/tabbar/tabs/inicio/components/AppInstall/components/introduction/1/index.vue'),
  },
  tabbar_inicio_FooterContent: {
    1: () => import('@/views/tabbar/tabs/inicio/components/FooterContent/index.vue'),
  },
  tabbar_inicio_FooterContent_introduction: {
    1: () => import('@/views/tabbar/tabs/inicio/components/FooterContent/components/introduction/1/index.vue'),
  },
  tabbar_inicio_FooterContent_version: {
    1: () => import('@/views/tabbar/tabs/inicio/components/FooterContent/components/version/1/index.vue'),
  },
  tabbar_inicio_FooterContent_logo: {
    1: () => import('@/views/tabbar/tabs/inicio/components/FooterContent/components/logo/1/index.vue'),
  },
  tabbar_inicio_FooterContent_badge: {
    1: () => import('@/views/tabbar/tabs/inicio/components/FooterContent/components/badge/1/index.vue'),
    icon1: {
      1: '/first/svg/age18.svg',
    },
    icon2: {
      1: new URL('@/assets/img/inicio/badge3.png', import.meta.url).href,
    },
    icon3: {
      1: new URL('@/assets/img/inicio/badge4.png', import.meta.url).href,
    }
  },
  tabbar_inicio_FooterContent_age18: {
    1: () => import('@/views/tabbar/tabs/inicio/components/FooterContent/components/age18/index.vue'),
    icon1: {
      1: '/first/svg/age18.svg',
    }
  },
  tabbar_inicio_CustomerServiceButton: {
    1: () => import('@/views/tabbar/tabs/inicio/components/CustomerServiceButton/index.vue'),
    image: {
      1: '/images/support.png',
    },
    icon: {
      1: '/first/svg/support.svg',
      2: '/svg/support1.svg',
    }
  },
  tabbar_inicio_ToTopButton: {
    1: () => import('@/views/tabbar/tabs/inicio/components/ToTopButton/index.vue'),
    toTop: {
      1: '/svg/to-top1.svg',
      2: '/svg/to-top2.svg',
      3: '/svg/to-top3.svg',
    }
  }
}
