<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import { getImageUrl } from '@/utils/url'
defineProps<{
  amount: number
  rate?: number,
  isActive: boolean,
  isVirtualCurrency: boolean
}
>();

</script>


<template>
  <div :class="['btn-wrap', { active: isActive, badge: !!rate }]" :data-badge="`${rate}%`">
    <img :src="getImageUrl('img/virtualCurrency.png')" v-if="isVirtualCurrency">
    <div class="bn-text">
      <p class="amount">{{ formatMoneyToShow(amount) }}</p>
    </div>
  </div>
</template>

<style scoped lang="less">
#recharge-main-default-amountBtnDefault-index {
  .style(@btnBg: --color-bg-200, @color: --color-text-gray-200, @colorActive: --color-text-white-100, @ActiveBg: --theme-color-gradient-100) {
    .badge {
      position: relative;
      overflow: hidden;
    }

    .badge::after {
      content: attr(data-badge);
      /* 使用属性值作为内容 */
      position: absolute;
      top: -1.1rem;
      right: -1.12rem;
      width: 3rem;
      /* 角标大小 */
      height: 2rem;
      /* 角标大小 */
      padding-left: 0.8rem;
      line-height: 6.6;
      color: var(--text-color-white-100);
      background: var(--color-danger);
      font-size: var(--font-size-8);
      transform: rotate(45deg);
      z-index: 20;
      /* 旋转角标 */
    }

    .btn-wrap {
      flex: 0 0 calc(33.333% - (2/3 * .625rem));
      height: 2.5rem;
      border-radius: var(--rounded-middle);
      line-height: 2.5rem;
      text-align: center;
      flex-shrink: 0;
      cursor: pointer;
      background: var(@btnBg);
      display: flex;
      align-items: center;
      justify-content: center;


      img {
        display: block;
        width: 1.25rem;
        height: 1.25rem;
        margin-right: .125rem;
      }

      .bn-text {



        .amount {
          font-size: 1rem;
          font-weight: var(--font-weight-medium);
          color: var(@color);
        }
      }





    }

    .active {
      background: var(@ActiveBg);

      .bn-text {
        .amount {
          color: var(@colorActive);
        }
      }
    }


  }

  .border(@color: --color-line) {
    .active {
      border: 1px solid var(@color);
    }


  }
}

#recharge-main-default-amountBtnDefault-index.style();


.blue-default {
  #recharge-main-default-amountBtnDefault-index.style(@btnBg: --color-bg-50, @ActiveBg: --theme-color-gradient-300);
  #recharge-main-default-amountBtnDefault-index.border(@color: --theme-color-600);
}


.amber-purple {
  #recharge-main-default-amountBtnDefault-index.style(@btnBg: --color-bg-100, @color: --text-color-light-purple-1-100, @ActiveBg: --gradients-selectedBorder, @colorActive: --color-text-white-100);

  .btn-wrap {
    position: relative;

    .amount {
      position: relative;
      z-index: 3;
    }

    img {
      position: relative;
      z-index: 3;
    }
  }



  .active {
    border: none;
    position: relative;
    color: var(--color-text-white-100);

    &::before {
      content: "";
      position: absolute;
      top: 1px;
      left: 1px;
      right: 1px;
      bottom: 1px;
      background: var(--color-bg-50);
      z-index: 1;
      border-radius: inherit;
    }
  }

}

.auroral-yellow {
  #recharge-main-default-amountBtnDefault-index.style(@btnBg: --color-bg-100, @ActiveBg: --color-bg-100);
  #recharge-main-default-amountBtnDefault-index.border(@color: --theme-color-600);
}

.forest-green,
.green-default {
  #recharge-main-default-amountBtnDefault-index.style(@btnBg: --color-bg-100);

}
</style>
