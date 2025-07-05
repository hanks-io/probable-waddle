<!-- 浮动标签栏 -->
<template>
  <div 
    ref="tabRef"
    class="segment-container-bg"
    :style="`margin-bottom:${bottom + 16}px;height:calc(${componentHeight}px - env(safe-area-inset-bottom))`"
  >
    <div class="segment-container relative">
      <div class="w-full z-10">
        <ion-segment mode="ios" v-model="tabValue" @ionChange="tabChange">
          <ion-segment-button v-for="item in tabs" :value="String(item.id)" :key="item.code"
            class="relative">
            <div v-if="tabValue == String(item.id)" class="lamp" />
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
            <ion-label>{{ item.name }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    IonLabel,
    IonSegment,
    IonSegmentButton,
  } from "@ionic/vue";
  import useLogic from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/platform/columnLayout/columnPlatformLogic'
  import GradientSVG from '@/components/GradientSVG/index.vue'
  import pathMaps from '@/theme/configuration/pathMaps'


  const emits = defineEmits(['tabChange']); // 定义默认传递事件方法(update:modelValue为v-model传值)

  interface Props {     // 定义默认绑定接参
    sticky: boolean;    // 是否固定
    height: number;     // 高度
    bottom: number; // 固定标签栏底部距离
  }

  const props = defineProps<Props>()// 定义默认绑定参数

  const loadImage = computed(() => pathMaps.tabbar_inicio_Segment_nav.icon1[1])

  const {
    tabs,
    tabRef,
    voiceBug,
    tabValue,
    tabChange,
    componentHeight,
  } = useLogic(props, emits)

  defineExpose({ // 定义默认暴露方法
    voiceBug
  })
</script>

<style scoped lang="less">
  @import './index.less';
</style>
