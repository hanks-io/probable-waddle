<!-- 推广中心 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t('main.agent') + $t('main.center') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- 顶部 segment切换栏 -->
    <div class="px-[0.625rem] pt-[0.625rem] tab-box">
      <ion-segment :scrollable="true" mode="md" v-model="sideValue" @ionChange="sideChange">
        <ion-segment-button class="min-h-0" v-for="item in segmentList" :key="item" :value="item">
          <ion-button fill="clear" class="base-style" :class="{ 'select-style': item == sideValue }">
            {{ $t(`toggle.${item}`) }}
          </ion-button>
          <HotPoint :isShow="item === 'MyAgency' && isHasCommission" classNames="top-0 right-[0.1rem]" />
        </ion-segment-button>
      </ion-segment>
    </div>
    <!-- 主要内容 -->
    <ion-content id="main" :scrollY="false" :scrollX="false">
      <!-- 改用vue的动态组建 -->
      <component :is="getCurrencyComp()"></component>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useSpreadLogic } from '@/views/spread/hooks/spreadLogic'
import { IonPage, IonHeader, IonButton, IonToolbar, IonLabel, IonContent, IonSegment, IonSegmentButton, IonSplitPane, IonTitle, IonIcon, IonSkeletonText } from '@ionic/vue';
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
.tab-box {
  background: var(--color-bg-400);
  border-bottom: 1px solid var(--color-line);
}

/* 设置导航标签布局方式 */
ion-segment.md { 
  display: flex;
  justify-content: left;
}

ion-segment-button.md::part(indicator) {  /* 设置指示器宽度 */
  margin-left: auto;
  margin-right: auto;
}

ion-segment-button.md::part(indicator-background) { /* 设置导航标签指示器的宽度 */
  background: none;
}

ion-segment-button.md ion-button {  /* 取消导航标签的标签与指示器之间的边距 */
  text-transform: none;             /* 取消自动字母大写 */
  height: 2.625rem;
  margin: 0;
  --padding-top: 0px;
  --padding-bottom: 5px;
  --padding-start: 0;
  --padding-end: 0;
  min-width: 0;
}

ion-button.base-style {
  --color: var(--my-card-detail-color);
  font-size: var(--font-1size-14);
  white-space: nowrap;
  padding: 0 1rem;
}

ion-button.select-style {
  font-weight: bold;
  position: relative;
  white-space: nowrap;
  --color: var(--spread-segment-select-tc);
  background: var(--spread-segment-btn-bg);
  border-radius: var(--rounded-small) var(--rounded-small) 0px 0px;
}

ion-button.select-style::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: .125rem;
  background: var(--spread-segment-bottom-bc);
}

ion-segment-button::part(native) {
  padding: 0;
}

.amber-purple body div#app ion-router-outlet > div.ion-page::before {
  z-index: 10;
  pointer-events: none;
}
</style>
