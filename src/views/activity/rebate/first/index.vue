<!-- 返水活动 -->
<template>
  <div class="warpper" :class="$attrs.class" :style="$attrs.style">
    <!-- 顶部返水规则 可领取金额 -->
    <div ref="rebateTop" class="top-reward">
      <div>
        <span class="title">{{ $t('viewsActivity.availableToday') }}：</span>
        <span class="reward">{{ formatMoneyToShow(showAvailableTomorrow ? availableTomorrow : available) }}</span>
      </div>
      <div v-if="showAvailableTomorrow">
        <span class="title">{{ $t('viewsActivity.availableTomorrow') }}：</span>
        <span class="reward">{{ formatMoneyToShow(available) }}</span>
      </div>
    </div>
    <!-- 中心内容 -->
    <div class="content">
      <!-- 左边类型切换栏 -->
      <div class="main-left" :class="topHeight ? 'un-zh-left' : ''">
        <ion-segment ref="segment" mode="ios" v-model="sideValue" @ionChange="sideChange">
          <ion-segment-button class="segment" v-for="item in segmentList" :key="item" :value="item"
            v-show="gameTypes.includes(item)">
            <ion-icon :class="{ check: sideValue === item }" :src="`/first/svg/sort/${item}.svg`" />
            <ion-label :class="{ check: sideValue === item }">{{ $t(`sort.${item}`)
              }}</ion-label>
          </ion-segment-button>
        </ion-segment>
         <!-- available -->
        <Button class="btn-claim" height="1.625rem" :shiny="!!(showAvailableTomorrow ? availableTomorrow : available)" :disabled="!(showAvailableTomorrow ? availableTomorrow : available)" @click="receiveHandle">
          {{ $t('toggle.claim') }}
        </Button>
        <Button class="btn-history" height="1.625rem" background="var(--color-bg-100)" @click="emit('toRecord')"
        :style="{'--button-text-color': 'var(--color-text-40)'}">
          {{ $t('toggle.history') }}
        </Button>
      </div>
      <!-- 右边数据展示栏 -->
      <div class="main-right" :class="topHeight ? 'un-zh-left' : ''">
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

<style scoped lang="less">
.warpper {
  width: 100%;
  position: relative;
}

.top-reward {
  width: 100%;
  .flex-between();
  padding: .625rem 0;
  font-size: var(--ep-font-size-s, 0.75rem);
  line-height: 1.5;
  .title {
    color: var(--ep-color-text-default, var(--color-text-40));
  }
  .reward {
    color: var(--ep-color-text-warning, var(--color-text-currency));
  }
}

.content {
  width: 100%;
  height: 100%;
  margin-bottom: 3.5rem;
  display: flex;
}

ion-segment {
  --background: transparent;
  display: flex;
  flex-direction: column;
}

ion-segment-button.segment {
  min-height: 3.75rem;
  ion-icon {
    font-size: 2.25rem;
    line-height: 2.5rem;
    color: var(--ep-color-text-weaker, var(--color-text-20));
  }
  ion-icon.check {
    color: var(--ep-color-text-selected, var(--color-primary-800));
  }
  ion-label {
    color: var(--ep-color-text-weaker, var(--color-text-40));
    font-weight: var(--ep-font-weight-regular, 400);
    font-size: var(--ep-font-size-s, 0.75rem);
  }
  ion-label.check {
    color: var(--ep-color-text-default, var(--color-text-100));
    font-weight: var(--ep-font-weight-medium, 400);
  }
}

ion-segment-button.ios {
  --background: var(--ep-color-background-fill-surface-raised-L1, var(--color-bg-200));
  --indicator-color: var(--ep-color-background-fill-surface-raised-L2, var(--color-bg-100));
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0.125rem;
  --padding-bottom: 0.125rem;
  margin-top: 0;
  margin-bottom: 0.625rem;
  text-transform: capitalize;
  min-width: 0;
}

.main-left {
  width: 5.3125rem;
  height: calc(100% - 33.2px);
  overflow-y: auto;
  margin-right: .625rem;

  .btn-claim, .btn-history {
    height: 1.25rem;
    margin-bottom: 0.75rem;
    font-size: var(--ep-font-size-s, 0.75rem);
    line-height: 1.5;
  }
}

.main-right {
  width: 100%;
  height: calc(100% - 33.2px);
  overflow-y: auto;
}

.un-zh-left {
  height: calc(100% - 50px);
}
</style>
