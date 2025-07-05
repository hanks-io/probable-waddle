<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName" />
    <ion-content>
      <section>
        <!-- 顶部图片 -->
        <div class="default-sing-top sign-flex-center">
          <div class="default-sign-money sign-flex-center">
            <img class="w-[1.5rem] h-[1.5rem] mr-[.375rem]" src="/images/sign/sign-money-icon.png" alt="">
            {{ formatMoneyToShow(cumulativeRewardsMoney) }}
          </div>
          <div class="default-sing-img w-[6.25rem] h-[6.25rem]"></div>
          <div class="default-sign-day sign-flex-center">
            <img class="w-[1.5rem] h-[1.5rem] mr-[.5rem]" src="/images/sign/sign-date-icon.png" alt="">
            {{ $t('activity.signDay',{ value: signInfo?.signInDays }) }}
          </div>
        </div>
        <!-- 当前VIP等级信息 -->
        <div class="default-current-vip flex items-center pl-[.875rem] mt-[-0.625rem]">
          <img class="w-[1.5rem] h-[1.5rem] mr-[.375rem]" src="/images/sign/sign-vip-icon.png" alt="">
          <div class="vip-info">
            <div>{{ $t('main.VIP') }}{{ currentVipLevel }}</div>
            <div class="vip-tips">{{ $t('activity.signPrompt') }}</div>
          </div>
        </div>
        <!-- 签到日期 -->
        <div class="default-sign-date">
          <div class="date-box flex flex-wrap" v-if="signInfo.rewardConfig.length">
            <div 
              class="date-item sign-flex-center relative" 
              :class="{ 'default-claimed-item': item.isClaimed, 'default-available-item1': item.isAvailable }"
              v-for="(item,index) in signInfo.rewardConfig" 
              :key="index" 
              @click="checkInClick(item, 'style1')"
            >
              <!-- 宝箱图片 -->
              <img v-if="item.iconType == 'DEFAULT'" class="w-[2.25rem] h-[2.25rem] mt-[.75rem]" :src="`/images/sign/sing-date-bg-style02-${handleStyle01DefaultPng(index+1)}.png`" alt="">
              <img v-else class="w-[2.25rem] h-[2.25rem] mt-[.75rem]" :src="item.icon" />
              <!-- 签到天数 -->
              <div class="date-item-day mt-[-0.125rem]">{{ $t('date.days') }} {{ handleDateDay(item.day) }}</div>
              <!-- 可领取金额 -->
              <div class="date-item-money sign-flex-center flex-wrap mt-[-0.125rem] mb-[.1875rem]">
                <template v-if="showRewardAmount">
                  <span class="item-money-conten">
                    <ion-icon class="date-item-money-icon mr-[.125rem]" src="/first/svg/agent/agent-currency.svg" />
                    <span class="item-money-text">{{ item.amountType == 'RANDOM' ? `${ formatMoneyToShow(item.amountMin) }~${ formatMoneyToShow(item.amountMax) }` : `+${ formatMoneyToShow(item.amountMax) }` }}</span>
                  </span>
                </template>
                <template v-else>
                  {{ item.amountType == 'RANDOM' ? $t('activity.signRandomText') : $t('activity.signRewardText') }}
                </template>
              </div>
              <!-- 额外奖励 -->
              <div 
                v-if="item.extraReward > 0" 
                class="default-date-extra-reward absolute top-[.1875rem] left-[0] w-full sign-flex-center"
              >
                <template v-if="showExtraRewardAmount">
                  {{ $t('viewsAssets.Extra') }} <span class="money ml-[.125rem]"> +{{formatMoneyToShow(item.extraReward) }}</span>
                </template>
                <template v-else>
                  {{ $t('activity.signExtraText') }}
                </template>
              </div>
              <!-- 可领取图标 -->
              <img v-if="item.isAvailable" class="default-triangle absolute top-[-0.5rem] left-[50%]" src="/images/sign/invite-cpf-polygon.png" alt="">
              <!-- 可领取底部颜色扩散 -->
              <div v-if="item.isAvailable" class="default-available-item2 absolute top-0 left-0 w-full h-full"></div>
            </div>
          </div>
        </div>
        <!-- 活动规则 -->
        <div class="default-sign-rule">
          <div class="default-sign-rule-content keep-space">
            <p>{{ activityRule }}</p>
          </div>
        </div>
        <!-- 底部领取按钮 -->
        <div class="default-footer-btn fixed bottom-0 left-0 w-full h-[5rem] sign-flex-center z-50">
          <ion-button class="w-full h-[3.0625rem] default-sign-available-btn" @click="receiveClickBtn('style1')">
            {{ $t('activity.signInfo') }}
          </ion-button>
        </div>
      </section>
    </ion-content>
    <!-- 未满足领取条件 弹窗 -->
    <UnmetReceiveModal v-if="openUnmetReceive" @closeUnmetReceive="closeReceiveModel('unmet')" :unmetInfo="unmetInfo" />
    <!-- 满足领取条件 弹窗 -->
    <ReceivedModal v-if="openStyle01Receive" :receivedInfo="unmetInfo" @closeReceived="closeStyle01Received" />
  </ion-page>
</template>

<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue'
import { useSignLogic } from '@/views/activity/sign/hooks/signLogic'
import NavigationBar from '@/components/NavigationBar/index.vue'
import UnmetReceiveModal from '@/views/activity/sign/components/default/modal/unmetReceiveModal.vue'
import ReceivedModal from '@/views/activity/sign/components/second/modal/receivedModal.vue'

const {
  activityName,
  activityRule,
  signInfo,
  cumulativeRewardsMoney,
  currentVipLevel,
  openUnmetReceive,
  openStyle01Receive,
  unmetInfo,
  showRewardAmount,
  showExtraRewardAmount,
  handleDateDay,
  checkInClick,
  closeReceiveModel,
  receiveClickBtn,
  closeStyle01Received,
  handleStyle01DefaultPng,
} = useSignLogic();

</script>

<style scoped lang="less">
@import "@/views/activity/sign/components/default/styles/base-index.less";
@import "@/views/activity/sign/components/default/styles/theme-style.less";

#activity-sign-components-default-index.style();

.yellow-dark {
  #activity-sign-components-default-index.style(
    --color-bg-300,
    --theme-color-800,
    --text-color-white-100,
    --text-color-white-40,
    --color-bg-200,
    --color-bg-300,
    --text-color-white-40,
    --text-color-white-100,
    --theme-color-800,
    --text-color-white-40,
    --sign-default-extra-reward,
    --accent-color-green,
    --sing-default-available-before,
    --text-color-white-40,
    --color-bg-200,
    --sign-default-footer-border,
    --theme-color-800,
    --color-text-black-100,
    --button-right-bg-color-shade,
    --button-right-bg-color-tint,
    --button-right-bg-color-shade,
    --line-color
  );
}

.green-dark {
  #activity-sign-components-default-index.style(
    --color-bg-300,
    --sign-default-day-text-color,
    --text-color-white-100,
    --text-color-white-40,
    --color-bg-200,
    --color-bg-300,
    --text-color-white-40,
    --text-color-white-100,
    --sign-default-day-text-color,
    --text-color-white-40,
    --sign-default-extra-reward,
    --accent-color-green,
    --ion-color-primary,
    --text-color-white-40,
    --color-bg-200,
    --color-line,
    --theme-color-800,
    --text-color-white-100,
    --sign-default-footer-btn-shade,
    --sign-default-footer-btn-tint,
    --sign-default-footer-btn-shade,
    --color-line
  )
}

.purple-light {
  #activity-sign-components-default-index.style(
    --color-bg-300,
    --sign-default-day-text-color,
    --sign-default-current-vip-text,
    --text-color-black-40,
    --color-bg-500,
    --color-bg-300,
    --text-color-black-40,
    --text-color-black-100,
    --sign-default-day-text-color,
    --text-color-black-40,
    --accent-color-green,
    --accent-color-green,
    --accent-color-green,
    --text-color-black-80,
    --color-bg-200,
    --line-color,
    --theme-color-800,
    --text-color-white-100,
    --sign-default-footer-btn-shade,
    --sign-default-footer-btn-tint,
    --sign-default-footer-btn-shade,
    --line-color
  )
}

.amber-purple {
  #activity-sign-components-default-index.style(
    --color-bg-300,
    --sign-default-day-text-color,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-bg-200,
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-100,
    --sign-default-day-text-color,
    --color-text-gray-200,
    --sign-default-extra-reward,
    --sing-default-available-before,
    --sing-default-available-before,
    --color-text-gray-200,
    --color-bg-200,
    --line-color,
    --sign-default-footer-btn-bg,
    --text-color-white-100,
    --sign-default-footer-btn-bg,
    --sign-default-footer-btn-bg,
    --sign-default-footer-btn-bg,
    --line-color
  )
}

.blue-default {
  #activity-sign-components-default-index.style(
    --color-bg-400,
    --sign-default-day-text-color,
    --color-text-white-100,
    --text-color-white-40,
    --sign-default-date-box-bg,
    --color-bg-400,
    --text-color-white-40,
    --color-text-white-100,
    --sign-default-day-text-color,
    --text-color-white-40,
    --sign-default-extra-reward,
    --mlm-agent-team-text-color,
    --sing-default-available-before,
    --text-color-white-40,
    --sign-default-date-box-bg,
    --sign-default-footer-border,
    --sign-default-footer-btn-bg,
    --color-text-white-100,
    --sign-default-footer-btn-bg,
    --sign-default-footer-btn-bg,
    --sign-default-footer-btn-bg,
    --sign-default-footer-border
  )
}

.forest-green {
  #activity-sign-components-default-index.style(
    --color-bg-300,
    --sign-default-day-text-color,
    --color-text-white-100,
    --color-text-white-40,
    --color-bg-200,
    --color-bg-300,
    --color-text-white-40,
    --color-text-white-100,
    --color-bg-300,
    --color-text-white-40,
    --sign-default-extra-reward,
    --mlm-agent-team-text-color,
    --sing-default-available-before,
    --color-text-gray-200,
    --color-bg-200,
    --color-link,
    --theme-color-gradient-100,
    --color-text-white-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --color-link
  )
}

.green-default {
  #activity-sign-components-default-index.style(
    --color-bg-300,
    --sign-default-day-text-color,
    --color-text-gray-100,
    --color-text-white-40,
    --color-bg-200,
    --color-bg-300,
    --color-text-white-40,
    --color-text-gray-100,
    --sign-default-day-text-color,
    --color-text-white-40,
    --sign-default-extra-reward,
    --mlm-agent-team-text-color,
    --sing-default-available-before,
    --color-text-gray-200,
    --color-bg-200,
    --line-color,
    --theme-color-gradient-100,
    --color-text-white-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --color-line
  )
}

.new-skin-symbol {
  #activity-sign-components-default-index.style(
    --ep-color-background-fill-body-default,
    --ep-color-text-highlight,
    --ep-color-text-default,
    --ep-color-text-weaker,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-background-fill-body-default,
    --ep-color-text-weak,
    --ep-color-text-highlight-white,
    --ep-color-icon-warning,
    --ep-color-text-weaker,
    --ep-color-text-success,
    --ep-color-icon-success,
    --ep-color-text-success,
    --ep-color-text-weaker,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-border-default,
    --ep-dynamic-primary,
    --ep-color-text-inverse,
    --ep-dynamic-primary,
    --ep-dynamic-primary,
    --ep-dynamic-primary,
    --ep-color-border-default
  );
}

.new-skin-symbol { 
  @import "@/views/activity/sign/components/default/styles/base-phantom.less";
}
</style>
