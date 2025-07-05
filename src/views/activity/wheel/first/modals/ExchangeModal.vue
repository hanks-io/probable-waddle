<!-- 幸运转盘-兑换弹窗 -->
<template>
  <ion-modal id="modal-exchange" :is-open="modalVisible" @didDismiss="modalDismiss">
    <h5 class="text-center color-text-100">{{ $t('activity.redeem2') }}</h5>
    <RewardCards :rewardCards="rewardCards"/>
    <form class="px-2" @submit="submitForm">
      <p class="text-xs color-text-100 my-3">{{ $t('viewsActivity.currentlyAvailableForExchange') }} : {{ summation }}</p>
      <!-- 输入兑换个数 -->
      <ion-item class="mb-[10px]">
        <ion-input mode="ios" v-model="amount" type="number" :placeholder="$t('viewsActivity.pleaseEnterTheExchangeAmount')" required :readonly="!summation"/>
        <ion-button class="absolute my-auto right-0 z-10 text-[12px]" fill="clear" @click="setMaxHandle">
          <div class="button-enabled py-1 px-4 flex items-center justify-center rounded-middle">
            <p class="text-xs">{{ $t('viewsAssets.max') }}</p>
          </div>
        </ion-button>
      </ion-item>
      <ion-button class="w-full" fill="clear" type="submit">
        <div class="h-[2.1875rem] w-[10rem] flex items-center justify-center rounded-middle" :class="summation ? 'button-enabled' : 'button-disabled'">
          <ion-label class="text-sm">{{ $t('activity.redeem2') }}</ion-label>
        </div>
      </ion-button>
    </form>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonItem, IonInput, IonButton, IonLabel } from '@ionic/vue';
import RewardCards from './components/RewardCards.vue';
import useExchangeModalLogic from '../../exchangeModalLogic';

const props = defineProps({
  modalVisible: { type: Boolean, required: true },                              // 弹窗显示状态
  rewardCards: { type: Array as () => Record<string, any>[], required: true },  // 弹窗显示状态
})

const emit = defineEmits(['visibleChange', 'exchange'])

const {
  amount,
  summation,
  modalDismiss,
  submitForm,
  setMaxHandle
} = useExchangeModalLogic({ emit, props })

</script>

<style scoped>
ion-modal#modal-exchange {
  --width: fit-content;
  --min-width: 21.875rem;
  --height: fit-content;
  --border-radius: var(--rounded-middle);
  --background: var(--color-bg-200);
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

ion-item.sc-ion-input-ios-h:not(.item-label):not(.item-has-modern-input), ion-item:not(.item-label):not(.item-has-modern-input) .sc-ion-input-ios-h {
  --padding-start: 10px; /* ion-input左内边距(ion-item内ion-input默认取消左内边距) */
}

ion-input { /* 输入框样式 */
  --placeholder-color: var(--color-text-40);
  --placeholder-opacity: 1;
  --padding-bottom: 0px;
  --padding-start: 10px;
  --padding-top: 0px;
  --border-width: 0px;
  --border-radius: var(--rounded-small);
  --color: var(--color-text-100);
  font-size: 12px;
}

:global(#modal-exchange ion-input .input-wrapper.sc-ion-input-ios) {
  border: 1px solid #566488;
}

ion-button {
  --ripple-color: transparent;
  --background-hover: transparent;
  --color: var(--color-lucky-button-text);
}

div.button-enabled {
  background: linear-gradient(31.96deg, #AD65ED 1.88%, #E693F9 100%);
  box-shadow: 0px 2px 2px 0px #FFFFFF66 inset, 0px -2px 2px 0px #FFFFFF66 inset;
}

div.button-disabled {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), linear-gradient(31.96deg, #AD65ED 1.88%, #E693F9 100%);
}
</style>
