<!-- 分类游戏列表视图 -->
<template>
  <div class="sort-container px-[.5625rem]">
    <div class="pt-3 flex items-center px-1.5 pb-2" v-if="gameList.length">
      <ion-icon :src="logo" class="mr-[0.875rem] w-[1.875rem] ml-[0.375rem] h-[1.875rem] sort" />
      <ion-label class="flex-1 font-extrabold text-sm">{{ platform.toUpperCase() + " " + $t(`sort.${type}`) }}</ion-label>
      <ion-icon class="tab bg-[#191E2D] text-[#9BA7BE] text-[0.875rem] px-1 py-1 rounded-[.1875rem] mx-[.3125rem]  mt-[0.5rem]"
        :icon="chevronBack" @click="swiperToSlide('prev')" />
      <ion-icon class="tab bg-[#191E2D] text-[#9BA7BE] text-[0.875rem] px-1 py-1 rounded-[.1875rem] mr-[0.6675rem] mt-[0.5rem]" :icon="chevronForward"
        @click="swiperToSlide()" />
    </div>
    <swiper class="mt-1" @swiper="onSwiper" :modules="modules" virtual>
      <swiper-slide v-for="i in Math.ceil(gameList.length / 12)" :key="i - 1" :virtualIndex="i - 1">
        <ion-row>
          <ion-col size="3" v-for="item in gameList.slice((i - 1) * 12, i * 12)" :key="Number(item.id)">
            <GameCard @click="gameHandle(item)" @favoriteHandle="() => favoriteHandle(item)"
              v-bind="{ isOwnGame: !!item.externalGameId, test: item?.test, cardBgStyle: gameCardStyle(item), isShowPlatformLogo: false, isFavorite: item?.isFavorite || false, status: item.status }">
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
import { IonImg, IonLabel, IonIcon, IonRow, IonCol } from "@ionic/vue";
import GameCard from "@/components/GameCard.vue";
import useSortViewLogic from "../logic";

const props = defineProps({
  type: { type: String, required: true }, // 分类类型
  platform: { type: String, required: true }, // 平台名称
  platformIndex: { type: Number, required: true }, // 平台索引
});

const modules = [Virtual]; // 轮播图模块

const { logo, gameList, swiperToSlide, onSwiper, gameCardStyle, categoryHandle, favoriteHandle, gameHandle } = useSortViewLogic(props);
</script>

<style lang="less" scoped>
.sort-container{
  background: url('/images/headerTextBgGreen01.png') no-repeat 0.8125rem 0.5rem /22.4175rem 2.4531rem;
}
ion-col {
  --ion-grid-column-padding: 0.375rem;
}

div ion-icon.sort {
  color: var(--color-icon-platform-sort);
}

.green-default {
  .v01 {
    .sort-container {
      ion-label {
        color: var(--color-text-gray-100);
      }

      div:first-child {
        .tab {
          background-color: var(--color-bg-50);
          color: var(--color-text-gray-100);
        }
      }
    }
  }
}

div ion-icon.sort {
  color: var(--color-icon-platform-sort);
}
</style>
