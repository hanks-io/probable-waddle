<!-- 浮动标签栏 -->
<template>
<div class="segment-container-bg">
  <div class="segment-container relative">
    <div class="w-full z-10" :class="sticky ? 'rounded-b-[7px]' : 'rounded-[7px]'">
      <ion-segment ref="segmentRef" mode="ios" :scrollable="true" v-model="tabValue" @ionChange="tabChange"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @mousemove="handleMouseMove"
      >
        <div v-for="item in tabs" :key="item.code" class="btn-wall">
          <ion-segment-button :value="String(item.id)" :disabled="disableTab" class="relative" :class="tabValue == String(item.id) ? 'active' : ''">
            <div v-if="tabValue == String(item.id)" class="bug"></div>
            <GradientSVG v-if="item.code === 'ONE_API_HOT'" class="type-icon" :src="loadImage(item.code)" styleId="ONE_API_HOT_1">
              <template #default>
                <svg class="svg-wall">
                  <defs>
                    <linearGradient id="ONE_API_HOT_1" x1="11.5677" y1="1.54517" x2="18.4448" y2="21.4853" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#e0cb7f"/>
                      <stop offset="1" stop-color="#ae4137"/>
                    </linearGradient>
                  </defs>
                </svg>
              </template>
            </GradientSVG>
            <i v-else class="type-img" :style="loadImage(item.code)"/>
            <div class="label-wall flex justify-center items-center">
              <ion-icon class="label-icon" src="/svg/gamepad.svg" />
              <span class="label-text text-[0.625rem] font-medium">{{item[labelKey]}}</span>
            </div>
          </ion-segment-button>
        </div>
      </ion-segment>
    </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { IonSegment, IonSegmentButton, IonImg, IonIcon } from '@ionic/vue';
import GradientSVG from '@/components/GradientSVG/index.vue'
import { useSegmentLoad } from '@/hooks/useLoadComponent';
import useSegmentLogic from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/platform/rowLayout/rowPlatformLogic'
import useMouseMove from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/useMouseMove'
import pathMaps from '@/theme/configuration/pathMaps'

const emit = defineEmits(['tabChange']); // 定义默认传递事件方法(update:modelValue为v-model传值)

interface Props {     // 定义默认绑定接参
  sticky: boolean;    // 是否固定
  height: number;     // 高度
}

const props = defineProps<Props>()// 定义默认绑定参数

const loadImage = computed(() => pathMaps.tabbar_inicio_Segment_nav.icon1[1])

const {
  tabs,
  tabValue,
  tabChange,
  segmentRef,
} = useSegmentLogic(props, emit)

const {
  disableTab,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove,
} = useMouseMove()

const { labelKey } = useSegmentLoad()
</script>

<style lang="less" scoped>
@import './index.less';
</style>
