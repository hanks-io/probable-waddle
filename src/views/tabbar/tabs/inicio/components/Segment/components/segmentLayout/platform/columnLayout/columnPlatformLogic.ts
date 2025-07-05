import { useElementStore } from '@/store/element';
import useCommonLogic from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/platform/commonLogic';


export default (props: any, emits: any) => {
  const elementStore = useElementStore(); // 导入element store
  const { tabs, hotTab, tabsList, tabValue, gameStore, scrollToElement } = useCommonLogic(props, emits);

  const componentHeight = ref(600);
  const mainEl = ref<HTMLElement | null>(document.querySelector('.main-content'));
  useResizeObserver(mainEl, (entries) => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    if (height) {
      componentHeight.value = height - elementStore.tabBarHeight;
    }
  })

  const tabRef = ref<HTMLElement | null>(null);
  const moveTab = (index: number) => {
    tabRef.value?.querySelectorAll('ion-segment-button').forEach((el, i) => {
      if (i === index) {
        tabRef.value?.scrollTo({
          top: el.offsetTop,
          behavior: 'smooth',
        })
      }
    });
  }

  // 用于判断是否点击tab切换
  const isClick = ref(false);
  const clickTimeKey = ref<ReturnType<typeof setTimeout> | null>(null);
  // column布局专用tabChange
  const tabChange = async (event: any) => {
    if (clickTimeKey.value) {
      clearTimeout(clickTimeKey.value);
    }
    isClick.value = true;
    clickTimeKey.value = setTimeout(() => {
      isClick.value = false;
    }, 2500)
    const value = event.detail.value;
    if (!value) return;
    tabValue.value = value;
    emits('tabChange', { filterGameList: gameStore.allGameList })
    if (tabValue.value === hotTab.value.id) {
      scrollToElement(null);
      moveTab(0)
    } else {
      const elIndex = gameStore.allGameList.findIndex((item: any) => String(item.id) == value && !item.hotTab);
      const el = document.querySelectorAll('.game-wrapper-c')[elIndex];
      if (el) {
        const { offsetTop } = el as HTMLElement;
        scrollToElement(offsetTop);
      }
      const tIndex = tabs.value.findIndex((item) => String(item.id) === value)
      moveTab(tIndex)
    }
  }

  const voiceBug = (entry, direction, index, tabKey) => {
    if (index == 0) return;
    if (entry.isIntersecting) {
      const tabV = String(tabKey)
      if (tabValue.value !== tabV && !isClick.value) {
        let tIndex = tabs.value.findIndex((item) => item.id === tabKey)
        if (tIndex > 0) {
          tabValue.value = tabV;
        } else {
          tabValue.value = hotTab.value.id;
          tIndex = 0
        }
        moveTab(tIndex)
      }
    }
  }

  // column布局专用watch
  const unwatch = watch(() => gameStore.allGameList, (list) => {
    emits('tabChange', { filterGameList: list })
    setTimeout(() => {
      unwatch()
    }, 10000)
  })

  return {
    tabs,
    tabRef,
    hotTab,
    tabsList,
    tabValue,
    voiceBug,
    tabChange,
    componentHeight,
  }
}