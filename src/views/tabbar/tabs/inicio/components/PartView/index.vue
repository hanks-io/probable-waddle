<template>
  <div class="part-view">
    <component v-for="item in componentList" :is="item.component" :key="item.key" v-bind="{
      ...$attrs,
      ...item.options,
    }"/>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  }
})

</script>

<style lang="less" scoped>
.margin-top-27 {
  margin-top: 1.6875rem;
}

.margin-bottom-23 {
  margin-bottom: 1.4375rem;
}
</style>
