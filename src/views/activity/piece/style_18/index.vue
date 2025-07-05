<template>
  <!-- 头部 -->
  <ion-header class="ion-no-border fixed z-30">
    <pieceHeader :headerText="headerText" />
  </ion-header>
  <!-- 可抽奖次数 -->
  <spins-times :shareHandle="shareHandle" :roundCount="roundCount" />

  <!-- 倒计时 -->
  <countDown :expireTime="expireTime" v-if="expireTime" />

  <!-- 转盘 -->
  <pieceWheel v-model:luckyRef="luckyRef" v-bind="pieceWheelProps" />

  <!-- 获奖金币进度条 -->
  <bonusProcess v-bind="bonusProcessProps" />

  <!-- 中奖栏 -->
  <pieceTab v-model="recordTabs" v-bind="pieceTabProps" />

  <!-- 公告 -->
  <pieceNotice :rule="rule" />
  <!-- 分享弹框 -->
  <shareModal v-model="modalShareVisible" v-bind="shareModalProps" />
  <!-- 奖励弹窗 -->
  <prizeModal v-model="modalPrizeVisible" v-bind="prizeModalProps" />

  <!-- 帮助弹窗 -->
  <helpModal v-model="modalHelpVisible" v-bind="helpModalProps" />

  <!-- 邀请助力弹窗 -->
  <pieceModal v-model="modalPieceVisible" v-bind="pieceModalProps" />
</template>

<script setup lang="ts">
import { useI18n } from "@/hooks/useI18n";
import { formatMoneyToShow } from '@/utils/custom';
import { IonHeader } from '@ionic/vue';
import useLogic from '../logic';
import bonusProcess from './components/bonus-process.vue';
import countDown from './components/count-down.vue';
import helpModal from './components/help-modal.vue';
import pieceHeader from './components/piece-header.vue';
import pieceModal from '../components/piece-modal.vue';
import pieceNotice from './components/piece-notice.vue';
import pieceWheel from './components/piece-style18-wheel.vue';
import pieceTab from './components/piece-tab.vue';
import prizeModal from './components/prize-modal.vue';
import shareModal from '@/components/ShareModal/index.vue';
import spinsTimes from './components/spins-times.vue';

const { t } = useI18n()
const { tenantInfo, roundAmount, rangeAmount,
  shareHandle, modalShareVisible, modalCloseHandle, awardCount,
  modalPrizeVisible, modalHelpVisible, modalPieceVisible, rule,
  prizes, roundCount, startCallback, endCallback, luckyRef, expireTime,
  assistanceCashAwards, assistanceCashHelps, btnLoading, awardReceiveHandle,
  inviteFriendsHandle, recordTabs, startClick, scrollDuration, isShowAnimationEl, isAddAnimation,
  launchHandle, shareUrl, sharePhones, whatsappHandle, sendSMSHandle, winning, prizeType } = useLogic()

/**
 * 顶部导航栏标题
 */
const headerText = computed(() => `${t('activity.earn')}${tenantInfo.value?.merchantCy}${formatMoneyToShow(Number(roundAmount.value))}${t('activity.freeMoney')}`)

/**
 * 转盘props
 */
const pieceWheelProps = ref({
  prizes,
  roundCount,
  startCallback,
  endCallback,
  startClick,
  isShowAnimationEl,
  isAddAnimation,
  rangeAmount,
  winning,
  prizeType,
  awardCount
})

/**
 * 分享弹窗props
 */
const shareModalProps = ref({
  firstTitle: t('activity.inviteFriendsWithdrawal'),
  secondTitle: t('activity.sendRandomPlayer'),
  shareUrl,
  sharePhones,
  whatsappHandle,
  sendSMSHandle,
  launchHandle
})


/**
 * 邀请助力弹窗props
 */
const pieceModalProps = ref({
  closeHandle: modalCloseHandle,
  rangeAmount,
  roundAmount,
  tenantInfo,
  btnLoading,
  awardReceiveHandle,
  inviteFriendsHandle,
})

/**
 * 奖励弹窗props
 */
const prizeModalProps = ref({
  closeHandle: modalCloseHandle,
  merchantCy: tenantInfo.value?.merchantCy,
  awardCount,
})

/**
 * 帮助弹窗props
 */
const helpModalProps = ref({
  closeHandle: modalCloseHandle,
  rule,
})

/**
 * 中奖栏props
 */
const pieceTabProps = ref({
  cashAwards: assistanceCashAwards,
  cashHelps: assistanceCashHelps,
  tenantInfo,
  scrollDuration,
})

/**
 * 获奖金币进度条props
 */
const bonusProcessProps = ref({
  merchantCy: tenantInfo.value?.merchantCy,
  roundAmount,
  rangeAmount,
})
</script>
