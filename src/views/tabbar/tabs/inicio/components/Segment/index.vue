<template>
  <div class="wrapper" :style="props.style" :id="props.id" :ref="props.ref" :class="props.class" :bottom="props.bottom" :height="props.height">
    <component v-for="item in filterComponentList" :key="item.key" :is="item.component" v-bind="{ ...$attrs, ...item.options }" />
  </div>
</template>

<script setup lang="ts">
import useCategoryOrPlatform from '@/views/tabbar/tabs/inicio/components/Segment/useCategoryOrPlatform'

const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  },
  style: {
    type: Object,
    default: () => ({})
  },
  id: {
    type: String,
    default: ''
  },
  ref: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  bottom: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  negateCategoryType: {
    type: Boolean,
    default: false
  }
})

const { filterComponentList } = useCategoryOrPlatform(props)

</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 35;
  background: var(--ep-color-background-fill-surface-lowered, #101B3C);
}
</style>