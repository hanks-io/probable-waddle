<!-- 浮动标签栏 -->
<template>
  <div class="relative px-3" :style="'height:'+height+'px'">
    <div class="w-full z-10" :class="sticky ? 'rounded-b-[7px]' : 'rounded-[7px]'">
      <ion-segment mode="ios" scrollable v-model="tabValue" @ionChange="tabChange"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @mousemove="handleMouseMove"
      >
        <ion-segment-button :class="index == tabs.length - 1 ? '' : 'mr-2.5'" :disabled="disableTab" v-for="(item, index) in tabs" :value="item" :key="item" layout="icon-start">
          <ion-icon class="text-2xl" :class="item == 'POPULAR' ? 'popular' : ''" :src="`/first/svg/sort/${item}.svg`"/>
          <ion-label class="name text-sm">{{$t(`sort.${item}`)}}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonSegment, IonSegmentButton, IonIcon, IonLabel } from '@ionic/vue';
import useSegmentLogic from '../logic';

const emit = defineEmits(['update:modelValue', 'segmentChange', 'tabChange']); // 定义默认传递事件方法(update:modelValue为v-model传值)

interface Props {     // 定义默认绑定接参
  modelValue: string; // 选中标签值<父组件使用v-model传参>
  sticky: boolean;    // 是否固定
  height?: number;    // 高度
  top: string;        // 顶部距离
}

const props = defineProps<Props>()  // 定义默认绑定参数

const {
  tabValue,
  tabs,
  disableTab,
  tabChange,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove,
} = useSegmentLogic(props, emit)

</script>

<style scoped>
ion-segment { /* 设置导航标签背景色 #101629 */
  --background: transparent;
  border-radius: 0;
}

ion-segment-button { /* 取消导航标签按钮默认外边距 */ 
  margin-top: 0;
  margin-bottom: 0;
  --background: var(--color-button-bg-gray);
  --border-radius: 2.125rem;
  --margin-start: .875rem;
  --margin-end: .825rem;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: .5rem;
  --padding-bottom: .5rem;
}
ion-segment-button.segment-button-checked { /* 设置选中动画 */
  animation: fadeToTransparent 600ms linear forwards;
}

ion-segment-button.segment-button-disabled {
  opacity: 1;
}

ion-segment-button ion-img { /* 取消导航标签图标与标签之间的默认边距 */
  margin-top: 4px;
}

ion-segment-button ion-label {  /* 取消导航标签的标签与指示器之间的边距 */
  text-transform: capitalize;   /* 首字母大写 */
  margin-top: 0;
}

ion-segment-button.ios::part(indicator) { /* 设置导航标签指示器样式 */
  padding-inline: 0;
}

ion-segment-button.ios::part(indicator-background) { /* 设置导航标签指示器背景色 #1C2334 */
  background: transparent;
}

ion-icon {
  color: var(--color-primary-800);
}

ion-icon.popular {
  color: var(--color-svg-popular);
}

ion-label.name {
  color: var(--navigation-button-color);
  font-weight: var(--font-weight-medium);
}

@keyframes fadeToTransparent {
  from {
    --background-checked: var(--color-bg-400);
  }
  
  to {
    --background-checked: var(--color-button-bg-gray);
  }
}
</style>