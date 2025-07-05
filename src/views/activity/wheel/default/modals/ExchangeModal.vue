<!-- 兑换弹窗 -->
<template>
  <ion-modal id="modal-exchange" :is-open="modalVisible" @didDismiss="modalDismiss">
    <h5 class="title-exchange">{{ $t("activity.redeem2") }}</h5>
    <RewardCards :rewardCards="rewardCards" />
    <ion-icon @click="modalDismiss" class="close" :src="closeIcon" />
    <form class="form-wrap" @submit="submitForm">
      <p class="p-cls">{{ $t("viewsActivity.currentlyAvailableForExchange") }} :
        {{ summation }}</p>
      <!-- 输入兑换个数 -->
      <ion-item class="item">
        <ion-input class="input" mode="ios" v-model="amount" type="number"
          :placeholder="$t('viewsActivity.pleaseEnterTheExchangeAmount')" required :readonly="!summation" />
        <ion-button class="btn-max" fill="clear" @click="setMaxHandle">
          <div class="button-enabled title">
            <p class="text-xs">{{ $t("viewsAssets.max") }}</p>
          </div>
        </ion-button>
      </ion-item>
      <ion-button class="sub-btn" fill="clear" type="submit">
        <div class="btn-cls" :class="summation ? 'button-enabled' : 'button-disabled'">
          <ion-label class="label">{{ $t("activity.redeem2") }}</ion-label>
        </div>
      </ion-button>
    </form>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonItem, IonInput, IonButton, IonLabel, IonIcon } from "@ionic/vue";
import RewardCards from "./components/RewardCards.vue";
import useExchangeModalLogic from "../../exchangeModalLogic";
import closeIcon from "@/assets/img/common/close.svg";

const props = defineProps({
  modalVisible: { type: Boolean, required: true },                              // 弹窗显示状态
  rewardCards: { type: Array as () => Record<string, any>[], required: true }  // 弹窗显示状态
});

const emit = defineEmits(["visibleChange", "exchange"]);

const {
  amount,
  summation,
  modalDismiss,
  submitForm,
  setMaxHandle
} = useExchangeModalLogic({ emit, props });

</script>

<style scoped lang="less">
// 基础公共 less
@import "@/views/activity/wheel/default/style/Exchange/base-exchange.less";
@import "@/views/activity/wheel/default/style/Exchange/theme-style.less";

#activity-wheel-default-modals-exchangeModal.style();

.blue-default {
  #activity-wheel-default-modals-exchangeModal.style(--color-bg-400,
    --color-text-gray-200,
    --color-border-600,
    --color-text-white-100);
}

.green-default {
  #activity-wheel-default-modals-exchangeModal.style(--color-bg-400,
    --color-text-gray-200,
    --color-line,
    --color-text-gray-100);
}

.amber-purple {
  #activity-wheel-default-modals-exchangeModal.style(--color-bg-400,
    --text-color-light-purple-2-100,
    --line-color,
    --text-color-light-purple-1-100);
}

.title-exchange {
  text-align: center;
  color: var(--ep-color-text-default, var(--color-text-basic));
  font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
  margin: .75rem 0 1.6625rem;
  font-size: var(--ep-font-size-xxl, 24px);
  line-height: 150%;
}

.form-wrap {
  padding: 0 0.75rem;

  .p-cls {
    color: var(--ep-color-text-default, var(--color-text-basic));
    font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
    margin-top: 1.5625rem;
    margin-bottom: 0.875rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }

  ion-input {
    &.input {
      color: var(--ep-color-text-default, var(--color-text-basic));
    }
  }
}

ion-modal#modal-exchange {
  --width: 22.625rem;

  .close {
    position: absolute;
    right: 0.625rem;
    top: 0.625rem;
    color: var(--ep-color-icon-default);
    width: 2.5rem;
    height: 2.5rem;
  }
}

.btn-cls {
  height: 2.5rem;
  width: 21.25rem;
  .flex-center();
  border-radius: var(--border-radius-m, 0.375rem);

  .label {
    color: var(--ep-color-text-inverse, #FFF);
    font-size: var(--ep-font-size-m, 0.875rem);
    font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
  }
}

.button-enabled {
  background: var(--ep-color-background-fill-active-primary, #6687F6);
}

.button-disabled {
  background: var(--ep-color-background-fill-active-disabled, #A3CBFF);
}

.sub-btn {
  border-radius: var(--border-radius-l, 0.5rem);
  margin: 0.25rem 0 1rem;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;

  .button-enabled {
    background: linear-gradient(32deg, var(--ep-color-border-highlight, #FE963B) 1.88%, var(--ep-color-border-warning, #FA8313) 100%);
  }

  .button-disabled {
    border-radius: var(--border-radius-l, 0.5rem);
    background: var(--ep-color-background-fill-active-disabled, #A3CBFF);
  }
}

.btn-max {
  position: absolute;
  margin-top: auto;
  margin-bottom: auto;
  right: 0;
  z-index: 10;
  font-weight: var(--ep-font-weight-regular, var(--font-weight-regular));
  font-size: var(--ep-font-size-s, 0.75rem);
  color: var(--ep-color-text-inverse, #fff);

  .title {
    padding: 0.25rem 1rem;
    .flex-center();
    border-radius: var(--ep-border-radius-m, .375rem);
  }
}
</style>
