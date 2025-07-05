<!-- 稽核记录-稽核详情-限制游戏列表 -->
<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonImg,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import GameCard from '@/components/GameCard.vue'
import Image from '@/components/Image.vue'
import useLogic from '../hooks/useLogic'
import useAddThemeClassName from '@/hooks/useAddThemeClassName'
import Empty from '@/components/Empty/index.vue'
import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
import useStartSportGame from "@/hooks/useStartSportGame";
const {
  tabValue,
  tabs,
  sideValue,
  segmentList,
  loadMore,
  gameList,
  loading,
  infiniteRef,
  isHall,
  gameHandle,
  gameCardStyle,
  favoriteHandle,
  ionInfinite,
  tabChange,
  sideChange,
} = useLogic()
</script>

<template>
  <ion-page>
    <ion-header :class="['ion-no-border', useAddThemeClassName()]" >
      <ion-toolbar mode="ios" class="top-header">
        <BackButton />
        <ion-title>{{ $t('viewsAssets.designatedGame') }}</ion-title>
      </ion-toolbar>
      <!-- 游戏类型选择按钮 -->
      <ion-toolbar class="toolbar-search">
        <ion-segment mode="ios" scrollable v-model="tabValue" @ionChange="tabChange">
          <ion-segment-button v-for="item in tabs" :value="item" :key="item">
            <ion-img class="w-9" :src="`/icons/sort/${item}_on.png`" />
            <ion-label :class="['text-xs']">{{ $t(`sort.${item}`)
              }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content" :class="useAddThemeClassName()">
      <div class="mx-[.625rem] my-4  line"></div>
      <div class="flex h-full">
        <!-- 侧面栏 -->
        <ion-content class="side" v-if='segmentList.length'>
          <ion-segment class="flex flex-col" ref="segment" mode="ios" v-model="sideValue" :disabled="loading"
            @ionChange="sideChange">
            <ion-segment-button v-for="item in segmentList" :value="item.id">
              <ion-icon style="font-size:2.375rem;" :src="item.logo" />
              <div class="w-full px-1">
                <ion-label class="text-sm text-wrap" :style="`color:${sideValue == item.id ? '' : '#9BA7BE'}`">{{
                  item.name }}</ion-label>
              </div> 
            </ion-segment-button>
          </ion-segment>
        </ion-content>
        <!-- 主屏内容 -->
        <ion-content id="main" :scrollY="false">
          <ion-content>
            <ion-list>
              <!-- 游戏列表 -->
              <ion-grid>
                <div class="flex flex-col items-center justify-center" v-if="!loading && !gameList.length">
                  <Empty />
                </div>
                <ion-row>
                  <template v-if="isHall">
                    <HorizontalGameCard class="aspect-ratio-card"
                       v-for="item in gameList" :key="item.id" :game="item" :platform="{ gameType: item.gameType }"
                      @click="() => useStartSportGame({ ...item, gameType: item.gameType, platformId: item.id }, true)" />
                  </template>
                  <template v-else>
                    <ion-col class="pt-0 pb-[10px]" size="4" v-for="item in gameList">
                      <GameCard @click="gameHandle(item)" @favoriteHandle="() => favoriteHandle(item)"
                        v-bind="{ isOwnGame: !!item.externalGameId, test: item?.test, cardBgStyle: gameCardStyle(item), isFavorite: (item?.isFavorite || false), status: item.status, isShowPlatformLogo: false }">
                        <template #gameName v-if="!item.logo && item.externalGameId">
                          <span>{{item.name}}</span>
                        </template>
                      </GameCard>
                    </ion-col>
                  </template>
                </ion-row>
              </ion-grid>
            </ion-list>
            <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite" threshold="5px">
              <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
                :loading-spinner="loadMore == 'more' ? 'bubbles' : null" />
            </ion-infinite-scroll>
          </ion-content>
        </ion-content>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="less">
.top-header {
  --background: var(--color-bg-200);
}

ion-toolbar.toolbar-search {
  --background: var(--color-bg-300);

  ion-segment {
    /* --background: var(--color-bg-100); */
    margin-left: .625rem;
    margin-right: .625rem;
    margin-top: 0.9375rem;
    --width: 24.375rem;

  }

  ion-segment-button {
    margin-right: .375rem;
  }

  ion-segment-button.ios {
    border-radius: var(--rounded-small);
    --color: var(--color-text-40);
    --color-checked: var(--color-text-100);
    --background: var(--color-bg-200);
    --indicator-color: var(--color-bg-100);
  }

  .segment-button-checked ion-label {
    color: var(--color-text-100);
  }
}

ion-segment-button.ios {
  ion-img {
    filter: grayscale(1);
    opacity: 0.4;
  }
}
ion-segment-button.segment-button-checked.ios {
  color: var(--color-text-100);
  ion-icon {
    color: var(--theme-color-700);
  }
}

.line {
  border-bottom: 2px solid var(--color-border);
}
ion-content.side {
  --padding-start: .625rem;
  --padding-end: .625rem;
  --padding-top: 0;
  --padding-bottom: 2.625rem;
  /* --padding-end: 0 */
  min-width: 0;
  max-width: 5.3125rem;
}

ion-content div ion-segment {
  --background: transparent;
}

ion-content div .side ion-segment-button.ios {
  --border-radius: var(--rounded-small);
  --background: transparent;
  --color: var(--color-text-40);
  --indicator-color: var(--color-bg-100);
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: .25rem;
  --padding-bottom: .25rem;
  --background: var(--color-bg-200);
  text-transform: capitalize;
  min-width: 0;
  min-height: 3.5rem;
  margin-bottom: 10px;
  margin-top: 0;
}

.side ion-segment-button.segment-button-checked.ios {
  border: none;
  font-weight: var(--font-weight-bold);
  --background: var(--color-bg-200);
}

.side ion-segment-button.ios::part(indicator-background) {
  border: none;
}

.side ion-segment-button.ios::part(indicator) {
  padding-inline: 0;
}

.side ion-segment-button.ios ion-label {
  text-transform: none;
}

ion-content#main {
  --padding-top: 2px;
}

ion-list {
  background: transparent;
  padding-top: 0;
  padding-bottom: 0;
}

ion-grid {
  padding-bottom: 0;
}

 /* 设置网格卡片样式 */
.grid-card {
  aspect-ratio: .76;
  width: 100%;
  background-size: 100% 100% !important;
}

/* 设置触底加载更多样式 */
ion-infinite-scroll {
  min-height: 70px;
}

/* 设置触底加载更多样式 */
ion-infinite-scroll-content {
  min-height: 10px;
}

ion-grid {
  padding-top: 0;
}
.scheme-light {
  .top-header {
    --background: var(--theme-color-800);
  }
  ion-toolbar.toolbar-search {
    ion-segment-button.ios {
      --color: var(--color-text-80);
    }
  }

  .segment-button-checked ion-label {
    color: var(--color-text-100);
  }
}

ion-content.scheme-light .side ion-segment-button.ios {
  --color: var(--color-text-80);
}
.aspect-ratio-card {
  width: 100%;
  height: 5.9013rem;
  aspect-ratio: 1 / 0.32786;
  margin: 0 auto;
  border-radius: var(--ep-border-radius-surface-default, 0.875rem);
  overflow: hidden;
}
</style>

