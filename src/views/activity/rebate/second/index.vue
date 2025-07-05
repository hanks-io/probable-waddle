<!-- 返水活动 -->
<template>
  <div class="w-full relative" :class="$attrs.class" :style="$attrs.style">
    <!-- 顶部返水规则 可领取金额 -->
    <div ref="rebateTop" class="flex w-full justify-between items-center py-[.625rem] leading-[1rem] text-[0.75rem]">
      <div>
        <span class="text-[--color-text-first]">{{ $t('viewsActivity.availableToday') }}：</span>
        <span class=" text-[--color-currency]">{{ formatMoneyToShow(showAvailableTomorrow ? availableTomorrow : available) }}</span>
      </div>
      <div v-if="showAvailableTomorrow">
        <span class="text-[--color-text-first]">{{ $t('viewsActivity.availableTomorrow') }}：</span>
        <span class=" text-[--color-currency]">{{ formatMoneyToShow(available) }}</span>
      </div>
    </div>
    <!-- 中心内容 -->
    <div class="h-full w-full flex mb-[3.5rem]">
      <!-- 左边类型切换栏 -->
      <div class="main-left w-[4.375rem] overflow-y-auto mr-[1rem]" :class="topHeight ? 'un-zh-left' : ''">
        <ion-segment class="flex flex-col" ref="segment" mode="ios" v-model="sideValue" @ionChange="sideChange">
          <ion-segment-button class="segment" v-for="item in segmentList" :key="item" :value="item"
            v-show="gameTypes.includes(item)">
            <ion-icon class=" w-[2rem] h-[2rem] mb-[0.1944rem]" :class="sideValue === item ? 'text-[--color-text-first]': 'text-[--color-text-second]'" :src="`/first/svg/sort/${item}.svg`" />
            <ion-label class="text-xs font-semibold" :class="sideValue == item ? 'text-[--color-text-first]' : 'text-[--color-text-second]'">{{ $t(`sort.${item}`)
              }}</ion-label>
          </ion-segment-button>
        </ion-segment>
         <!-- available -->
        <Button class="h-5 mb-3 text-xs" height="1.625rem" :shiny="!!(showAvailableTomorrow ? availableTomorrow : available)" :disabled="!(showAvailableTomorrow ? availableTomorrow : available)" @click="receiveHandle">
          {{ $t('toggle.claim') }}
        </Button>
        <Button class="h-5 mb-3 text-xs" height="1.625rem" background="var(--color-bg-third)" @click="emit('toRecord')"
        :style="{'--button-text-color': 'var(--color-text-history-unable-btn)'}">
          {{ $t('toggle.history') }}
        </Button>
      </div>
      <!-- 右边数据展示栏 -->
      <div class="main-right flex-1 overflow-y-auto" :class="topHeight ? 'un-zh-left' : ''">
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
import { IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/vue';
import Button from '@/components/first/Button/index.vue'
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

<style scoped>
ion-segment {
  --background: transparent;
}

ion-segment-button.segment {
  min-height: 4.375rem;
  --border-radius: 0.625rem;
}

ion-segment-button.ios {
  --background: var(--color-bg-segment-ios);
  --indicator-color: var(--color-bg-third);
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 1rem;
  text-transform: capitalize;
  min-width: 0;
}

.main-left,
.main-right {
  height: calc(100% - 33.2px);
}

.main-content {
  margin-top: 3.125rem;
}

.un-zh-left {
  height: calc(100% - 50px);
}
</style>
