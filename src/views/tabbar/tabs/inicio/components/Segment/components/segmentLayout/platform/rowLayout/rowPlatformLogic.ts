import { useRouter } from 'vue-router';
import { useSegmentLoad } from '@/hooks/useLoadComponent';
import useCommonLogic from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/platform/commonLogic';
import useSegmentScroll from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/useSegmentScroll';


export default (props: any, emits: any) => {

  const router = useRouter();

  const { tabs, hotTab, tabsList, tabValue, gameStore, scrollToElement } = useCommonLogic(props, emits);
  const tabsIdList = computed(() => tabs.value.map((item) => String(item.id)));

  const gameTypeList = ['ELECTRONIC', 'CHESS', 'FISHING', 'LOTTERY', 'VIDEO', 'SPORTS']
  const sortHomeGamesList = computed(() => {
    if (gameStore.homeGames.length) {
      return gameStore.homeGames.sort(<T extends { gameType: string }>(a: T, b: T) => {
        const indexA = gameTypeList.indexOf(a.gameType ?? '');
        const indexB = gameTypeList.indexOf(b.gameType ?? '');
        return indexA - indexB;
      });
    }
    return [];
  });

  const goToCategory = () => {
    if (tabValue.value == hotTab.value.id) {
      router.push(`/game/category/ELECTRONIC/0`);
      return;
    }
    const platformId = Number(tabValue.value);
    for (let i = 0; i < sortHomeGamesList.value.length; i++) {
      const { gameType, platformList } = sortHomeGamesList.value[i] as { gameType: "SPORTS" | "ELECTRONIC" | "CHESS" | "FISHING" | "VIDEO" | "LOTTERY", platformList: any[] };
      for (let j = 0; j < platformList.length; j++) {
        const { id } = platformList[j];
        if (id === platformId) {
          if(gameType === 'SPORTS') {
            router.push('/game/category/sport');
            return;
          }
          router.push(`/game/category/${gameType}/${platformId}`);
          return;
        }
      }
    }
  }

  // 跳转到厂商平台
  const goToPlatform = () => {
    const platformId = tabValue.value === hotTab.value.id ? 0 : tabValue.value
    router.push(`/game/platform/${platformId}`)
    tabValue.value = hotTab.value.id;
  }



  const selectPlatformTab = () => {
    let list = [];
    if (tabValue.value === hotTab.value.id) {
      list = gameStore.allGameList.filter((item: any) => !tabsIdList.value.includes(String(item.id)) || item.hot);
    } else {
      list = gameStore.allGameList.filter((item: any) => String(item.id) == tabValue.value && !item.hotTab);
    }
    scrollToElement(null);
    emits('tabChange', { filterGameList: list })
  }
  const { tabExecutionEvent2 } = useSegmentLoad()

  const tabMethods = reactive<{
    goToPlatform: () => void;
    selectPlatformTab: () => void;
    goToCategory: () => void;
  }>({
    goToPlatform,
    goToCategory,
    selectPlatformTab,
  });

  const tabChange = async (event: any) => {
    const value = event.detail.value;
    if (!value) return;
    tabValue.value = value;
    if (props.eventKey) {
      tabMethods[props.eventKey as keyof typeof tabMethods]()
      return;
    }
    tabMethods[tabExecutionEvent2.value as keyof typeof tabMethods]()
  }

  const tabClick = async ({ id }: { id: number | string }) => {
    tabValue.value = String(id);
    if (props.eventKey) {
      tabMethods[props.eventKey as keyof typeof tabMethods]()
      return;
    }
    tabMethods[tabExecutionEvent2.value as keyof typeof tabMethods]()
  }



  const unRowWatch = watch(() => gameStore.allGameList, (list) => {
    if (tabValue.value === hotTab.value.id) {
      const filterGameList = list.filter((item: any) => !tabsIdList.value.includes(String(item.id)) || item.hot);
      emits('tabChange', { filterGameList })
      setTimeout(() => {
        unRowWatch()
      }, 10000)
    }
  }, { immediate: true })


  return {
    ...useSegmentScroll({ tabValue, hotTab }),
    tabs,
    tabsList,
    tabValue,
    tabClick,
    tabChange,
  }
}
