<!-- 返水活动 -->
<template>
  <div class="w-full relative" :class="$attrs.class" :style="$attrs.style">
    <!-- 顶部返水规则 可领取金额 -->
    <div ref="rebateTop" class="flex w-full justify-between items-center py-[.625rem] leading-[1rem] text-[0.75rem]">
      <div>
        <span class=" text-[--color-text-basic]">{{ $t('viewsActivity.availableToday') }}：</span>
        <span class="text-[--color-text-emphasis]">{{ formatMoneyToShow(showAvailableTomorrow ? availableTomorrow : available) }}</span>
      </div>
      <div v-if="showAvailableTomorrow">
        <span class=" text-[--color-text-basic]">{{ $t('viewsActivity.availableTomorrow') }}：</span>
        <span class="text-[--color-text-emphasis]">{{ formatMoneyToShow(available) }}</span>
      </div>
    </div>
    <!-- 中心内容 -->
    <div class="h-full w-full flex mb-[3.5rem]">
      <!-- 左边类型切换栏 -->
      <div class="main-left w-[5.3125rem] overflow-y-auto mr-[.625rem]" :class="topHeight ? 'un-zh-left' : ''">
        <ion-segment class="flex flex-col" ref="segment" mode="ios" v-model="sideValue" @ionChange="sideChange">
          <ion-segment-button class="segment" v-for="item in segmentList" :key="item" :value="item"
            v-show="gameTypes.includes(item)">
            <ion-img class="w-9" v-if="sideValue == item" :src="`/icons/sort/${item}_on.png`" />
            <ion-icon class="text-4xl text-[--color-text-unChecked]" v-else :src="`/svg/sort/${item}_off.svg`" />
            <ion-label class="text-xs" :style="`color:${sideValue == item ? '' : 'var( --color-text-unChecked)'}`">{{ $t(`sort.${item}`)
              }}</ion-label>
          </ion-segment-button>
        </ion-segment>
        <!-- available -->
        <ion-segment-button mode="ios" class="claim text-[--color-text-btn-basic]" :class=" (showAvailableTomorrow ? availableTomorrow : available) ? 'shiny' : 'on'" @click="receiveHandle">
          <ion-label class="whitespace-normal text-sm line-clamp-2">{{ $t('toggle.claim') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button mode="ios" class="history text-[--color-text-btn-basic]" @click="emit('toRecord')">
          <ion-label class="whitespace-normal text-sm line-clamp-2">{{ $t('toggle.history') }}</ion-label>
        </ion-segment-button>
      </div>
      <!-- 右边数据展示栏 -->
      <div class="main-right w-full overflow-y-auto" :class="topHeight ? 'un-zh-left' : ''">
        <div v-for="list in rebateList" :key="list.gameType" v-show="[list.gameType, 'all'].includes(sideValue)">
          <RebateItem v-for="item in list.platformRebateList" :key="item.platformId" v-show="item.platformId"
            :gameType="list.gameType" :item="item" @click="rebateRecordHandle(item, list.gameType)" />
        </div>
      </div>
    </div>
    <!-- 规则弹窗 -->
    <RuleModal :isOpen="ruleVisible" @visibleChange="visibleChange" />
  </div>
</template>

<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom';
import { IonImg, IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/vue';
import RebateItem from './components/RebateItem.vue';
import RuleModal from './components/RuleModal.vue';
import useLogic from '../logic';

const emit = defineEmits(['toRecord']);

const props = defineProps({
  rebateId: { type: Number, required: true }
})

defineOptions({
  inheritAttrs: false
})

const {
  rebateTop,
  topHeight,
  ruleVisible,
  rebateList,
  segmentList,
  sideValue,
  available,
  gameTypes,
  ruleHandle,
  visibleChange,
  rebateRecordHandle,
  sideChange,
  receiveHandle,
  availableTomorrow,
  showAvailableTomorrow
} = useLogic({ props, emit })

</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/rebate/default/style/base-index.less";
  @import "@/views/activity/rebate/default/style/theme-style.less";

  #activity-rebate-default-index.style();

  .blue-default {
    #activity-rebate-default-index.style(
      --color-bg-200,
      --color-text-white-100,
      --color-bg-100,
      --theme-color-gradient-200,
      --color-text-white-100,
      --color-btn-gradient-claimUnable,
      --color-text-white-100,
      --theme-color-gradient-400,
      --color-text-white-100,
      --color-text-white-100,
      --accent-color-yellow,
      --accent-color-yellow
      --color-text-gray-200
    );
  }

  .green-default {
    #activity-rebate-default-index.style(
      --color-bg-200,
      --color-text-gray-100,
      --color-bg-100,
      --theme-color-gradient-200,
      --color-text-white-100,
      --theme-color-gradient-400,
      --color-text-white-40,
      --theme-color-gradient-100,
      --color-text-white-100,
      --color-text-gray-100,
      ---accent-color-yellow,
      ---accent-color-yellow,
      --color-text-gray-200
    );
  }

  .forest-green {
    #activity-rebate-default-index.style(
      @rebate-default-index-01: --mlm-bord-tab-item-select-bgc,
      @rebate-default-index-02: --color-text-gray-100,
      @rebate-default-index-07: --color-text-white-40,
      @rebate-default-index-08: --theme-color-gradient-100,
      @rebate-default-index-14: --color-bg-200
    );
  };

  .amber-purple {
    #activity-rebate-default-index.style(
      --color-bg-200,
      --text-color-light-purple-1-100,
      --color-bg-100,
      --segment-gradients-purple,
      --text-color-white-100,
      --gradients-disabled-btn-bg,
      --text-color-white-40,
      --theme-color-800,
      --text-color-white-100,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --accent-color-yellow,
      --text-color-light-purple-2-100
    );
  }

  .auroral-yellow {
    #activity-rebate-default-index.style(
      @rebate-default-index-01: --mlm-bord-tab-item-select-bgc,
      @rebate-default-index-02: --color-text-gray-100,
      @rebate-default-index-07: --color-text-white-40,
      @rebate-default-index-08: --theme-color-800,
      @rebate-default-index-14: --color-bg-200,
      @rebate-default-index-09: --agent-btn-color,
    );
  }
</style>
