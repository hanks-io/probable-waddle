<!-- 推广中心 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t('main.agent') + $t('main.center') }}</ion-title>
      </ion-toolbar>
      <!-- 顶部 segment切换栏 -->
      <div class="p-[.625rem] w-full tab-box overflow-hidden">
        <ion-segment :scrollable="true" mode="ios" :value="sideValue" @ionChange="sideChange">
          <div class="btn-wrap">
            <div v-for="item in segmentList" :key="item" class="btn-item-wrap" @click.stop="() => handleClick(item)">
              <ion-segment-button  :value="item">
                <ion-label :class="sideValue == item ? 'selected-tab' : 'base-tab'">{{ $t(`toggle.${item}`) }}</ion-label>
              </ion-segment-button>
              <HotPoint :isShow="item === 'MyAgency' && isHasCommission" classNames="top-0 right-[-0.1rem]" />
            </div>
          </div>
        </ion-segment>
      </div>
    </ion-header>
    <!-- 主要内容 -->
    <ion-content id="content">
      <ion-content id="main" :scrollY="false" :scrollX="false">
        <!-- 改用vue的动态组建 -->
        <component :is="getCurrencyComp()"></component>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useSpreadLogic } from '@/views/spread/hooks/spreadLogic'
import { IonPage, IonHeader, IonToolbar, IonLabel, IonContent, IonSegment, IonSegmentButton, IonSplitPane, IonTitle, IonIcon, IonSkeletonText } from '@ionic/vue';
import RegisterSubordinates from './components/RegisterSubordinates.vue';
import SubordinatesStats from './components/SubordinatesStats.vue';
import AgentBonusRate from './components/AgentBonusRate.vue';
import AgentNetwork from './components/AgentNetwork/index.vue';
import ReferralInfo from './components/ReferralInfo.vue';
import Performance from './components/Performance.vue';
import Commission from './components/Commission.vue';
import BackButton from '@/components/BackButton.vue';
import HotPoint from '@/components/HotPoint/index.vue';

const {
  segmentList,
  sideValue,
  loaded,
  agencyInfo,
  isHasCommission,
  isToken,
  handleClick,
  setSideValue,
  sideChange
} = useSpreadLogic();

// 根据sideValue 动态获取active组建
const getCurrencyComp = () => {
  switch (sideValue.value) {
    case 'MyAgency':             // 我的推广
      return ReferralInfo
    case 'MyPerformance':        // 我的业绩
      return Performance
    case 'MyCommission':        // 我的佣金
      return Commission
    case 'PromotionTutorial':   // 推广教程
      return AgentNetwork
    case 'CommissionRatio':     // 返佣比例
      return AgentBonusRate
    case 'DirectAccount':       // 直属开户
      return RegisterSubordinates
    case 'DirectData':          // 直属开户
      return SubordinatesStats
    default:
      return null
  }
}

</script>

<style scoped lang="less">
  @import "@/views/spread/default/styles/base-index.less";
  @import "@/views/spread/default/styles/theme-style.less";

  #spread-default-index.style();

  .blue-default {
    #spread-default-index.style(
      --color-bg-200,
      --color-bg-300,
      --theme-color-gradient-100,
      --color-bg-900,
      --text-color-white-100,
      --text-color-white-100
    );
  }

  .green-default {
    #spread-default-index.style(
      --color-bg-100,
      --color-bg-300,
      --theme-color-gradient-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-text-white-100
    );
  }

  .amber-purple {
    #spread-default-index.style(
      --color-bg-100,
      --color-bg-300,
      --theme-color-800,
      --color-bg-200,
      --text-color-light-purple-2-100,
      --text-color-white-100
    );
  }

  .forest-green {
    #spread-default-index.style(
      --color-bg-100,
      --color-bg-300,
      --theme-color-gradient-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-text-white-100
    );
  }

  .auroral-yellow {
    #spread-default-index.style(
      @spread-default-index-03:--theme-color-800,
      @spread-default-index-06:--color-text-black-100
    );
  }
</style>
