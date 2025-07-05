<template>
  <ion-modal ref="modal" :is-open="visible" :backdrop-dismiss="false">
    <div class="unmet-receive">
      <!-- 标题 -->
      <div class="text-center unmet-tips">{{ $t('main.tips') }}</div>
      <!-- 需要充值/投注信息 -->
      <div class="unmet-message text-center mt-[1.0625rem] mb-[1.5rem]">
        <template v-if="unmetInfo.tipsConten == 'unSignDate01'">{{ $t(`activity.${unmetInfo.tipsConten}`) }}</template>
        <template v-else-if="unmetInfo.tipsConten == 'unSignDate02'">{{ $t(`activity.${unmetInfo.tipsConten}`, { day: unmetInfo.signDay }) }}</template>
        <template v-else>
          {{ $t('activity.unmetMsg1') }}
          <span class="text-money">{{ formatMoneyToShow(unmetInfo.rechargeAmount) }}</span>
          {{ $t('activity.unmetMsg2') }}
          <span class="text-money">{{ formatMoneyToShow(unmetInfo.validBet) }}</span>
          {{ $t('activity.unmetMsg3') }}
        </template>
      </div>
      <!-- 知道了 按钮 -->
      <ion-button class="sign-yellow-btn w-full h-[3.125rem]" @click="unmetBtnClick">{{ $t('activity.unmetButton') }}</ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonButton } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { SignItem } from '@/views/activity/sign/hooks/data'
import { useUnmetReceiveLogic } from '@/views/activity/sign/hooks/unmetReceiveLogic'

const emit = defineEmits(["closeUnmetReceive"]); // 定义传递事件方法: 注册
const props = defineProps<{
  unmetInfo: SignItem;
}>();

const {
  visible,
  unmetBtnClick
} = useUnmetReceiveLogic({ emit });
</script>

<style scoped lang="less">
  @import "@/views/activity/sign/components/first/style/unmetReceiveModal/base.less";
</style>
