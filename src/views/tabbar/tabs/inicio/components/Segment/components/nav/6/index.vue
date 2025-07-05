<template>
  <div
    class="btn-wall"
  >
    <i class="type-img" :style="loadImage.icon1(tab.code)" />
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  tab: {
    type: Object,
    default: () => ({})
  },
  loadImage: {
    type: Object,
    default: () => ({})
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  componentList: {
    type: Array,
    default: () => []
  },
})


</script>

<style lang="less" scoped>
@import './index.less';
</style>
