import router from '@/router';
import { useGameStore } from '@/store/game';
import { useElementStore } from '@/store/element';
import { sportsType } from '@/enums/common';
import { delay } from '@/utils/delay';

export default (props) => {
  const platformId = computed(() => Number(props.platformId));
  const swiperIndex = ref(0);   // swiper索引
  const userStore = useUserStore();   // 用户store
  const gameStore = useGameStore();   // 游戏store
  const elementStore = useElementStore(); // 元素store


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

  const showAll = ref(false); // 是否显示全部游戏
  // 获取分页后的游戏列表
  const pageList = computed(() => {
    let list = [];
    if (showAll.value) {
      list.push(props.gameList);
    } else {
      for (let i = 0; i < props.gameList.length; i += props.size) {
        list.push(props.gameList.slice(i, i + props.size));
      }
    }
    return list;
  });

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
   * @description swiper滑动事件
   * @param swiper swiper实例
   */
  function onSlideChange(swiper: any) {
    swiperIndex.value = swiper.activeIndex;
  }

  


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
    pageList,
    onSwiper,
    isHallGame,
    gameHandle,
    showAllGame,
    headOptions,
    virtualSlide,
    onSlideChange,
    gameImageStyle,
    favoriteHandle,
    forPlatformLogo,
  }
}
