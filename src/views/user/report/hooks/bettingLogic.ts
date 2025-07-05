import i18n from '@/i18n';
import { useAppStore } from '@/store/app'
import { gameListApi } from '@/api/normal';
import { useGameStore } from '@/store/game';
import { gameRecordApi } from '@/api/personal';
import { useTenantStore } from "@/store/tenant";
import { GameListModel, GameListParams } from '@/api/normal/model';
import { GameRecordModel, GameRecordParams } from '@/api/personal/model';
import { onBeforeMount, ref, reactive, computed, watch } from 'vue';
import { tenantReportTimeList, handleStatementSelectTime } from '@/utils/reportTime'

export function useBettingLogic () {
  const { t } = i18n.global
  const appStore = useAppStore() 	                         // 用户信息
  const gameStore = useGameStore();                        // 游戏store
  const tenantStore = useTenantStore();                    // 租户信息
  
  const gameId = ref(0);                                              // 游戏id
  const dateIndex = ref();                                            // 日期索引
  const platformId = ref(0);                                          // 游戏平台
  const infiniteRef = ref<any>(null);	                                // 上拉加载更多组件DOM(用于重置状态)
  const loading = ref(false);                                         // 游戏列表加载状态
  const gameType = ref('all');                                        // 游戏类型
  const loadMore = ref('more');                                       // 加载更多状态
  const changeTime = ref('today');                                          // 时间类型
  const timePopoverVisible = ref(false);                                    // 时间筛选弹出层显示状态
  const gameTypeChange = ref(false);                                  // 游戏类型变化
  const gamePlatformChange = ref(false);                              // 游戏平台变化
  const typePopoverVisible = ref(false);                              // 游戏类型选项弹出层显示状态
  const gamePopoverVisible = ref(false);                              // 游戏选项弹出层显示状态
  const platformPopoverVisible = ref(false);                          // 平台选项弹出层显示状态
  const games = ref<GameListModel['gameList']>([]);                   // 游戏列表
  const scrollSelectionRef = ref<HTMLElement | null>(null);           // 选择器滚动容器
  const gameRecordList = ref<GameRecordModel['gameRecordList']>([]);  // 游戏记录列表

  const gameRecordParams = reactive<GameRecordParams>({ // 游戏记录请求参数 
    page: 1,
    pageSize: 10,
    startTime: '',
    endTime: ''
  })
  const gameParams = reactive<GameListParams>({ // 游戏列表请求参数
    page: 1,
    pageSize: 999,
    all: true
  })
    
  const gameTypes = computed(() => gameStore.homeGames.map(item => item.gameType)); // 游戏类型
  const gamePlatforms = computed(() => {                                            // 游戏平台
    const games = gameStore.homeGames.filter(item => item.gameType === gameType.value);
    if (!games.length) return [];
    const platforms = games[0].platformList as any;
    platforms.forEach((item:any) => {
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
  const isToken = computed(() => appStore.token ? true : false)    // 是否未登录
  const showEmpty = computed(() => !isToken.value || (loadMore.value == 'noMore' && !gameRecordList.value.length))

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    gameStore.getHomeGames(); // 获取游戏列表
  })

  // 监听时间类型变化
  watch(() => changeTime.value, (val) => {
    const dateObj = handleStatementSelectTime(val);
    gameRecordParams.startTime = dateObj?.startTime;
    gameRecordParams.endTime = dateObj?.endTime;
    gameRecordParams.page = 1;
    loadMore.value = 'more';
    gameRecordList.value = [];
    getGameRecord();
  }, { immediate: true })

  // 监听游戏类型变化
  watch(() => gameType.value, () => {
    gameTypeChange.value = true;
    platformId.value = 0;
    gameId.value = 0;
    gameRecordParams.page = 1;
    loadMore.value = 'more';
    gameRecordList.value = [];
    getGameRecord();
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
    if (!gameTypeChange.value) {  // 防止游戏类型变化时触发
      gameRecordParams.page = 1;
      loadMore.value = 'more';
      gameRecordList.value = [];
      getGameRecord();
    }
    setTimeout(() => {
      gamePlatformChange.value = false;
    }, 100);
  })

  // 监听游戏id变化
  watch(() => gameId.value, () => {
    if (!gamePlatformChange.value) { // 防止游戏平台变化时触发
      gameRecordParams.page = 1;
      loadMore.value = 'more';
      gameRecordList.value = [];
      getGameRecord();
    }
  })

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
    timePopoverVisible.value = false;
    typePopoverVisible.value = false;
    platformPopoverVisible.value = false;
    gamePopoverVisible.value = false;
  }

  /**
   * @description 触底加载更多事件
   */
  async function ionInfinite() {
    if (loadMore.value == 'noMore') return;
    gameRecordParams.page! ++;
    await getGameRecord();
  }

  return {
    gameId,
    dateIndex,
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
    games,
    scrollSelectionRef,
    gameRecordList,
    gameRecordParams,
    gameParams,
    gameTypes,
    gamePlatforms,
    isToken,
    showEmpty,
    changeTime,
    currentTimeList,
    timePopoverVisible,
    timeSelectHandle,
    selectedTime,
    dismissHandle,
    typeSelectHandle,
    getTypeName,
    selectedType,
    platformSelectHandle,
    getPlatformName,
    selectedPlatform,
    gameSelectHandle,
    getGameName,
    selectedGame,
    ionInfinite
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
   * 接口调用-获取游戏列表
   */
  async function onGetGame() {
      gameParams.gameType = gameType.value === 'all' ? undefined : gameType.value as GameRecordParams['gameType'];
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
   * 接口调用-获取游戏记录
   */
  async function getGameRecord() {
    const appStore = useAppStore() 	  // 用户信息
    if (!appStore.token) return
    gameRecordParams.gameType = gameType.value === 'all' ? undefined : gameType.value as GameRecordParams['gameType'];
    gameRecordParams.platformId = platformId.value || undefined;
    gameRecordParams.gameId = gameId.value || undefined;
    try {
      const res = await gameRecordApi(gameRecordParams);
      if (gameRecordParams.page === 1)
        gameRecordList.value = res.gameRecordList;
      else
        gameRecordList.value = gameRecordList.value.concat(res.gameRecordList);
      if (res.gameRecordList.length < gameRecordParams.pageSize!)
        loadMore.value = 'noMore';
      else
        loadMore.value = 'more';
    } catch {
      loadMore.value = 'noMore';
    } finally {
        if (infiniteRef.value) {
          infiniteRef.value.$el.complete();
        }
    }
  }
}
