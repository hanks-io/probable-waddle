<template>
  <div :class="['badge-box', layoutType]">
    <ion-icon class="icon" :src="loadImage.icon1" />
    <ion-label class="label">{{ $t('subtitle.000003') }}</ion-label>
  </div>
</template>

<script setup lang="ts">
  import { IonIcon, IonLabel } from '@ionic/vue';

  const props = defineProps({
    layoutType: {
      type: String,
      default: 'layout1'
    },
    loadImage: {
      type: Object,
      default: () => ({})
    }
  })
</script>

<style lang="less" scoped>
@import './index.less';
</style>