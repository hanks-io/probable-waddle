import { useGameCard } from '@/hooks/useLoadComponent';

export default () => {
  const mainPageRef = ref();
  const segmentRef = ref(); // 分类导航栏DOM
  // 显示的游戏列表
  const showGameList = ref<any[]>([]);
  const {
    gameWrapperOptions,
  } = useGameCard();

  function forTabValueOptions(item: any) {
    const { size, row, hotRow, hotSize, ...rest } = gameWrapperOptions.value;
    let logoType = "1";
    let currentSize = size;
    let currentRow = row;
    let platformId = String(item.id);
    if (item.gameType === "POPULAR") {
      currentRow = hotRow;
      currentSize = hotSize;
    }
    if (item.hot) {
      platformId = String(item.platformId);
    }
    if (['POPULAR', 'SPORTS'].includes(item.gameType) || item.hot) {
      logoType = "2";
    }
    return {
      ...rest,
      logoType,
      platformId,
      size: currentSize,
      row: currentRow,
      platform: item,
      gameList: item.list,
    }
  }

  const stickySegmentBottom = ref(0);
  function getGameCardBottom() {
    // 当segment和游戏卡片左右布局时使用这个方法
    const contentEl = document.querySelector('.main-content>.order-container') as Element | null;
    const gameCardEl = document.querySelector('.game-c') as HTMLElement | null;

    if (contentEl && gameCardEl) {
      const { offsetTop = 0, offsetHeight = 0 } = gameCardEl;
      const bottom = contentEl.scrollHeight - offsetTop - offsetHeight;
      if (bottom !== stickySegmentBottom.value) {
        stickySegmentBottom.value = bottom;
      }
    }
  }

  const { showBackToTop, setShowBackToTop } = inject('floatBtnData') as any;

  // 监听内容滚动, 显示隐藏回到顶部按钮
  function watchBuoy({ entry, direction, index, tabKey }: any) {
    console.log('index', index);

    if (entry.isIntersecting) {
      if (index > 2) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
      const voiceBug = segmentRef.value?.voiceBug;
      if (voiceBug) {
        // 纵向滚动segment和游戏卡片左右布局时使用这个方法
        voiceBug(entry, direction, index, tabKey)
      }
    }
  }

  function tabChange1({ filterGameList }: { filterGameList: any[] }) {
    setShowBackToTop(false);
    if (filterGameList) {
      showGameList.value = filterGameList;
    }
  }

  const handleHeader = (scrollTop: number) => {
		if (!mainPageRef.value) return;
		if (scrollTop > 50) {
      mainPageRef.value.$el.style.removeProperty('--header-dynamic-bg');
		} else {
      mainPageRef.value.$el.style.setProperty('--header-dynamic-bg', 'transparent');
		}
	}

  onMounted(() => {
    nextTick(() => {
      handleHeader(0)
    })
  })


  return {
    mainPageRef,
    watchBuoy,
    tabChange1,
    segmentRef,
    showGameList,
    handleHeader,
    showBackToTop,
    getGameCardBottom,
    forTabValueOptions,
    stickySegmentBottom,
  }
}