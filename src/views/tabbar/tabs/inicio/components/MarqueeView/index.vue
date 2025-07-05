<template>
  <div class="marquee-wrapper">
    <component v-for="item in componentList" :is="item.component" :key="item.key" v-bind="item.options"/>
  </div>
</template>

<script setup lang="ts">
import useMarqueeViewLogic from './logic1';


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
  display: flex;
  align-items: center;
  position: relative;
}
</style>
