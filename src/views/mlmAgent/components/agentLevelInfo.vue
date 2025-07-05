<!-- 多级分销 代理级别 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('mlmAgent.agentLevel')" />
    <ion-content>
      <!-- 顶部图片 -->
      <div class="top-img"></div>
      <!-- 代理级别信息 -->
      <div class="agent-level-main">
        <div 
          class="agent-level-item"
          :class="{ 'lase-item': index === agentLevelInfo.length - 1 }"
          v-for="(item,index) in agentLevelInfo" 
          :key="index"
        >
          <!-- VIP等级图标 -->
          <div class="pl-[0.25rem] flex mt-[-1.375rem]">
            <div class="item-level-border relative">
              <img class="current-level" :src="agentStore.getMlmAgentLevelInfo(item.level,'icon')" alt="">
            </div>
            <div class="level-tips h-full font-weight-bold">LV{{ item.level }}</div>
          </div>
          <div class="item-level-bottom">
            <div 
              class="level-item" 
              v-for="(conditionItem,index) in item.conditionList" 
              :key="index"
            >
              <span class="level-item-left">{{ $t(`mlmAgent.${conditionItem.name}`) }}</span>
              <span v-if="conditionItem.name == 'membersCount'" class="level-item-right">{{ conditionItem.value }}</span>
              <span v-else class="level-item-right">{{ formatMoneyToShow(conditionItem.value) }}</span>
            </div>
          </div>
        </div>
        <!-- 代理级别说明 -->
        <div class="agent-description">
          <div class="title">{{ $t('mlmAgent.agentLevelTips') }}</div>
          <div class="description-content" v-for="(item,index) in agentLevelRules" :key="index">
            <div class="point"></div>
            {{ item }}
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
import { formatMoneyToShow } from '@/utils/custom'
import { useAgentLevelInfoLogic } from '../hooks/agentLevelInfoLogic'
import { IonPage, IonContent } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'


const agentStore = useAgentStore();   // 代理store

// 代理等级外圈图片
const currentAgentLevelPng = computed(() => {
  const data = getTheme();
  const skin = data.skin == 'second' ? 'second' : 'first'
  return `url('/${skin}/agent/${data.theme}-agent-level-bg.png')`
})

const {
  agentLevelInfo,
  agentLevelRules
} = useAgentLevelInfoLogic();
</script>

<style scoped lang="less">
@import '@/views/mlmAgent/styles/AgentLevelInfo/base-index.less';
@import '@/views/mlmAgent/styles/AgentLevelInfo/theme-style.less';

#mlmAgent-components-agentLevelInfo-index.style();

.item-level-border {
  background: v-bind(currentAgentLevelPng) no-repeat;
  background-size: 100% 100%;
}

.yellow-dark,
.green-dark,
.purple-light,
.amber-purple,
.blue-default,
.forest-green,
.green-default,
.auroral-yellow {
  #mlmAgent-components-agentLevelInfo-index.style(
    --mlm-toolbar-bg-color,
    --mlm-agent-level-item-bgc,
    --mlm-agent-my-agency-textc,
    --color-bg-300,
    --color-line,
    --color-text-40,
    --mlm-agent-my-agency-textc,
    --mlm-rate-item-right-text-color,
    --mlm-description-content-title-color,
    --mlm-agent-report-icon-color,
    --mlm-agent-report-icon-color
  );
}

.auroral-yellow {
  #mlmAgent-components-agentLevelInfo-index.style(
    @mlmAgent-components-agentLevelInfo-index-03: --color-text-white-100;
    @mlmAgent-components-agentLevelInfo-index-07: --color-text-white-100;
    @mlmAgent-components-agentLevelInfo-index-09: --color-text-white-100;
  )
}

.new-skin-symbol {
  #mlmAgent-components-agentLevelInfo-index.style(
    --ep-color-background-fill-top-nav-secondary,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-default,
    --ep-color-background-fill-body-default,
    --ep-color-border-default,
    --ep-color-text-weaker,
    --ep-color-text-default,
    --ep-color-text-warning,
    --ep-color-text-default,
    --ep-color-text-weaker,
    --ep-color-text-weaker
  )
}

.new-skin-symbol {
  @import '@/views/mlmAgent/styles/AgentLevelInfo/index-phantom.less';
}
</style>
