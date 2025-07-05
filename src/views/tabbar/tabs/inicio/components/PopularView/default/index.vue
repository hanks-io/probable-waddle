<!-- 热门游戏列表视图 -->
<template>
  <div class="popular-container px-[.5625rem]">
    <div class="pt-3 flex items-center px-1.5" v-if="popularList.length">
      <ion-img src="/icons/sort/POPULAR_on.png" class="mr-2 w-9" />
      <ion-label class="flex-1">{{ $t('sort.POPULAR') }}</ion-label>
      <ion-label class="tab bg-[#191E2D] text-sm px-3 py-[.1875rem] rounded-[.1875rem] text-[#FBA531]"
        @click="router.push({ path: '/game/search' })">{{ $t('sort.ALL') }} {{ popularList.length }}</ion-label>
      <ion-icon class="tab bg-[#191E2D] text-[#9BA7BE] text-sm px-2 py-1.5 rounded-[.1875rem] mx-[.3125rem]"
        :icon="chevronBack" @click="swiperToSlide('prev')" />
      <ion-icon class="tab bg-[#191E2D] text-[#9BA7BE] text-sm px-2 py-1.5 rounded-[.1875rem]" :icon="chevronForward"
        @click="swiperToSlide()" />
    </div>
    <swiper class="mt-1" @swiper="onSwiper" :modules="modules" virtual>
      <swiper-slide v-for="i in Math.ceil(popularList.length / 9)" :key="i - 1" :virtualIndex="i - 1">
        <ion-row>
          <ion-col size="4" v-for="item in popularList.slice((i - 1) * 9, i * 9)" :key="Number(item.id)">
            <GameCard @click="popularHandle(item)" @favoriteHandle="() => favoriteHandle(item)"
              v-bind="{ isOwnGame: !!item.externalGameId, test: item?.test, cardBgStyle: gameCardStyle(item), platformLogo: platformList[Number(item.platformId)],  isFavorite: (item?.isFavorite || false), status: item.status,}">
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
import GameCard from '@/components/GameCard.vue'
import usePopularViewLogic from '../logic';
import router from '@/router';

const modules = [Virtual];  // 轮播图模块

const { popularList, platformList, swiperToSlide, onSwiper, gameCardStyle, favoriteHandle, popularHandle } = usePopularViewLogic();
</script>

<style lang="less" scoped>
ion-col {
  --ion-grid-column-padding: .375rem;
}

.green-default {
  .popular-container {
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
</style>
