<!-- 活动-待领取 -->
<template>
  <div class="flex flex-col w-full h-full pt-[0.3125rem] bg-300">
    <!--搜索栏 -->
    <div class="flex-between mb-[1.8125rem]">
	  	<!-- 日期选择 -->
      <div></div>
	  	<!-- 奖金内容 -->
      <div class="height-text-white">
        <span class="color-text-100 font-weight-regular">{{ $t('activity.rewardLabel') }}:</span>
        <span class="color-text-currency">{{ formatMoneyToShow(parseFloat(rewardTotal)) }}</span>
      </div>
	  </div>
    <!-- 表头 -->
    <div>
      <ion-grid class="w-full table-title-bg">
        <ion-row class="small-text-white table-item-color font-weight-bold">
          <ion-col class="flex-center" size="3">{{ $t('activity.time') }}</ion-col>
          <ion-col class="flex-center" size="3">{{ $t('activity.activityName') }}</ion-col>
          <ion-col class="text-center" size="3">{{ $t('activity.activityBonus') }}</ion-col>
          <ion-col class="flex-center" size="3">{{ $t('activity.rewardSource') }}</ion-col>
        </ion-row>
      </ion-grid>
    </div>
    <ion-content>
      <ion-grid class="w-full text-xs" v-if="!showEmpty">
        <ion-row class="small-text-white table-item-bg table-item" v-for="(item, i) in recordList" :key="item.time?.toString()">
          <ion-col class="flex-center" size="3"><p class="w-full text-center">{{ item.time }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center">{{ item.activityName }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center color-text-currency">{{ getReward(item) }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center">{{ getRewardSource(item) }}</p></ion-col>
        </ion-row>
      </ion-grid>
      <!-- 暂无数据 -->
      <div class="h-full flex-center" v-if="showEmpty">
        <Empty />
      </div>
      <ion-infinite-scroll @ionInfinite="ionInfinite" v-if="!showEmpty">
        <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
      </ion-infinite-scroll>
    </ion-content>
    <!-- 一键领取奖励 -->
    <div class="flex flex-col justify-end h-[3rem]" :style="{ marginBottom: `calc(${tabBarHeight}px + 1.3rem)`}" :class="(recordList.length > 0) ? '' :'disabledBtn'">
      <div class="btn rounded-[0.875rem] overflow-hidden h-[3rem]">
         <Button class="font-weight-bold" @click="receiveHandle" height="3rem" background="transpant" :shiny="Number(rewardTotal) > 0" >{{ $t('activity.oneClickReceive') }}</Button>
      </div>
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
import Button from '@/components/second/Button/index.vue'

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

<style scoped>
ion-infinite-scroll {
  min-height: 4.375rem;
}

ion-infinite-scroll-content { /* 设置触底加载更多样式 */
  min-height: .625rem;
  font-size: var(--font-size-12);
  color: var(--color-text-40);
}

ion-grid.table-title-bg {
  background: var(--color-bg-100);
  border-radius: var(--rounded-middle) var(--rounded-middle) 0 0;
}

ion-grid ion-row.table-item-bg {
  min-height: 2.625rem;
}

ion-grid ion-row.table-item-bg:nth-child(even) {
  background: var(--color-bg-400);
}

ion-grid ion-row.table-item {
  color: var(--color-text-80) !important;
}

.table-item-color {
  color: var(--my-card-detail-color) !important;
}

.btn {
    background: var(--color-gradients-btn);
    box-shadow: var(--color-shadow-bottom-btn);
}

.btn:active {
    background: var(--color-gradients-btn);
    box-shadow: none;
    height: 2.8rem;
}

.disabledBtn {
    opacity: 0.4;
    pointer-events: none;
}
</style>
