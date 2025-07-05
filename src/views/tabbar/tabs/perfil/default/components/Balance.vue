<!-- 个人中心-用户余额 -->
<template>
  <div class="money-color">
    <div>
      <span class="left">{{ fixedNumber(balance) }}</span>
      <span class="right">{{ formatMoneyToShow(balance ?? 0) }}</span>
    </div>
    <span>{{ merchantCy }}</span>
    <ion-icon  :class="{ 'animate-refresh': completed }" :icon="syncSharp"
      @click="refreshBalance()" />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { syncSharp } from 'ionicons/icons';
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
@import '@/views/tabbar/tabs/perfil/default/styles/Balance/base-index.less' ;
@import '@/views/tabbar/tabs/perfil/default/styles/Balance/theme-style.less' ;
#tabbar-tabs-perfil-default-Balance.style();
.blue-default {
  #tabbar-tabs-perfil-default-Balance.style();
}
.green-default {
  #tabbar-tabs-perfil-default-Balance.style(
    --color-text-gray-100
  );
}
.amber-purple {
  #tabbar-tabs-perfil-default-Balance.style(
    --color-text-gray-100
  );
}

.forest-green {
  #tabbar-tabs-perfil-default-Balance.style(
    --color-text-gray-100
  );
}
</style>
