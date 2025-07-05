<template>
  <div :class="['arrow-container', layoutType]">
    <ion-icon :class="[isInvalid('left'), 'left']" :icon="loadImage.icon1" @click="swiperToSlide('prev')" />
    <ion-icon :class="[isInvalid('right'), 'right']" :icon="loadImage.icon1" @click="swiperToSlide" />
  </div>
</template>

<script setup lang="ts">
  import { IonIcon } from '@ionic/vue';

  const props = defineProps({
    loadImage: { type: Object, default: () => {} }, // 加载图片
    layoutType: { type: String, default: 'layout1' }, // 布局类型
  });

  const { isInvalid, swiperToSlide } = inject('headerInject') as any;
</script>

<style lang="less" scoped>
  @import './index.less';
</style>