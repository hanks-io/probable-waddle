<!-- 体育游戏列表视图 -->
<template>
  <div class="sport-container px-3" v-if="gameList.length">
    <div class="pt-3 flex items-center px-1.5">
      <ion-img class="sort w-8 h-8 mr-1.5" src="/icons/sort/SPORTS_on.png"/>
      <ion-label class="flex-1">{{ $t('sort.SPORTS') }}</ion-label>
      <ion-label class="tab bg-[#191E2D] text-sm px-3 py-[.1875rem] rounded-[.1875rem] text-[#FBA531]" @click="router.push('/game/category/sport')">
        {{ $t(`sort.ALL`) }} {{ gameList.length }}
      </ion-label>
    </div>
    <HorizontalGameCard class="w-full h-[7.5rem] rounded-md mt-3 overflow-hidden"
    v-for="item of gameList"
    :key="item.id"
    :game="item"
    :platform="{gameType: 'SPORTS'}"
     @click="() =>useStartSportGame({...item, gameType: 'SPORTS', platformId: item.id})"/>
  </div>
</template>

<script setup lang="ts">
import { IonImg, IonLabel } from '@ionic/vue';
import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
import useSportViewLogic from '../logic';
import router from '@/router';

const { gameList, useStartSportGame, favoriteHandle } = useSportViewLogic();



</script>

<style lang="less" scoped>
.green-default {
  .sport-container {
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
