import router from '@/router';
import { useGameStore } from '@/store/game';
import { useElementStore } from '@/store/element';
import { useTenantStore } from '@/store/tenant';
import { delay } from '@/utils/delay';

export default (props) => {
  const userStore = useUserStore();   // 用户store
  const gameStore = useGameStore();   // 游戏store
  const elementStore = useElementStore(); // 元素store
  const tenantStore = useTenantStore(); // 租户store

  const swiperIndex = ref(0);   // swiper索引
  const swiperHandler = ref();      // swiper方法

  const platformId = computed(() => Number(props.platformId));
  const gameImageStyle = computed(() => {
    const { row, size } = props;
    const rowCount = size / row;
    const width = `calc((100% - ${(rowCount - 1) * 0.75}rem) / ${rowCount})`;
    return {
      width
    }
  });

  function virtualSlide(index: number) {
    return Math.abs(swiperIndex.value - index) < 2
  }
  const bonusPoolLayout = computed(() => 
    tenantStore.themeConfig?.specialSkinSettings?.bonusPoolPosition?.find(
      (item) => item.gameType === props.platform.gameType
    )
  );

  const showAll = ref(false); // 是否显示全部游戏
  const bonusPoolPaging = () => {
    const { gameList, size: propsSize } = props;
    let list = [];
    if (showAll.value) {
      list.push(gameList);
    } else {
      let pageSize = propsSize - bonusPoolLayout.value?.size;
      for (let i = 0; i < gameList.length; i += pageSize) {
        if (i > 0) {
          pageSize = propsSize;
        }
        list.push(gameList.slice(i, i + pageSize));
      }
    }
    return list;
  }

  const paging = () => {
    const { gameList, size } = props;
    let list = [];
    if (showAll.value) {
      list.push(gameList);
    } else {
      for (let i = 0; i < gameList.length; i += size) {
        list.push(gameList.slice(i, i + size));
      }
    }
    return list;
  }
  // 获取分页后的游戏列表
  const pageList = computed(() => bonusPoolLayout.value && tenantStore.tenantInfo?.switch ? bonusPoolPaging() : paging());

  const showAllChange = (value: boolean) => {
    showAll.value = value;
  }

  const showAllGame = computed(() => {
    const { isShowAll, size, platform: { total } } = props;
    return isShowAll && total > size;
  });

  // 头部ref
  const headRef = ref(null);
  /**
   * @description 显示全部游戏
   */
  async function sizeChange() {
    showAll.value = !showAll.value;
    if (!showAll.value && headRef.value) {
      const { offsetTop } = headRef.value.$el;
      const top = offsetTop - elementStore.tabBarHeight;
      // ion-content滚动到指定位置
      await delay(200);
      const mainContent = document.querySelector('.main-content') as any;
      mainContent.scrollEl.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }

  function forPlatformLogo(item) {
    const { gameType, logo } = props.platform
    if (gameType === 'POPULAR') {
      return item.platformLogo || ''
    }
    return logo
  }

  const headOptions = computed(() => {
    const { size, gameList, titleType, logoType } = props;
    const { logo, gameType, name, platformName, target, total } = props.platform;
    const platformInfo = {
      logo,
      name: name || platformName,
    }
    // 1使用游戏类型logo 2使用平台logo
    let currentLogo = logoType === '1' ? undefined : logo;
    let currentShowNextBtn = true;
    let currentTitleType = titleType || '1';
    if (target === 'hall' && !name) {
      currentTitleType = '1';
    }
    if (target === 'hall') {
      currentShowNextBtn = false;
    }
    if (gameType === 'POPULAR') {
      currentTitleType = '1';
    }
    return {
      total,
      platformInfo,
      type: gameType,
      logo: currentLogo,
      titleType: currentTitleType,
      swiperIndex: swiperIndex.value,
      size: showAll.value ? 0 : size,
      showNextBtn: currentShowNextBtn,
    }
  });

  const isHallGame = computed(() => {
    const { platform, gameList = [] } = props;
    return gameList[0]?.target === 'hall' || platform.target === 'hall'
  })


  /**
   * @description swiper滑动到指定的slide
   * @param 方向
   */
  function swiperToSlide(direction: 'prev' | 'next' = 'next') {
    if (direction === 'prev')
      swiperHandler.value.slidePrev();
    else
      swiperHandler.value.slideNext();
  }

  /**
   * @description swiper滑动事件
   * @param swiper swiper实例
   */
  function onSlideChange(swiper: any) {
    swiperIndex.value = swiper.activeIndex;
  }

  /**
   * @description swiper初始化完成
   * @param swiper
   */
  function onSwiper(swiper: any) {
    swiperHandler.value = swiper;
  };


  /**
  * @description 收藏事件
  */
  function favoriteHandle(item: Record<string, any>) {
    item.isFavorite = !item.isFavorite;
    const game = {
      gameId: item.id,
      gameName: item.gameName || item.name,
    };
    Object.assign(game, item);
    if (item.isFavorite) {
      userStore.addFavorite(game);
    } else {
      userStore.cancelFavorite(game);
    }
  }

  /**
   * @description 跳转分类事件
   */
  function categoryHandle() {
    const { gameType, target, id } = props.platform;
    if (gameType === 'SPORTS') {
      router.push('/game/category/sport')
      return;
    }
    if (gameType === 'POPULAR') {
      router.push({ path: '/game/search/POPULAR' })
      return;
    }
    if (target === 'hall') {
      router.push({ path: `/game/category/${gameType}/${id}`, })
      return;
    }
    router.push({ path: `/game/category/${gameType}/${platformId.value}`, })
  };

  /**
   * @description 热门游戏点击事件
   */
  function gameHandle(item: any) {
    if (item.gameId || item.name) {
      gameStore.enterGame(item)
    } else {
      router.push({ path: `/game/category/${item.gameType}${item.platformId}` });
    }
  }
  // 头部组件
  const headComponent = ref<ComponentPublicInstance | null>(null);

  const headList: Record<string, () => Promise<any>> = {
    '1': () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/1/index.vue'),
    '3': () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/Head3.vue'),
    '4': () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/4/index.vue'),
    '5': () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/5/index.vue'),
    '6': () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/6/index.vue'),
    '7': () => import('@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/7/index.vue'),
  }

  if (headList[props.headType]) {
    const asyncComponent = defineAsyncComponent(headList[props.headType]);
    headComponent.value = markRaw(asyncComponent) as unknown as ComponentPublicInstance | null;
  }


  provide('headerProps', { categoryHandle });
  provide('wrapperShowAllData', {
    headRef,
    pageList,
    swiperIndex,
    showAllChange,
    size: props.size,
    total: props.platform.total,
  });

  return {
    headRef,
    showAll,
    pageList,
    onSwiper,
    isHallGame,
    sizeChange,
    gameHandle,
    tenantStore,
    showAllGame,
    headOptions,
    swiperIndex,
    virtualSlide,
    swiperToSlide,
    headComponent,
    onSlideChange,
    gameImageStyle,
    categoryHandle,
    favoriteHandle,
    forPlatformLogo,
    bonusPoolLayout,
  }
}
