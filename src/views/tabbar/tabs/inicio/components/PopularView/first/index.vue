<!-- 热门游戏列表视图 -->
<template>
  <div class="px-[.5625rem]">
    <div class="pt-[1.625rem] flex items-center px-1.5" v-if="popularList.length">
      <ion-icon v-if="skin === 'first'" src="/first/svg/sort/POPULAR.svg" class="popular mr-2 text-[2rem]" />
      <div v-else class="logo border-gradient items-center justify-center">
        <ion-icon src="/first/svg/sort/POPULAR.svg"/>
      </div>
      <ion-label class="label flex-1 text-xl font-bold">{{ $t("sort.POPULAR") }}</ion-label>
      <ion-label class="bar text-sm px-3 py-[.1875rem] rounded-[.1875rem] text-[#FBA531]" @click="router.push({ path: '/game/search' })">
        <span class="bar-label mr-1">{{ $t(`sort.ALL`) }}</span>
        <span class="bar-total">{{ popularList.length }}</span>
      </ion-label>
      <ion-icon
        class="arrow text-sm px-2 py-1.5 rounded-[.1875rem] mx-[.3125rem]"
        :class="swiperIndex === 0 ? 'invalid' : 'active'"
        :icon="chevronBack"
        @click="swiperToSlide('prev')"
      />
      <ion-icon
        class="arrow text-sm px-2 py-1.5 rounded-[.1875rem]"
        :icon="chevronForward"
        :class="swiperIndex === Math.ceil(popularList.length / 9) - 1 ? 'invalid' : 'active'"
        @click="swiperToSlide()"
      />
    </div>
    <swiper class="mt-1" @swiper="onSwiper" @slideChange="onSlideChange" :modules="modules" virtual>
      <swiper-slide v-for="i in Math.ceil(popularList.length / 9)" :key="i - 1" :virtualIndex="i - 1">
        <ion-row>
          <ion-col size="4" v-for="item in popularList.slice((i - 1) * 9, i * 9)" :key="Number(item.id)">
            <GameCard
              @click="popularHandle(item)"
              @favoriteHandle="() => favoriteHandle(item)"
              v-bind="{
                isOwnGame: !!item.externalGameId,
                test: item?.test,
                cardBgStyle: gameCardStyle(item),
                platformLogo: platformList[item.platformId],
                isFavorite: item?.isFavorite || false,
                status: forGameStatus(item),
                gameName: item.gameName,
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
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import { IonLabel, IonIcon, IonRow, IonCol } from "@ionic/vue";
import GameCard from "@/components/GameCard.vue";
import usePopularViewLogic from "../logic";
import router from "@/router";
import { getTheme } from '@/theme/hooks';

const { skin } = getTheme();
const modules = [Virtual]; // 轮播图模块

const { 
  forGameStatus,
  popularList,
  platformList,
  swiperIndex,
  swiperToSlide,
  onSwiper,
  onSlideChange,
  gameCardStyle,
  favoriteHandle,
  popularHandle
} = usePopularViewLogic();
</script>

<style scoped lang="less">
@import '@/views/tabbar/tabs/inicio/components/SortView/second/index.less';

ion-icon.popular {
  color: var(--color-svg-popular);
}

ion-col {
  --ion-grid-column-padding: 0.375rem;
}
</style>
