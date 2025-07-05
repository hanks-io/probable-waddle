<!-- 分类游戏列表视图 -->
<template>
  <div class="sort-container px-[.5625rem]">
    <div class="pt-3 flex items-center px-1.5" v-if="gameList.length">
      <ion-icon :src="logo" class="mr-2 text-4xl sort" />
      <ion-label class="flex-1">{{ platform.toUpperCase() + " " + $t(`sort.${type}`) }}</ion-label>
      <ion-label class="tab bg-[#191E2D] text-sm px-3 py-[.1875rem] rounded-[.1875rem] text-[#FBA531]"
        @click="categoryHandle">{{ $t(`sort.ALL`) }} {{ gameList.length }}</ion-label>
      <ion-icon class="tab bg-[#191E2D] text-[#9BA7BE] text-sm px-2 py-1.5 rounded-[.1875rem] mx-[.3125rem]"
        :icon="chevronBack" @click="swiperToSlide('prev')" />
      <ion-icon class="tab bg-[#191E2D] text-[#9BA7BE] text-sm px-2 py-1.5 rounded-[.1875rem]" :icon="chevronForward"
        @click="swiperToSlide()" />
    </div>
    <swiper class="mt-1" @swiper="onSwiper" :modules="modules" virtual>
      <swiper-slide v-for="i in Math.ceil(gameList.length / 6)" :key="i - 1" :virtualIndex="i - 1">
        <ion-row>
          <ion-col size="4" v-for="item in gameList.slice((i - 1) * 6, i * 6)" :key="Number(item.id)">
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
ion-col {
  --ion-grid-column-padding: 0.375rem;
}

.green-default {
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

div ion-icon.sort {
  color: var(--color-icon-platform-sort);
}

.green-default {
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

div ion-icon.sort {
  color: var(--color-icon-platform-sort);
}
</style>
