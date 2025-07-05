<!-- 体育游戏列表视图 -->
<template>
  <div class="px-3" v-if="gameList.length">
    <div class="pt-3 flex items-center px-1.5">
      <ion-icon v-if="skin === 'first'" class="sort text-[2rem] mr-1.5" src="/first/svg/sort/SPORTS.svg"/>
      <div v-else class="logo border-gradient items-center justify-center">
        <ion-icon src="/first/svg/sort/SPORTS.svg"/>
      </div>
      <ion-label class="label flex-1 text-[1.25rem] font-bold">{{ $t('sort.SPORTS') }}</ion-label>
      <ion-label class="bar text-sm px-3 py-[.1875rem] rounded-[.1875rem]" @click="router.push('/game/category/sport')">
        <span class="bar-label mr-1">{{ $t(`sort.ALL`) }}</span>
        <span class="bar-total">{{ gameList.length}}</span>
      </ion-label>
    </div>
    <HorizontalGameCard class="w-full h-[7.5rem] rounded-md mt-3 overflow-hidden"
    v-for="item of gameList"
     :key="item.id"
     :game="item"
     :platform="{gameType: 'SPORTS'}"
     @click="() =>useStartSportGame({...item, gameType: 'SPORTS', platformId: item.id})"
     />
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel } from '@ionic/vue';
import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
import useSportViewLogic from '../logic';
import router from '@/router';
import { getTheme } from '@/theme/hooks';

const { skin } = getTheme();
const { gameList, useStartSportGame} = useSportViewLogic();
</script>

<style lang="less" scoped>
@import '@/views/tabbar/tabs/inicio/components/SortView/second/index.less';
ion-icon.sort {
  color: var(--sports-icon-color);
}

</style>
