<template>
  <section class="activity-list">
    <slot :list="activityList" :handleClick="goToActivity"/>
  </section>
</template>

<script setup lang="ts">
import useLogic from './logic';

const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  }
})

const {
  activityList,
  goToActivity
} = useLogic(props)
</script>

<style scoped lang="less">
@import './index.less';
</style>
