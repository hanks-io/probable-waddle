<template>
  <div class="wrapper">
    <div class="main-left" v-if="agencyConfig?.commissionType == 'gameType'">
      <ion-segment ref="segment" mode="ios" v-model="tabValue" @ionChange="tabChange">
        <ion-segment-button class="segment" v-for="item in sortList" :key="item" :value="item">
          <ion-icon :class="{ check: tabValue === item }" :src="`/first/svg/sort/${item}.svg`" />
          <ion-label :class="{ check: tabValue === item }">{{ $t(`sort.${item}`)}}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
    <div class="main-right">
      <div class="table-title">
        <ion-grid>
          <ion-row>
            <ion-col size="4">{{ $t('main.level') }}</ion-col>
            <ion-col size="4">{{ $t('main.performancerequirements') }}</ion-col>
            <ion-col size="4">{{ $t('toggle.CommissionRatio') }}</ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <ion-content>
        <div class="table-item" :class="i%2 ? 'even' : ''" v-for="(item, i) in rateList[tabValue]" :key="i">
          <ion-grid>
            <ion-row>
              <ion-col size="4">{{ item.level }}</ion-col>
              <ion-col size="4">{{ formatMoneyToShow(item.needFlow) + '+' }}</ion-col>
              <ion-col size="4" class="bonus-rate-amount">{{ convertRatioToShow(item.rat) }}%</ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </ion-content> 
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyToShow, convertRatioToShow } from '@/utils/custom'
import { useAgentBonusRateLogic } from '@/views/spread/hooks/agentBonusRateLogic'
import { IonRow, IonCol, IonGrid, IonContent, IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/vue';

const {
  tabValue,
  sortList,
  rateList,
  tabChange,
  agencyConfig,
} = useAgentBonusRateLogic();

</script>

<style scoped lang="less">

.wrapper {
  height: 100%;
  display: flex;
  padding: 1.3125rem 0.75rem;

  .main-left {
    min-width: 4.375rem;
    margin-right: 0.6875rem;
  }

  .main-right {
    width: 100%;
    color: var(--ep-color-text-default, #FFF);
    font-size: var(--ep-font-size-s, 0.75rem);
    text-align: center;
    line-height: 1.5;
    .table-title {
      background: var(--ep-color-background-fill-surface-raised-L2, #1D2A55);
      border-top-left-radius: var(--ep-border-radius-m, 0.375rem);
      border-top-right-radius: var(--ep-border-radius-m, 0.375rem);
      font-weight: var(--ep-font-weight-bold, 700);
      ion-col {
        .flex-center();
      }
    }
    .table-item {
      height: 2.625rem;
      font-weight: var(--ep-font-weight-regular, 400);
      color: var(--ep-color-text-default, #FFF);
      .flex-center();
    }
    .table-item.even {
      background: var(--ep-color-background-fill-surface-lowered, #101B3C);
    }
    .bonus-rate-amount {
      color: var(--ep-color-text-warning, #FC974C);
      font-weight: var(--ep-font-weight-bold, 700);
    }
  }
}

ion-segment {
  --background: transparent;
  display: flex;
  flex-direction: column;
}

ion-segment-button.segment {
  ion-icon {
    font-size: 2rem;
    line-height: 2rem;
    color: var(--ep-color-text-weaker);
  }
  ion-icon.check {
    color: var(--ep-color-text-selected);
  }
  ion-label {
    color: var(--ep-color-text-weaker);
    font-weight: var(--ep-font-weight-regular);
    font-size: var(--ep-font-size-s);
  }
  ion-label.check {
    color: var(--ep-color-text-default);
    font-weight: var(--ep-font-weight-medium);
  }
}

ion-segment-button.ios {
  width: 4.375rem;
  height: 4.375rem;
  --background: var(--ep-color-background-fill-surface-raised-L1);
  --indicator-color: var(--ep-color-background-fill-surface-raised-L2);
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --border-radius: var(--ep-border-radius-m, 0.375rem);
  margin-top: 0;
  margin-right: 0;
  margin-bottom: 1rem;
  text-transform: capitalize;
  min-width: 0;
}
</style>
