<template>
  <div class="h-full flex flex-col pt-[0.625rem] text-xs agent-bonus-rate">
    <ion-segment ref="segment" class="min-h-0  w-[22.5rem] mx-auto" mode="md" scrollable v-model="tabValue" @ionChange="tabChange" v-if="agencyConfig?.commissionType == 'gameType'">
      <ion-segment-button :value="item" v-for="item in sortList" :key="item">
        <ion-label :class="tabValue == item ? 'selected-tab' : 'base-tab'">{{$t(`sort.${item}`)}}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <ion-item class="text-[.625rem] rate-item-title w-[22.5rem] mx-auto mt-[0.5rem]">
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
        <ion-item class="text-[.625rem] w-[22.5rem] mx-auto h-[2.5rem]" :class="i%2 ? 'odd' : ''" v-for="(item, i) in rateList[tabValue]" :key="i">
          <ion-grid>
            <ion-row class="table-content-text-color">
              <ion-col size="4">{{ item.level }}</ion-col>
              <ion-col size="4">{{ formatMoneyToShow(item.needFlow) + '+' }}</ion-col>
              <ion-col size="4" class="important-text">{{ convertRatioToShow(item.rat) }}%</ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-content> 
    </div>
  </div>
  <div class="agent-bonus-rate-wrap">
    <!-- <ul class="nav flexBox">
      <li v-for="item in sortList" :key="item" :class="tabValue === item ? 'active' : ''"
        @touchend="() => tabTouch(item)">{{ $t(`sort.${item}`) }}</li>
    </ul> -->
    <ion-segment ref="segment" class="min-h-0" mode="md" scrollable v-model="tabValue" @ionChange="tabChange" v-if="agencyConfig?.commissionType == 'gameType'">
      <ion-segment-button :value="item" v-for="item in sortList" :key="item">
        <ion-label :style="`color:${tabValue == item ? '#fff' : '#6D788E'}`">{{$t(`sort.${item}`)}}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <ul class="content-title flexBox">
      <li class="content-box">{{ $t('main.level') }}</li>
      <li class="content-box">{{ $t('main.performancerequirements') }}</li>
      <li class="content-box ">{{ $t('toggle.CommissionRatio') }}</li>
    </ul>

    <ul class="content">
      <li class="flexBox" v-for="(item,index) in rateList[tabValue]" :key="index">
        <div class="content-box item"> {{ item.level }}</div>
        <div class="content-box item">{{ formatMoneyToShow(item.needFlow) + '+' }}</div>
        <div class="content-box item">{{ convertRatioToShow(item.rat) }}%</div>
      </li>
    </ul>
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
  @import "@/views/spread/default/styles/AgentBonusRate/base.less";
  @import "@/views/spread/default/styles/AgentBonusRate/theme-style.less";

  #spread-default-components-agentBonusRate.style();

  .blue-default {
    #spread-default-components-agentBonusRate.style(
      --color-bg-200,
      --color-bg-200,
      --color-line,
      --theme-color-600,
      --color-text-white-100,
      --color-text-gray-200,
      --color-bg-1200,
      --color-bg-1200,
      --color-text-white-100,
      --color-text-gray-200,
      --accent-color-yellow
    );
  }

  .green-default {
    #spread-default-components-agentBonusRate.style(
      --color-bg-200,
      --color-bg-200,
      --color-line,
      --theme-color-600,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-bg-100,
      --color-bg-100,
      --color-text-gray-100,
      --color-text-gray-200,
      --accent-color-yellow
    );
  }

  .amber-purple {
    #spread-default-components-agentBonusRate.style(
      --color-bg-200,
      --color-bg-200,
      --line-color,
      --segment-gradients-purple,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --color-bg-100,
      --color-bg-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --accent-color-yellow
    );
  }

  .forest-green {
    #spread-default-components-agentBonusRate.style(
      --color-bg-200,
      --color-bg-200,
      --color-bg-100,
      --color-line,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-bg-100,
      --color-bg-100,
      --color-text-gray-100,
      --color-text-gray-200,
      --accent-color-yellow
    );
  }
  .auroral-yellow{
    #spread-default-components-agentBonusRate.style(
      @default-components-agentBonusRate-04 :--theme-color-800
    );
}
</style>
