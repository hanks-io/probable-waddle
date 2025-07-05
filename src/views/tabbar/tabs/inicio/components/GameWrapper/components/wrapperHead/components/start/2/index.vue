<template>
  <div class="logo-c">
    <ion-icon :src="sortLogoSrc" :class="[props.type === 'POPULAR' ? 'hot-logo' : '', 'logo']" />
    <ion-label v-if="titleType === '1'" class="label">{{ $t(`sort.${props.type}`) }}</ion-label>
    <ion-label v-if="titleType === '2'" class="label">{{ props.platformInfo.name + " " + $t(`sort.${props.type}`) }}</ion-label>
  </div>
</template>

<script setup lang="ts">
  import { IonLabel, IonIcon } from '@ionic/vue';

  const props = defineProps({
    titleType: { type: String, default: '1' },
    type: { type: String, required: true },
    platformInfo: { type: Object, required: true },
    sortLogoSrc: { type: String, required: true },
  })

</script>

<style lang="less" scoped>
@import './index.less';
</style>