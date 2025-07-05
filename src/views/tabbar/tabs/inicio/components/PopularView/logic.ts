import { useGameStore } from '@/store/game';
import { useUserStore } from '@/store/user';
import { ref, computed } from 'vue';
import router from '@/router';
import useGameStatus from '@/views/tabbar/tabs/inicio/components/GameWrapper/useGameStatus';

const swiperHandler = ref();  // swiper方法
const swiperIndex = ref(0);   // swiper索引

export default function usePopularViewLogic() {
  const gameStore = useGameStore();   // 游戏store
  const userStore = useUserStore();   // 用户store

  const popularList = computed(() => gameStore.popularGames);   // 热门游戏列表
  const platformList = computed(() => gameStore.platformList);  // 平台列表
  const { forGameStatus } = useGameStatus();

  // 生命周期: 组件加载前
  onBeforeMount(() => {
    gameStore.loadPopularGames();
  })

  // 监听收藏列表变化
  watch(() => userStore.favoriteList.length, () => {
    setFavorite(gameStore.popularGames);
  }, { immediate: true })
  /**
   * @description swiper滑动到指定的slide
   * @param direction 方向
   */
  function swiperToSlide(direction: 'prev' | 'next' = 'next') {
    if (direction === 'prev')
      swiperHandler.value.slidePrev();
    else
      swiperHandler.value.slideNext();
  }

  /**
   * @description swiper初始化完成
   * @param swiper swiper实例
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
    if (item.gameName) {
      const gradient = '180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 10.41%, rgba(0, 0, 0, 0) 18.5%, rgba(0, 0, 0, 0) 100%'
      const logo = item.logo || item.gameLogo;
      return `background:linear-gradient(${gradient}),url("${logo}"); background-size: 100% 100%`
    }
    return `background: url("${item.background || item.plateformBackground}"); background-size: 100% 100%`
  }

  /**
   * @description 收藏按钮事件
   */
  async function favoriteHandle(item: any, platform?: any, remove?: boolean) {
    if (remove)
      item.isFavorite = false;
    else
      item.isFavorite = !item.isFavorite

    if (item.isFavorite)
      await userStore.addFavorite(item, platform);
    else
      await userStore.cancelFavorite(item, platform);
  }

  /**
   * @description 热门游戏点击事件
   */
  function popularHandle(item: any) {
    if (item.gameId) {
      gameStore.enterGame(item)
    } else
      router.push({ path: `/game/category/${item.gameType}/${item.platformId}` })
  }

  return {
    forGameStatus,
    swiperIndex,
    popularList,
    platformList,
    swiperToSlide,
    onSwiper,
    onSlideChange,
    gameCardStyle,
    favoriteHandle,
    popularHandle
  }
}
