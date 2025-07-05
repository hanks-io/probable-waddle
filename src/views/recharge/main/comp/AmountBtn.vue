<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import { getImageUrl } from '@/utils/url'

defineProps<{
  amount: number
  rate?: number,
  isActive: boolean
  isVirtualCurrency: boolean
}
>();

</script>


<template>
  <div :class="['btn-wrap', { active: isActive }]">
    <div class="bn-text">
      <div class="amount">
        <img :src="getImageUrl('img/virtualCurrency.png')" v-if="isVirtualCurrency">
        <div class="amount-text">{{ formatMoneyToShow(amount) }}</div>
      </div>
      <p class="rate" v-if="rate">{{ `+${formatMoneyToShow(rate)}%` }}{{ $t('viewsAssets.bonus') }}</p>
    </div>
  </div>
</template>

<style scoped lang="less">

#amount-btn-wrap-new-index {

  .style(@bg: --ep-color-background-fill-surface-raised-L2,
    @amountColor: --ep-color-text-default,
    @rateColor: --ep-color-text-highlight,
    @activeBorder: --ep-color-border-selected,
    @isNew: true) {
    .btn-wrap {
      flex: 0 0 calc(33.333% - (2/3 * .625rem));
      height: 3rem;
      background: var(@bg);
      border-radius: .375rem;
      line-height: 3rem;
      text-align: center;
      flex-shrink: 0;
      cursor: pointer;

      .bn-text {
        display: inline-block;
        line-height: 1.2;
        vertical-align: middle;

        .amount {
          display: flex;
          align-items: center;
          font-size: var(--ep-font-size-l, 1rem);
          font-weight: var(--ep-font-weight-medium, 500);
          color: var(@amountColor);

          img {
            display: block;
            width: 1.25rem;
            height: 1.25rem;
            margin-right: .125rem;
          }
        }

        .rate {
          font-weight: var(--ep-font-weight-regular, 400);
          font-size: var(--ep-font-size-xs, 0.625rem);
          color: var(@rateColor);
        }
      }
    }

    .active {
      border: 1px solid var(@activeBorder);
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 16.59%, var(--ep-color-background-fill-glow-primary-opacity-40, rgba(58, 140, 227, 0.40)) 110.34%), var(--ep-color-background-fill-surface-raised-L2, #1A1F30);
    }
  }

}

.new-skin-symbol {
  #amount-btn-wrap-new-index.style();
}

.yellow-dark,
.green-dark,
.purple-light {
  #amount-btn-wrap-new-index.style(@bg: --color-bg-100,
    @amountColor: --color-text-100,
    @rateColor: --color-primary-800,
    @activeBorder: --color-primary-900,
    @isNew: false);

  .active {

    background: var(--color-btn-bg-active-r)
  }

}

.amber-purple {
  #amount-btn-wrap-new-index.style(@bg: --color-bg-100,
    @amountColor: --color-text-100,
    @rateColor: --color-currency,
    @activeBorder: --color-primary-900,
    @isNew: false);

  .btn-wrap {
    position: relative;

    .bn-text {
      position: relative;
      z-index: 3;


    }
  }

  .active {
    border: none;
    position: relative;
    background: var(--gradients-selectedBorder);

    &::before {
      content: "";
      position: absolute;
      top: 1px; // 调整为边框宽度的一半
      left: 1px; // 调整为边框宽度的一半
      right: 1px; // 调整为边框宽度的一半
      bottom: 1px; // 调整为边框宽度的一半
      background: var(--color-bg-100);
      z-index: 1; // 使伪元素位于内容后面
      border-radius: inherit; // 确保边框圆角继承父元素
    }
  }


}
</style>
