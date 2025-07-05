import i18n from '@/i18n';
import { useAppStore } from '@/store/app'
import { gameListApi } from '@/api/normal';
import { useGameStore } from '@/store/game';
import { userProfitApi } from '@/api/personal';
import { useTenantStore } from "@/store/tenant";
import { moneyConvertToClient } from '@/utils/custom'
import { GameListModel, GameListParams } from '@/api/normal/model';
import { UserProfitModel, UserProfitParams } from '@/api/personal/model';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { tenantReportTimeList, handlePersonSelectTime } from '@/utils/reportTime'

export function usePersonalLogic() {
  const { t } = i18n.global
  const appStore = useAppStore() 	         // 用户信息
  const gameStore = useGameStore();        // 游戏store
  const tenantStore = useTenantStore();    // 租户信息

  const gameId = ref(0);                                                    // 游戏id
  const platformId = ref(0);                                                // 游戏平台
  const infiniteRef = ref<any>(null);	                                      // 上拉加载更多组件DOM(用于重置状态)
  const loading = ref(false);                                               // 游戏列表加载状态
  const gameType = ref('all');                                              // 游戏类型
  const loadMore = ref('more');                                             // 加载更多状态
  const changeTime = ref('today');                                          // 时间类型
  const timePopoverVisible = ref(false);                                    // 时间筛选弹出层显示状态
  const gameTypeChange = ref(false);                                        // 游戏类型变化
  const gamePlatformChange = ref(false);                                    // 游戏平台变化
  const typePopoverVisible = ref(false);                                    // 游戏类型选择弹出层显示状态
  const gamePopoverVisible = ref(false);                                    // 游戏选择弹出层显示状态
  const platformPopoverVisible = ref(false);                                // 游戏平台选择弹出层显示状态
  const userProfitInfo = reactive<any>({
    totalGameRounds: 0,          // 累计注单量
    totalValidBetAmount: 0,      // 累计有效投注
    totalProfitAmount: 0         // 累计输赢
  });                            // 个人输赢信息
  const games = ref<GameListModel['gameList']>([]);                         // 游戏列表
  const scrollSelectionRef = ref<HTMLElement | null>(null);                 // 选择器滚动容器
  const userDayProfitList = ref<UserProfitModel['userDayProfitList']>([]);  // 个人输赢列表    

  const userProfitParams = reactive<UserProfitParams>({
    page: 1,
    pageSize: 15,
    startTime: '',
    endTime: ''
  })
  const gameParams = reactive<GameListParams>({ // 游戏列表请求参数
    page: 1,
    pageSize: 999,
    all: true,
  })

  const gameTypes = computed(() => gameStore.homeGames.map(item => item.gameType)); // 游戏类型
  const gamePlatforms = computed(() => {                                            // 游戏平台
    const games = gameStore.homeGames.filter(item => item.gameType === gameType.value);
    if (!games.length) return [];
    const platforms = games[0].platformList as any;
    platforms.forEach((item: any) => {
      item['isTrue'] = false
      // 未包含空格 最多支持13位字符
      if (item.name && !item.name.includes(' ') && item.name.length > 13) {
        item['isTrue'] = true
      }
      // 包含空格 最多支持25未字符
      if (item.name && item.name.includes(' ') && item.name.length > 25) {
        item['isTrue'] = true
      }
    })
    return platforms.map((item: any) => { return { platformId: item.id, platformName: item.name, isTrue: item.isTrue } });
  })
  // 当前商户报表查询时间列表
  const currentTimeList = computed(() => tenantReportTimeList(tenantStore.tenantInfo?.reportTimeRange));
  const isToken = computed(() => appStore.token ? true : false)                     // 是否未登录
  const showEmpty = computed(() => !isToken.value || (loadMore.value == 'noMore' && !userDayProfitList.value.length))

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    gameStore.getHomeGames(); // 获取游戏列表
  })

  // 监听游戏类型变化
  watch(() => gameType.value, () => {
    gameTypeChange.value = true;
    platformId.value = 0;
    gameId.value = 0;
    userProfitParams.page = 1;
    loadMore.value = 'more';
    userDayProfitList.value = [];
    getUserProfit();
    setTimeout(() => {
      gameTypeChange.value = false;
    }, 100);
  })

  // 监听游戏平台变化
  watch(() => platformId.value, (val) => {
    gamePlatformChange.value = true;
    gameId.value = 0;
    if (val) {                    // 游戏平台变化有值时获取游戏列表
      onGetGame();
    } else {                      // 游戏平台变化无值时清空游戏列表
      games.value = [];
    }
    if (!gameTypeChange.value) {  // 防止游戏类型变化时重复请求
      userProfitParams.page = 1;
      loadMore.value = 'more';
      userDayProfitList.value = [];
      getUserProfit();
    }
    setTimeout(() => {
      gamePlatformChange.value = false;
    }, 100);
  })
  // 监听游戏id变化
  watch(() => gameId.value, (val) => {
    if (!gamePlatformChange.value) {
      userProfitParams.page = 1;
      loadMore.value = 'more';
      userDayProfitList.value = [];
      getUserProfit();
    }
  })

  // 监听时间类型变化
  watch(() => changeTime.value, (val) => {
    const dateObj = handlePersonSelectTime(val);
    userProfitParams.startTime = dateObj?.startTime;
    userProfitParams.endTime = dateObj?.endTime;
    userProfitParams.page = 1;
    loadMore.value = 'more';
    userDayProfitList.value = [];
    getUserProfit();
  }, { immediate: true })

  /**
   * @description 时间类型选择器点击事件
   */
  function timeSelectHandle(event: any) {
    scrollSelectedToCenter(event);
    timePopoverVisible.value = true
  }

  /**
   * @description 选择时间类型
   */
  function selectedTime(name: string) {
    changeTime.value = name
    setTimeout(() => {
      timePopoverVisible.value = false;
    }, 300);
  }

  /**
   * @description 游戏类型选择器点击事件
   */
  function typeSelectHandle(event: any) {
    scrollSelectedToCenter(event);
    typePopoverVisible.value = true;
  }

  /**
   * @description 计算游戏类型名称
   */
  function getTypeName(type: string) {
    const gameType = gameTypes.value.find(item => item === type);
    return gameType ? t(`sort.${gameType}`) : t(`option.all`);
  }

  /**
   * @description 选择游戏类型
   */
  function selectedType(item: string) {
    gameType.value = item;
    setTimeout(() => {
      typePopoverVisible.value = false;
    }, 300);
  }

  /**
   * @description 平台选择器点击事件
   */
  function platformSelectHandle(event: any) {
    scrollSelectedToCenter(event);
    platformPopoverVisible.value = true;
  }

  /**
   * @description 计算平台名称
   */
  function getPlatformName(id: number) {
    const platform = gamePlatforms.value.find((item: any) => item.platformId === id);
    return platform ? platform.platformName : t(`option.allPlatform`);
  }

  /**
   * @description 选择平台
   */
  function selectedPlatform(id: number = 0) {
    platformId.value = id;
    setTimeout(() => {
      platformPopoverVisible.value = false;
    }, 300);
  }

  /**
   * @description 游戏选择器点击事件
   */
  function gameSelectHandle(event: any) {
    scrollSelectedToCenter(event);
    if (!loading.value) {
      gamePopoverVisible.value = true;
    }
  }

  /**
   * @description 计算游戏名称
   */
  function getGameName(id: number) {
    const game = games.value.find((item: any) => item.id === id);
    return game ? game.name : t(`option.allGame`);
  }

  /**
   * @description 选择游戏
   */
  function selectedGame(id: number = 0) {
    gameId.value = id;
    setTimeout(() => {
      gamePopoverVisible.value = false;
    }, 300);
  }

  /**
   * @description 弹出层关闭事件
   */
  function dismissHandle() {
    platformPopoverVisible.value = false;
    gamePopoverVisible.value = false;
    typePopoverVisible.value = false;
    timePopoverVisible.value = false;
  }

  /**
   * @description 触底加载更多事件
   */
  async function ionInfinite() {
    if (loadMore.value == 'noMore') return;
    userProfitParams.page! ++;
    await getUserProfit();
  }

  return {
    gameId,
    platformId,
    infiniteRef,
    loading,
    gameType,
    loadMore,
    gameTypeChange,
    gamePlatformChange,
    typePopoverVisible,
    gamePopoverVisible,
    platformPopoverVisible,
    userProfitInfo,
    games,
    scrollSelectionRef,
    userDayProfitList,
    userProfitParams,
    gameParams,
    gameTypes,
    gamePlatforms,
    isToken,
    showEmpty,
    changeTime,
    timePopoverVisible,
    currentTimeList,
    timeSelectHandle,
    selectedTime,
    typeSelectHandle,
    getTypeName,
    selectedType,
    platformSelectHandle,
    getPlatformName,
    selectedPlatform,
    gameSelectHandle,
    getGameName,
    selectedGame,
    dismissHandle,
    ionInfinite,
  }

  /**
   * 接口调用: 获取个人输赢报表
   */
  async function getUserProfit() {
    if (!isToken.value) return
    userProfitParams.gameType = gameType.value == 'all' ? undefined : gameType.value as UserProfitParams['gameType'];
    userProfitParams.platformId = platformId.value ? platformId.value : undefined;
    userProfitParams.gameId = gameId.value ? gameId.value : undefined;
    try {
      const res = await userProfitApi(userProfitParams);
      const { totalGameRounds, totalValidBetAmount, totalProfitAmount } = res
      Object.assign(userProfitInfo, {
        ...res,
        totalGameRounds: totalGameRounds ?? 0,
        totalValidBetAmount: moneyConvertToClient(totalValidBetAmount || 0),
        totalProfitAmount: moneyConvertToClient(totalProfitAmount || 0)
      })
      if (userProfitParams.page == 1)
        userDayProfitList.value = res.userDayProfitList
      else
        userDayProfitList.value = userDayProfitList.value.concat(res.userDayProfitList);
      if (res.userDayProfitList.length < userProfitParams.pageSize!) {
        loadMore.value = 'noMore';
      } else {
        loadMore.value = 'more';
      }
    } catch (error) {
      loadMore.value = 'noMore';
    } finally {
      if (infiniteRef.value) {
        infiniteRef.value.$el.complete();
      }
    }
  }

  /**
   * 接口调用-获取游戏列表
   */
  async function onGetGame() {
    gameParams.gameType = gameType.value == 'all' ? undefined : gameType.value as UserProfitParams['gameType'];
    gameParams.platformId = platformId.value || undefined;
    try {
      loading.value = true;
      const newArr = (await gameListApi(gameParams)).gameList;
      newArr.forEach((item: any) => {
        item['isTrue'] = false
        // 未包含空格 最多支持13位字符
        if (item.name && !item.name.includes(' ') && item.name.length > 13) {
          item['isTrue'] = true
        }
        // 包含空格 最多支持25未字符
        if (item.name && item.name.includes(' ') && item.name.length > 25) {
          item['isTrue'] = true
        }
      })
      games.value = newArr
    } catch (error) {
      onGetGame();
    } finally {
      loading.value = false;
    }
  }

  /**
   * @description 滚动选择器滚动到中间
   */
  function scrollSelectedToCenter(event: any) {
    if (scrollSelectionRef.value) {
      const container = scrollSelectionRef.value;
      const target = event.target!;

      const containerCenter = container.offsetWidth / 2; // 容器中心相对于视口的位置
      const targetCenter = target.offsetLeft + target.offsetWidth / 2; // 目标元素中心相对于视口的位置
      const scrollLeft = targetCenter - containerCenter + container.scrollLeft; // 计算目标元素中心需要移动到容器中心的距离
      const maxScrollLeft = container.scrollWidth - container.offsetWidth; // 考虑容器最大滚动范围，防止滚动超出
      const clampedScrollLeft = Math.min(Math.max(scrollLeft, 0), maxScrollLeft); // 确保滚动位置在有效范围内

      container.scroll({
        left: clampedScrollLeft,
        behavior: 'smooth'
      });
    }
  }

  /**
   * @description 计算日期字符串
   */
  function getDayStr(index: number) {
    switch (index) {
      case 0:
        return t('date.today');
    }
  }
}
