<template>
  <Layout>
    <template #default="{ handleClick, ...rest }">
      <div class="deposit-withdrawal-wrapper" v-bind="rest">
        <ion-menu-toggle class="deposit-wrapper" @click="handleClick('entrar')">
          <ion-icon class="icon" :src="`/first/svg/tabbar/deposit_on.svg`"/>
          <ion-label class="label">{{ $t('main.entrar') }}</ion-label>
        </ion-menu-toggle>
        <ion-menu-toggle class="withdraw-wrapper" @click="handleClick('withdraw')">
          <ion-icon class="icon" :src="`/first/svg/tabbar/withdraw_on.svg`"/>
          <ion-label class="label">{{ $t('main.withdraw') }}</ion-label>
        </ion-menu-toggle>
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { IonMenuToggle, IonIcon, IonLabel } from '@ionic/vue';
import Layout from '@/views/tabbar/components/DrawerLeft/components/depositAndWithdrawal/layout.vue'
</script>

<style scoped lang="less">
@import './index.less';
</style>