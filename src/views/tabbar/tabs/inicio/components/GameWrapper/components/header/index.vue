<template>
  <div class="game-head">
    <component v-for="item in componentList" :key="item.key" :is="item.component" v-bind="item.options" />
  </div>
</template>

<script setup lang="ts">
import useLogic from '@/views/tabbar/tabs/inicio/components/GameWrapper/components/header/logic';


const props = defineProps({
  showNextBtn: { type: Boolean, default: true },      // 是否展示下一页按钮
  componentList: { type: Array, default: () => [] }, // 组件列表
  pageJumps: { type: Function, default: () => {} }, // 跳转事件
  gameTypeOrPlatform: { type: String, default: '' },
  provideName: { type: String, default: 'headerInject' },
});

useLogic(props);
</script>

<style lang="less" scoped>
.game-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.border-top {
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.0625rem;
    background: var(--border-color1);
  }
}

.border-bottom {
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.0625rem;
    background: var(--border-color2);
  }
}

</style>
