<template>
  <div :class="['content-box', layoutType]" :style="styleIcon1">
    <component
      v-for="item in componentList"
      :key="item.key"
      :is="item.component"
      v-bind="item.options"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  },
  layoutType: {
    type: String,
    default: 'layout1'
  },
  loadImage: {
    type: Object,
    default: () => ({})
  }
})

const styleIcon1 = computed(() => {
  if (props.loadImage?.icon1) {
    return `--data-icon1:url(${props.loadImage.icon1})`
  }
  return ''
})
</script>

<style scoped lang="less">
@import './index.less';
</style>