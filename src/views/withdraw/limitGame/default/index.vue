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
  IonIcon,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import BackButton from "@/components/BackButton.vue";
import GameCard from "@/components/GameCard/index.vue";
import useLogic from "../hooks/useLogic";
import useStartSportGame from "@/hooks/useStartSportGame";
import HorizontalGameCard from "@/components/HorizontalGameCard.vue";
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
} = useLogic();
</script>
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t("viewsAssets.designatedGame") }}</ion-title>
      </ion-toolbar>
      <!-- 游戏类型选择按钮 -->
      <ion-toolbar class="toolbar-search">
        <ion-segment mode="ios" scrollable v-model="tabValue" @ionChange="tabChange" class="w-full">
          <ion-segment-button v-for="item in tabs" :value="item" :key="item">
            <ion-img  :src="`/icons/sort/${item}_on.png`" />
            <ion-label :class="tabValue == item ? 'selected' : 'unselected'">{{
              $t(`sort.${item}`)
            }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content">
      <div class="line"></div>
      <div class="bottom">
        <!-- 侧面栏 -->
        <ion-content class="side" v-if="segmentList.length">
          <ion-segment ref="segment" mode="ios" v-model="sideValue" :disabled="loading" @ionChange="sideChange">
            <ion-segment-button v-for="item in segmentList" :value="item.id">
              <ion-icon :class="[sideValue == item.id ? 'active' : '']" :src="item.logo" />
              <div class="text">
                <ion-label :class="sideValue == item.id ? '' :'unselected'">{{ item.name }}</ion-label>
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
                <div class="game" v-if="!loading && !gameList.length" >
                  <ion-img src="/icons/No_record.png" />
                  <ion-label color="medium">{{ $t("label.noRecord") }}</ion-label>
                </div>
                <ion-row>
                  <template v-if="isHall">
                    <HorizontalGameCard
                      class="aspect-ratio-card"
                      v-for="item in gameList"
                      :key="item.id"
                      :game="item"
                      :platform="{ gameType: item.gameType }"
                      @click="() => useStartSportGame({ ...item, gameType: item.gameType, platformId: item.id }, true)"
                    />
                  </template>
                  <template v-else>
                    <ion-col class="gameItem" size="4" v-for="item in gameList">
                      <GameCard
                        :key="item.id"
                        class="game-item"
                        :is-own-game="!!item.externalGameId"
                        :test="item?.test"
                        :status="item.status"
                        :is-logo="false"
                        :gameInfo="{ logoFlag: item.logoFlag }"
                        :is-favorite="item?.isFavorite || false"
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
              </ion-grid>
            </ion-list>
            <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite" threshold="5px">
              <ion-infinite-scroll-content
                :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
                :loading-spinner="loadMore == 'more' ? 'bubbles' : null"
              />
            </ion-infinite-scroll>
          </ion-content>
        </ion-content>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="less">
@import "@/views/withdraw/limitGame/default/styles/index-base.less";
@import "@/views/withdraw/limitGame/default/styles/theme-style.less";
#withdraw-limitGame-default-index.style();
.blue-default {
  #withdraw-limitGame-default-index.style();
}
.green-default {
  #withdraw-limitGame-default-index.style(
    --color-bg-300,
    --color-text-white-100,
    --color-text-gray-200,
    --color-bg-400,
    --color-bg-100,
    --theme-color-gradient-100,
    --color-text-white-100,
    --color-text-gray-200,
    --theme-color-gradient-100,
    --color-line
  );
}
.auroral-yellow {
  #withdraw-limitGame-default-index.style(
    @index02:--theme-color-800,
    @index06:--color-bg-100,
    @index09:--color-bg-100,
    @index07:--theme-color-800,
  );
}
.amber-purple {
  #withdraw-limitGame-default-index.style(
    --color-bg-300,
    --color-text-white-100,
    --color-text-gray-200,
    --color-bg-400,
    --color-bg-100,
    --theme-color-gradient-100,
    --color-text-white-100,
    --color-text-gray-200,
    --theme-color-gradient-100,
    --color-line
  );
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
