<!-- 游戏搜索 -->
<template>
  <ion-page class="category-sport-container">
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t(`sort.SPORTS`) }}</ion-title>
      </ion-toolbar>
      <!-- 搜索框 -->
      <ion-toolbar class="toolbar-search">
        <ion-searchbar mode="md" id="searchbar" class="relative" v-model="searchValue" show-clear-button="never" :placeholder="$t('input.SearchGames')">
          <ion-spinner name="bubbles" v-if="loading" />
          <ion-icon :icon="searchOutline" v-else />
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content class="container">
      <!-- 导航标签栏 -->
      <ion-segment ref="segment" mode="md" v-model="tabValue" @ionChange="tabChange">
        <ion-segment-button :value="item.tab" v-for="item in games" :key="item.tab">
          <ion-button class="tab" fill="clear" :class="[tabValue == item.tab ? 'active' : '']">
            <ion-img v-if="skin === 'default'" class="tab-img" slot="start" :src="`/icons/sort/${item.icon}_on.png`" />
            <ion-icon v-else :icon="`/icons/sort/${item.icon}_on.svg`"
              :class="[tabValue == item.tab ? 'active' : 'placid', 'text-[1rem] mr-[0.3rem] tab-icon']" aria-hidden="true" />
            <span>{{ $t(`sort.${item.tab}`) }}</span>
          </ion-button>
        </ion-segment-button>
      </ion-segment>
      <!-- 游戏列表 -->
      <div class="game-box">
        <HorizontalGameCard class="w-full h-[7.5rem] sport-card rounded-md mt-2 p-2" v-for="item in currentGameList"
          :key="item.id" :game="item" :platform="{ gameType: 'SPORTS' }"
          @click="() => useStartSportGame({ ...item, gameType: 'SPORTS', platformId: item.id })"
          @cancelFavorite=cancelFavorite />
        <div class="empty" v-if="!currentGameList.length">
          <ion-icon class="empty-bg-game" :src="getImageUrl('svg/No_game.svg')"></ion-icon>
          <ion-label class="tip">{{ $t('label.noGame') }}</ion-label>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { searchOutline } from 'ionicons/icons';
import { setFavorite } from '@/hooks/SetFavorite';
import { useTenantStore } from '@/store/tenant';
import { IonPage, IonHeader, IonToolbar, IonButton, IonLabel, IonContent, IonSegment, IonSegmentButton, IonImg, IonTitle, IonSearchbar, IonIcon, IonSpinner, IonGrid, IonRow, IonCol } from '@ionic/vue';
import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
import useGetFavoriteGame, { setSportsPlatformGameFavorites} from '@/hooks/useGetFavoriteGame';
import useGetRecentGame from '@/hooks/useGetRecentGame';
import BackButton from '@/components/BackButton.vue';
import useStartSportGame from "@/hooks/useStartSportGame";
import router from '@/router'
import { getImageUrl } from '@/utils/url'


const gameStore = useGameStore(); // 游戏信息

const route = router.currentRoute
const tabValue = ref('ALL');  // 导航标签动态值
const searchValue = ref('');  // 导航标签动态值
const loading = ref(false);       // 搜索框加载动画
const games = ref([               // 游戏列表
  { tab: 'ALL', icon: 'SPORTS', list: [] as any[] },
  { tab: 'POPULAR', icon: 'POPULAR', list: [] },
  { tab: 'RECENT', icon: 'RECENT', list: [] },
  { tab: 'FAVORITE', icon: 'FAVORITE', list: [] }
]);
const tenantStore = useTenantStore(); // 商户户store
const { skin } = tenantStore.themeConfig!;
const currentGameList = computed(() => {
  let target = games.value.find(it => it.tab === tabValue.value)
  if (!target) return []
  let list = target.list ?? []
  list = setSportsPlatformGameFavorites(list)
  if (!searchValue.value) {
    return list
  }

  let reg = new RegExp(`${searchValue.value}`, "i")
  return list.filter((it: any) => {
    return reg.test(it.name) || `${it.id}`.includes(searchValue.value)
  })

})
let allSportsGameList = []


watch(() => route.value.path, async (newPath) => {

  if (newPath == '/game/category/sport') {
    await useGetFavoriteGame()
    onGetHotGame();
  }


}, { immediate: true })


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
 * 接口调用-获取热门游戏
 */
async function onGetHotGame() {
  const homeGames = await gameStore.getHomeGames();
  const sportGames = homeGames.find((item: any) => item.gameType === 'SPORTS');
  if (sportGames?.platformList) {
    allSportsGameList = (sportGames?.platformList as any[]).filter((item: any) => item.target === 'hall');
    games.value[0].list = allSportsGameList
    games.value[1].list = allSportsGameList.filter((item: any) => item.hot);
    setFavorite(games.value[1].list);
  } else {
    games.value[0].list = []
    games.value[1].list = [];
  }
}

/**
 * 接口调用-获取最近游戏
 */
async function onGetRecentGame() {
  games.value[2].list = await useGetRecentGame({ gameType: 'SPORTS', target: 'hall' });

}

/**
 * 接口调用-获取收藏游戏
 */
async function onGetFavoriteGame() {
  let result = await useGetFavoriteGame()
  games.value[3].list = result

}
const cancelFavorite = (id: number) => {
  let list = games.value[3].list
  games.value[3].list = list.filter(it => it.id !== id)

}

const handleSearch = () => {
  if (!searchValue.value) return;
  tabValue.value = 'ALL';
  onGetHotGame();
};
</script>

<script lang="ts">
export default {
  name: 'Search',
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
