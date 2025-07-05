<template>
  <ion-modal id="receiveModal" ref="modal" :is-open="visible" :backdrop-dismiss="false">
    <div class="w-full h-full flex flex-col items-center overflow-y-scroll">
      <!-- 顶部图片 -->
      <div class="w-[22.5rem] h-[30rem] relative">
        <img class="w-full h-full" :class="visible ? 'show-reward' : 'hidden-reward'" src="/images/sign/receive-money.png" />
        <div class="check-success text-gradient absolute bottom-[1.5rem] left-0 w-full text-center">
          {{ $t('activity.checkSuccess') }}
        </div>
      </div>
      <!-- 获得奖励 -->
      <div class="get-prize">{{ $t('activity.getPrize') }}</div>
      <!-- 获取金额 -->
      <div class="mt-[3.25rem] mb-[3.25rem] w-full receive-money flex-center">
        <div class="sign-reward text-gradient receive-plus">+ </div>
        <div class="sign-reward text-gradient"> {{ formatMoneyToShow(receiveInfo.successReward) }}</div>
        <div v-if="receiveInfo.extraReward" class="ml-[1.375rem] extra-reward text-gradient">{{ $t('viewsAssets.Extra') }} {{ `+${formatMoneyToShow(receiveInfo.extraReward)}` }}</div>
      </div>
      <!-- 知道了 按钮 -->
      <ion-button class="receive-btn w-[10.3125rem] h-[2.5rem]" @click="receiveBtnClick">
        {{ $t('activity.unmetButton') }}
      </ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonButton } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { SignItem } from '@/views/activity/sign/hooks/data'
import { useReceiveModelLogic } from '@/views/activity/sign/hooks/receiveModelLogic'

const emit = defineEmits(["closeReceive"]); // 定义传递事件方法: 注册
const props = defineProps<{
  receiveInfo: SignItem;
}>();

const {
  visible,
  receiveBtnClick
} = useReceiveModelLogic({ emit });
</script>

<style scoped lang="less">
  @import "@/views/activity/sign/components/first/style/receiveModel/base.less";
</style>
