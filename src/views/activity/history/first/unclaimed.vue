<!-- 活动-待领取 -->
<template>
  <div class="flex flex-col w-full h-full pt-[0.3125rem] pending-claim-record">
    <!--搜索栏 -->
    <div class="flex-between mb-[1.8125rem]">
	  	<!-- 日期选择 -->
      <div></div>
	  	<!-- 奖金内容 -->
      <div class="height-text-white">
        <span class="pending-claim-reward-label">{{ $t('activity.rewardLabel') }}:</span>
        <span class="color-text-currency">{{ formatMoneyToShow(parseFloat(rewardTotal)) }}</span>
      </div>
	  </div>
    <!-- 表头 -->
    <div>
      <ion-grid class="w-full table-title-bg">
        <ion-row class="small-text-white table-title-color font-weight-bold">
          <ion-col class="flex-center" size="3">{{ $t('activity.time') }}</ion-col>
          <ion-col class="flex-center" size="3">{{ $t('activity.activityName') }}</ion-col>
          <ion-col class="text-center" size="3">{{ $t('activity.activityBonus') }}</ion-col>
          <ion-col class="flex-center" size="3">{{ $t('activity.rewardSource') }}</ion-col>
        </ion-row>
      </ion-grid>
    </div>
    <ion-content>
      <ion-grid class="w-full table-item-grid" v-if="!showEmpty">
        <ion-row class="small-text-white table-item-bg table-item" v-for="(item, i) in recordList" :key="item.time?.toString()">
          <ion-col class="flex-center table-item-time-text" size="3"><p class="w-full text-center">{{ item.time }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center">{{ item.activityName }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center color-text-currency">{{ getReward(item) }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center">{{ getRewardSource(item) }}</p></ion-col>
        </ion-row>
      </ion-grid>
      <!-- 暂无数据 -->
      <div class="h-full flex-center empty-color" v-if="showEmpty">
        <Empty />
      </div>
      <ion-infinite-scroll @ionInfinite="ionInfinite" v-if="!showEmpty">
        <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
      </ion-infinite-scroll>
    </ion-content>
    <!-- 一键领取奖励 -->
    <div class="flex-initial w-full" :style="{ marginBottom: `calc(${tabBarHeight}px + 1.3rem)`}">
      <Button class="font-weight-bold" @click="receiveHandle" :shiny="Number(rewardTotal) > 0" :disabled="!(recordList.length > 0)">{{ $t('activity.oneClickReceive') }}</Button>
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
	IonContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
} from '@ionic/vue'
import useUnclaimedLogic from '../unclaimedLogic'
import Empty from '@/components/Empty/index.vue'
import Button from '@/components/first/Button/index.vue'

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
@import "@/views/activity/history/first/styles/Unclaimed/base-index.less";

.new-skin-symbol {
  @import "@/views/activity/history/first/styles/Unclaimed/theme-style.less";
}
</style>
