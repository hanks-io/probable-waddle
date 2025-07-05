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
      <ion-button class="default-unmet-receive-btn w-full h-[3.125rem]" @click="unmetBtnClick">{{ $t('activity.unmetButton') }}</ion-button>
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
@import "@/views/activity/sign/components/default/styles/modal/unmetReceiveModal/base.less";
@import "@/views/activity/sign/components/default/styles/modal/unmetReceiveModal/theme-style.less";

#activity-sign-components-default-modal-unmetReceiveModal.style();

.yellow-dark {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --color-primary-btn-text-disable,
    --color-bg-200,
    --text-color-white-100,
    --text-color-white-40,
    --accent-color-green,
    --theme-color-800,
    --color-text-black-100,
    --button-right-bg-color-shade,
    --button-right-bg-color-tint,
    --button-right-bg-color-shade
  );
}

.green-dark {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --color-primary-btn-text-disable,
    --color-bg-200,
    --text-color-white-100,
    --text-color-white-40,
    --accent-color-green,
    --theme-color-800,
    --text-color-white-100,
    --sign-default-footer-btn-shade,
    --sign-default-footer-btn-tint,
    --sign-default-footer-btn-shade,
  )
}

.purple-light {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --sign-default-unmetReceiveModal-bg,
    --color-bg-200,
    --sign-default-current-vip-text,
    --text-color-black-80,
    --accent-color-green,
    --theme-color-800,
    --text-color-white-100,
    --sign-default-footer-btn-shade,
    --sign-default-footer-btn-tint,
    --sign-default-footer-btn-shade,
  )
}

.amber-purple {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --sign-default-unmetReceiveModal-bg,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --accent-color-green,
    --theme-color-800,
    --text-color-white-100,
    --sign-default-unmetReceiveModal-btn-focused,
    --sign-default-unmetReceiveModal-btn-hover,
    --sign-default-unmetReceiveModal-btn-focused
  )
}

.blue-default {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --sign-default-unmetReceiveModal-bg,
    --color-bg-200,
    --color-text-white-100,
    --text-color-white-40,
    --sign-default-extra-reward,
    --sign-default-footer-btn-bg,
    --color-text-white-100,
    --sign-default-footer-btn-bg,
    --sign-default-footer-btn-bg,
    --sign-default-footer-btn-bg
  )
}

.auroral-yellow {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --sign-default-unmetReceiveModal-bg,
  )
}

.forest-green {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --sign-default-unmetReceiveModal-bg,
    --color-bg-200,
    --color-text-white-100,
    --color-text-gray-200,
    --sign-default-extra-reward,
    --theme-color-gradient-100,
    --color-text-white-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
  )
}

.green-default {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --sign-default-unmetReceiveModal-bg,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --sign-default-extra-reward,
    --theme-color-gradient-100,
    --color-text-white-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
  )
}

.new-skin-symbol {
  #activity-sign-components-default-modal-unmetReceiveModal.style(
    --ep-neutral-black-black-40,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-default,
    --ep-color-text-weaker,
    --ep-color-text-warning,
    --ep-dynamic-primary,
    --ep-color-text-inverse,
    --ep-dynamic-primary,
    --ep-dynamic-primary,
    --ep-dynamic-primary
  );
}
</style>
