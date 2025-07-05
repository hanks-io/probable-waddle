<template>
  <div v-if="userId" :class="['button-box', layoutType]">
    <component
      v-for="item in componentList"
      :key="item.key"
      :is="item.component"
      v-bind="item.options"
      @btnClick="btnClick"
    />
  </div>
</template>

<script setup lang="ts">
import useButtonWrapLogic from '@/views/tabbar/tabs/inicio/components/HeaderBar/components/buttonWrap/logic';


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

const {
  userId,
  btnClick,
} = useButtonWrapLogic();



</script>

<style scoped lang="less">
@import './index.less';
</style>