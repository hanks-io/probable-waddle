<!-- 游戏分类列表 -->
<template>
  <ion-page class="category-container">
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t(`sort.${gameParams.gameType}`) }}</ion-title>
      </ion-toolbar>
      <!-- 搜索框 -->
      <ion-toolbar class="toolbar-search">
        <ion-searchbar mode="md" class="relative" id="searchbar" v-model="gameParams.gameName" show-clear-button="never"
          :placeholder="$t('sort.SEARCH') + $t('main.games')">
          <ion-spinner name="bubbles" v-if="loading && gameParams.page == 1" />
          <ion-icon :icon="searchOutline" @click="searchHandle" v-else />
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content">
      <div class="container">
        <!-- 侧面栏 -->
        <ion-content class="side">
          <ion-segment mode="ios" :value="sideValue" :disabled="loading" @ionChange="sideChange" :scrollable="true"
            class="custom-segment">
            <div ref="segment" class="segment-scroll">
              <ion-segment-button :value="0" :class="[sideValue == 0 ? 'active-tab' : '']">
                <ion-img :src="`/icons/sort/${gameParams.gameType}_on.png`" />
                <ion-label class="label line-clamp-2">{{
                  $t('main.all') + $t(`sort.${gameParams.gameType}`) }}</ion-label>
              </ion-segment-button>
              <ion-segment-button v-for="item in segmentList" :value="item.id"
                :class="[sideValue == item.id ? 'active-tab' : '']">
                <ion-icon :src="item.logo" />
                <ion-label class="label line-clamp-2">{{ item.name }}</ion-label>
              </ion-segment-button>
            </div>
          </ion-segment>
        </ion-content>
        <!-- 主屏内容 -->
        <ion-content id="main" class="ion-content" :scrollY="false">
          <!-- 导航标签 -->
          <ion-segment class="tab-bar" :mode="tabsMode" :scrollable="true" v-model="tabValue" :disabled="loading"
            @ionChange="tabChange">
            <ion-segment-button v-for="item in tabs" :value="item" :key="item" class="btn">
              <ion-label>{{ $t(`sort.${item}`) }}</ion-label>
            </ion-segment-button>
          </ion-segment>
          <ion-content ref="contentRef">
            <ion-list :style="{ height: listHeight, transition: isTabChanging ? 'height 0.05s ease' : 'none' }">
              <!-- 骨架屏 -->
              <ion-grid v-if="loading && gameParams.page == 1 && !isCache">
                <ion-row>
                  <ion-col size="4" v-for="_item in 18">
                    <div class="skeleton-card"><ion-skeleton-text /></div>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <!-- 游戏列表 -->

              <ion-grid>
                <div class="empty" v-if="!loading && !gameList.length">
                  <ion-icon class="empty-bg-game" :src="getImageUrl('svg/No_game.svg')"></ion-icon>
                  <ion-label class="tip">{{ $t('label.noGame') }}</ion-label>
                </div>
                <transition name="game-list-fade">
                  <ion-row v-if="gameList.length">
                    <template v-for="item in gameList">
                      <ion-col v-if="item.target == 'hall'" class="card-col" size="12">
                        <HorizontalGameCard class="aspect-ratio-card" :key="item.id" :game="item"
                          :platform="{ gameType: gameParams.gameType }"
                          @click="() => useStartSportGame({ ...item, gameType: gameParams.gameType, platformId: item.id })" />
                      </ion-col>
                      <ion-col v-else class="order-2 card-col" size="4">
                        <GameCard :key="item.id" class="game-item" :is-own-game="!!item.externalGameId"
                          :logo="platformList[item.platformId]" :status="forGameStatus(item)" :is-logo="!sideValue"
                          :gameInfo="{ logoFlag: item.logoFlag }"
                          :is-favorite="item?.isFavorite || false" :test="item?.test" @click="gameHandle(item)"
                          @favorite-handle="() => favoriteHandle(item)">
                          <template #gameName v-if="!item.logo && item.externalGameId">
                            <span>{{ item.name }}</span>
                          </template>
                        </GameCard>
                      </ion-col>
                    </template>
                  </ion-row>
                </transition>
              </ion-grid>
            </ion-list>
            <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite" threshold="5px">
              <ion-infinite-scroll-content class="text-xs"
                :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
                :loading-spinner="loadMore == 'more' ? 'bubbles' : null" />
            </ion-infinite-scroll>
          </ion-content>
        </ion-content>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { searchOutline } from 'ionicons/icons';
import { useAppStore } from '@/store/app';
import { gameListApi } from '@/api/normal';
import { useUserStore } from '@/store/user';
import { useGameStore } from '@/store/game';
import { useTenantStore } from '@/store/tenant';
import { setFavorite } from '@/hooks/SetFavorite';
import { FavoriteListParams } from '@/api/personal/model';
import { GameListParams, HotParams } from '@/api/normal/model';
import { onBeforeMount, onMounted, reactive, ref, computed } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonContent, IonSegment, IonSegmentButton, IonImg, IonTitle, IonSearchbar, IonIcon, IonSpinner, IonGrid, IonRow, IonCol, IonSkeletonText, InfiniteScrollCustomEvent } from '@ionic/vue';
import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
import useGetFavoriteGame from '@/hooks/useGetFavoriteGame';
import BackButton from '@/components/BackButton.vue';
import GameCard from '@/components/GameCard/index.vue';
import useStartSportGame from "@/hooks/useStartSportGame";
import useGameStatus from '@/views/tabbar/tabs/inicio/components/GameWrapper/useGameStatus';
import useTransformFavoriteParameter from '@/views/game/search/useTransformFavoriteParameter';
import useCategoryRecentGame from '@/views/game/category/useCategoryRecentGame';
import { useCacheApi } from '@/hooks/useCacheApi';
import { getImageUrl } from '@/utils/url'


const router = useRouter();       // 路由对象
const appStore = useAppStore();   // 应用信息
const gameStore = useGameStore(); // 游戏信息
const userStore = useUserStore(); // 用户信息

const contentRef = ref()        // content实例
const sideValue = ref(0);       // 侧边导航标签动态值
const loading = ref(false);      // 搜索框加载动画
const infiniteRef = ref();      // 触底加载更多组件
const tabValue = ref('ALL');    // 导航标签动态值
const loadMore = ref('more');   // 加载更多状态
const gameList = ref<any>([]);  // 游戏列表
const segment = ref();          // 侧面栏容器引用
const isCache = ref(false);     // 是否缓存
const isTabChanging = ref(false); // 是否切换tab
const listHeight = ref('auto'); // 游戏列表高度

const { forGameStatus } = useGameStatus();

const platformList = computed(() => gameStore.platformList);  // 平台列表

const tabMapHandler = {
  ALL: onGetGame,
  POPULAR: onGetHotGame,
  RECENT: onGetRecentGame,
  FAVORITE: onGetFavorite
}

const tabAnimation = computed(() => {
  if (gameList.value.length > 0) return 'slide';
  return 'none';
})

const findHallInfo = (list: any[], hallID: number) => list.find((item: any) => item.id == hallID && item.target == 'hall');

const getHallInfo = (list: any[], hallID: number) => {
  const hallInfo = findHallInfo(list, hallID);
  if (hallInfo) {
    gameList.value = [hallInfo];
    loadMore.value = 'noMore';
    return true;
  }
  return false;
}

const filterSegmentList = () => {
  let list: any[] = [];
  gameStore.homeGames.forEach((item: any) => {
    if (item.gameType == gameParams.gameType) {
      item.platformList.forEach((platform: any) => {
        if (list.some((item: any) => item.id == platform.id)) return;
        list.push({ ...platform });
      })
    }
  })
  return list
}

const segmentList = computed(() => {
  const list = filterSegmentList();
  setFavorite(list, gameParams.gameType)
  return list.sort((a, b) => b.sort - a.sort);
});

const hallGameList = computed(() => {
  return segmentList.value.filter((item: any) => item.target == 'hall')
})

const gameParams = reactive<GameListParams>({                                                                 // 游戏列表请求参数
  gameType: router.currentRoute.value.params.gameType.toString().toUpperCase() as GameListParams['gameType'], // 获取路由动态参数
  platformId: Number(router.currentRoute.value.params.platformId),                                            // 获取平台ID(路由URL参数)
  gameName: '',
  page: 1,
  pageSize: 30,
})
const hotParams = reactive<HotParams>({                                                                       // 热门游戏列表请求参数
  gameType: router.currentRoute.value.params.gameType.toString().toUpperCase() as GameListParams['gameType'], // 获取路由动态参数
  platformId: Number(router.currentRoute.value.params.platformId),                                            // 获取平台ID(路由URL参数)
  gameName: '',
  page: 1,
  pageSize: 100,
  isHot: true,
});
const favoriteListParams = reactive<FavoriteListParams>({                                                     // 收藏列表请求参数
  gameType: router.currentRoute.value.params.gameType.toString().toUpperCase() as GameListParams['gameType'], // 获取路由动态参数
  page: 1,
  pageSize: 1000
});

const tabs = ['ALL', 'POPULAR', 'RECENT', 'FAVORITE'];              // 导航标签列表

gameParams.platformId && (sideValue.value = gameParams.platformId); // 设置侧边导航标签动态值

const tenantStore = useTenantStore();  // 租户信息
const tabsMode = computed(() => {
  const { skin, theme, home } = tenantStore.themeConfig || {};
  const themeKey = `${skin}-${theme + (home ? ('-' + home) : '')}`;
  return ['default-amber-purple'].includes(themeKey) ? 'md' : 'ios';
});      // 导航标签模式
// 生命周期-页面加载前
onBeforeMount(() => {
  gameStore.loadHomeGames();  // 载入首页游戏列表
})

// 生命周期-页面加载完成
onMounted(async () => {
  await Promise.all([
    useGetFavoriteGame(favoriteListParams),
    gameStore.getHomeGames()
  ])
  onGetGame();
  nextTick(() => {
    const index = findIndexById(Number(router.currentRoute.value.params.platformId));
    scrollToBottom(segment.value?.children[0].clientHeight * (index + 1));
  });
})

// 查找在游戏数组中的下标位置
const findIndexById = (id: number) => segmentList.value.findIndex(item => item.id === id);
// 定位滚动位置
const scrollToBottom = (target: number) => {
  segment.value?.scrollTo({ top: target, behavior: "smooth" });
};

/**
 * @description 侧边栏标签切换事件
 * @param event 事件对象
 */
async function sideChange(event: any) {
  const value = event.detail.value;
  if (value === undefined || sideValue.value === value) return;
  sideValue.value = value;
  await contentRef.value.$el.scrollToTop(500)                     // 500毫秒回到顶部
  gameParams.platformId = hotParams.platformId = value;
  gameParams.page = 1;
  gameList.value = [];
  gameParams.gameName = '';
  tabHandle(tabValue.value, true);
}

/**
 * @description 搜索框输入事件
 */
function searchHandle() {
  if (!gameParams.gameName) return;
  gameParams.page = 1;
  gameList.value = [];
  tabValue.value = 'ALL';
  onGetGame();
}

function tabChange(event: any) {
  tabHandle(event.detail.value);
}
/**
 * @description 导航标签切换事件
 * @param item 导航标签值
 * @param segment 是否触发侧边导航标签切换
 */
async function tabHandle(item: string, segment?: boolean) {
  if (loading.value) return;
  gameList.value = [];
  gameParams.gameName = '';
  gameParams.page = 1;
  hotParams.page = 1;
  tabValue.value = item;
  listHeight.value = '0';
  isTabChanging.value = true;
  await contentRef.value.$el.scrollToTop(20)
  tabMapHandler[item as keyof typeof tabMapHandler]();
  setTimeout(() => {
    listHeight.value = 'auto';
    isTabChanging.value = false;
  }, 20);
}

/**
 * @description 游戏卡片样式
 */
function gameCardStyle(item: any) {
  if (item.gameName || item.name) {
    const gradient = '360deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 16.23%, rgba(0, 0, 0, 0) 29.9%, rgba(0, 0, 0, 0) 100%'
    const logo = item.logo || item.gameLogo;
    return `background:linear-gradient(${gradient}),url("${logo}"); background-size: cover; background-position: center`
  }
  return `background: url(${item.background || item.plateformBackground}); background-size: cover; background-position: center`
}

/**
 * @description 收藏事件
 * @param item 游戏对象
 */
function favoriteHandle(item: any) {
  item.isFavorite = !item.isFavorite;
  item.type = 'game';
  if (item.isFavorite)
    userStore.addFavorite(item);
  else {
    userStore.cancelFavorite(item);
    if (tabValue.value == 'FAVORITE') {
      gameList.value.splice(gameList.value.indexOf(item), 1);
    }
  }
}

/**
 * @description 触底加载更多事件
 */
async function ionInfinite(event: InfiniteScrollCustomEvent) {
  nextTick(() => {
    if (loadMore.value == 'noMore' || gameList.value.length == 0) return;
    // onGetGame();
    tabMapHandler[tabValue.value as keyof typeof tabMapHandler]();
  })
}

/**
 * @description 游戏跳转
 */
function gameHandle(item: any) {
  return gameStore.enterGame(item)
}

/**
 * 接口调用-获取游戏列表
 */
async function onGetGame() {
  const lock = getHallInfo(segmentList.value, gameParams.platformId!)
  if (lock) return;
  loading.value = true;
  if (gameParams.platformId == 0) gameParams.platformId = undefined;
  useCacheApi(gameListApi, {
    params: gameParams,
    cacheInterceptor: ({ params }) => {
      return params?.page! === 1;
    },
    success: (res, hasCache) => {
      if (tabValue.value !== 'ALL') return; // 延时数据拦截避免错误数据追加
      if (res && 'gameList' in res) {
        const newGameList = res.gameList;
        setFavorite(newGameList);
        if (newGameList.length < gameParams.pageSize!) {
          loadMore.value = 'noMore';
        } else {
          loadMore.value = 'more';
          if (!hasCache) gameParams.page! += 1;
        }
        const oldGameList = gameList.value.filter((item: any) => item.target !== 'hall')
        if (gameParams.platformId == undefined) {
          gameList.value = hasCache ? [...hallGameList.value, ...newGameList] : [...hallGameList.value, ...oldGameList, ...newGameList]
        } else {
          gameList.value = hasCache ? [...newGameList] : [...oldGameList, ...newGameList]
        }
      }
      loading.value = false;
      infiniteRef.value.$el.complete();

    }
  })
}

/**
 * 接口调用-获取热门游戏列表
 */
async function onGetHotGame() {
  const lock = getHallInfo(segmentList.value, gameParams.platformId!)
  if (lock) return;
  loading.value = true;
  loadMore.value = 'loading';
  useCacheApi(gameListApi, {
    params: hotParams,
    cacheInterceptor: ({ params }) => {
      return params.page === 1;
    },
    success: (res, hasCache) => {
      if (tabValue.value !== 'POPULAR') return; // 延时数据拦截避免错误数据追加
      if (res && 'gameList' in res) {
        setFavorite(res.gameList);
        if (res.gameList.length < hotParams.pageSize!) {
          loadMore.value = 'noMore';
        } else {
          loadMore.value = 'more';
          if (!hasCache) {
            hotParams.page! += 1;
          }
        }
        gameList.value = hasCache ? [...res.gameList] : [...gameList.value, ...res.gameList]
      }
      loading.value = false;
      infiniteRef.value.$el.complete();
    }
  })
}

/**
 * 接口调用-获取最近游戏列表
 */
async function onGetRecentGame() {
  loading.value = true;
  const { gameType, platformId } = gameParams;
  let rParams = { platformId, gameType }
  const hallInfo = findHallInfo(segmentList.value, platformId!);
  if (hallInfo) {
    rParams.target = 'hall'
  }
  useCacheApi(useCategoryRecentGame, {
    params: rParams,
    success: (res) => {
      gameList.value = res
      loading.value = false;
    }
  })
  // gameList.value = await useCategoryRecentGame(rParams)
  // loading.value = false;
}

const { transformFavoriteParameter } = useTransformFavoriteParameter();

interface FavoriteItem {
  target?: string;
  platformId: number;
  [key: string]: any;
}

async function onGetFavorite() {
  loading.value = true;
  loadMore.value = 'loading';
  useCacheApi(useGetFavoriteGame, {
    params: favoriteListParams,
    success: favoriteList => {
      const transformList = transformFavoriteParameter(favoriteList);
      const favoriteHallList: FavoriteItem[] = [];
      const favoriteGameList: FavoriteItem[] = [];
      transformList.forEach((it: FavoriteItem) => {
        if (it.target === 'hall') {
          favoriteHallList.push(it)
        } else {
          favoriteGameList.push(it)
        }
      })
      if (!gameParams.platformId) {
        gameList.value = [...favoriteHallList, ...favoriteGameList]
      }
      const hallInfo = findHallInfo(segmentList.value, gameParams.platformId)
      if (hallInfo) {
        const fInfo = favoriteHallList.find((it: FavoriteItem) => it.platformId === gameParams.platformId)
        gameList.value = fInfo ? [fInfo] : []
      }
      if (gameParams.platformId && !hallInfo) {
        gameList.value = transformList.filter((it: FavoriteItem) => it.platformId === gameParams.platformId)
      }
      loading.value = false;
    }
  })
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
