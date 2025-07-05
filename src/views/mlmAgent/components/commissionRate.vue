<!-- 多级分销 佣金比例表 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('mlmAgent.commissionRate')" />
    <ion-content>
      <!-- 选择游戏类型 -->
      <div class="game-type px-[0.625rem]" v-if="isShowGameType">
        <ion-segment ref="segment" scrollable mode="md" class="game-type-se" v-model="currentGameType">
          <ion-segment-button 
            class="game-type-btn" 
            :class="{'second-game-type': isSecondSkin }"
            :value="item.value" 
            v-for="(item,index) in gameTypeList" 
            :key="index" 
            @click="selectAgmeType(item.value)"
          >
            <ion-button fill="clear" class="base-style" :class="{ 'select-style': currentGameType == item.value }">
              {{ item.name }}
            </ion-button>
          </ion-segment-button>
        </ion-segment>
      </div>
      <!-- 顶部图片 -->
      <div class="top-img w-full"></div>
      <!-- 代理级别 segment -->
      <div class="level">
        <ion-segment ref="segment" class="level-agent-se" scrollable v-model="currentAgentLevel">
          <ion-segment-button 
            class="level-agent" 
            v-for="(item,index) in agentLevelList" 
            :key="index" 
            :value="item.level" 
            @click="selectAgentLevel(item.level)"
          >
            <div class="item" :class="{ 'level-icon': currentAgentLevel == item.level }">
              <img class="current-level" :src="agentStore.getMlmAgentLevelInfo(item.level,'icon')" />
            </div>
            <ion-label>LV{{ item.level }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
      <!-- 代理级别比例信息 -->
      <div class="commission-rate-mes px-[0.375rem]">
        <div class="rate-info">
          <div class="icon">
            <img class="w-[2.070625rem] h-[2.070625rem]" :src="agentStore.getMlmAgentLevelInfo(currentAgentLevel,'icon')" />
            <span>LV{{ currentAgentLevel }}</span>
          </div>
          <div class="rate-title">
            <span>{{ $t('mlmAgent.agentLevel') }}</span>
            <span>LV{{ currentAgentLevel }}</span>
          </div>
          <!-- 代理等级比例信息 -->
          <div class="rate-box py-[0.25rem] px-[0.5rem]">
            <div class="rate-item" v-for="(item,index) in agentLevelRateInfo" :key="index">
              <span class="rate-item-left">{{ $t('activity.vip5') }} {{ item.level }}</span>
              <span class="rate-item-right">{{ `${(item.rat)}%` }}</span>
            </div>
          </div>
          <!-- 底部说明 -->
          <div class="rate-footer-tips w-full mt-[1.25rem]">
            {{ $t('mlmAgent.rateFooterTips') }}
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { useAgentStore } from '@/store/agent';
import { useCommissionRateLogic } from '../hooks/commissionRateLogic'
import { IonPage, IonContent, IonSegment, IonSegmentButton, IonLabel, IonButton } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'

const agentStore = useAgentStore();   // 代理store

// 当前是second皮肤
const isSecondSkin = computed(() => getTheme().skin == 'second');

// 代理等级外圈图片
const currentAgentLevelPng = computed(() => {
  const data = getTheme();
  const skin = data.skin == 'second' ? 'second' : 'first'
  return `url('/${skin}/agent/${data.theme}-rate-level-bg.png')`
})

const { 
  gameTypeList,
  currentGameType,
  currentAgentLevel,
  agentLevelList,
  agentLevelRateInfo,
  isShowGameType,
  selectAgentLevel,
  selectAgmeType
} = useCommissionRateLogic();
</script>

<style scoped lang="less">
@import '@/views/mlmAgent/styles/CommissionRate/base-index.less';
@import '@/views/mlmAgent/styles/CommissionRate/theme-style.less';

.level-icon {
  background: v-bind(currentAgentLevelPng) no-repeat;
  background-size: 100% 100%;
}

#mlmAgent-components-commissionRate-index.style();

.yellow-dark,
.green-dark,
.purple-light,
.amber-purple,
.blue-default,
.forest-green,
.green-default,
.auroral-yellow {
  #mlmAgent-components-commissionRate-index.style(
    --mlm-toolbar-bg-color,
    --color-bg-300,
    --mlm-rate-level-agent-segment-select-color,
    --mlm-level-agent-selected-text-color,
    --color-bg-300,
    --mlm-agent-rate-info-bgc,
    --mlm-agent-my-agency-textc,
    --color-text-40,
    --color-bg-300,
    --color-line,
    --mlm-agent-my-agency-textc,
    --mlm-rate-item-right-text-color,
    --mlm-agent-report-icon-color,
    --mlm-commission-rate-game-type-bg,
    --mlm-agent-report-icon-color,
    --mlm-segment-select-text-color,
    --mlm-segment-selected-text-color,
    --mlm-segment-indicator-bg-color,
  );
}

.new-skin-symbol {
  #mlmAgent-components-commissionRate-index.style(
    --ep-color-background-fill-top-nav-secondary,
    --ep-color-background-fill-body-default,
    --ep-color-text-weaker,
    --ep-color-text-selected,
    --ep-color-background-fill-body-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-default,
    --ep-color-text-default,
    --ep-color-background-fill-body-default,
    --ep-color-border-default,
    --ep-color-text-default,
    --ep-color-text-warning,
    --ep-color-text-weaker,
    --ep-color-background-fill-surface-lowered,
    --ep-color-text-weaker,
    --ep-color-text-weaker,
    --ep-color-text-selected,
    --ep-color-border-selected
  );
}

.new-skin-symbol {
  @import '@/views/mlmAgent/styles/CommissionRate/index-phantom.less';
}
</style>
