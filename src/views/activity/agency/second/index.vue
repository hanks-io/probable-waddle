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
      <div class="w-full rounded-middle bg-200">
        <ion-item class="">
          <div class="flex items-center justify-between w-full">
            <div class="color-text-100 text-xs truncate"> {{ $t('activity.agent1', { url: '' }) }}
              <span class="color-link">{{ shareUrl }}</span>
            </div>
            <ion-buttons class="">
              <ion-button class="copy" @click="copy(shareUrl)">
                <ion-icon class="mx-3 icon" slot="icon-only" :src="`/svg/copy.svg`"></ion-icon>
              </ion-button>
            </ion-buttons>
          </div>
        </ion-item>
        <ion-item>
          <div class="w-full">
            <div class="w-full mt-2 flex justify-between">
              <p class="color-text-100 text-xs">{{ $t('activity.agent2') }}</p>
               <!-- 奖金 -->
              <div v-if="rewardShowMode === ZDisplayMode.enum.RECEIVE" class="flex items-center">
                <span class="color-text-currency text-xs font-weight-bold">{{ merchantCy }}{{ activityInfo.rewardAmount }}</span>
              </div>
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
          <div class="w-full">
            <div class="relative flex items-center justify-between w-full text-xs color-text-100 py-5">
              <!-- 注册投注内容 -->
              <div class="max-w-[15.625rem]">
                {{ $t('activity.agent4') }}
                <span class="color-link">{{ `${activityInfo.subordinate}${$t('activity.agent7')}` }}</span>
                {{ `(${$t('activity.agent5')}` }}
                <span class="color-text-100">{{ activityInfo.validCount + $t('activity.agent7') + ')' }}</span>
              </div>
              <div class="color-link text-xs font-weight-regular" @click="detailsHandle"> {{ $t('activity.agent8') }}</div>
            </div>
            <!-- 领取按钮 -->
            <div class="w-full mb-5" v-if="rewardShowMode === ZDisplayMode.enum.RECEIVE">
              <Button @click="claimHandle" :disabled="receiveBtnIsDisabled" :shiny="!receiveBtnIsDisabled">
                {{ $t('activity.agent6') }}
              </Button>
            </div>
          </div>
        </ion-item>
      </div>
      <!-- 宝箱/红包 -->
      <div v-if="rewardShowMode !== ZDisplayMode.enum.RECEIVE"
        class="reward-box w-full rounded-middle bg-200 flex flex-wrap px-[0.625rem] py-[0.625rem]">
        <div class="relative reward-item" v-for="(item, index) in rewardList" :value="index" :key="item.userCount"
          @click="openBoxHandle(item)">
          <div :class="item.isMeet && !item.isOpen ? 'redPacketGet' : ''" class="flex ">
            <img v-show="!item.showOpenAni" class="w-[4.25rem] h-[4.25rem]" :src="getBoxIconPath(item.isOpen)"
              @click="activeRedPacketUuid = item.uuid" />
            <img v-show="item.showOpenAni" class="w-[4.25rem] h-[4.25rem] transition-all" :src="getBoxIconAniPath()" />
            <div
              class="text-position absolute top-[2.5625rem] leading-[0.75rem] -translate-x-8 w-16 text-[0.6875rem] text-[#FFF] font-weight-bold text-center text-with-shadow "
              v-if="item.isOpen || showRewardAmount">
              {{ getBoxAmount(item) }}
            </div>
          </div>
          <div v-show="!item.isTrue" class="text-color arrow_icon absolute right-[0.25rem] top-[2rem] text-sm"> > </div>
          <div class="i8n-box w-[4.25rem] text-color my-[0.625rem]">
            {{ $t('activity.agent9') }}
            <span class="color-text-currency">{{ item.userCount }}</span>
            {{ $t('activity.agent7') }}
          </div>
        </div>
        <div class="reward-item"></div>
        <div class="reward-item"></div>
      </div>
      <!-- 有效推广人数 -->
      <div v-if="rewardShowMode === ZDisplayMode.enum.RECEIVE" class="w-full h-auto rounded-middle bg-200">
        <ion-item>
          <div class="condition font-weight-bold text-color text-xs">
            <div>{{ $t('activity.agent10') }}</div>
            <div>{{ $t('activity.agent11') }}</div>
          </div>
        </ion-item>
        <ion-item v-for="(item, index) in rewardList" :key="index"
          :lines="(index !== rewardList.length - 1 ? undefined : 'none')">
          <div class="condition">
            <div class="text color-text-100">{{ `≥${item.userCount}` }}</div>
            <div v-if="bonusType === ZRewardType.enum.RANDOM" class="text font-weight-bold color-text-currency">{{
          `${formatMoneyToShow(item.min)}~${formatMoneyToShow(item.max)}`
        }}</div>
            <div v-if="bonusType === ZRewardType.enum.FIXED" class="text font-weight-bold color-text-currency">{{ formatMoneyToShow(item.max) }}</div>
          </div>
        </ion-item>
      </div>
      <!-- 什么是有效推广人数 -->
      <div v-if="showValidCondition" class="validCondition w-full h-auto rounded-middle bg-200">
        <ion-item lines="full">
          <div class="w-full text-left my-[0.25rem]">
            <p class="text-color font-weight-bold text-xs">{{ $t('activity.agent13') }}
              <span v-if="conditionType === ZValidCondition.enum.ALL">{{ $t('activity.agent14') }}</span>
              <span v-if="conditionType === ZValidCondition.enum.ONE">{{ $t('activity.agent15') }}</span>
            </p>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.firstRecharge.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-color text-left w-[16.25rem]">{{ $t('activity.agent16') }}</div>
            <div class="text color-link font-weight-bold text-right">{{
          `≥${formatMoneyToShow(activityInfo.firstRecharge.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeAmount.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-color text-left w-[16.25rem]">{{ $t('activity.agent17') }}</div>
            <div class="text color-link font-weight-bold text-right">{{
          `≥${formatMoneyToShow(activityInfo.rechargeAmount.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.validBet.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-color text-left w-[16.25rem]">{{ $t('activity.agent18') }}</div>
            <div class="text color-link font-weight-bold text-right">{{
          `≥${formatMoneyToShow(activityInfo.validBet.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeDay.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-color text-left w-[16.25rem]">{{ $t('activity.agent19') }}</div>
            <div class="text color-link font-weight-bold text-right">{{ `≥${activityInfo.rechargeDay.days}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeTimes.status)">
          <div class="condition py-[0.25rem]">
            <div class="text text-color text-left w-[16.25rem]">{{ $t('activity.agent20') }}</div>
            <div class="text color-link font-weight-bold text-right">{{ `≥${activityInfo.rechargeTimes.count}` }}</div>
          </div>
        </ion-item>
      </div>
      <!-- 活动描述 -->
      <div class="text-xs leading-5 font-weight-regular rule-text keep-space p-[0.625rem] rounded-middle bg-200">
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
import Button from '@/components/second/Button/index.vue'
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
  handleMouseMove
} = useLogic()

</script>

<style scoped>

ion-item {
  --background: transparent;
  --border-color: var(--color-line);
}

ion-segment {
  --background: transparent;
  border-radius: 0;
  display: flex;
  justify-content: left;
}

ion-segment-button.segment-button-disabled {
  opacity: 1;
}

ion-segment-button.ios {
  --border-radius: .375rem;
  --background: transparent;
  --color: var(--color-text-100);
  --indicator-color: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --indicator-box-shadow: none;
  flex: 0 0 auto;
  text-transform: capitalize;
  min-width: 0;
  max-width: 2.25rem;
  min-height: 2.5rem;
  max-height: 2.5rem;
  margin: 0.5rem 0.375rem 0.5rem 0;
}

ion-segment-button.ios::part(native) {
  max-width: 2.25rem;
}

ion-button.copy::part(native) {
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  /* width: 1rem; */
}

.validCondition ion-item:last-child {
  --border-color: transparent;
}

.claimHistory,
.copy,
.more {
  --color: var(--color-text-100);;
}

.claimHistory .icon {
  font-size: 24px;
}

.copy .icon {
  font-size: 1.75rem;
  color: var(--color-copy-button);
}

.text-with-shadow {
  text-shadow: -1px -1px 1px red, 1px -1px 1px red, -1px 1px 1px red, 1px 1px 1px red;
}

.condition {
  width: 100%;
  display: flex;
  text-align: center;
  font-size: .75rem;
  align-items: center;
  justify-content: space-between;
}

.text {
  font-size: var(--font-size-12);
}

.text-color {
  color: var(--color-text-100);
}

.rule-text {
  color: var(--color-text-80);
}

/* 红包抖动效果 */
.redPacketGet {
  animation-name: redPacketShake;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

.i8n-box {
  white-space: normal;
  text-align: center;
  font-size: 0.65rem;
  line-height: 0.9rem;
}

.claim-click {
  flex-direction: column;
}

@keyframes redPacketShake {
  0% {}

  30% {
    scale: 1.1;
    transform: rotate(0deg);
  }

  40% {
    transform: rotate(-15deg);
  }

  50% {
    transform: rotate(0deg);
  }

  60% {
    transform: rotate(-15deg);
  }

  70% {
    transform: rotate(0deg);
    scale: 1.1;
  }

  100% {
    scale: 1;
  }
}

.reward-box {
  justify-content: space-between;
}

.reward-item {
  width: 25%;
}

.text-position {
  left: 2.1rem;

}

.reward-item:nth-child(4),
.reward-item:nth-child(4n) {
  width: 20%;
}
</style>
