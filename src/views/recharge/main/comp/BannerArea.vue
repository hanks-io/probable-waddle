<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
const emit = defineEmits<{
  (e: 'clickHandle'): void

}>()
defineProps<{
  bannerUrl: string
  rateOfGift: number
  amountOfGift: number
  merchantCy: string
  isDefaultBanner: boolean
}
>()

const bannerHandle = () => {
  emit(`clickHandle`)
} 
</script>
<template>

  <div class="banner" :style='{ backgroundImage: `url("${bannerUrl}")` }' @click="bannerHandle">
    <p class="text">
      <span>{{ $t('viewsTabbar.depositLeft') }}</span>
      <span class="rate">{{ formatMoneyToShow(rateOfGift) }}%</span>
      <span>{{ $t('viewsTabbar.depositRight') }}</span>
    </p>
    <p class="bottom flex-between">
      <span>{{ $t('viewsTabbar.discountReward') }}</span>
      <span>
        <span class="rate">{{ formatMoneyToShow(rateOfGift) }}%</span>
        <span class="amount">{{ `${merchantCy} +${formatMoneyToShow(amountOfGift)}`
          }}</span>
      </span>
    </p>
  </div>

</template>

<style scoped lang="less">

#recharge-main-bannerArea-new-index {
  .style(@rateColor: --ep-color-text-success,
   @color: --ep-color-text-highlight-white, 
   @amountColor: --ep-color-text-warning,
    @bottomBg: rgba(0, 0, 0, .4)) {
    .rate-style {
      color: var(@rateColor);
      font-size: var(--ep-font-size-xl, 1.125rem);
      font-weight: var(--ep-font-weight-bold, 700);

    }

    .banner {
      width: 22.5rem;
      height: 7.5rem;
      margin: .75rem auto;
      background: no-repeat center center;
      background-size: cover;
      position: relative;
      box-sizing: border-box;
      padding: 15px 20px;
      border-radius: var(--ep-border-radius-m, .375rem);

      .text {
        width: 13.125rem;
        color: var(@color);
        font-size: var(--ep-font-size-m, 0.875rem);
        line-height: 1.375rem;

        .rate {
          .rate-style()
        }
      }

      .bottom {
        width: 100%;
        height: 1.5625rem;
        box-sizing: border-box;
        padding: 0 1.25rem;
        position: absolute;
        left: 0;
        bottom: 0;
        background: @bottomBg;
        border-radius: 0 0 var(--ep-border-radius-m, .375rem) var(--ep-border-radius-m, .375rem);
        font-size: var(--ep-font-size-s, 0.75rem);
        color: #fff;
       .amount{
         color:var(@amountColor);
       }

        .rate {

          margin-right: .625rem;
          .rate-style()
        }
      }




    }

  }
}

.new-skin-symbol {
  #recharge-main-bannerArea-new-index.style();
}
.green-dark, .yellow-dark, .blue-default,  .forest-green , .purple-light, .auroral-yellow{
  #recharge-main-bannerArea-new-index.style(@rateColor:--color-success, @color: --color-text-100, @amountColor: --color-currency, );
}
 .green-default, .amber-purple{
  #recharge-main-bannerArea-new-index.style(@color: --text-color-white-100, @rateColor: --color-success, );
}
</style>
