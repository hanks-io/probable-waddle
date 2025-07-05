<template>
  <div class="h-full flex flex-col agent-bonus-rate-info py-[0.75rem] px-[0.625rem]">
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
    <ion-item class="spread-table-title w-[22.5rem] mx-auto mt-[0.5rem]">
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
        <ion-item class="spread-table-item w-[22.5rem] mx-auto h-[2.5rem]" :class="i%2 ? 'odd' : ''" v-for="(item, i) in rateList[tabValue]" :key="i">
          <ion-grid>
            <ion-row>
              <ion-col size="4">{{ item.level }}</ion-col>
              <ion-col size="4">{{ formatMoneyToShow(item.needFlow) + '+' }}</ion-col>
              <ion-col size="4" class="spread-bonus-rate-amount">{{ convertRatioToShow(item.rat) }}%</ion-col>
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
@import '@/views/spread/first/styles/AgentBonusRate/base-index.less';

.new-skin-symbol {
  @import '@/views/spread/first/styles/AgentBonusRate/theme-style.less';
}
</style>
