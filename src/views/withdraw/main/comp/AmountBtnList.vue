<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import { getImageUrl } from '@/utils/url'
const emit = defineEmits<{
  (e: 'amountHandle', amount: number): void
}>()
defineProps<{
  amountList: number[]
  amount: string,
  balance: number,
  isVirtualCurrency: boolean
}
>()

const amountHandle = (amount: number) => {
  emit('amountHandle', amount)
}
</script>
<template>
  <ul class="amount-list flex-between">
    <li v-for="it in amountList" :key="it"
      :class="['amount-item', { 'active': Number(amount) === it, 'disabled': balance < it }]" @click="amountHandle(it)">
      <img :src="getImageUrl('img/virtualCurrency.png')" v-if="isVirtualCurrency">
      <span class="amount">{{ formatMoneyToShow(it) }}</span>
    </li>
    <li></li>
    <li></li>
  </ul>
</template>

<style scoped lang="less">
#withdraw-main-amountBtnList-index {
  .defaultStyle(@bg: --color-bg-50, @color: --color-text-gray-200, @activeColor: --color-text-white-100, @activeBg: --theme-color-gradient-300) {

    .amount-list {
      flex-wrap: wrap;
      font-size: var(--font-size-16);
      width: 100%;
      gap: .75rem;
      width: 100%;
      padding-bottom: .625rem;
      box-sizing: border-box;

      li {
        flex: 0 0 calc(33.333% - (2/3 * .75rem));

      }

      .amount-item {
        flex: 0 0 calc(33.333% - (2/3 * .75rem));
        height: 2.5rem;
        line-height: 2.5rem;
        cursor: pointer;
        text-align: center;

        background: var(@bg);
        color: var(@color);
        border-radius: var(--rounded-middle);
        font-weight: var(--font-weight-regular);
        display: flex;
        align-items: center;
        justify-content: center;


        img {
          display: block;
          width: 1.25rem;
          height: 1.25rem;
          margin-right: .125rem;
        }

      }

      .disabled {
        pointer-events: none;
      }

      .active {
        background: var(@activeBg);
        color: var(@activeColor);
        font-weight: var(--font-weight-bold);
      }
    }
  }

  .borderStyle(@color: --theme-color-600) {

    .amount-list .active {
      border: 1px solid var(@color);
    }
  }

  .style(@bg: --color-bg-300, @color: --color-text-100) {
    .amount-list {
      flex-wrap: wrap;
      margin-top: .625rem;
      font-size: var(--font-size-12);
      width: 100%;
      gap: .75rem;
      padding-bottom: .625rem;
      box-sizing: border-box;

      li {
        flex: 0 0 calc(33.333% - (2/3 * .75rem));
      }

      .amount-item {
        flex: 0 0 calc(33.333% - (2/3 * .75rem));
        height: 2.375rem;
        text-align: center;
        background: var(--color-bg-300);
        border-radius: var(--rounded-middle);
        line-height: 2.625rem;
        cursor: pointer;
        color: var(@color);
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-16);
        display: flex;
        align-items: center;
        justify-content: center;


        img {
          display: block;
          width: 1.25rem;
          height: 1.25rem;
          margin-right: .125rem;
        }

      }

      .active {
        border: 1px solid var(--color-primary-900);
        background: var(--color-btn-bg-active-w);

      }

    }

  }

  .amberPurpleStyle(@beforeBg: #2c294d) {
    .amount-list {
      font-weight: 600;
      position: relative;

      .active {
        border: none;
        background: linear-gradient(160deg, #EABD5B 15%, #7041F3 50%, #7041F3 80%, #F5C84C 100%);
        position: relative;

        .amount {
          color: var(--color-text-white-100)
        }


        &::before {
          content: "";
          position: absolute;
          top: 1px;
          left: 1px;
          right: 1px;
          bottom: 1px;
          background: @beforeBg;
          z-index: 1;
          border-radius: inherit;
        }
      }

      .amount {
        position: relative;
        z-index: 2;
        color: var(--text-color-light-purple-1-100)
      }

      img {
        position: relative;
        z-index: 2;
      }
    }


  }

}





.green-dark,
.yellow-dark {
  #withdraw-main-amountBtnList-index.style()
}

.purple-light {

  #withdraw-main-amountBtnList-index.style(@bg: --color-bg-200)
}

.amber-purple {
  .second {
    #withdraw-main-amountBtnList-index.style(@bg: --color-bg-200, @color: --text-color-light-purple-1-100);
    #withdraw-main-amountBtnList-index.amberPurpleStyle()
  }

  .default {
    #withdraw-main-amountBtnList-index.defaultStyle(@color: --text-color-light-purple-1-100, @bg: --color-bg-100, );
    #withdraw-main-amountBtnList-index.amberPurpleStyle(#544d80)
  }
}




.blue-default {
  #withdraw-main-amountBtnList-index.defaultStyle();
  #withdraw-main-amountBtnList-index.borderStyle();
}

/* green-default 皮肤的样式 */
.green-default {
  #withdraw-main-amountBtnList-index.defaultStyle(@bg: --color-bg-100, @activeBg: --color-bg-100);
  #withdraw-main-amountBtnList-index.borderStyle(@color: --color-text-gray-200);

}


.forest-green {
  #withdraw-main-amountBtnList-index.defaultStyle(@bg: --color-bg-100, @activeBg: --color-link);
  #withdraw-main-amountBtnList-index.borderStyle(@color: --color-text-gray-200);

}

.auroral-yellow {
  #withdraw-main-amountBtnList-index.defaultStyle(@bg: --color-bg-100, @activeBg: --color-bg-100);
  #withdraw-main-amountBtnList-index.borderStyle();

}



#withdraw-main-amountBtnList-new-index {
  .style() {
    .amount-list {
      flex-wrap: wrap;
      margin-top: .625rem;
      font-size: var(--ep-font-size-s, .75rem);
      gap: .75rem;

      li {
        flex: 0 0 calc(33.333% - (2/3 * .75rem));
      }

      .amount-item {
        flex: 0 0 calc(33.333% - (2/3 * .75rem));
        height: 2.375rem;
        text-align: center;
        background: var(--ep-color-background-fill-surface-raised-L2);
        border-radius: .375rem;
        line-height: 2.625rem;
        cursor: pointer;
        color: var(--ep-color-text-default);
        font-weight: var(--ep-font-weight-medium, 500);
        font-size: var(--ep-font-size-l, 1rem);
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          display: block;
          width: 1.25rem;
          height: 1.25rem;
          margin-right: .125rem;
        }
      }

      .active {
        border: 1px solid var(--ep-color-border-selected);
        background: linear-gradient(180deg, color-mix(in srgb, var(--ep-color-background-fill-active-active) 0%, transparent) 16.59%, var(--ep-color-background-fill-glow-primary-opacity-40, rgba(58, 140, 227, 0.40)) 110.34%), var(--ep-color-background-fill-surface-raised-L2, #1A1F30);
        ;

      }

    }

  }
}

.new-skin-symbol {
  #withdraw-main-amountBtnList-new-index.style();
}
</style>
