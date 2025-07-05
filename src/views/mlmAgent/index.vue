<!-- 多级分销 推广中心 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="$t('main.agent') + $t('main.center')">
      <template #end>
        <ion-icon slot="end" v-show="isShowLeaderBoard" class="text-[3.125rem]" @click="leaderBoardClick" src="/first/svg/agent/leaderboard-icon.svg" />
      </template>
    </NavigationBar>
    <!-- 内容 -->
    <ion-content>
      <!-- 代理等级信息 -->
      <div class="agent-level w-full h-[12.0094rem] flex">
        <div class="agent-level-left">
          <div class="level-icon relative mb-[0.375rem]">
            <img class="current-level" :src="agentStore.getMlmAgentLevelInfo(agencyInfo.currentLevel,'icon')" alt="">
          </div>
          <div class="level-tips">LV{{ agencyInfo.currentLevel }}</div>
        </div>
        <div class="agent-level-right">
          <div class="top">{{ $t('date.yesterday') }} {{ $t('spread.totalCommission') }}</div>
          <div class="claim-commisson">
            <ion-icon class="agent-money" src="/svg/agent-money.svg" />
            <span>{{ tenantInfo?.merchantCy }} {{ formatMoneyToShow(agencyInfo?.claimedCommission) }}</span>
            <ion-icon class="agent-money agent-money-right" src="/svg/agent-money.svg" />
          </div>
          <!-- 领取 领取记录按钮 -->
          <div class="btn">
            <ion-button class="mlm-agent-btn" @click="historyClick">{{ $t('toggle.history') }}</ion-button>
            <ion-button 
              class="mlm-agent-btn claim-btn" 
              :disabled="claimDisabled"
              :class="{ 'claim-dis': claimDisabled }"
              @click="claimClick"
              v-if="isShowClaimBtn"
            >
              {{ $t('toggle.claim') }}
            </ion-button>
          </div>
          <!-- 佣金领取规则 -->
          <div class="receive-rule relative">
            <span class="text">
              <span class="hint" v-html="$t('toggle.receiveTime', { time: config?.commissionDistributeTime })"></span>
            </span>
            <div v-if="false" class="rule-btn" @click="showBonusRuleModal">
              <ion-icon :src="`/svg/warning.svg`" />
              <span>{{ $t('toggle.ruleBtn') }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 代理信息 -->
      <div class="mlm-agent-info">
        <!-- 下级信息 -->
        <div class="flex">
          <div class="subordinate-info" v-for="item in agencyInfo.subordinateInfo" :key="item.type">
            <!-- 直属下级/团队下级 -->
            <div 
              class="left" 
              :class="item.type == 'direct' ? 'direct-title' : 'team-title'"
            >
              <ion-icon  :src="`/first/svg/agent/${item.icon}.svg`" />
              {{ item.title }}
            </div>
            <div class="dataItem-info" v-for="(dataItem,index) in item.data" :key="index">
              <div class="dataItem-title">
                <ion-icon v-if="dataItem.icon" :src="`/first/svg/agent/${dataItem.icon}.svg`" />
                {{ dataItem.name }}
              </div> 
              <div class="num">{{ dataItem.format ? formatMoneyToShow(dataItem.value) : dataItem.value  }}</div>
            </div>
          </div>
        </div>
        <!-- 邀请链接 -->
        <div class="my-[1rem]">
          <Button v-if="!isSecondSkin" @click="invitationLink">{{ $t('mlmAgent.inviteLink') }}</Button>
          <secondButton v-else @click="invitationLink">{{ $t('mlmAgent.inviteLink') }}</secondButton>
        </div>
        <!-- 我的推广 -->
        <div class="agent-info-datail">
          <div class="header">
            <ion-icon class="agent-report-icon" src="/first/svg/agent/agent-report.svg" />
            <span class="my-agency">{{ $t('toggle.MyAgency') }}</span>
          </div>
          <div class="item">
            <div class="detail-item" :class="item.icon ? 'up' : ''" v-for="(item,index) in agencyInfo.myAgentInfoList" :key="index">
              <div class="count-info">{{ item.format ? formatMoneyToShow(item.value) : item.value }}</div>
              <div class="des">
                <ion-icon v-if="item.icon"  :src="`/first/svg/agent/${item.icon}.svg`" />
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- 下级数据/佣金明细/邀请规则/代理级别/佣金比例表 -->
        <div class="mt-[1rem]">
          <div 
            class="jump-item" 
            v-for="(item,index) in nlnAgentJumpList" 
            :key="index"
            :style="{ backgroundImage: `url(/first/agent/${item.bgIcon}.png` }"
            @click="item.fun"
          >
            <div class="text">{{ item.name }}</div>
            <ion-icon src="/first/svg/agent/agent-detail-icon.svg"/>
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
import { useMlmAgentLogic } from './hooks/logic'
import { formatMoneyToShow } from '@/utils/custom'
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/first/Button/index.vue'
import secondButton from '@/components/second/Button/index.vue'

const agentStore = useAgentStore();   // 代理store

// 当前是second皮肤
const isSecondSkin = computed(() => getTheme().skin == 'second');


// 代理等级外圈图片
const agentLevelBgMap: { [key: string]: string } = {
  'purple-light': 'url(/first/agent/purple-light-home-agent-level-bg.png)',
  'mystlight-blue': 'url(/first/agent/mystlight-blue-home-agent-level-bg.png)',
}
const currentAgentLevelPng = computed(() => {
  const { theme } = getTheme();
  return agentLevelBgMap[theme] || `url(/first/agent/home-agent-level-bg.png)`;
})

const {
  agencyInfo,
  tenantInfo,
  config,
  nlnAgentJumpList,
  claimDisabled,
  isShowClaimBtn,
  isShowLeaderBoard,
  invitationLink,
  leaderBoardClick,
  historyClick,
  claimClick,
  showBonusRuleModal
} = useMlmAgentLogic();

</script>

<style scoped lang="less">
  @import '@/views/mlmAgent/styles/index.less';
  @import '@/views/mlmAgent/styles/theme-style.less';

  #mlmAgent-index.style();

  .agent-level {
    .agent-level-left {
      .level-icon {
        background: v-bind(currentAgentLevelPng) no-repeat;
        background-size: 100% 100%;
      }
    } 
  }

  .yellow-dark, 
  .auroral-yellow {
    #mlmAgent-index.style(
      --color-bg-200,
      --text-color-white-100,
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(254, 184, 5, 0.154) 118.45%),
      --color-text-40,
      --color-text-80,
      --color-text-40,
      --color-text-100,
      --theme-color-800,
      rgba(255, 255, 255, 0.1),
      --accent-color-blue,
      --color-bg-200,
      --accent-color-orange,
      --color-text-100,
      --color-bg-100,
      --accent-color-blue,
      --accent-color-blue,
      --accent-color-green,
      --accent-color-green,
      --color-text-40,
      --color-bg-100,
      --color-text-40,
      --color-text-100,
      --color-bg-200,
      --color-text-100,
      --color-bg-300,
      --color-text-40,
      --color-text-100,
      --text-color-white-40,
      --accent-color-orange,
      --color-text-80,
      --text-color-white-40,
      --color-bg-100,
      --text-color-white-100,
      --mlmagent-history-focused-bgc,
      --mlmagent-history-hover-bgc,
      --theme-color-800,
      --color-text-secondary-1,
      --mlm-agent-claim-hover-bgc,
      --mlm-agent-claim-focused-bgc,
      --color-primary-btn-disable,
      --color-mlm-btn-text-disable,
    );
  }

  .green-dark {
    #mlmAgent-index.style(
      --color-bg-200,
      --text-color-white-100,
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(254, 184, 5, 0.154) 118.45%),
      --color-text-40,
      --color-text-80,
      --color-text-40,
      --color-text-100,
      --accent-color-orange-1,
      rgba(255, 255, 255, 0.1),
      --mlm-receive-rule-text-color,
      --color-bg-200,
      --accent-color-orange,
      --color-text-100,
      --color-bg-100,
      --accent-color-blue,
      --accent-color-blue,
      --accent-color-green,
      --theme-color-800,
      --color-text-40,
      --color-bg-200,
      --color-text-40,
      --color-text-100,
      --color-bg-200,
      --color-text-100,
      --color-bg-300,
      --color-text-40,
      --color-text-100,
      --text-color-white-40,
      --accent-color-orange,
      --mlm-agent-my-agency-textc,
      --text-color-white-40,
      --color-bg-100,
      --text-color-white-100,
      --mlmagent-history-focused-bgc,
      --mlmagent-history-hover-bgc,
      --theme-color-800,
      --text-color-white-100,
      --mlm-agent-claim-hover-bgc,
      --mlm-agent-claim-focused-bgc,
      --color-primary-btn-disable,
      --color-text-20
    )
  }

  .purple-light {
    #mlmAgent-index.style(
      --theme-color-800,
      --text-color-white-100,
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(254, 184, 5, 0.154) 118.45%),
      --color-text-40,
      --text-color-black-80,
      --text-color-black-40,
      --text-color-black-100,
      --accent-color-orange,
      rgba(255, 255, 255, 0.1),
      --mlm-receive-rule-text-color,
      --color-bg-200,
      --accent-color-orange,
      --text-color-black-100,
      --color-bg-100,
      --accent-color-blue,
      --accent-color-blue,
      --accent-color-green,
      --accent-color-green,
      --text-color-black-40,
      --color-bg-100,
      --text-color-black-40,
      --text-color-black-100,
      --color-bg-500,
      --text-color-black-100,
      --color-bg-300,
      --text-color-black-40,
      --text-color-black-100,
      --mlm-agent-report-icon-color,
      --accent-color-orange,
      --text-color-black-100,
      --mlm-agent-report-icon-color,
      --mlm-agent-history-bgc,
      --text-color-white-100,
      --mlmagent-history-focused-bgc,
      --mlmagent-history-hover-bgc,
      --theme-color-800,
      --text-color-white-100,
      --mlm-agent-claim-hover-bgc,
      --mlm-agent-claim-focused-bgc,
      --color-primary-btn-disable,
      --text-color-white-60
    );
  }

  .new-skin-symbol {
    #mlmAgent-index.style(
      --ep-color-background-fill-top-nav-secondary,
      --ep-color-icon-default,
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(254, 184, 5, 0.154) 118.45%),
      --ep-color-text-default,
      --ep-color-text-default,
      --ep-color-text-weaker,
      --ep-color-text-highlight-white,
      --ep-color-text-highlight,
    rgba(255, 255, 255, 0.1),
      --ep-color-text-info,
      --ep-color-background-fill-surface-raised-L1,
      --ep-color-icon-warning,
      --ep-color-text-highlight-white,
      --ep-color-background-fill-surface-raised-L2,
      --ep-color-text-info,
      --ep-color-icon-info,
      --ep-color-text-success,
      --ep-color-icon-success,
      --ep-color-text-weaker,
      --ep-color-background-fill-surface-raised-L2,
      --ep-color-icon-weaker,
      --ep-color-text-default,
      --ep-color-background-fill-surface-raised-L1,
      --ep-color-text-default,
      --ep-color-background-fill-body-default,
      --ep-color-text-weaker,
      --ep-color-text-highlight-white,
      --ep-color-text-weaker,
      --ep-color-icon-warning,
      --ep-color-text-default,
      --ep-color-icon-weaker,
      --ep-color-background-fill-surface-raised-L2,
      --ep-color-text-default,
      --ep-color-background-fill-surface-raised-L2,
      --ep-color-background-fill-surface-raised-L2,
      --ep-color-background-fill-active-primary,
      --ep-color-text-inverse,
      --ep-color-background-fill-active-primary,
      --ep-color-background-fill-active-primary,
      --ep-color-background-fill-active-disabled,
      --ep-color-text-inverse-disabled
    );
  }

  .amber-purple {
    #mlmAgent-index.style(
      --color-bg-200,
      --text-color-light-purple-1-100,
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(254, 184, 5, 0.154) 118.45%),
      --color-text-40,
      --mlm-level-tips-text-color,
      --color-text-40,
      --color-text-100,
      --mlm-agent-claim-commisson-textc,
      rgba(255, 255, 255, 0.1),
      --mlm-receive-rule-text-color,
      --color-bg-200,
      --mlm-agent-home-money-icon-color,
      --text-color-light-purple-1-100,
      --color-bg-100,
      --mlm-agent-direct-text-color,
      --mlm-agent-direct-icon-text-color,
      --mlm-agent-team-text-color,
      --mlm-agent-team-icon-text-color,
      --text-color-light-purple-2-100,
      --color-bg-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --color-bg-200,
      --text-color-light-purple-1-100,
      --color-bg-300,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --mlm-agent-report-icon-color,
      --mlm-agent-home-money-icon-color,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --mlm-agent-history-bgc,
      --text-color-white-100,
      --mlmagent-history-focused-bgc,
      --mlmagent-history-hover-bgc,
      --mlm-agent-claim-bg-color,
      --text-color-white-100,
      --mlm-agent-claim-hover-bgc,
      --mlm-agent-claim-focused-bgc,
      --color-mlm-btn-bg-disable,
      --color-mlm-btn-text-disable
    );
  }

  .blue-default {
    #mlmAgent-index.style(
      --color-bg-200,
      --color-text-white-100,
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(254, 184, 5, 0.154) 118.45%),
      --text-color-white-40,
      --text-color-white-80,
      --text-color-white-40,
      --color-text-white-100,
      --accent-color-yellow,
      rgba(255, 255, 255, 0.1),
      --accent-color-blue,
      --color-bg-200,
      --accent-color-orange,
      --color-text-white-100,
      --color-bg-50,
      --accent-color-blue,
      --accent-color-blue,
      --mlm-agent-team-text-color,
      --mlm-agent-team-icon-text-color,
      --text-color-white-40,
      --color-bg-100,
      --text-color-white-40,
      --color-text-white-100,
      --color-bg-200,
      --color-text-white-100,
      --color-bg-300,
      --text-color-white-40,
      --color-text-white-100,
      --text-color-white-40,
      --accent-color-orange,
      --text-color-white-80,
      --text-color-white-40,
      --color-bg-50,
      --text-color-white-100,
      --mlmagent-history-focused-bgc,
      --mlmagent-history-hover-bgc,
      --theme-color-gradient-200,
      --text-color-white-100,
      --mlm-agent-claim-hover-bgc,
      --mlm-agent-claim-focused-bgc,
      --color-mlm-btn-bg-disable,
      --text-color-white-40
    );
  }

  .green-default {
    #mlmAgent-index.style(
      --color-bg-200,
      --color-text-gray-100,
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(254, 184, 5, 0.154) 118.45%),
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --accent-color-orange-1,
      rgba(255, 255, 255, 0.1),
      --mlm-agent-direct-text-color,
      --color-bg-200,
      --accent-color-orange,
      --color-text-gray-100,
      --color-bg-100,
      --mlm-agent-direct-text-color,
      --mlm-agent-direct-icon-text-color,
      --mlm-agent-team-text-color,
      --mlm-agent-team-icon-text-color,
      --color-text-gray-200,
      --color-bg-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-bg-300,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --accent-color-orange,
      --color-text-gray-100,
      --color-text-gray-200,
      --theme-color-gradient-100,
      --text-color-white-100,
      --mlmagent-history-focused-bgc,
      --mlmagent-history-hover-bgc,
      --theme-color-gradient-200,
      --text-color-white-100,
      --mlm-agent-claim-hover-bgc,
      --mlm-agent-claim-focused-bgc,
      --theme-color-gradient-400,
      --color-text-white-40
    );
  }

  .forest-green {
    #mlmAgent-index.style(
      --color-bg-200,
      --color-text-white-100,
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(254, 184, 5, 0.154) 118.45%),
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --accent-color-orange-1,
      rgba(255, 255, 255, 0.1),
      --mlm-agent-direct-text-color,
      --color-bg-200,
      --accent-color-orange,
      --color-text-gray-100,
      --color-bg-100,
      --mlm-agent-direct-text-color,
      --mlm-agent-direct-icon-text-color,
      --mlm-agent-team-text-color,
      --mlm-agent-team-icon-text-color,
      --color-text-gray-200,
      --color-bg-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-bg-300,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --accent-color-orange,
      --color-text-gray-100,
      --color-text-white-40,
      --theme-color-gradient-100,
      --color-text-white-100,
      --mlmagent-history-focused-bgc,
      --mlmagent-history-hover-bgc,
      --theme-color-gradient-200,
      --color-text-gray-100,
      --mlm-agent-claim-hover-bgc,
      --mlm-agent-claim-focused-bgc,
      --theme-color-gradient-400,
      --color-text-white-40
    );
  }
  
  .auroral-yellow {
    #mlmAgent-index.style(
      @mlmAgent-index-21: --color-text-gray-200;
      @mlmAgent-index-30: --color-text-gray-200;
      @mlmAgent-index-16: --color-bg-100
    );
  }

  .new-skin-symbol {
    @import '@/views/mlmAgent/styles/index-phantom.less';
  }
</style>
 