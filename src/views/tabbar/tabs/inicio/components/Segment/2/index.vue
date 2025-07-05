<!-- 浮动标签栏 -->
<template>
  <div class="segment-container-bg" style="top: -0.0625rem">
    <div class="segment-container relative px-[.9375rem] mb-[0.625rem] pb-[0.625rem]">
      <div class="w-full z-10 " :class="sticky ? 'rounded-b-[7px]' : 'rounded-[7px]'">
        <ion-segment mode="ios" scrollable v-model="tabValue" @ionChange="tabChange" @mousedown="handleMouseDown"
          @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove" id="linkSegmentRef">
          <ion-segment-button v-for="item in tabs" :value="String(item.id)" :key="item.code" :disabled="disableTab"
            @click='checkedLineChange'>
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
            <i v-else :class="[tabValue == String(item.id) ? 'ionImgActive' : '', 'type-img']" :style="loadImage(item.code)"/>
            <ion-label
              :class="[tabValue == String(item.id) ? 'active' : '', ' text-[0.625rem]']">{{ item.name }}</ion-label>
          </ion-segment-button>
          <div class="checkedLineArea  h-[0.3125rem] bg-[#162C48] absolute left-0 bottom-0 flex items-center">
            <div class="checkedLine w-[0.5rem] h-[0.125rem] bg-[#94FF7F] ">
            </div>
          </div>
        </ion-segment>
        <div class="trapezoidImage w-full h-[1.9688rem] mt-[-2.1875rem]">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonSegment, IonSegmentButton, IonImg, IonLabel } from '@ionic/vue';
  import GradientSVG from '@/components/GradientSVG/index.vue'
  import useCheckedLine from './useCheckedLine';
  import useSegmentLogic from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/platform/rowLayout/rowPlatformLogic'
  import useMouseMove from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/useMouseMove'
  import { useGameStore } from '@/store/game';
  import pathMaps from '@/theme/configuration/pathMaps'

  const gameStore = useGameStore();

  const emit = defineEmits(['tabChange']);

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
  } = useSegmentLogic(props, emit)

  const {
    disableTab,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
  } = useMouseMove()

  const {
    checkedLineLeft,
    checkedLineWidth,
    checkedLineChange,
  } = useCheckedLine()
  /**
   * @description 监听侧边栏点击,数据改变,切换首页segment
   */
  watch(() => gameStore.currentSegment, (newVal) => {
    if (newVal.segment != '-1') {
      nextTick(() => {
        tabChange({
          detail: {
            value: newVal.segment + ''
          }
        })

        tabValue.value = newVal.segment + "";
        let linkSegmentRef = document.querySelector('#linkSegmentRef')
        if (linkSegmentRef) {
          checkedLineLeft.value = `${linkSegmentRef.children[newVal.index].offsetLeft + linkSegmentRef!.children[newVal.index].clientWidth / 2 - 4}px`;
        }
      })
    }
  })

</script>

<style lang="less" scoped>
  .segment-container-bg {
    padding-bottom: 0.0625rem;
    background: linear-gradient(180deg, #090F1F 79.72%, rgba(9, 15, 31, 0.00) 96.1%);
  }

  .segment-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    /* 调整背景图片的透明度 */
    z-index: -1;
    /* 使伪元素在内容后面 */
    /* 内容样式 */
    background-image: url("/icons/texture_bg.png");
    /* 设置背景图像(需要先将--background变量设置透明) */
    background-size: 5rem;
    /* 设置背景图像块的大小为100px x 100px */
    background-repeat: repeat;
    /* 设置背景图像平铺 */
  }

  ion-segment {
    /* 设置导航标签背景色 #101629 */
    --background: transparent;
    border-radius: 0;
  }

  ion-segment-button {
    /* 取消导航标签按钮默认外边距 */
    margin-top: 0;
    margin-bottom: 0;
    display: flex;
    align-items: flex-end;

    .active {
      font-weight: 600;
    }
  }

  ion-segment-button.segment-button-checked {
    /* 设置选中动画 */
    opacity: 1;
  }

  ion-segment-button.segment-button-disabled {
    opacity: 1;
  }

  .ionImgActive {
    /* 取消导航标签图标与标签之间的默认边距 */
    animation: buttonAnimation 500ms;
    transform: scale(1.25);
  }

  @keyframes buttonAnimation {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(1.5);
    }

    100% {
      transform: scale(1.25);
    }
  }

  ion-segment-button {
    /* 取消导航标签图标与标签之间的默认边距 */
    opacity: 0.4;
  }

  ion-segment-button ion-label {
    /* 取消导航标签的标签与指示器之间的边距 */
    text-transform: capitalize;
    /* 首字母大写 */
    margin-top: 0.125rem;
    margin-bottom: 0.5625rem;
    line-height: 0.75rem;
  }

  ion-segment-button.ios::part(indicator) {
    /* 设置导航标签指示器样式 */
    padding-inline: 0;
  }

  ion-segment-button.ios::part(indicator-background) {
    /* 设置导航标签指示器背景色 #1C2334 */
    background: transparent;
  }

  .checkedLineArea {
    width: v-bind(checkedLineWidth);

    .checkedLine {
      margin-left: v-bind(checkedLineLeft);
      transition: margin-left 0.3s;
      box-shadow: 0px 0.25rem 0.25rem 0rem rgba(0, 0, 0, 0.25);
      border-radius: 0.125rem;
    }
  }

  .trapezoidImage {
    background: url('/images/bgTrapezoid.png') no-repeat center center/cover;
  }

  @keyframes fadeToTransparent {
    from {
      --background-checked: #343947;
    }

    to {
      --background-checked: rgba(255, 0, 0, 0);
    }
  }

  .green-default {
    .segment-container {
      &>div {
        background-color: var(--color-bg-100);
      }
    }

    ion-segment-button {
      ion-label {
        color: var(--color-text-gray-200);
      }

    }
  }

  .type-img {
    margin-top: 0.25rem;
    width: 2.25rem;
    height: 2.25rem;
    display: block;
    background-size: 800% 400%;
  }

  .type-icon {
    width: 2.25rem;
    height: 2.25rem;
  }
         
</style>