<!-- 活动-待领取 -->
<template>
  <div class="flex h-full flex-col">
    <!--搜索栏 -->
    <ion-row class="text-xs items-center mb-2.5">
      <ion-label class="flex-1 text-end text-sm text-[--color-text-basic]">{{ $t('activity.rewardLabel') }}
        <span class="text-[--color-text-emphasis]">{{ formatMoneyToShow(parseFloat(rewardTotal)) }}</span>
      </ion-label>
    </ion-row>
    <!-- 表头 -->
    <ion-grid class="w-full flex-initial text-xs text-center text-[--color-text-basic]">
      <ion-row>
        <ion-col size="3">{{ $t('activity.time') }}</ion-col>
        <ion-col size="3">{{ $t('activity.activityName') }}</ion-col>
        <ion-col size="3">{{ $t('activity.activityBonus') }}</ion-col>
        <ion-col size="3">{{ $t('activity.rewardSource') }}</ion-col>
      </ion-row>
    </ion-grid>
    <ion-content>
      <ion-grid class="w-full text-xs text-[--color-text-basic]" v-if="!showEmpty">
        <ion-row class="py-2" :class="i%2 ? '' : 'odd'" v-for="(item, i) in recordList" :key="item.time?.toString()">
          <ion-col class="flex items-center justify-center" size="3"><p class="w-full text-center">{{ item.time }}</p></ion-col>
          <ion-col class="flex items-center justify-center" size="3"><p class="w-full text-center">{{ item.activityName }}</p></ion-col>
          <ion-col class="flex items-center justify-center" size="3"><p class="w-full text-center text-[--color-text-emphasis]">{{ getReward(item) }}</p></ion-col>
          <ion-col class="flex items-center justify-center" size="3"><p class="w-full text-center">{{ getRewardSource(item) }}</p></ion-col>
        </ion-row>
      </ion-grid>
      <!-- 暂无数据 -->
      <div class="h-full flex flex-col items-center justify-center text-[--color-text-second]" v-if="showEmpty">
        <div class="w-[7.5rem] h-[7.5rem] empty-bg-img"></div>
        <ion-label >{{ $t('label.noRecord') }}</ion-label>
      </div>
      <ion-infinite-scroll @ionInfinite="ionInfinite" v-if="!showEmpty">
        <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
      </ion-infinite-scroll>
    </ion-content>
    <!-- 一键领取奖励 -->
    <div class="flex-initial w-full text-[--color-text-btn-basic]" :style="{ marginBottom: `calc(${tabBarHeight}px + 1.6rem)`}">
      <ion-button class="mx-auto" expand="block" :class="[Number(rewardTotal) > 0 ? 'shiny' : 0, !(recordList.length > 0) ? 'unable' :'']" @click="receiveHandle" >
        {{ $t('activity.oneClickReceive') }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRewardSource, getReward } from '../data'
import { formatMoneyToShow } from '@/utils/custom'
import {
	IonRow,
	IonGrid,
	IonCol,
	IonLabel,
	IonButton,
	IonContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
} from '@ionic/vue'
import useUnclaimedLogic from '../unclaimedLogic'

defineOptions({
  inheritAttrs: false
})

const {
  recordList,
  rewardTotal,
  loadMore,
  showEmpty,
  ionInfinite,
  receiveHandle,
  tabBarHeight,
} = useUnclaimedLogic()

</script>

<style scoped lang="less">
// 基础公共 less
  @import "@/views/activity/history/default/style/unclaimedStyle/base-unclaimed.less";
  @import "@/views/activity/history/default/style/unclaimedStyle/theme-style.less";

  #activity-history-default-unclaimed.style();

  .blue-default {
    #activity-history-default-unclaimed.style(
      --color-bg-200,
      --theme-color-gradient-200,
      --activity-unclaim-shade-bg-color,
      --activity-unclaim-shade-bg-color,
      --activity-unclaim-tint-bg-color,
      --color-btn-gradient-claimUnable,
      --color-text-white-100,
      --text-color-white-40,
      --color-text-white-100,
      --color-text-white-100,
      --text-color-white-40,
      --accent-color-yellow,
      --color-text-white-100
    );
  }

  .green-default {
    #activity-history-default-unclaimed.style(
      --color-bg-200,
      --theme-color-gradient-200,
      --activity-unclaim-shade-bg-color,
      --activity-unclaim-shade-bg-color,
      --activity-unclaim-tint-bg-color,
      --theme-color-gradient-400,
      --color-text-white-40,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-100,
      --color-text-gray-200,
      --accent-color-yellow,
      --color-text-white-100
    );
  }

  .forest-green {
    #activity-history-default-unclaimed.style(
      @history-default-unclaimed-07:--color-text-white-40
    );
  }

  .amber-purple {
    #activity-history-default-unclaimed.style(
      --color-bg-200,
      --segment-gradients-purple,
      --segment-gradients-purple,
      --segment-gradients-purple,
      --segment-gradients-purple,
      --gradients-disabled-btn-bg,
      --text-color-white-40,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --accent-color-yellow,
      --color-text-white-100
    );
  }

  .auroral-yellow {
    #activity-history-default-unclaimed.style(
      @history-default-unclaimed-02: --theme-color-800,
      @history-default-unclaimed-05: --agent-btn-color,
      @history-default-unclaimed-14: --agent-btn-color,
    );
  }
</style>