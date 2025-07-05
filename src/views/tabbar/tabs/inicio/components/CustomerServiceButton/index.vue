<template>
  <div class="support" :class="className" :style="elStyle" @click="goToNotification">
    <ProgressiveImages v-if="loadImage.image" class="support-img" :src="loadImage.image" />
    <ion-icon v-else class="support-icon" :src="loadImage.icon" />
    <div v-if="showUnRead" class="dot" />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'
import useLogic from './logic';

const props = defineProps({
  type: { type: Number, default: 1 },
  loadImage: { type: Object, default: () => ({}) },
});

const {
  elStyle,
  className,
  showUnRead,
  goToNotification
} = useLogic(props);
</script>

<style lang="less" scoped>
  @import './index.less';
</style>