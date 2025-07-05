<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="25" viewBox="0 0 19 25" fill="none">
  <path d="M7.43622 22.2783L7.43622 2.2334L17.4587 12.2559L7.43622 22.2783Z" :fill="fill" :stroke="stroke" stroke-width="1.84962"/>
  <path d="M1.30835 22.2783L1.30835 2.2334L11.3308 12.2559L1.30835 22.2783Z" :fill="fill" :stroke="stroke" stroke-width="1.84962"/>
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
