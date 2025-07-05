<template>
  <div :class="['version-box', layoutType]">
    <ion-label class="subtitle">©2025 {{ merchantName }} {{ $t('subtitle.rightsReserved') }}.</ion-label>
    <div v-if="showMark" class="equipment-info">
    <ion-label>{{ os + browser + appType }}</ion-label>
    <ion-label>{{ getBuildVersion() }}</ion-label>
    <ion-label>{{ origin }}</ion-label>
    <ion-label>{{ webPushRegId }}</ion-label>
  </div>
  </div>
  
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import useVersionLogic from '@/views/tabbar/tabs/inicio/components/FooterContent/components/version/logic';

const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout1',
  },
})


const {
  os,
  origin,
  browser,
  appType,
  showMark,
  merchantName,
  webPushRegId,
  getBuildVersion,
} = useVersionLogic();

</script>

<style scoped lang="less">
@import './index.less';
</style>