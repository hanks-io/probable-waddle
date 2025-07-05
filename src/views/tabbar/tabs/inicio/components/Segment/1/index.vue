<!-- 浮动标签栏 -->
<template>
  <div class="tabbar-tabs-inicio-components-Segment-default-index" :style="'height:' + height + 'px'">
    <div class="wrapper" :class="sticky ? 'float-wrapper' : ''">
      <ion-segment mode="ios" scrollable v-model="tabValue" @ionChange="tabChange" @mousedown="handleMouseDown"
        @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
        <ion-segment-button v-for="item in tabs" :value="item" :key="item" :disabled="disableTab">
          <ion-img class="type-img" :src="`/icons/sort/${item}_on.png`" />
          <ion-label :class="[tabValue == item ? 'active' : '', 'label']">{{ $t(`sort.${item}`) }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonSegment, IonSegmentButton, IonImg, IonLabel } from '@ionic/vue';
  import useSegmentLogic from '@/views/tabbar/tabs/inicio/components/Segment/logic';

  const emit = defineEmits(['segmentChange', 'tabChange']); // 定义默认传递事件方法(update:modelValue为v-model传值)

  interface Props {     // 定义默认绑定接参
    sticky: boolean;    // 是否固定
    height: number;     // 高度
  }

  const props = defineProps<Props>()// 定义默认绑定参数

  const {
    tabValue,
    tabs,
    disableTab,
    tabChange,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove, } = useSegmentLogic(props, emit)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
