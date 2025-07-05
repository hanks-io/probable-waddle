<template>
  <section class="activity-list">
    <component :is="itemComponent" :list="activityList" :handleClick="menuActivityHandle" :layoutType="layoutType"/>
  </section>
</template>

<script setup lang="ts">
import useLogic from './logic';

const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  },
  childComponentKey: {
    type: String,
    default: ''
  },
  layoutType: {
    type: String,
    default: 'layout1'
  }
})

const {
  activityList,
  itemComponent,
  menuActivityHandle
} = useLogic(props)

</script>

<style scoped lang="less">
@import './index.less';
</style>
