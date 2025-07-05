<template>
  <div class="arrow-container layout1">
    <ion-icon :class="[isInvalid('left'), 'left']" :icon="loadImage.icon" @click="emits('swiperToSlide', 'prev')" />
    <ion-icon :class="[isInvalid('right'), 'right']" :icon="loadImage.icon" @click="emits('swiperToSlide')" />
  </div>
</template>

<script setup lang="ts">
  import { IonIcon } from '@ionic/vue';

  const emits = defineEmits(['swiperToSlide']);

  const props = defineProps({
    loadImage: { type: Object, default: () => {} }, // 加载图片
    isInvalid: { type: Function, default: () => {} }, // 是否无效
    layoutType: { type: String, default: 'layout1' }, // 布局类型
  });
</script>

<style lang="less" scoped>
  @import './index.less';
</style>