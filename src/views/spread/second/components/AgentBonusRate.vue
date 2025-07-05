<template>
  <div class="h-full flex flex-col text-xs bg-300 py-[0.75rem] px-[0.625rem]">
    <div class="w-full">
      <ion-segment 
        ref="segment" 
        class="min-h-0 w-[22.5rem] mx-auto" 
        mode="md" 
        scrollable 
        v-model="tabValue" 
        @ionChange="tabChange" 
        v-if="agencyConfig?.commissionType == 'gameType'"
      >
        <ion-segment-button :value="item" v-for="item in sortList" :key="item">
          <ion-label :class="tabValue == item ? 'selected-item' : 'select-item'">{{$t(`sort.${item}`)}}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
    <ion-item class="table-title small-text-white font-weight-bold w-[22.5rem] mx-auto mt-[0.5rem]">
      <ion-grid>
        <ion-row>
          <ion-col size="4">{{ $t('main.level') }}</ion-col>
          <ion-col size="4">{{ $t('main.performancerequirements') }}</ion-col>
          <ion-col size="4">{{ $t('toggle.CommissionRatio') }}</ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
    <div class="flex-1">
      <ion-content>
        <ion-item class="small-text-white w-[22.5rem] mx-auto h-[2.5rem]" :class="i%2 ? 'odd' : ''" v-for="(item, i) in rateList[tabValue]" :key="i">
          <ion-grid>
            <ion-row>
              <ion-col size="4">{{ item.level }}</ion-col>
              <ion-col size="4">{{ formatMoneyToShow(item.needFlow) + '+' }}</ion-col>
              <ion-col size="4" class="color-text-currency">{{ convertRatioToShow(item.rat) }}%</ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-content> 
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyToShow, convertRatioToShow } from '@/utils/custom'
import { useAgentBonusRateLogic } from '@/views/spread/hooks/agentBonusRateLogic'
import { IonItem, IonRow, IonCol, IonGrid, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';

const {
  tabValue,
  sortList,
  rateList,
  agencyConfig,
  isToken,
  tabChange,
  tabTouch
} = useAgentBonusRateLogic();

</script>

<style scoped lang="less">
ion-segment-button.md::part(indicator-background) { /* 设置导航标签指示器的宽度 */
  background: var(--theme-color-800);
  height: 1px;
}

ion-segment {
  border-bottom: 1px solid var(--spread-share-box-border-color);
}

ion-segment-button {
  /* 设置导航标签元素样式) */
  --padding-start: 0;
  --padding-end: 0;
  text-transform: capitalize;
  /* 文本每个单词头部自动大写*/
  min-width: 0;
  min-height: 0;
  /* 与ion-segment设置最小高度才能真正取消标签与指示器之间的边距 */
  margin-right: 10px;
  margin-top: 0;
  margin-bottom: 0;
}

ion-segment-button ion-button {
  /* 取消导航标签的标签与指示器之间的边距 */
  min-width: 0;
}

ion-segment-button ion-label {
  font-size: .75rem !important;
  /* 自定义颜色需要设置优先级,或使用行内样式 */
  margin-top: .375rem;
  margin-bottom: .375rem;
}

ion-label.selected-item {
  color: var(--color-text-100);
}

ion-label.select-item {
  color: var(--spread-bonus-rate-segment-item-color);
}

ion-content {
  --background: transperent;
}

ion-item {
  --background: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-end: 0;
  --inner-border-width: 0px;
  --min-height: 2.25rem;
}

ion-item.table-title {
  --background: var(--color-bg-100);
  border-radius: var(--rounded-small);
}

ion-item.odd {
  --background: var(--color-bg-500);
  border-radius: var(--rounded-small);
}

ion-grid {
  --ion-grid-padding: 0;
}

ion-col {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-light-purple-1-100);
}

ion-col.color-text-currency {
  color: var(--color-currency);
}
</style>
