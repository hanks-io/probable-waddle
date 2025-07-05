<template>
  <span v-if="!!(iso)" class="fi" :class="flagIconClass" :title="title || iso">
  </span>
</template>
<script setup lang="ts">

const props = withDefaults(defineProps<{
  iso: string,
  title?: string,
}>(), {
  iso: '',
  title: '',
})
const flagIconClass = computed(() => {
  return `fi-${props.iso?.toLowerCase()} fis`;
})
</script>

<style lang="less">
@import "@/components/Flag/flag.less";
</style>
