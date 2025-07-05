<!-- 推广中心 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="$t('main.agent') + $t('main.center')" />
    <!-- 顶部 segment切换栏 -->
    <div class="px-[0.625rem] pt-2 tab-box">
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
import { IonPage, IonButton, IonContent, IonSegment, IonSegmentButton } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useSpreadLogic } from '@/views/spread/hooks/spreadLogic'
import { SpreadSubPageNames } from '@/theme/templateConfigs/spread'
import { getTheme } from '@/theme/hooks'


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



const subPageComponentMap = {
  'MyAgency': {
    'style_1': () => import('@/views/spread/first/components/referralInfo/style_1/ReferralInfo.vue'),
    'style_18': () => import('@/views/spread/first/components/referralInfo/style_18/ReferralInfo.vue'),
  },
  'MyPerformance': {
    'style_1': () => import('@/views/spread/first/components/performance/style_1/Performance.vue'),
  },
  'MyCommission': {
    'style_1': () => import('@/views/spread/first/components/commission/style_1/Commission.vue'),
  },
  'PromotionTutorial': {
    'style_1': () => import('@/views/spread/first/components/agentNetworkNew/style_1/index.vue'),
  },
  'CommissionRatio': {
    'style_1': () => import('@/views/spread/first/components/agentBonusRate/style_1/AgentBonusRate.vue'),
    'style_18': () => import('@/views/spread/first/components/agentBonusRate/style_18/AgentBonusRate.vue'),
  },
  'DirectAccount': {
    'style_1': () => import('@/views/spread/first/components/registerSubordinates/style_1/RegisterSubordinates.vue'),
  },
  'DirectData': {
    'style_1': () => import('@/views/spread/first/components/subordinatesStats/style_1/SubordinatesStats.vue'),
  },
}

// 根据sideValue 动态获取active组建
const getCurrencyComp = () => {
  const { spreadConfig } = getTheme()
  const pageName = sideValue.value as SpreadSubPageNames;
  if (!pageName || !subPageComponentMap[pageName]) {
    return null;
  }
  const style = spreadConfig[pageName]?.template || 'style_1';
  const componentMap = subPageComponentMap[pageName];
  if (componentMap && componentMap[style]) {
    return markRaw(defineAsyncComponent(componentMap[style])) as unknown as ComponentPublicInstance;

  }
}

</script>

<style scoped lang="less">
@import '@/views/spread/first/styles/base-index.less';

.new-skin-symbol {
  @import '@/views/spread/first/styles/theme-style.less';
}
</style>
