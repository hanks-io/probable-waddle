<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="25" viewBox="0 0 19 25" fill="none">
  <path d="M11.3311 22.2783L11.3311 2.2334L1.30859 12.2559L11.3311 22.2783Z" :fill="fill" :stroke="stroke" stroke-width="1.84962"/>
  <path d="M17.4589 22.2783L17.4589 2.2334L7.43646 12.2559L17.4589 22.2783Z" :fill="fill" :stroke="stroke" stroke-width="1.84962"/>
</svg>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  fill?: string,
  stroke?: string,
}>(), {
  fill: '#5C82F5',
  stroke: '#000',
})
</script>
