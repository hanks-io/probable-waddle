<!-- 活动-领取记录 -->
<template>
  <div class="flex h-full flex-col" :class="$attrs.class" :style="$attrs.style">
	<!-- 顶部筛选 奖金 -->
	<div class="text-xs flex px-4 select-scroll overflow-x-auto ">
		<!-- 日期选择 -->
		<div 
			class="mr-2.5 border rounded-[10px] flex items-center justify-between py-1 pl-2 pr-1" 
			:class="datePopoverVisible ? 'border-[--color-text-basic]' : 'border-[--color-text-second]'" 
			@click="dateSelectHandle"
		>
          <div class="flex items-center mr-2 text-[--color-text-basic]">{{ getDayStr(dateIndex) }}</div>
          <ion-icon :icon="caretDown" class="w-4 h-4 text-[--color-text-second]" :class="datePopoverVisible ? 'on' : ''"/>
          <!-- 日期选择弹出层 -->
          <ion-popover mode="md" trigger="date-history-trigger" :isOpen="datePopoverVisible" @didDismiss="datePopoverVisible = false" size="cover">
            <ion-row class="px-3 py-1.5 text-xs text-center">
              <ion-col size="3" class="px-[.3125rem]" v-for="i in 4" :key="i" @click="selectedDate(i-1)">
                <p class="flex items-center justify-center h-9 px-1 rounded-md" :class="dateIndex == i-1 ? 'on' : 'border border-[--color-border-input-basic] text-[--color-text-second]'">{{ getDayStr(i-1) }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
    	</div>
		<!-- 奖金内容 -->
    	<ion-label class="flex-1 text-end text-sm text-[--color-text-basic]">
        {{ $t('activity.rewardLabel') }}
        <span class="text-[--color-text-emphasis]">
          {{ formatMoneyToShow(rewardTotal) }}
        </span>
      </ion-label>
	</div>
    <!-- 弹出层参照 -->
    <div id="date-history-trigger" class="w-full bg-white"/>
    <!-- 表头 -->
    <ion-grid class="text-xs w-full flex-initial text-[--color-text-basic]">
      <ion-row>
        <ion-col class="text-center" size="3">{{ $t('activity.time') }}</ion-col>
        <ion-col class="text-center" size="3">{{ $t('activity.activityName') }}</ion-col>
        <ion-col class="text-center" size="3">{{ $t('activity.activityBonus') }}</ion-col>
        <ion-col class="text-center" size="3">{{ $t('activity.rewardSource') }}</ion-col>
      </ion-row>
    </ion-grid>
    <ion-content>
      <ion-grid class="text-xs w-full text-[--color-text-basic]">
        <ion-row class="py-2" :class="i%2 ? '' : 'odd'" v-for="(item, i) in recordList" :key="i">
          <ion-col class="flex items-center justify-center" size="3"><p class="w-full text-center">{{ item.time }}</p></ion-col>
          <ion-col class="flex items-center justify-center" size="3"><p class="w-full text-center">{{ item.activityName }}</p></ion-col>
          <ion-col class="flex items-center justify-center" size="3"><p class="w-full text-center text-[--color-text-emphasis]">{{ getReward(item) }}</p></ion-col>
          <ion-col class="flex items-center justify-center" size="3"><p class="w-full text-center">{{ getRewardSource(item) }}</p></ion-col>
        </ion-row>
      </ion-grid>
	  <!-- 暂无数据 -->
      <div class="empty-height h-full flex flex-col items-center justify-center text-[--color-text-second]" v-if="showEmpty">
        <div class="w-[7.5rem] h-[7.5rem] empty-bg-img"></div>
        <ion-label>{{ $t('label.noRecord') }}</ion-label>
      </div>
      <ion-infinite-scroll @ionInfinite="ionInfinite" v-if="!showEmpty">
        <ion-infinite-scroll-content v-if="recordList.length" :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
      </ion-infinite-scroll>
    </ion-content>
  </div>
</template>

<script setup lang="ts">
import { caretDown } from 'ionicons/icons';
import {
	IonRow,
	IonIcon,
	IonGrid,
	IonCol,
	IonLabel,
	IonContent,
	IonPopover,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
} from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { getRewardSource, getReward } from '../data'
import useClaimLogic from '../claimLogic';

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
  // 基础公共 less
  @import "@/views/activity/history/default/style/claimStyle/base-claim.less";
  @import "@/views/activity/history/default/style/claimStyle/theme-style.less";

  #activity-history-default-claim.style();

  .blue-default {
    #activity-history-default-claim.style(
      --color-bg-200,
      --color-bg-200,
      --theme-color-gradient-100,
      --color-text-white-100,
      --text-color-white-40,
      --color-text-white-100,
      --text-color-white-40,
      --color-text-white-100,
      --text-color-white-40,
      --color-border-600,
      --color-text-gray-200,
      --color-text-white-100,
      --accent-color-yellow,
      --color-text-white-100,
      --accent-color-yellow,
      --text-color-white-40
    );
  }

  .green-default {
    #activity-history-default-claim.style(
      --color-bg-200,
      --color-bg-200,
      --theme-color-gradient-100,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-line,
      --color-text-gray-200,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-text-gray-200
    );
  }

  .amber-purple {
    #activity-history-default-claim.style(
      --color-bg-200,
      --color-bg-200,
      --color-bg-100,
      --text-color-white-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --color-line,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --text-color-light-purple-2-100
    );
  }

  .auroral-yellow {
    #activity-history-default-claim.style(
      @history-default-claim-03: --theme-color-800,
      @history-default-claim-04: --agent-btn-color,
    );
  }
</style>
