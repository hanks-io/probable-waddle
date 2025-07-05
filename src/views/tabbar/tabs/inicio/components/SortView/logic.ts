
import { gameListApi } from '@/api/normal';
import { GameListParams } from '@/api/normal/model';
import { useGameStore, TGameInfo } from '@/store/game';
import router from '@/router';
import useGameStatus from '@/views/tabbar/tabs/inicio/components/GameWrapper/useGameStatus';

export default function useSortViewLogic(props: any) {
  const gameStore = useGameStore();   // 游戏store
  const userStore = useUserStore();   // 用户store

  const swiperIndex = ref(0);   // swiper索引
  const logo = ref('');             // logo
  const swiperHandler = ref();      // swiper方法

  // 游戏列表请求参数
  const gameParams = reactive<GameListParams>({
    platformId: undefined,
    gameType: props.type as GameListParams['gameType'],
    gameName: '',
    page: 1,
    pageSize: 999,
  })

  const gameList = computed(() => {
    const { platformId, gameType } = gameParams
    const platformGames = gameStore.popularPlatformGames.find((item) => {
      return item.gameList?.[0]?.platformId === platformId && item.gameList?.[0]?.gameType === gameType
    })
    return platformGames?.gameList?.map(v => v) ?? []
  });

  const platformList = computed(() => gameStore.platformList);  // 平台列表
  const { forGameStatus } = useGameStatus();

  // 监听收藏列表变化
  watch(() => userStore.favoriteList.length, () => {
    setFavorite(gameList.value);
  }, { immediate: true })

  // 生命周期: 组件挂载前
  onMounted(async () => {
    const platform = gameStore.popularPlatform.find(item => item.platformName === props.platform);
    if (platform) {
      logo.value = `${platform.logo}`;
      gameParams.platformId = Number(platform.platformId);
    }
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
   * @description swiper初始化完成
   * @param swiper
   */
  function onSwiper(swiper: any) {
    swiperHandler.value = swiper;
  };

  /**
   * @description swiper滑动事件
   * @param swiper swiper实例
   */
  function onSlideChange(swiper: any) {
    swiperIndex.value = swiper.activeIndex;
  }


  /**
   * @description 游戏卡片样式
   */
  function gameCardStyle(item: any) {
    const logo = item.logo || item.gameLogo;
    const gradient = '180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 10.41%, rgba(0, 0, 0, 0) 18.5%, rgba(0, 0, 0, 0) 100%'
    return `background:linear-gradient(${gradient}),url("${logo}"); background-size: 100% 100%`
  }

  /**
   * @description 跳转分类事件
   */
  function categoryHandle() {
    debugger;
    router.push({ path: `/game/category/${props.type}/${gameParams.platformId}`, })
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
   * @description 热门游戏点击事件
   */
  function gameHandle(item: any) {
    if (item.gameId || item.name) {
      gameStore.enterGame(item)
    } else {
      router.push({ path: `/game/category/${item.gameType}${item.platformId}` });
    }
  }



  return {
    forGameStatus,
    logo,
    gameList,
    swiperIndex,
    platformList,
    swiperToSlide,
    onSwiper,
    onSlideChange,
    gameCardStyle,
    categoryHandle,
    favoriteHandle,
    gameHandle,
  }
}
