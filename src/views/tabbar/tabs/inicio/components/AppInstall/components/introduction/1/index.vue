<template>
  <div :class="['introduction-box', layoutType]">
    <ion-label class="title">{{ 
      $t('viewsTabbar.DownloadApp') 
    }}</ion-label>
    <ion-label class="introduce">{{
      $t('viewsTabbar.DownloadAppDes')
    }}</ion-label>
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';

const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout1'
  },
})

</script>

<style lang="less" scoped>
@import './index.less';
</style>