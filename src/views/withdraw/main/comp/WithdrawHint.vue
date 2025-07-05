<script setup lang="ts">
import Button from '@/components/first/Button/index.vue'

import {
  IonModal,
} from '@ionic/vue'
import { getTheme } from '@/theme/hooks';
const { theme } = getTheme();
const emit = defineEmits<{
  (e: 'update:visible', bool: boolean): void
}>()
const visible = defineModel<boolean>('visible', { required: true })
defineProps<{
  hintIndex: string
}
>()
const modalDismiss = () => {
  emit('update:visible', false)
}
</script>
<template>
  <ion-modal :class="[theme, 'withdrawHint']" :is-open="visible" @didDismiss="modalDismiss">
    <div class="text-center mt-3">
      <p class="text-base">{{ $t('main.tips') }}</p>
    </div>
    <div class="text-[0.8125rem] text-center">
      <p v-if="hintIndex === '1'" class="text-center">{{ $t('viewsAssets.demoUnWithdraw') }}</p>
      <p v-if="hintIndex === '2'" class="text-center">{{ $t('viewsAssets.singleDepositWithdrawal') }}</p>
    </div>
    <div class="btn-c">
      <Button @click="modalDismiss">{{ $t('activity.redPacket10') }}</Button>
    </div>
  </ion-modal>
</template>

<style scoped lang="less">
/* 提现提示弹窗 */
ion-modal.withdrawHint {
  --width: 19.375rem;
  --height: 10rem;
  --background: var(--color-bg-300);
  --border-radius: .5rem;
  color: var(--color-text-100)
}

ion-modal.withdrawHint.amber-purple {
  --background: var(--color-bg-100);
}


.btn-c {
  margin: 0.5rem auto;
  width: 100px;
}

.new-skin-symbol {
  ion-modal.withdrawHint {
    --width: 19.375rem;
    --height: 10rem;
    --background: var(--ep-color-background-fill-surface-raised-L1);
    --border-radius: var(--ep-border-radius-l, .5rem);
    color: var(--ep-color-text-default)
  }
}
</style>
