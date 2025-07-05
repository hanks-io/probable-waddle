<template>
  <div class="marquee-wrapper">
    <MarqueeViewComponent :componentList="[]" :loadImage="{megaphone: '/first/svg/broadcast.svg'}"/>
  </div>
</template>

<script setup lang="ts">
import MarqueeViewComponent from '@/views/tabbar/tabs/inicio/components/MarqueeView/components/marquee/index.vue';
import useMarqueeViewLogic from '../logic1';


const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  }
})

useMarqueeViewLogic()
</script>

<style lang="less" scoped>
.marquee-wrapper {
  width: 100%;
  height: 2.25rem;
  padding: 0 0.9375rem;
  margin-top: 0.9375rem;
  margin-bottom: 0.4063rem;
  display: flex;
  align-items: center;
  position: relative;

  :deep(.wall.megaphone) {
    color: var(--bugle-color);
  }

  :deep(.marquee.label) {
    color: var(--marquee-color);
  }
}
</style>
