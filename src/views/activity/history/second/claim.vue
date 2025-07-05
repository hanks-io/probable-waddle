<!-- 活动-领取记录 -->
<template>
  <div class="flex flex-col  h-full w-full pt-[0.3125rem] bg-300" :class="$attrs.class" :style="$attrs.style">
	  <!-- 顶部筛选 奖金 -->
	  <div class="flex-between ">
	  	<!-- 日期选择 -->
      <div class="mr-2.5 flexBox select-box rounded-small h-[2rem] px-[0.625rem]" @click="dateSelectHandle">
        <div class="report-selected mr-[0.5rem]">
          <span class="date-tips font-weight-medium">{{ $t('activity.selectDate') }}: </span> {{ getDayStr(dateIndex) }}
        </div>
        <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="datePopoverVisible ? 'on' : ''"/>
        <!-- 日期选择弹出层 -->
        <ion-popover mode="md" trigger="date-history-trigger" :isOpen="datePopoverVisible" @didDismiss="datePopoverVisible = false" size="cover">
          <ion-row class="w-[7.5rem] overflow-hidden rounded-middle mt-[0.625rem]">
            <ion-col size="12" class="p-0" v-for="i in 4" :key="i" @click="selectedDate(i-1)">
              <p class="flex-center small-text-white h-[2.25rem]" :class="dateIndex == i-1 ? 'record-seleceted-item' : 'record-selecet-item'">{{ getDayStr(i-1) }}</p>
            </ion-col>
          </ion-row>
        </ion-popover>
      </div>
	  	<!-- 奖金内容 -->
      <div class="height-text-white">
        <span class="color-text-100 font-weight-regular">{{ $t('activity.rewardLabel') }}:</span>
        <span class="color-text-currency">{{ formatMoneyToShow(rewardTotal) }}</span>
      </div>
	  </div>
    <!-- 弹出层参照 -->
    <div id="date-history-trigger" class="w-full"/>
    <!-- 表头 -->
    <div class="mt-[1.8125rem]">
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
      <ion-grid>
        <ion-row class="small-text-white table-item-bg table-item" v-for="(item, i) in recordList" :key="i">
          <ion-col class="flex-center" size="3"><p class="w-full text-center">{{ item.time }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center">{{ item.activityName }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center text-[--accent-color-yellow]">{{ getReward(item) }}</p></ion-col>
          <ion-col class="flex-center" size="3"><p class="w-full text-center">{{ getRewardSource(item) }}</p></ion-col>
        </ion-row>
      </ion-grid>
	    <!-- 暂无数据 -->
      <div class="empty-height h-full flex-center" v-if="showEmpty">
        <Empty />
      </div>
      <ion-infinite-scroll @ionInfinite="ionInfinite" v-if="!showEmpty">
        <ion-infinite-scroll-content v-if="recordList.length" :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
      </ion-infinite-scroll>
    </ion-content>
  </div>
</template>

<script setup lang="ts">
import {
	IonRow,
	IonIcon,
	IonGrid,
	IonCol,
	IonContent,
	IonPopover,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
} from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { getRewardSource, getReward } from '../data'
import useClaimLogic from '../claimLogic';
import Empty from '@/components/Empty/index.vue'

defineOptions({
  inheritAttrs: false
})

const {
	dateIndex,
	rewardTotal,
	loadMore,
	recordList,
	datePopoverVisible,
	showEmpty,
	ionInfinite,
	dateSelectHandle,
	selectedDate,
	getDayStr,
} = useClaimLogic()

</script>

<style scoped lang="less">
ion-infinite-scroll-content { /* 设置触底加载更多样式 */
  min-height: .625rem;
  font-size: var(--font-size-12);
  color: var(--color-text-40);
}

ion-popover {
  left: 1.75rem;
  --width: 7.5rem !important;
  --backdrop-opacity: 0;
  --box-shadow: none;
}

ion-icon {
  transition: transform .1s linear;
}

ion-icon.on {
  transform: rotate(180deg);
}

.empty-height {
	height: calc(100% - 3.5rem);
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

.select-box {
  background: var(--spread-commission-select-box-bg);
  ion-icon {
    color: var(--color-report-select-icon);
  }
}

.date-tips {
  color: var(--my-card-detail-color);
}

.table-item-color {
  color: var(--my-card-detail-color) !important;
}
</style>
