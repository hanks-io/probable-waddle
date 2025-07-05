<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
const emit = defineEmits<{
  (e: 'recordHandle'): void
}>()
defineProps<{
  merchantCy: string
  isDemo: boolean
  betAmount: number
  prompt: string
  balance: number,
  isHideAuditRecords: boolean
}
>()
const recordHandle = () => {
  emit('recordHandle')
  //recordHandle(WithdrawPageType.WITHDRAW_AUDIT)
}
</script>
<template>


  <div class="balance-area">
    <p class="balance-wrap">
      <span class="account">{{ $t('label.accountBalance') }}</span>
      <span class="balance-w">{{ merchantCy }}<span class="amount">{{
        formatMoneyToShow(balance) }}</span></span>
    </p>
    <p v-if="isDemo" class="withdraw-tip">{{ prompt }}</p>
    <p v-if="!isDemo && betAmount > 0" class="withdraw-tip">
      {{ $t('splice.withdrawCondition1') }}
      <span class="balance-w">{{ `${merchantCy} ` + formatMoneyToShow(betAmount) }}</span>
      {{ $t('splice.withdrawCondition2') }}
      <span v-if="!isHideAuditRecords" class="link-text" @click="recordHandle">{{
        $t('viewsAssets.viewDetail') }}</span>
    </p>
  </div>
</template>

<style scoped lang="less">
#withdraw-main-balanceArea-index {
  .style(@tipColor: --color-text-40, @balanceColor: --color-currency, @tipBalanceColor: --color-text-100, @balanceSize: --font-size-12, @accountColor: --color-text-100) {
    .balance-area {
      margin: .5rem 0;
      font-size: var(--font-size-12);

      .withdraw-tip {

        color: var(@tipColor);
        line-height: 18px;

        .balance-w {
          color: var(@tipBalanceColor);

        }

        .link-text {
          .dynamic-font(@color: --color-link);
          cursor: pointer;
        }
      }

      .balance-wrap {
        font-size: var(--font-size-12);

        .account {
          font-weight: var(--font-weight-bold);
          font-size: var(@balanceSize);
          color: var(@accountColor);

        }

        .balance-w {
          font-weight: var(--font-weight-bold);
          font-size: var(@balanceSize);
          color: var(@balanceColor);
          margin-left: .5rem;

          .amount {
            margin-left: .1875rem;
          }
        }
      }
    }

  }

}

.yellow-dark, .green-dark, .amber-purple {
  #withdraw-main-balanceArea-index.style();
}



.purple-light {
  #withdraw-main-balanceArea-index.style(@tipColor: --color-text-80);
}


.blue-default {
  #withdraw-main-balanceArea-index.style(@balanceSize: --font-size-14, @tipBalanceColor: --color-currency);
}

.green-default,
.forest-green {
  #withdraw-main-balanceArea-index.style(@balanceColor: --accent-color-yellow, @tipBalanceColor: --accent-color-yellow);
}

.auroral-yellow {
  #withdraw-main-balanceArea-index.style(@balanceColor: --accent-color-yellow-1, @tipBalanceColor: --accent-color-yellow-1);
}

#withdraw-main-balanceArea-new-index {
  .style(@tipColor: --color-text-40, @balanceColor: --color-currency, @tipBalanceColor: --color-text-100, @balanceSize: --font-size-12, @accountColor: --color-text-100) {
    .balance-area {
      margin: .5rem 0;
      font-size: var(--ep-font-size-s, .75rem);

      .withdraw-tip {

        color: var(--ep-color-icon-weaker);
        line-height: 18px;

        .balance-w {
          color: var(--ep-color-text-default);

        }

        .link-text {
          color: var(--ep-color-text-info);
          cursor: pointer;
        }
      }

      .balance-wrap {
        font-size: var(--ep-font-size-m, .875rem);
        font-weight: var(--ep-font-weight-medium, 500);

        .account {
          color: var(--ep-color-text-default);

        }

        .balance-w {
          color: var(--ep-color-icon-warning);
          margin-left: .5rem;

          .amount {
            margin-left: .1875rem;
          }
        }
      }
    }

  }

}

.new-skin-symbol {
  #withdraw-main-balanceArea-new-index.style();
}
</style>
