<template>
  <div class="game-head">
    <template v-for="item in componentList" :key="item.key">
      <component v-if="item.componentName === 'tabbar_inicio_GameWrapper_WrapperHead_start'" :is="item.component"
        v-bind="item.options" :type="type" :titleType="titleType" :sortLogoSrc="sortLogoSrc"
        :platformInfo="platformInfo" :platformLogoSrc="platformLogoSrc" />
      <component v-if="item.componentName === 'tabbar_inicio_GameWrapper_WrapperHead_center'" :is="item.component"
        v-bind="item.options" :total="total" />
      <template v-if="showNextBtn">
        <component v-if="item.componentName === 'tabbar_inicio_GameWrapper_WrapperHead_end'" :is="item.component" v-bind="item.options" :isInvalid="isInvalid" @swiperToSlide="(val) => $emit('swiperToSlide', val )" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import useLogic from '@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/logic';


const props = defineProps({
  logo: { type: String, default: '' },             // logo
  titleType: { type: String, default: '1' },           // 标题
  type: { type: String, required: true },             // 游戏类型
  size: { type: Number, required: true },             // swiper每页展示数量
  total: { type: Number, required: true },   // 游戏列表长度
  swiperIndex: { type: Number, required: true },      // swiper当前索引
  platformInfo: { type: Object, required: true },     // 平台信息
  showNextBtn: { type: Boolean, default: true },      // 是否展示下一页按钮
  loadImage: { type: Object, default: () => { } }, // 加载图片
  componentList: { type: Array, default: () => [] }, // 组件列表
});

const {
  isInvalid,
  sortLogoSrc,
  platformLogoSrc,
} = useLogic(props);
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
