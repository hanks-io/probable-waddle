<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
const emit = defineEmits<{
  (e: 'queryWalletBalance'): void
  (e: 'enterWallet'): void
}>()

let props = withDefaults(defineProps<{
  walletBalance: string
  merchantCy: string
  isCompleted: boolean

}>(), {});
</script>

<template>
  <div class="wallet-wrap">
    <div class="wallet-info-wrap">
      <div>
        <div class="wallet-balance-title">{{ $t('viewsAssets.000001') }}</div>
        <span class="wallet-balance-value">{{ merchantCy }}<span class="wallet-balance-value-num">{{ walletBalance
            }}</span></span>
        <span class="refresh-wrap" @click="emit('queryWalletBalance')">
          <ion-icon slot="icon-only" :class="['refresh', { 'animate-refresh': isCompleted }]"
            src="/first/svg/perfil/refresh.svg" />
        </span>

      </div>

      <div class="wallet-hall" @click="emit('enterWallet')">
        {{ $t('viewsAssets.000002') }}
      </div>
    </div>
    <slot name="tip"></slot>
    <p class="title">{{ $t('viewsAssets.amount') }}</p>
    <div class="bg-400">
      <slot name="amount"></slot>
    </div>


  </div>
</template>

<style scoped lang="less">
#recharge-main-first-wallet--index {

  .style(@bg: linear-gradient(90deg, #442913 0%, #3D2F16 100%),
    @titleColor: rgba(255, 255, 255, 0.8),
    @refreshColor: rgba(255, 255, 255, 0.4),
    @balanceColor: --accent-color-orange,
  ) {
    .wallet-wrap {
      padding: 0 0.75rem;
      margin: 0.6rem 0 0.75rem;

      .wallet-info-wrap {
        width: 22.875rem;
        height: 3.4375rem;
        background: @bg;
        border-radius: var(--rounded-small);
        padding: 0 1.25rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .wallet-balance-title {
          font-size: var(--font-size-12);
          line-height: 1.125rem;
          color: @titleColor;
          font-weight: var(--font-weight-bold);
        }

        .wallet-balance-value {
          color: var(@balanceColor);
          font-size: var(--font-size-18);
          line-height: 28px;
          font-weight: var(--font-weight-medium);

          &-num {
            margin: 0 12px 0 6px;
          }
        }

        .refresh-wrap {
          cursor: pointer;
          width: 16px;
          height: 16px;

          .refresh {

            color: @refreshColor;
            font-size: var(--font-size-16);
          }

        }




        .wallet-hall {
          height: 1.875rem;
          font-size: 14px;
          line-height: 1.875rem;
          text-align: center;
          padding: 0 10px;
          border: .0625rem solid #FEB805;
          border-radius: var(--rounded-small);
          cursor: pointer;
          color: #FEB805;
        }
      }
    }

    .title {
      .dynamic-font(@fontWeight: --font-weight-bold);
      line-height: 1.125rem;
      margin: .375rem 0;
    }
  }
}

.yellow-dark,
.green-dark {
  #recharge-main-first-wallet--index.style()
}

.purple-light {
  #recharge-main-first-wallet--index.style(@titleColor: rgba(255, 255, 255, 0.6),
  )
}


.amber-purple {
  #recharge-main-first-wallet--index.style(@bg: linear-gradient(90deg, #004279 0%, #0E3E30 100%),


  )
}
</style>
