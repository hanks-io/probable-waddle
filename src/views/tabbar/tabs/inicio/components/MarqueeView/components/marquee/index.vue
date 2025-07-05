<template>
  <div class="megaphone-wrapper">
    <ImgOrSvg class="megaphone" :src="loadImage.megaphone" />
    <Marquee class="label" :content="marqueeContent" />
    <component v-for="item in componentList" :is="item.component" :key="item.key" v-bind="item.options"/>
  </div>
</template>

<script setup lang="ts">
import Marquee from '@/components/Marquee.vue';
import ImgOrSvg from '@/components/GradientSVG/imgOrSvg.vue';
import useMarqueeLogic from '@/views/tabbar/tabs/inicio/components/MarqueeView/logic';

const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  },
  componentList: {
    type: Array,
    default: () => []
  }
})

const { marqueeContent } = useMarqueeLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
