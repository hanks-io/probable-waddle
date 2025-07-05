import { useI18n } from 'vue-i18n';
import { useGameStore } from '@/store/game';


export default (props: any, emit: any) => {
  const { t } = useI18n();
  const gameStore = useGameStore();
  
  const hotTab = computed(() => {
    const total = gameStore.popularGames.length;
    return {
      id: 'null',
      name: t('sort.POPULAR'),
      code: "ONE_API_HOT",
      status: null,
      openType: null,
      sort: null,
      total,
    }
  })
  const tabValue = ref(hotTab.value.id); // 定义接参对应使用变量(props不推荐组件内赋值)

  const tabs = computed(() => [hotTab.value].concat(gameStore.homePlatformList));

  const tabsList = computed(() => {
    if (props.noHot) {
      return gameStore.homePlatformList;
    }
    return tabs.value;
  })


  const scrollToElement = (toTop: number | null) => {
    // ion-content滚动到指定位置
    const mainContent = document.querySelector('.main-content') as any;
    if (toTop && mainContent) {
      mainContent.scrollEl.scrollTo({
        top: toTop,
        behavior: 'smooth'
      });
    }
    const gameBuoy = document.querySelector('#game-buoy') as HTMLElement;
    if (!toTop && gameBuoy && mainContent) {
      const { offsetTop } = gameBuoy as HTMLElement;
      mainContent.scrollEl.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  gameStore.getHomePlatformList(); // 获取首页游戏平台列表

  return {
    tabs,
    hotTab,
    tabsList,
    tabValue,
    gameStore,
    scrollToElement,
  }
}