<template>
  <ion-segment
    mode="ios"
    scrollable
    :value="tabValue"
    ref="segmentRef"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
  >
    <ion-segment-button
      v-for="item in tabsList"
      :key="item.code"
      :class="[tabValue == String(item.id) ? 'active' : '', 'init-segment']"
      :value="String(item.id)"
      :disabled="disableTab"
      @click="tabClick(item)"
    >
      <component
        v-for="cItem in componentList"
        :tab="item"
        :key="cItem.key"
        :is="cItem.component"
        v-bind="cItem.options"
      />
    </ion-segment-button>
  </ion-segment>
</template>


<script setup lang="ts">
  import { IonSegment, IonSegmentButton } from '@ionic/vue';
  import useSegmentLogic from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/platform/rowLayout/rowPlatformLogic'
  import useMouseMove from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/useMouseMove'


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
    noHot: {
      type: Boolean,
      default: false,
    }
  })// 定义默认绑定参数

  const {
    tabsList,
    tabValue,
    tabClick,
    segmentRef,
  } = useSegmentLogic(props, emits)

  const {
    disableTab,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
  } = useMouseMove()

</script>

<style lang="less" scoped>
  ion-segment {
    --background: transparent;
    display: flex;
    gap: 0.625rem;

    ion-segment-button {

      &.init-segment {
        flex-shrink: 0;
        --padding-start: 0;
        --padding-end: 0;
        --padding-top: 0;
        --padding-bottom: 0;
        height: min-content;
        min-width: min-content;
        margin: 0;
        --indicator-transition: none;
        --background: transparent;
        --indicator-color: transparent;
      }
    }
  }
</style>