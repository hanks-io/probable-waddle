<template>
  <div class="service-wrapper" @click="goToCustomer">
    <div class="icon-wrapper">
      <ion-icon class="icon" src="/first/svg/support.svg"/>
    </div>
    <ion-label class="label">{{ $t('main.suporte') }}</ion-label>
    <NumberPoint v-if="unReadCount" class="point" :count="unReadCount"/>
  </div>
</template>


<script setup lang="ts">
import { IonIcon, IonLabel } from '@ionic/vue';
import NumberPoint from '@/components/HotPoint/numberPoint.vue'
import useLogic from '@/views/tabbar/components/DrawerLeft/components/customerService/logic'

const { unReadCount, goToCustomer } = useLogic();
</script>

<style scoped lang="less">
@import './index.less';
</style>
