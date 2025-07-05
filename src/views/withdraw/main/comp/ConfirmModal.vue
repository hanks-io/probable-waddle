<script setup lang="ts">
import PasswordInput from '@/components/PasswordInput.vue'
import Button from '@/components/first/Button/index.vue'
import { close } from 'ionicons/icons'
import { IonIcon, IonModal } from '@ionic/vue'
import { getTheme } from '@/theme/hooks';
import { formatMoneyToShow } from '@/utils/custom'
const { theme } = getTheme();
const passwordRef = ref() // 密码element
const emit = defineEmits<{
  (e: 'passwordHandle', pwd: string): void
  (e: 'onWithdrawCreate'): void
  (e: 'update:visible', bool: boolean): void
}>()
const visible = defineModel<boolean>('visible', { required: true })
const props = defineProps<{
  amountInput: string
  rateValue: number
  merchantCy: string
  rateType: string
  receiveAmount: number
  passwordSwitch?: string
}
>()

const modalDismiss = () => {
  props?.passwordSwitch === 'ON' && passwordRef.value?.clear()
  emit('update:visible', false)
}
const onWithdrawCreate = () => {
  emit('onWithdrawCreate')
}

const passwordHandle = (pwd: string) => {
  emit('passwordHandle', pwd)
}
</script>
<template>
  <ion-modal id="confirmModalWithdraw" :is-open="visible" @didDismiss="modalDismiss">
    <div :class="[theme, 'pop-wrap']">
      <p class="title">{{ $t('viewsAssets.enterWithdrawalPassword') }}</p>
      <ion-icon class="absolute close" :icon="close" @click="modalDismiss" />
      <p class="withdraw">{{ $t('viewsAssets.withdraw') }}</p>
      <p class="amuont" v-if="rateType == 'fixed'">{{ merchantCy }}
        <span class="sum">
          {{ formatMoneyToShow(Number(amountInput) > 0 ? Math.max((Number(amountInput) - rateValue), 0) : 0) }}
        </span>
      </p>
      <p class="amuont" v-else>{{ merchantCy }}
        <span class="sum">
          {{ formatMoneyToShow(receiveAmount > 0 ? Math.max((Number(amountInput) - rateValue), 0) : 0) }}
        </span>
      </p>
      <p class="line h-[1px] w-full mb-4" />
      <div class="rate-type-text">
        <p>{{ $t('viewsAssets.serviceFee') }}</p>
        <p>{{ merchantCy }}{{ formatMoneyToShow(rateValue) }}</p>
      </div>

      <PasswordInput v-if="(passwordSwitch === 'ON')" class="password-input" ref="passwordRef" @input="passwordHandle"
        focus />

      <div v-else class="submit submit-btn">
        <Button @click="onWithdrawCreate">{{ $t('activity.redPacket10') }}</Button>
      </div>
    </div>
  </ion-modal>
</template>

<style scoped lang="less">
.pop-wrap {
  width: 22.875rem;
  .bg-300();
  .rounded-large();
  padding: 16px;
  box-sizing: border-box;
  margin: 8.375rem auto;
  position: relative;
  text-align: center;
  .dynamic-font(@fontSize: --font-size-16, @color: --color-text-80);


  .title {
    line-height: 1.5rem;
    margin-top: 1.1875rem;
    .dynamic-font(@fontSize: --font-size-16, @color: --color-text-80, @fontWeight: --font-weight-bold);
  }

  .withdraw {
    margin: 1.125rem 0 .375rem;
    line-height: 1.125rem;
  }

  .password-input {
    margin: .75rem 0 1.3125rem;
  }

  .close {
    .dynamic-font(@fontSize: --font-size-20, @color: --color-text-40);
    top: .875rem;
    right: .4375rem;

  }

  .line {
    background: var(--line-color);
  }

  .amuont {
    .dynamic-font(@fontSize: --font-size-20, @color: --color-currency, @fontWeight: --font-weight-bold);
    line-height: 1.125rem;
    margin: .75rem 0 1.25rem;

    .sum {
      margin-left: .1875rem;
    }
  }

  .submit-btn {
    width: 60%;
    margin: .75rem auto 1.3125rem;
  }

  .rate-type-text {
    .dynamic-font(@fontSize: --font-size-12, @color: --color-text-60);
    .flex-between()
  }

}

.blue-default {
  .pop-wrap {

    .title,
    .withdraw {
      color: var(--color-text-gray-100)
    }

    .rate-type-text {
      color: var(--color-text-gray-200)
    }
  }

}

.amber-purple {
  .pop-wrap {
    .bg-100();

    .title,
    .withdraw {
      color: var(--color-text-100)
    }

    .rate-type-text {
      color: var(--text-color-light-purple-2-100)
    }
  }

}

#withdraw-main-comp-confirmModal {
  .style() {
    .pop-wrap {
      width: 22.875rem;
      background: var(--ep-color-background-fill-surface-raised-L1);
      border-radius: var(--ep-border-radius-xl, .625rem);
      padding: 16px;
      box-sizing: border-box;
      margin: 8.375rem auto;
      position: relative;
      text-align: center;
      .title {
        line-height: 1.5rem;
        margin-top: 1.1875rem;
        font-weight: var(--ep-font-weight-bold, 700);
        font-size: var(--ep-font-size-l, 1rem);
        color: var(--ep-color-text-default);
      }

      .withdraw {
        margin: 1.125rem 0 .375rem;
        line-height: 1.125rem;
        color: var(--ep-color-text-weaker);
      }

      .password-input {
        margin: .75rem 0 1.3125rem;
      }

      .close {
      
        font-size: 1.25rem;
        top: .875rem;
        right: .4375rem;
        color: var(--ep-color-icon-default);

      }

      .line {
        background: var(--ep-color-border-default);
      }

      .amuont {
        font-weight: var(--ep-font-weight-bold, 700);
        font-size: var(--ep-font-size-xl, 1.125rem);
        line-height: 1.125rem;
        margin: .75rem 0 1.25rem;
        color: var(--ep-color-text-warning);
        .sum {
          margin-left: .1875rem;
        }
      }

      .submit-btn {
        width: 60%;
        margin: .75rem auto 1.3125rem;
      }

      .rate-type-text {
        font-size: var(--ep-font-size-s, .75rem);
        color: var(--ep-color-text-weaker);
        .flex-between()
      }

    }

  }
}

.new-skin-symbol {
  #withdraw-main-comp-confirmModal.style()
}
</style>
