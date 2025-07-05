<template>
  <ion-segment
    mode="ios"
    scrollable
    :value="tabValue"
    ref="segmentRef"
  >
    <component
      v-for="item in componentList"
      :key="item.key"
      :is="item.component"
      v-bind="item.options"
      :tabs="tabs"
      :tabValue="tabValue"
      @handleClick="tabClick"
    />
  </ion-segment>
</template>


<script setup lang="ts">
  import { IonSegment } from '@ionic/vue';
  import useSegmentLogic from './columnPlatformLogic'

  const emits = defineEmits(['tabChange']); // 定义默认传递事件方法(update:modelValue为v-model传值)


  const props = defineProps({
    eventKey: {
      type: String,
      default: ''
    },
    componentList: {
      type: Array,
      default: () => []
    },
  })// 定义默认绑定参数

  const {
    tabs,
    tabRef,
    voiceBug,
    tabValue,
    tabClick,
  } = useSegmentLogic(props, emits)

  defineExpose({ // 定义默认暴露方法
    voiceBug,
  })

</script>

<style lang="less" scoped>
  ion-segment {
    --background: transparent;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>