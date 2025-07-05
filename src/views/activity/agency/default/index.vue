<!-- 代理活动 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName">
      <template #end>
        <div class="h-[1.875rem] pt-1.5 rounded-[.3125rem] mr-4" @click="claimHistoryHandle">
          <ion-icon class="h-5" src="/svg/activity/icon_record.svg" />
        </div>
      </template>
    </NavigationBar>
    <ion-content class="space-y-3 ion-padding">
      <!-- 快速分享 -->
      <div class="w-full rounded-lg bg-[--color-bg-second]">
        <ion-item>
          <div class="flex items-center justify-between w-full">
            <div class="text-[--color-text-link-agency] text-xs truncate"> {{ $t('activity.agent1', { url: shareUrl }) }}</div>
            <ion-buttons>
              <ion-button class="copy" @click="copy(shareUrl)">
                <ion-icon class="mx-3 icon" slot="icon-only" :src="`/svg/copy.svg`"></ion-icon>
              </ion-button>
            </ion-buttons>
          </div>
        </ion-item>
        <ion-item>
          <div class="w-full">
            <div class="w-full mt-2">
              <p class="text-xs text-[--color-text-basic]">{{ $t('activity.agent2') }}</p>
            </div>
            <!-- 分享平台配置 -->
            <ion-segment ref="segmentRef" mode="ios" scrollable :value="shareValue" 
                @mousedown="handleMouseDown"
                @mouseup="handleMouseUp"
                @mouseleave="handleMouseLeave"
                @mousemove="handleMouseMove">
              <ion-segment-button v-for="(item, index) in segmentList" :value="index" :key="item.type"
                :disabled="disableTab"  @click="shareHandle(item.type)">
                <ion-icon :id="`icon-${item}`" class="w-[2.25rem] h-[2.25rem]" :src="item.icon" />
              </ion-segment-button>
            </ion-segment>
          </div>
        </ion-item>
        <ion-item lines="none">
          <div class="relative flex items-center justify-between w-full text-xs">
            <!-- 左侧注册投注内容 -->
            <div class="max-w-[15.625rem] text-[--color-text-basic]">
              {{ $t('activity.agent4') }} <br>
              <span class="text-[--color-text-emphasis]">{{ `${activityInfo.subordinate}${$t('activity.agent7')}` }}</span>
              {{ `(${$t('activity.agent5')}` }}
              <span class="text-[--color-text-emphasis]">{{ activityInfo.validCount + $t('activity.agent7') + ')' }}</span>
            </div>
            <!-- 右侧详情/领取按钮 -->
            <div class="flex items-center">
              <div class="text-[--color-text-href-agency-detail] text-[0.625rem]" @click="detailsHandle"> {{ $t('activity.agent8') }}</div>
              <div class="flex flex-col ml-[0.375rem] items-end" v-if="rewardShowMode === ZDisplayMode.enum.RECEIVE">
                <ion-button class="claim w-[3.25rem] h-[1.75rem] text-[0.75rem]" @click="claimHandle"
                  :disabled="receiveBtnIsDisabled">
                  {{ $t('activity.agent6') }}
                </ion-button>
                <span class="text-[--color-text-emphasis]">{{ merchantCy }}{{ activityInfo.rewardAmount }}</span>
              </div>
            </div>
          </div>
        </ion-item>
      </div>
      <!-- 宝箱/红包 -->
      <div v-if="rewardShowMode !== ZDisplayMode.enum.RECEIVE"
        class="reward-box w-full  rounded-lg bg-[--color-bg-second] flex flex-wrap px-[0.625rem] py-[0.625rem]">
        <div class="relative reward-item" v-for="(item, index) in rewardList" :value="index" :key="item.userCount"
          @click="openBoxHandle(item)">
          <div :class="item.isMeet && !item.isOpen ? 'redPacketGet' : ''" class="flex ">
            <img v-show="!item.showOpenAni" class="w-[4.25rem] h-[4.25rem]" :src="getBoxIconPath(item.isOpen)"
              @click="activeRedPacketUuid = item.uuid" />
            <img v-show="item.showOpenAni" class="w-[4.25rem] h-[4.25rem] transition-all" :src="getBoxIconAniPath()" />
            <div
              class="text-position absolute top-[2.5625rem] leading-[0.75rem] -translate-x-8 w-16 text-[0.6875rem] text-[#FFF] font-bold text-center text-with-shadow "
              v-if="item.isOpen || showRewardAmount">
              {{ getBoxAmount(item) }}
            </div>
          </div>
          <div v-show="!item.isTrue" class="arrow_icon absolute right-[0.25rem] top-[2rem] text-sm text-[--color-text-basic]"> > </div>
          <div class="i8n-box w-[4.25rem] text-[--color-text-second] my-[0.625rem]">
            {{ $t('activity.agent9') }}
            <span class="text-[--color-text-emphasis]">{{ item.userCount }}</span>
            {{ $t('activity.agent7') }}
          </div>
        </div>
        <div class="reward-item"></div>
        <div class="reward-item"></div>
      </div>
      <!-- 有效推广人数 -->
      <div v-if="rewardShowMode === ZDisplayMode.enum.RECEIVE" class="w-full h-auto rounded-lg bg-[--color-bg-second]">
        <ion-item>
          <div class="condition text-[--color-text-basic]">
            <div>{{ $t('activity.agent10') }}</div>
            <div>{{ $t('activity.agent11') }}</div>
          </div>
        </ion-item>
        <ion-item v-for="(item, index) in rewardList" :key="index"
          :lines="(index !== rewardList.length - 1 ? undefined : 'none')">
          <div class="condition">
            <div class="text text-[--color-text-second]">{{ `≥${item.userCount}` }}</div>
            <div v-if="bonusType === ZRewardType.enum.RANDOM" class="text font-bold text-[--color-text-emphasis]">
              {{`${formatMoneyToShow(item.min)}~${formatMoneyToShow(item.max)}`}}
            </div>
            <div v-if="bonusType === ZRewardType.enum.FIXED" class="text font-bold text-[--color-text-emphasis]">
              {{ formatMoneyToShow(item.max) }}
            </div>
          </div>
        </ion-item>
      </div>
      <!-- 什么是有效推广人数 -->
      <div v-if="showValidCondition" class="validCondition w-full h-auto rounded-lg bg-[--color-bg-second]">
        <ion-item lines="full">
          <div class="w-full text-left my-[0.25rem]">
            <p class="text-[--color-text-title-label-agency] text-xs">{{ $t('activity.agent13') }}
              <span v-if="conditionType === ZValidCondition.enum.ALL">{{ $t('activity.agent14') }}</span>
              <span v-if="conditionType === ZValidCondition.enum.ONE">{{ $t('activity.agent15') }}</span>
            </p>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.firstRecharge.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-[--color-text-second] text-left w-[16.25rem]">{{ $t('activity.agent16') }}</div>
            <div class="text text-[--color-text-label-value-agency] font-bold text-right">{{
          `≥${formatMoneyToShow(activityInfo.firstRecharge.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeAmount.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-[--color-text-second] text-left w-[16.25rem]">{{ $t('activity.agent17') }}</div>
            <div class="text text-[--color-text-label-value-agency] font-bold text-right">{{
          `≥${formatMoneyToShow(activityInfo.rechargeAmount.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.validBet.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-[--color-text-second] text-left w-[16.25rem]">{{ $t('activity.agent18') }}</div>
            <div class="text text-[--color-text-label-value-agency] font-bold text-right">{{
          `≥${formatMoneyToShow(activityInfo.validBet.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeDay.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-[--color-text-second] text-left w-[16.25rem]">{{ $t('activity.agent19') }}</div>
            <div class="text text-[--color-text-label-value-agency] font-bold text-right">{{ `≥${activityInfo.rechargeDay.days}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeTimes.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-[--color-text-second] text-left w-[16.25rem]">{{ $t('activity.agent20') }}</div>
            <div class="text text-[--color-text-label-value-agency] font-bold text-right">{{ `≥${activityInfo.rechargeTimes.count}` }}</div>
          </div>
        </ion-item>
      </div>
      <!-- 活动描述 -->
      <div class="text-xs leading-5 text-[--color-text-second] keep-space p-[0.625rem] bg-[--color-bg-second] rounded-lg">
        <p>{{ activityInfo.description }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy'
import {
  IonPage,
  IonIcon,
  IonContent,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonButtons,
} from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import { formatMoneyToShow } from '@/utils/custom'
import { ZValidCondition, ZDisplayMode, ZRewardType } from '@/enums/types/activity.type'
import useLogic from '../logic'

const {
  segmentRef,
  shareValue,
  segmentList,
  shareUrl,
  showRewardAmount,
  rewardShowMode,
  rewardList,
  conditionType,
  bonusType,
  activityName,
  showValidCondition,
  receiveBtnIsDisabled,
  activityInfo,
  activeRedPacketUuid,
  claimHistoryHandle,
  detailsHandle,
  claimHandle,
  openBoxHandle,
  shareHandle,
  getBoxIconPath,
  getBoxIconAniPath,
  getBoxAmount,
  isRewardOpen,
  merchantCy,
  disableTab,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove,
} = useLogic()

</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/agency/default/style/base-index.less";
  @import "@/views/activity/agency/default/style/theme-style.less";

  #activity-agency-default-index.style();

  .blue-default {
    #activity-agency-default-index.style(
      --color-text-gray-200,
      --color-text-white-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --color-bg-200,
      --color-text-gray-300,
      --color-text-white-100,
      --color-text-white-100,
      --theme-color-500,
      --accent-color-yellow,
      --accent-color-yellow,
      --color-bg-200,
      --color-text-white-100,
      --color-text-gray-200,
      --color-bg-200,
      --color-text-white-100,
      --color-text-gray-200,
      --accent-color-yellow,
      --color-bg-200,
      --color-text-gray-300,
      --color-text-gray-200,
      --theme-color-500,
      --color-text-gray-200,
      --color-bg-200
    );
  };

  .green-default {
    #activity-agency-default-index.style(
      --color-text-gray-200,
      --color-text-gray-200,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --color-bg-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-100,
      --accent-color-yellow,
      --accent-color-yellow,
      --accent-color-yellow,
      --color-bg-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-bg-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --accent-color-yellow,
      --color-bg-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --accent-color-yellow,
      --color-text-gray-200,
      --color-bg-200
    );
  }
  
  .amber-purple {
    #activity-agency-default-index.style(
        --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --gradients-purple-1,
      --gradients-purple-1,
      --gradients-purple-1,
      --gradients-purple-1,
      --color-bg-200,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --accent-color-yellow,
      --accent-color-yellow,
      --color-bg-200,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --color-bg-200,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --accent-color-yellow,
      --color-bg-200,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --accent-color-yellow,
      --text-color-light-purple-2-100,
      --color-bg-200
    );
  };
</style>
