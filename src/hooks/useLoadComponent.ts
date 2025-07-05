import { useTenantStore } from "@/store/tenant";
import { defineAsyncComponent, markRaw, computed, ComponentPublicInstance, ComputedRef, Ref } from 'vue';
import pathMaps from '@/theme/configuration/pathMaps';

export interface ComponentList { 
  'blue-default-GameType'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'blue-default-Platform'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'blue-default-v01-GameType'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'blue-default-v02-Platform'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'amber-purple-v01-Platform'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'green-default-v01-GameType'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'green-default-v01-Platform'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'green-default-v02-Platform'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'forest-green-v01-Platform'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'forest-green-v02-Platform'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
  'auroral-yellow-Platform'?: () => Promise<ReturnType<typeof defineAsyncComponent>>;
}

interface ComponentItem {
  componentName?: string;
  componentId?: string;
  modules?: () => Promise<any>;
  position?: string;
  children?: ComponentItem[];
  [key: string]: any;
}

type ComponentMapItem = {
  key?: string;
  position?: string;
  componentName?: string;
  list?: ComponentMapItem[];
  options: Record<string, any>;
  component?: ComponentPublicInstance | null;
}

interface ImageItem {
  name: string;
  id: string;
}

const checkThemeInList = (themeKeyObject: Record<string, string[]>) => {
  const { themeHomeType } = useLoadComponent();
  for (const [key, theme] of Object.entries(themeKeyObject)) {
    if (theme.includes(themeHomeType.value)) {
      return key
    }
  }
}

export const useLoadComponent = () => {
  const tenantStore = useTenantStore();

  const {
    themeConfig
  } = toRefs(tenantStore);

  const themeHomeType = computed(() => {
    const { theme, home, homeType } = tenantStore.themeConfig ?? {};
    return  `${theme}-${home ? (home + '-') : ''}${homeType ?? 'GameType'}`;
  });

  // 组件加载器
  const loadComponent = (list: ComponentList) => {
    const components = list[themeHomeType.value as keyof ComponentList] || list['blue-default-GameType'] || null;
    if (components) {
      const asyncComponent = defineAsyncComponent(components);
      return markRaw(asyncComponent) as unknown as ComponentPublicInstance | null;
    }
    return null;
  };

  return {
    themeConfig,
    loadComponent,
    themeHomeType,
  };
}

export const useHeaderToolbar = (supportLanguages?: ComputedRef<string[]> | Ref<string[]>) => {
  const { themeHomeType } = useLoadComponent();
  
  const headerSearchHideList = ['auroral-yellow-Platform'];
  const headerLanguageHideList = ['green-default-v02-Platform', 'forest-green-v02-Platform', 'auroral-yellow-Platform'];
  
  type BtnKey = 'search' | 'language';

  const hideButton = (key: BtnKey): boolean => {
    const btns: Record<BtnKey, () => boolean> = {
      search: () => !headerSearchHideList.includes(themeHomeType.value),
      language: () => {
        return (supportLanguages?.value?.length ?? 0) > 1 && !headerLanguageHideList.includes(themeHomeType.value);
      },
    };
    return btns[key]();
  }

  const hideList = ['amber-purple-GameType', 'auroral-yellow-Platform']

  // 判断是否显示资产图标
  const showAssetsIcon = computed(() => {
    return !hideList.includes(themeHomeType.value)
  })

  const menuIcons = {
    '/svg/menu.svg': ['blue-default-Platform'],
    '/svg/menu2.svg': ['auroral-yellow-Platform'],
  }
  const menuIcon = computed(() => {
    for (const [imgUrl, theme] of Object.entries(menuIcons)) {
      if (theme.includes(themeHomeType.value)) {
        return imgUrl
      }
    }
    return '/svg/menu1.svg'
  })

  const assetsImgs = {
    'icons/tabbar/withdraw3.png': ['auroral-yellow-Platform'],
  }
  const assetsImgUrl = computed(() => {
    for (const [imgUrl, theme] of Object.entries(assetsImgs)) {
      if (theme.includes(themeHomeType.value)) {
        return imgUrl
      }
    }
    return ''
  })

  return {
    menuIcon,
    hideButton,
    assetsImgUrl,
    showAssetsIcon,
  }
}

export const useGradientSVG = () => {
  const { themeHomeType } = useLoadComponent();
  
  const svgThemeKey: Record<string, string[]> = {
    '1': ['green-default-v01-Platform', 'green-default-v02-Platform', 'forest-green-v01-Platform', 'forest-green-v02-Platform'],
    '2': ['blue-default-v02-Platform', 'blue-default-Platform', 'blue-default-v01-GameType'],
    '3': ['amber-purple-v01-Platform'],
    '4': ['auroral-yellow-Platform'],
  }

  const selectSvgGradientID = () => {
    const list = Object.keys(svgThemeKey);
    for (const key of list) {
      if (svgThemeKey[key].includes(themeHomeType.value)) {
        return key;
      }
    }
    return ''
  }
  return {
    selectSvgGradientID,
  }
}

export const usePwaToolbar = () => {
  const { themeHomeType } = useLoadComponent();

  const pwaHeaderCloseBtnInStart = ['amber-purple-v01-Platform', 'blue-default-v02-Platform', 'green-default-v01-Platform', 'green-default-v02-Platform', 'forest-green-v01-Platform', 'forest-green-v02-Platform']
  
  const closeButtonPosition = computed(() => {
    return pwaHeaderCloseBtnInStart.includes(themeHomeType.value) ? 'start' : 'end'
  }); // 关闭按钮

  const giftImgUrl = computed(() => {
    const imgUrls = {
      '/images/money2.png': ['blue-default-v01-GameType', 'auroral-yellow-Platform'],
    }
    for (const [imgUrl, theme] of Object.entries(imgUrls)) {
      if (theme.includes(themeHomeType.value)) {
        return imgUrl
      }
    }
    return '/images/pwa-prize.png'
  })

  return {
    giftImgUrl,
    closeButtonPosition,
  }
}

export const useGameCard = () => {
  const { themeHomeType } = useLoadComponent();

  const gameHeadTypes: Record<string, any> = {
    'blue-default-GameType': () => ({
      titleType: '2',
      headType: '1',
      size: 6,
      row: 2,
      hotSize: 9,
      hotRow: 3,
    }),
    'blue-default-Platform': () => ({
      titleType: '1',
      headType: '3',
      isShowAll: true,
      size: 12,
      row: 3,
      hotSize: 16,
      hotRow: 4,
    }),
    'blue-default-v01-GameType': () => ({
      titleType: '1',
      headType: '6',
      size: 16,
      row: 4,
      hotSize: 16,
      hotRow: 4,
    }),
    'green-default-v01-GameType': () => ({
      titleType: '1',
      headType: '1',
      size: 12,
      row: 3,
      hotSize: 16,
      hotRow: 4,
    }),
    'green-default-v01-Platform': () => ({
      titleType: '1',
      headType: '4',
      isShowAll: true,
      size: 12,
      row: 3,
      hotSize: 16,
      hotRow: 4,
    }),
    'amber-purple-v01-Platform': () => ({
      titleType: '1',
      headType: '4',
      isShowAll: true,
      size: 12,
      row: 3,
      hotSize: 16,
      hotRow: 4,
    }),
    'blue-default-v02-Platform': () => ({
      titleType: '1',
      headType: '4',
      isShowAll: true,
      size: 12,
      row: 3,
      hotSize: 16,
      hotRow: 4,
    }),
    'green-default-v02-Platform': () => ({
      titleType: '1',
      headType: '5',
      isShowAll: true,
      size: 9,
      row: 3,
      hotSize: 12,
      hotRow: 4,
    }),
    'forest-green-v01-Platform': () => ({
      titleType: '1',
      headType: '4',
      isShowAll: true,
      size: 12,
      row: 3,
      hotSize: 16,
      hotRow: 4,
    }),
    'forest-green-v02-Platform': () => ({
      titleType: '1',
      headType: '5',
      isShowAll: true,
      size: 9,
      row: 3,
      hotSize: 12,
      hotRow: 4,
    }),
    'auroral-yellow-Platform': () => ({
      titleType: '1',
      headType: '7',
      isShowAll: true,
      size: 16,
      row: 4,
      hotSize: 16,
      hotRow: 4,
    }),
  }

  // 游戏卡片参数
  const gameWrapperOptions = computed(() => {
    const headType = gameHeadTypes[themeHomeType.value] || gameHeadTypes['blue-default-GameType'];
    return headType()
  });

  return {
    gameWrapperOptions
  }
}

export const useHotGameCard = () => {
  const { themeHomeType } = useLoadComponent();

  const themeLogos: Record<string, any> = {
    'image': {
      logo1: '/icons/sort/POPULAR_on.png',
      logo2: '/icons/sort/SPORTS_on.png',
    },
    'image1': {
      logo1: '/icons/platform/ONE_API_HOT-2.png',
      logo2: '/first/svg/sort/SPORTS.svg',
    },
    'svg1': {
      logo1: '/first/svg/sort/POPULAR1.svg',
      logo2: '/first/svg/sort/SPORTS1.svg',
    },
    'svg2': {
      logo1: '/first/svg/sort/POPULAR.svg',
      logo2: '/first/svg/sort/SPORTS.svg',
    },
  };

  const themeLogoKeys: Record<string, string[]> = {
    'image': [
      'blue-default-GameType',
      'green-default-GameType',
      'amber-purple-GameType',
    ],
    'image1': [
      'auroral-yellow-Platform',
    ],
    'svg1': [
      'blue-default-v01-GameType',
    ],
  }

  let themeKey = 'svg2';

  for (const key in themeLogoKeys) {
    if (themeLogoKeys[key].includes(themeHomeType.value)) {
      themeKey = key;
    }
  }

  const hotGameOptions = themeLogos[themeKey];

  return {
    hotGameOptions
  }
}

export const useBonusPoolPosition = () => {
  const { themeHomeType } = useLoadComponent();

  const bonusPool: { [key: number]: string[] } = {
    1: ['forest-green-v02-Platform', 'green-default-v02-Platform', 'blue-default-v01-GameType', 'auroral-yellow-Platform'],
    2: ['forest-green-v01-Platform', 'green-default-v01-Platform', 'amber-purple-v01-Platform', 'blue-default-v02-Platform'],
  };

  const showBonusPool = (positionKey: number) => bonusPool[positionKey]?.includes(themeHomeType.value) ?? false;

  return {
    showBonusPool
  }
}

export const useSegmentLoad = () => {
  const { themeHomeType } = useLoadComponent();

  const spliceImageSrcFns = {
    '1': (code: string) => `/icons/platform/${code}.png`,
    '2': (code: string) => `/icons/platform/${code}-2.png?v=1`,
  }
  const imgThemes = {
    '2': ['auroral-yellow-Platform']
  }
  const loadImageSrc = (code: string) => {
    const list = Object.keys(imgThemes) as Array<keyof typeof imgThemes>;
    for (const key of list) {
      if (imgThemes[key].includes(themeHomeType.value)) {
        return spliceImageSrcFns[key](code)
      }
    }
    return spliceImageSrcFns[1](code)
  }

  const labelOfTheme = {
    'name': ['auroral-yellow-Platform'],
  }
  const labelKey = computed(() => {
    for (const [key, theme] of Object.entries(labelOfTheme)) {
      if (theme.includes(themeHomeType.value)) {
        return key
      }
    }
    return 'total'
  })

  const tabFnsKey = {
    goToPlatform: [],
    goToCategory: ['auroral-yellow-Platform'],
  }
  // tab执行事件
  const tabExecutionEvent2 = computed(() => {
    for (const [key, theme] of Object.entries(tabFnsKey)) {
      if (theme.includes(themeHomeType.value)) {
        return key
      }
    }
    return 'selectPlatformTab'
  })

  return {
    labelKey,
    loadImageSrc,
    tabExecutionEvent2
  }
}


export const useSearchComponent = () => {
  const { themeHomeType } = useLoadComponent();

  const tabsMode = computed(() => {
    return ['amber-purple-GameType'].includes(themeHomeType.value) ? 'md' : 'ios';
  }); 

  return {
    tabsMode
  }
}

export const useEventPromotion = () => {
  const imgThemeKeys = {
    1: ['auroral-yellow-Platform-11111'],
  }

  // 定义图片模块的类型
  interface ImageModule {
    default: string;
  }

  const loadLocalImage = async (ev: any, position: number) => {
    const themeKey = checkThemeInList(imgThemeKeys)
    try {
      let imageUrl: ImageModule
      if (themeKey) {
        imageUrl = await import(`@/assets/img/inicio/event-promotion${position}-${themeKey}.png`)
      } else {
        imageUrl = await import(`@/assets/img/inicio/event-promotion${position}.png`)
      }
      ev.target.src = imageUrl.default
    } catch (error) {
      console.error('Failed to load image:', error)
    }
  }

  return {
    loadLocalImage,
  }
}

export const useConfiguration = () => {
  const createComponent = (list: ComponentItem[] | undefined): ComponentMapItem[] => {
    if (!list) return [];
    return list.map((item: ComponentItem) => {
      const { componentName, componentId, position, children, imageList, ...rest } = item;
   
      if (position) {
        return {
          position,
          options: rest,
          list: createComponent(children),
        }
      }
      if (componentName && componentId) {
        const restPathMap = pathMaps[componentName];
        let loadImage = null;
        if (imageList) {
          loadImage = imageList.reduce((acc: Record<string, any>, { name, id }: ImageItem) => {
            acc[name] = restPathMap[name][id];
            return acc;
          }, {});
        }
        const promiseComponents = restPathMap[componentId];
        if (!promiseComponents) return null;
        const asyncComponent = defineAsyncComponent(promiseComponents);
        const component = markRaw(asyncComponent) as unknown as ComponentPublicInstance | null;
        return {
          component,
          componentName,
          key: componentName + componentId,
          options: {
            ...rest,
            loadImage,
            componentList: createComponent(children),
          }
        }
      }
    }).filter((item) => item !== null) as ComponentMapItem[];
  }

  return {
    createComponent
  }
}