<!--宫格抽奖 -->
<template>
  <div class="lucky-grid-container">
    <lucky-grid 
      :blocks="blocks" 
      :prizes="prizes" 
      @start="startCallback" 
      @end="endCallback"
      :defaultStyle="computedDefaultStyle" 
      :activeStyle="computedActiveStyle" 
      :rows="computedRows" 
      :cols="computedCols"
      :height="computedHeight"
      :width="computedWidth"
      ref="luckyGridRef" 
    />
    <slot name="lucky_grid_title" />
    <div v-if="lucky_grid_button" :class="isStart || once ? lucky_grid_button.class : lucky_grid_button.classDisabled">
      <div :class="isStart || once ? lucky_grid_button.innerClassDisabled : lucky_grid_button.innerClass" @click="startCallback">
        <slot name="lucky_grid_button" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import { LuckyGrid } from '@lucky-canvas/vue';

const luckyGridRef = ref<any>(null);
const isStart = ref(false);
const isOnError = ref(false);

const props = defineProps<{
  blocks?: Array<{ padding: string, background: string }>,
  prizes?: Array<{ x: number, y: number }>,
  buttons?: Array<{ type: string, value: string }>,
  rows?: number,
  cols?: number,
  defaultStyle?: { background: string , lengthLimit?: string },
  activeStyle?: { background: string },
  lucky_grid_button?: { 
    class: string, // 自定义样式按钮 防止与组件样式冲突
    innerClassDisabled?: string,
    classDisabled?: string,
    innerClass?: string,
    click: () => Promise<number> // 返回值为抽奖结果
  },
  height?: number | string,
  width?: number | string,
  once?: boolean,
  endCallback?: (isOnError: boolean) => void
}>()


const rootStyles = getComputedStyle(document.documentElement);
const active_Style = { background: rootStyles.getPropertyValue('--ep-accent-yellow') };

const blocks = computed(() => props.blocks);
const prizes = computed(() => props.prizes);
const computedRows = computed(() => props.rows || 2);
const computedCols = computed(() => props.cols || 3);
const computedDefaultStyle = computed(() => props.defaultStyle);
const computedActiveStyle = computed(() => props.activeStyle || active_Style);
const computedHeight = computed(() => props.height || 200);
const computedWidth = computed(() => props.width || 300);

const startCallback = async () => {
  const { click } = props.lucky_grid_button || {};
  luckyGridRef.value.play();
  if (props.once) return;
  if (!isStart.value) {
    const index = await click?.();
    if (index || index === 0) {
      isStart.value = true;
      luckyGridRef.value.stop(index);
    } else {
      isOnError.value = true;
      luckyGridRef.value.stop();
    }
  }
};

const endCallback = () => {
  props.endCallback?.(isOnError.value);
  isStart.value = false;
};

</script>

<style scoped lang="less">
.lucky-grid-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
