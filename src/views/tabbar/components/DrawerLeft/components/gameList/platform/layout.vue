<template>
  <section class="game-platform">
    <slot :list="list" :handleClick="goToCategory"/>
  </section>
</template>

<script setup lang="ts">
import useLogic from './logic';

const props = defineProps({
  loadImage: {
    type: Object,
  }
});

const {
  list,
  goToCategory
} = useLogic(props)

</script>

<style scoped lang="less">
@import './index.less';
</style>
