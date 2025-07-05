<!-- 返水规则 -->
<template>
  <ion-modal ref="modal" :is-open="isOpen" @didDismiss="modalDismiss">
    <div class="bg-200 rounded-small px-5 pb-5 w-[22.5rem] mx-auto">
      <h6 class="text-center text-xl">{{ $t('viewsActivity.rebateRules') }}</h6>
      <div class="h-72 overflow-y-auto mb-6">
        <p class="text-[0.875rem] color-text-40 keep-space">
          {{ruleStr}}
        </p>
      </div>
      <ion-item class="submit text-[16px]">
        <Button class="text-[14px] text-white" mode="md" type="submit" size="default" fill="clear" @click="modalDismiss">{{ $t('main.confirm') }}</Button>
      </ion-item>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonItem, IonButton } from '@ionic/vue';
import Button from '@/components/first/Button/index.vue'
import useRuleModalLogic from '../../ruleModalLogic';

const emit = defineEmits(['visibleChange']) // 定义传递事件方法(变更显示状态)

const props = defineProps({
  isOpen: Boolean
})

const { ruleStr, modalDismiss } = useRuleModalLogic({ emit })

</script>

<style scoped>
ion-modal {
  --height: fit-content;
  --border-radius: 16px;
  --max-height: none;
  
}

ion-item {
  --background: transparent;
  --padding-bottom: 0px;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --inner-padding-end: 0;
  --inner-border-width: 0px;
}

</style>
