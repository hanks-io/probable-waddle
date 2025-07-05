import { t } from '@/i18n'
import { useGameStore } from '@/store/game';
import { sportsType } from '@/enums/common';
import { delay } from '@/utils/delay';
import { showLoading, hideLoading } from '@/utils/loading';
import useGetRecentGame from '@/hooks/useGetRecentGame';
import useGetFavoriteGame from '@/hooks/useGetFavoriteGame';

export default (props, emits) => {
  const platformId = computed(() => Number(props.platformId));
  const gameStore = useGameStore(); // 游戏信息
  const tabValue = ref('POPULAR');
  const tabs = computed(() => {
    return [
      {
        key: 'POPULAR',
        label: t('sort.POPULAR')
      },
      {
        key: 'RECENT',
        label: t('sort.RECENT')
      },
      {
        key: 'FAVORITE',
        label: t('sort.FAVORITE')
      },
    ]
  })

  function scrollToElement(toTop: number | null) {
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

  const gameListParams = {
    platformId: 0,   // 平台id
    page: 1,
    pageSize: 999,
  }
  // 获取热门游戏
  async function getHotGame() {
    emits('tabChange', { filterGameList: gameStore.allGameList });
    await delay(1000);
    const elIndex = gameStore.allGameList.findIndex((item: any) => item.id == platformId.value);
    const el = document.querySelectorAll('.game-wrapper-c')[elIndex];
    if (el) {
      const { offsetTop } = el as HTMLElement;
      scrollToElement(offsetTop);
    }
  }

  // 循环遍历
  function forGameList(list: any) {
    const objList = list.reduce((acc: any, cur: any) => {
      if (platformId.value) {
        if (cur.platformId == platformId.value) {
          if (acc[cur.gameType]) {
            acc[cur.gameType].push(cur);
          } else {
            acc[cur.gameType] = [cur];
          }
        }
      } else {
        if (acc[cur.gameType]) {
          acc[cur.gameType].push(cur);
        } else {
          acc[cur.gameType] = [cur];
        }
      }
      return acc;
    }, {})
    emits('tabChange', { filterGameList: Object.values(objList) });
  }
  // 获取最近游戏
  async function getRecentGame() {
    showLoading();
    const list = await useGetRecentGame();
    if (platformId.value) {
      forGameList(list);
    } else {
      let newList = []
      if (list.length) {
        const item = gameStore.platformHotGameList.find(item => item.gameType === 'POPULAR');
        newList.push({
          ...item,
          list
        })
      }
      emits('tabChange', { filterGameList: newList });
    }
    await delay(500);
    hideLoading();
    scrollToElement(null);
  }

  type FavoriteItem = {
    gameName: string;
    gameLogo: string;
    gameStatus: string;
    isFavorite: boolean;
    palateformLogo: string;
  }
  const forFavoriteData = (list: FavoriteItem[]) => {
    return list.map((item) => {
      const { gameName: name, gameLogo: logo, gameStatus: status, isFavorite, palateformLogo: platformLogo } = item;
      return {
        ...item,
        name,
        logo,
        status,
        isFavorite,
        platformLogo,
      }
    })
  }
  /**
   * 接口调用-获取收藏列表
   */
  async function getFavorite() {
    showLoading();
    const list = await useGetFavoriteGame()
    const listData = forFavoriteData(list);
    if (platformId.value) {
      forGameList(listData);
    } else {
      let newList = []
      if (listData.length) {
        const item = gameStore.platformHotGameList.find(item => item.gameType === 'POPULAR');
        newList.push({
          ...item,
          list: listData
        })
      }
      emits('tabChange', { filterGameList: newList });
    }
    await delay(500);
    hideLoading();
    scrollToElement(null);
  }
  
  // 定义事件
  const events: Record<string, () => Promise<void>> = {
    'POPULAR': getHotGame,
    'RECENT': getRecentGame,
    'FAVORITE': getFavorite,
  }

  /**
   * @description 导航标签切换事件
   * @param event 事件对象
   */
  async function tabChange(event: any) {
    const value = event.detail.value;
    if (platformId.value) {
      events[value]();
      return;
    } 
    if (value === 'POPULAR') {
      // 热门游戏
      emits('tabChange', { filterGameList: gameStore.allGameList });
    } else {
      events[value]();
    }
  }


  watch(() => props.platformId, async (newVal, oldVal) => {
    tabValue.value = 'POPULAR';
  })

  return {
    tabs,
    tabValue,
    tabChange,
  }
}