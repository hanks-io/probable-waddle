<template>
  <div
    class="flexible-tab"
    v-hate-keyboard
  >
    <ion-icon class="tab-icon" :src="props.loadImage.icon" />
    <ion-label class="tab-label">{{ props.label }}</ion-label>
  </div>
</template>

<script setup lang="ts">
import { IonLabel, IonIcon } from "@ionic/vue";
import vHateKeyboard from '@/directives/hateKeyboard';

const props = defineProps<{
  label: string;
  loadImage: Record<string, any>;
}>()
</script>

<style scoped lang="less">
@import './index.less';
</style>
