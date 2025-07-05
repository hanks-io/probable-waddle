<script setup lang="ts">
import {
  IonIcon,
} from "@ionic/vue";

const emit = defineEmits<{
  (e: 'queryWalletBalance'): void
  (e: 'enterWallet'): void
}>()

let props = withDefaults(defineProps<{
  walletBalance: string
  merchantCy: string
  isCompleted: boolean
}>(), {
  
});
</script>

<template>
  <div class="wallet-wrap">
    <div class="wallet-balance-area">
      <span>{{ $t('viewsAssets.000001') }}:</span>
      <span class="wallet-balance-value">{{ merchantCy }}{{ walletBalance }}</span>
      <ion-icon slot="icon-only" :class="['refresh', { 'animate-refresh': isCompleted }]" src="/first/svg/perfil/refresh.svg" @click="emit('queryWalletBalance')" />
    </div>
    <div class="wallet-hall" @click="emit('enterWallet')">
      {{ $t('viewsAssets.000002') }}
    </div>
  </div>
</template>

<style scoped lang="less">
#recharge-main-default-wallet-default-index {
  .style(@Color: --color-text-100) {
    .wallet-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.875rem;
      font-weight: 400;
      margin-top: .9375rem;
      color: var(@Color);

      .wallet-balance-area {
        width: 13.5rem;
        height: 1.5rem;
        font-size: 1rem;
        line-height: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .wallet-balance-value {
          color: var(--color-currency);
        }

        .refresh {
          cursor: pointer;
        }
      }

      .wallet-hall {
        height: 1.5rem;
        font-size: .875rem;
        line-height: 1.5rem;
        text-align: center;
        border: .0625rem solid var(--theme-color-800);
        border-radius: .375rem;
        padding: 0 .625rem;
        cursor: pointer;
      }
    }
  }
}

.blue-default,
.green-default,
.amber-purple,
.forest-green {
  #recharge-main-default-wallet-default-index.style();
}
</style>
