<template>
  <div :class="['hot-game-title', layoutType]">
    <div class="hot-game-icon-box">
      <ion-img class="hot-game-icon" src="/icons/platform/ONE_API_HOT-2.png" />
      <ion-label class="label">{{ $t("sort.POPULAR") }}</ion-label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonImg, IonLabel } from '@ionic/vue';

const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout1'
  }
})
</script>

<style scoped lang="less">
@import './index.less';
</style>