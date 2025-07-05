<!-- 个人中心-用户余额 -->
<template>
  <div class="flex items-center height-text-white">
    <span class="color-text-currency">{{ merchantCy }}</span>
    <div class="relative ml-[0.25rem]">
      <span class="opacity-0 mr-2">{{ fixedNumber(balance) }}</span>
      <span class="absolute money-color inset-0">{{ formatMoneyToShow(balance) }}</span>
    </div>
    <ion-icon class="height-text-white refresh-icon rotate-[30deg]" :class="{ 'animate-refresh': completed }" src="/first/svg/perfil/refresh.svg" @click="refreshBalance()" />
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

<style scoped>

.money-color {
  color: var(--balance-money-text-color) !important;
}

.color-text-currency {
  color: var(--balance-money-text-color);
}

.refresh-icon {
  color: rgba(255, 255, 255, 0.4);
}
</style>
