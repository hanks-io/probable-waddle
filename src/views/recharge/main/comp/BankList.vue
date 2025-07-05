<script setup lang="ts">
import type { BankInfoType } from '@/store/recharge'
import { IonIcon } from '@ionic/vue'
import { getImageUrl } from '@/utils/url'
const emit = defineEmits<{
  (e: 'bankChange', code: string): void

}>()
const bankCode = defineModel<string>('bankCode', { required: true })
defineProps<{
  bankList: BankInfoType[]

}
>()

const bankChange = (code: string) => {
  emit(`bankChange`, code)
}
</script>
<template>
  <div class="bank-area" v-if="bankList.length">
    <div class="title">{{ $t('depositWithdrawal.000029') }}</div>
    <ul class="bank-list-wrap">
      <li :class="['bank-item', { active: bankCode === bank.code }]" v-for="bank in bankList" :key="bank.id"
        @click="bankChange(bank.code)">
        <img :src="bank.logo" alt="bank logo" class="bank-logo">
        <div class="bank-name">{{ bank.name }}</div>
        <ion-icon v-if="bankCode === bank.code" slot="icon-only" :src="getImageUrl('svg/ok.svg')" class="ok-icon" />
      </li>
      <li class="bank-item" v-show="false"></li>
    </ul>
  </div>
</template>

<style scoped lang="less">
#recharge-main-bankList-new-index {

  .style(@itemBgColor: --ep-color-background-fill-surface-raised-L1,
    @itemColor: --ep-color-text-weaker,
    @activeColor: --ep-color-text-default,
    @activeBorderColor: --ep-color-text-selected,
    @activeBgColor: --ep-dynamic-secondary,
    @okIconColor: --ep-color-icon-selected,
    @titleColor: --ep-color-text-default) {
    .bank-area {
      .title {
        font-size: var(--ep-font-size-s, .75rem);
        color: var(@titleColor);
        font-weight: var(--ep-font-weight-bold, 700);
        margin: 0 0 .625rem .75rem;
        line-height: 1.125rem;
      }

      .bank-list-wrap {
        width: 22.875rem;
        margin: 0 auto 1.375rem;
        display: flex;
        flex-wrap: wrap;
        gap: .75rem;
        align-content: space-between;
        align-items: center;

        .bank-item {
          flex: 0 0 calc(33.333% - (2/3 * .75rem));
          height: 3.375rem;
          border-radius: var(--ep-border-radius-m, .375rem);
          background: var(@itemBgColor, );
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: var(@itemColor);
          padding: .375rem .5rem;
          box-sizing: border-box;
          font-size: var(--ep-font-size-m, .75rem);
          cursor: pointer;

          .bank-logo {
            width: 2rem;
            height: 2rem;
            border-radius: var(--ep-border-radius-m, .375rem);
            display: block;
            margin-right: .375rem;
          }

          .bank-name {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            line-height: 1.2;
          }
        }

        .active {
          border: 1px solid var(@activeBorderColor);
          color: var(@activeColor);
          background: var(@activeBgColor);
          position: relative;

          .ok-icon {
            color: var(@okIconColor);
            position: absolute;
            right: .25rem;
            bottom: .25rem;
            font-size: var(--ep-font-size-l, .875rem);
          }
        }



      }

    }

  }
}

.new-skin-symbol {
  #recharge-main-bankList-new-index.style();
}

.green-dark,
.yellow-dark,
.forest-green,
.purple-light,
.auroral-yellow,
.green-default {
  #recharge-main-bankList-new-index.style(@itemBgColor: --color-bg-200,
    @itemColor: --color-text-40,
    @activeColor: --color-text-100,
    @activeBorderColor: --theme-color-800,
    @activeBgColor: --color-btn-bg-active-r,
    @okIconColor: --theme-color-800,
    @titleColor: --color-text-100);
}

.blue-default {
  #recharge-main-bankList-new-index.style(@itemBgColor: --color-bg-200,
    @itemColor: --color-text-40,
    @activeColor: --color-text-100,
    @activeBorderColor: --theme-color-900,
    @activeBgColor: --color-btn-bg-active-r,
    @okIconColor: --theme-color-800,
    @titleColor: --color-text-100);
}

.amber-purple {
  #recharge-main-bankList-new-index.style(@itemBgColor: --color-bg-200,
    @itemColor: --color-text-40,
    @activeColor: --color-text-100,
    @activeBorderColor: --color-line,
    @activeBgColor: --color-btn-bg-active-r,
    @okIconColor: --color-text-gray-100,
    @titleColor: --color-text-100);
}
</style>
