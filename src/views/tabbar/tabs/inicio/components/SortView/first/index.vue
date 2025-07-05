<!-- 分类游戏列表视图 -->
<template>
<div class="h-[22.9494rem]" v-if="!logo"></div>
  <div class="px-[.5625rem]" v-else>
    <div class="pt-3 flex items-center px-1.5" v-if="gameList.length">
      <ion-icon :src="logo" class="sort mr-2 text-4xl" />
      <ion-label class="label flex-1 text-xl font-bold">{{ platform.toUpperCase() + " " + $t(`sort.${type}`) }}</ion-label>
      <ion-label class="bar text-sm px-3 py-[.1875rem] rounded-[.1875rem]" @click="categoryHandle">
        <span class="all mr-1">{{ $t(`sort.ALL`) }}</span>
        <span class="amount">{{ gameList.length }}</span>
      </ion-label>
      <ion-icon
        class="bar text-sm px-2 py-1.5 rounded-[.1875rem] mx-[.3125rem]"
        :class="swiperIndex === 0 ? '' : 'invalid'"
        :icon="chevronBack"
        @click="swiperToSlide('prev')"
      />
      <ion-icon
        class="bar text-sm px-2 py-1.5 rounded-[.1875rem]"
        :class="swiperIndex === Math.ceil(gameList.length / 6) - 1 ? '' : 'invalid'"
        :icon="chevronForward"
        @click="swiperToSlide()"
      />
    </div>
    <swiper class="mt-1" @swiper="onSwiper" @slideChange="onSlideChange" :modules="modules" virtual>
      <swiper-slide v-for="i in Math.ceil(gameList.length / 6)" :key="i - 1" :virtualIndex="i - 1">
        <ion-row>
          <ion-col size="4" v-for="item in gameList.slice((i - 1) * 6, i * 6)" :key="Number(item.id)">
            <GameCard
              @click="gameHandle(item)"
              @favoriteHandle="() => favoriteHandle(item)"
              v-bind="{
                isOwnGame: !!item.externalGameId,
                test: item?.test,
                cardBgStyle: gameCardStyle(item),
                platformLogo: platformList[item.platformId],
                isShowPlatformLogo: false,
                isFavorite: item?.isFavorite || false,
                status: forGameStatus(item),
                gameName: item.name,
              }"
            >
              <template #gameName v-if="!item.logo && item.externalGameId">
                <span>{{item.name}}</span>
              </template>
            </GameCard>
          </ion-col>
        </ion-row>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Virtual } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { chevronBack, chevronForward } from 'ionicons/icons';
import { IonImg, IonLabel, IonIcon, IonRow, IonCol } from '@ionic/vue';
import GameCard from '@/components/GameCard.vue';
import useSortViewLogic from '../logic';


const props = defineProps({
  type: { type: String, required: true }, // 分类类型
  platform: { type: String, required: true }, // 平台名称
  platformIndex: { type: Number, required: true }, // 平台索引
});

const modules = [Virtual]; // 轮播图模块

const { forGameStatus, logo, gameList, swiperIndex, platformList, swiperToSlide, onSlideChange, onSwiper, gameCardStyle, categoryHandle, favoriteHandle, gameHandle } =
  useSortViewLogic(props);
</script>

<style scoped lang="less">
@import '@/views/tabbar/tabs/inicio/components/SortView/second/index.less';

ion-col {
  --ion-grid-column-padding: 0.375rem;
}

.bar {
  background: var(--navigation-bar-bg);
  color: var(--navigation-bar-color);
}

.bar.invalid {
  color: var(--navigation-arrow-color);
}

ion-label.bar span.all {
  color: var(--navigation-bar-color);
}

ion-label.bar span.amount {
  font-weight: 700;
  color: var(--color-primary-800);
}

ion-label.label {
  color: var(--navigation-label-color);
  white-space: pre-wrap;
  word-break: break-word;
}

ion-icon.sort {
  color: var(--ion-color-primary);
}
</style>
