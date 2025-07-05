<!-- 游戏搜索 -->
<template>
  <ion-page class="search-container">
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t(`sort.SEARCH`) }}</ion-title>
      </ion-toolbar>
      <!-- 搜索框 -->
      <ion-toolbar class="toolbar-search">
        <ion-searchbar mode="md" id="searchbar" class="relative" v-model="gameParams.gameName" show-clear-button="never" :placeholder="$t('input.SearchGames')">
          <ion-spinner name="bubbles" v-if="loading" />
          <ion-icon :icon="searchOutline" @click="searchHandle" v-else />
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content class="container">
      <!-- 导航标签栏 -->
      <ion-segment ref="segment" mode="md" v-model="tabValue" @ionChange="tabChange">
        <ion-segment-button :value="item.tab" v-for="item in games" :key="item.tab">
          <ion-button class="tab" fill="clear">
            <ion-img v-if="skin === 'default'" class="tab-img" slot="start"
              :src="`/icons/sort/${item.tab}_on.png`"></ion-img>
            <ion-icon v-else :icon="`/icons/sort/${item.tab}_on.svg`" :class="[tabValue == item.tab ? 'active' : 'placid', 'text-[1rem] mr-[0.3rem] tab-icon']"   aria-hidden="true" />
            <span>{{ $t(`sort.${item.tab}`) }}</span>
          </ion-button>
        </ion-segment-button>
      </ion-segment>
      <!-- 游戏列表 -->
      <ion-grid class="game-box">
        <ion-row>
          <template v-for="item in currentGameList">
            <ion-col v-if="item.target === 'hall'" size="12">
              <HorizontalGameCard
                class="sports-card"
                :key="item.id"
                :game="item"
                :platform="{gameType: item.gameType}"
                @click="() => useStartSportGame({...item, gameType: item.gameType, platformId: item.platformId})"
                @cancelFavorite="cancelFavorite"
              />
            </ion-col>
            <ion-col v-else class="order-2" :size="cardSize">
              <GameCard
                :key="item.id"
                class="game-item"
                :is-own-game="!!item.externalGameId"
                :logo="platformList[item.platformId]"
                :status="forGameStatus(item)"
                :is-logo="true"
                :gameInfo="{ logoFlag: item.logoFlag }"
                :is-favorite="item?.isFavorite || false"
                :test="item?.test"
                @click="gameHandle(item)"
                @favorite-handle="() => favoriteHandle(item)"
              >
                <template #gameName v-if="!item.logo && item.externalGameId">
                  <span>{{ item.name }}</span>
                </template>
              </GameCard>
            </ion-col>
          </template>
        </ion-row>
        <div class="empty" v-if="!currentGameList.length">
          <ion-icon class="empty-bg-game" :src="getImageUrl('svg/No_game.svg')"></ion-icon>
          <ion-label class="tip">{{ $t('label.noGame') }}</ion-label>
        </div>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { gameListApi } from '@/api/normal';
import { useUserStore } from '@/store/user';
import { useGameStore, TGameInfo } from '@/store/game';
import { searchOutline } from 'ionicons/icons';
import { useTenantStore } from '@/store/tenant';
import { setFavorite } from '@/hooks/SetFavorite';
import { GameListParams } from '@/api/normal/model';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonButton, IonLabel, IonContent, IonSegment, IonSegmentButton, IonImg, IonTitle, IonSearchbar, IonIcon, IonSpinner, IonGrid, IonRow, IonCol } from '@ionic/vue';
import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
import useGetFavoriteGame from '@/hooks/useGetFavoriteGame';
import useGetRecentGame from '@/hooks/useGetRecentGame';
import BackButton from '@/components/BackButton.vue';
import GameCard from '@/components/GameCard/index.vue';
import useGameStatus from '@/views/tabbar/tabs/inicio/components/GameWrapper/useGameStatus';
import useCardStyle from '@/components/GameCard/useCardStyle';
import useStartSportGame from "@/hooks/useStartSportGame";
import useTransformFavoriteParameter from '@/views/game/search/useTransformFavoriteParameter';
import { getImageUrl } from '@/utils/url'


const userStore = useUserStore(); // 用户信息
const gameStore = useGameStore(); // 游戏信息
const router = useRouter();       // 路由对象

const tabValue = ref('');  // 导航标签动态值
const loading = ref(false);       // 搜索框加载动画
const games = ref([               // 游戏列表
  { tab: 'SEARCH', list: [] as any[] },
  { tab: 'POPULAR', list: [] },
  { tab: 'RECENT', list: [] },
  { tab: 'FAVORITE', list: [] }
]);
const tenantStore = useTenantStore(); // 商户户store
const { skin } = tenantStore.themeConfig!;
const currentGameList = computed(() => games.value.find(it => it.tab === tabValue.value)?.list ?? [])
const platformList = computed(() => gameStore.platformList);  // 平台列表
const { cardStyle } = useCardStyle();

const cardSize = computed(() => 
  tenantStore.themeConfig?.specialSkinSettings?.gameSearchProps?.cardSize ?? 4
)

// 游戏列表请求参数
const gameParams = reactive<GameListParams>({
  platformId: undefined,
  gameType: undefined,
  gameName: '',
  page: 1,
  pageSize: 40,
})
const { forGameStatus } = useGameStatus();

/**
 * @description 导航标签切换事件
 * @param event 事件对象
 */
function tabChange(event: any) {
  tabValue.value = event.detail.value;
  switch (tabValue.value) {
    case 'POPULAR':
      onGetHotGame();
      break;
    case 'RECENT':
      onGetRecentGame();
      break;
    case 'FAVORITE':
      onGetFavoriteGame();
      break;
    default:
      break;
  }
}

/**
 * @description 搜索框输入事件
 */
function searchHandle() {
  if (!gameParams.gameName) return;
  tabValue.value = 'SEARCH';
  onGetGame();
}

/**
 * @description 游戏卡片样式
 */
function gameCardStyle(item: any) {
  if (item.gameName || item.gameId || item.name) {
    const logo = item.logo || item.gameLogo;
    const gradient = '180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 10.41%, rgba(0, 0, 0, 0) 18.5%, rgba(0, 0, 0, 0) 100%'
    return `background:linear-gradient(${gradient}),url("${logo}"); background-size: 100% 100%`
  }
  return `background: url(${item.background || item.plateformBackground}); background-size: 100% 100%`
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
 * @description 游戏点击事件
 */
function gameHandle(item: any) {
  if (item.gameId || item.name) {
    return gameStore.enterGame(item)
  } else {
    router.push({ path: `/game/category/${item.gameType}/${item.platformId}` });
  }
}

/**
 * 接口调用-获取游戏列表
 */
async function onGetGame() {
  loading.value = true;
  const res = await gameListApi(gameParams);
  loading.value = false;
  if (res && 'gameList' in res) {
    const { gameList } = res;
    setFavorite(gameList);
    games.value[0].list = gameList;
  }
}

/**
 * 接口调用-获取热门游戏
 */
async function onGetHotGame() {
  games.value[1].list = await gameStore.getPopularGames();
  setFavorite(games.value[1].list);
}

/**
 * 接口调用-获取最近游戏
 */
async function onGetRecentGame() {
  games.value[2].list = await useGetRecentGame(null, true);
}

const { transformFavoriteParameter } = useTransformFavoriteParameter();
/**
 * 接口调用-获取收藏游戏
 */
async function onGetFavoriteGame() {
  const list = await useGetFavoriteGame();
  const transformList = transformFavoriteParameter(list);
  games.value[3].list = transformList;
}

const cancelFavorite = (id: number) => {
  let list = games.value[3].list
  games.value[3].list = list.filter(it => it.id !== id)

}


// 生命周期: 组件加载前
onBeforeMount(async () => {
  const { tab } = router.currentRoute.value.params;
  const detailValue = tab || 'POPULAR';
  await useGetFavoriteGame()
  tabChange({ detail: { value: detailValue } });
  gameStore.getHomeGames();
});
</script>

<script lang="ts">
export default {
  name: 'Search',
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
