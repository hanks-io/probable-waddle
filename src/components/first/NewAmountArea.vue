<script setup lang="ts">
import { getImageUrl } from '@/utils/url'
import { IonIcon } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils';


const props = withDefaults(defineProps<{
  isVirtualCurrency: boolean
  type?: 'recharge' | 'withdraw'
  amountInput: string
  merchantCy: string
  rateValue?: number

}
>(), {
  type: 'recharge',
  amountColor: '--accent-color-orange'
})

const ratio = ref(0)
const realCurrency = computed(() => ratio.value * Number(props.amountInput))
const legalTender = computed(() => useTenantStore().tenantInfo?.legalTender);

onMounted(async () => {
  ratio.value = await useCalcRealCurrencyRatio()

})


</script>
<template>
  <div class="no-cycle-amount-input-wrap">
    <div class="top" v-if="isVirtualCurrency">
      <div class="title">{{ type === 'recharge' ? $t('depositWithdrawal.000015') : $t('depositWithdrawal.0000151') }}</div>
      <div class="virtual-currency">
        <img :src="getImageUrl('img/virtualCurrency.png')">
        <span class="virtual-count"> {{'1'}} </span>
        <div> = {{ formatMoneyToShow(ratio) }}<span class="ml-1">{{ legalTender }}</span></div>
      </div>
    </div>
    <div v-if="type === 'recharge'" class="text-tip-area">
      <slot name="textTip"></slot>
    </div>
    <div class="amount-btn-wrap">
      <slot name="amountBtn"></slot>
    </div>
    <div class="amountInput">
      <slot name="amountInput"></slot>
    </div>
    <div class="description-wrap" v-if="Number(amountInput) && isVirtualCurrency">
      <div class="description-title">{{ $t(`depositWithdrawal.${type === 'recharge' ? '000014' : '000013'}`) }}</div>
      <div class="description">
        <ion-icon slot="icon-only" :src="getImageUrl('svg/approximatelyEqual.svg')" class="amount-icon" />
        <div class="amount">
          {{ formatMoneyToShow(realCurrency) }}
          <span class="ml-1">{{ legalTender }}</span>
        </div>
      </div>
    </div>
    <div class="fee-wrap" v-if="amountInput && type === 'withdraw'">
      <ion-icon class="balance-fee" src="/first/svg/assets/warning.svg" />
      <span class="fee">{{ $t('viewsAssets.handlingFee') }}:
        <span class="handling-fee">
          {{ rateValue && formatMoneyToShow(rateValue) }} {{ merchantCy }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped lang="less">
#comp-first-noCycle-amount-index {

  .style(@wrapBg: --ep-color-background-fill-surface-raised-L1,
    @border: --ep-color-border-default,
    @titleColor: --ep-color-text-default,
    @descColor: --ep-color-text-weaker,
    @amountIconColor: --ep-color-icon-warning,
    @amountColor: --ep-color-text-warning,
    @inputBg: --ep-color-background-fill-surface-lowered,
    @feeColor: --ep-color-text-weaker,
    @feeIconColor: --ep-color-icon-weaker,
    @feeAmountColor: --ep-color-text-warning) {
    .no-cycle-amount-input-wrap {
      box-sizing: border-box;
      font-size: var(--ep-font-size-s, .75rem);
      width: 22.875rem;
      margin: 0 auto 1.3125rem;
      border: 1px solid var(@border);
      background: var(@wrapBg);
      padding: .8125rem .625rem 1rem;
      border-radius: var(--ep-border-radius-m, .375rem);

      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--ep-font-size-s, .75rem);
        margin-bottom: .625rem;
        color: var(@titleColor);

        .title {
          font-weight: var(--ep-font-weight-bold, 700);
          line-height: 1.125rem;
          height: 1.125rem;
        }

        .virtual-currency {
          display: flex;
          align-items: center;
          border: 1px solid var(@border);
          border-radius: var(--ep-border-radius-m, .375rem);
          padding: 0 .625rem;
          height: 1.125rem;

          .virtual-count {
            padding: 0 .125rem;
          }

          img {
            display: block;
            width: .875rem;
            height: .875rem;
            margin-right: .125rem;
          }



        }
      }

      .amount-btn-wrap {
        margin-bottom: .75rem;
      }

      .text-tip-area {
        background: var(@wrapBg);
        margin-bottom: .625rem;
      }

      .amountInput {
        width: 21.625rem;
        margin: 0 auto;
        background: var(@inputBg);
        border-radius: var(--ep-border-radius-m, .375rem);
      }

      .description-wrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: .625rem;
        font-size: var(--ep-font-size-s, .75rem);
        line-height: 1.125rem;

        .description-title {
          color: var(@descColor);
        }

        .amount-icon {
          color: var(@amountIconColor);
          font-size: var(--ep-font-size-s, .75rem);
          margin: 0 .125rem;
        }

        .amount {
          color: var(@amountColor);
        }

        .description {
          display: flex;
          align-items: center;

        }
      }

      .fee-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        line-height: 1.125rem;
        text-align: right;

        .fee {
          color: var(@feeColor);

        }

        ion-icon.balance-fee {
          color: var(@feeIconColor);
          margin-right: .1875rem;

        }


        .handling-fee {
          color: var(@feeAmountColor);
          margin-right: .1875rem;

        }

      }







    }


  }

}





.green-dark,
.yellow-dark,
.amber-purple,
.auroral-yellow,
.forest-green,
.green-default,
.blue-default,
.auroral-yellow {
  #comp-first-noCycle-amount-index.style(@wrapBg: --color-bg-200,
    @border: --line-color,
    @titleColor: --color-text-100,
    @descColor: --color-text-40,
    @amountIconColor: --accent-color-orange,
    @amountColor: --accent-color-orange,
    @inputBg: --color-bg-400,
    @feeColor: --color-text-40,
    @feeIconColor: --color-text-40,
    @feeAmountColor: --accent-color-orange)
}



.purple-light {

  #comp-first-noCycle-amount-index.style(@wrapBg: --color-bg-200,
    @border: --line-color,
    @titleColor: --color-text-100,
    @descColor: --color-text-40,
    @amountIconColor: --accent-color-orange,
    @amountColor: --accent-color-orange,
    @inputBg: --color-bg-400,
    @feeColor: --color-text-40,
    @feeIconColor: --color-text-40,
    @feeAmountColor: --accent-color-orange)
}




.new-skin-symbol {
  #comp-first-noCycle-amount-index.style();
}
</style>
