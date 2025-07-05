<template>
  <div :class="['footer-container', layoutType]">
    <component v-for="item in componentList" :key="item.key" :is="item.component" v-bind="item.options" />
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
    default: 'layout1',
  },
})


const showMark = ref(false);

const markChange = (value: boolean) => {
  showMark.value = value;
}

provide('footerData', {
  showMark,
  markChange,
});

</script>

<style lang="less" scoped>
@import './index.less';
</style>


