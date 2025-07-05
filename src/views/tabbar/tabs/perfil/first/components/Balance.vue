<!-- 个人中心-用户余额 -->
<template>
  <div class="flex items-center height-text-white">
    <span class="color-text-currency">{{ merchantCy }}</span>
    <div class="relative ml-[0.25rem]">
      <span class="opacity-0 money-color mr-2">{{ fixedNumber(balance) }}</span>
      <span class="absolute money-color inset-0">{{ formatMoneyToShow(balance ?? 0) }}</span>
    </div>
    <ion-icon class="height-text-white color-text-40 rotate-[30deg]" :class="{ 'animate-refresh': completed }" src="/first/svg/perfil/refresh.svg" @click="refreshBalance()" />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { formatMoneyToShow } from '@/utils/custom';

import useRefreshBalance from '@/hooks/useRefreshBalance'
const {
  completed,
  balance,
  onGetUserAssets,
  refreshBalance,
  fixedNumber,
  merchantCy
} = useRefreshBalance()

</script>

<style scoped lang="less">

.money-color {
  color: var(--balance-money-text-color);
}

.new-skin-symbol {
  .money-color {
    color: var(--ep-color-text-default);
  } 

  .height-text-white {
    font-size: var(--ep-font-size-l);
    font-weight: var(--ep-font-weight-bold);
    line-height: 1.5rem;
  }

  .color-text-currency {
    color: var(--ep-color-text-warning);
  }

  .color-text-40 {
    color: var(--ep-color-icon-default);
  }
}
</style>
