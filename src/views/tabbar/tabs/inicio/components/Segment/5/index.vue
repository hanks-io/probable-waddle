<!-- 浮动标签栏 -->
<template>
  <div class="wrapper">
    <ion-segment mode="ios" scrollable v-model="tabValue" @ionChange="tabChange" @mousedown="handleMouseDown"
      @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
      <ion-segment-button v-for="item in tabs" :value="item" :key="item" :disabled="disableTab">
        <ion-icon class="type-img" :src="`/svg/sort/${item}1.svg`" />
        <ion-label class="label">{{ $t(`sort.${item}`) }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <ion-button class="search unset-btn" fill="clear" @click="router.push({ path: '/game/search/POPULAR' })">
      <ion-icon class="search-icon icon-btn" slot="icon-only" src="/svg/search.svg" />
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { IonSegment, IonSegmentButton, IonIcon, IonLabel, IonButton } from '@ionic/vue';
  import useSegmentLogic from '@/views/tabbar/tabs/inicio/components/Segment/logic';

  const emit = defineEmits(['segmentChange', 'tabChange']); // 定义默认传递事件方法(update:modelValue为v-model传值)

  interface Props {     // 定义默认绑定接参
    sticky: boolean;    // 是否固定
  }

  const props = defineProps<Props>()// 定义默认绑定参数

  const {
    tabs,
    router,
    tabValue,
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
