<template>
  <div class="game-head">
    <div class="logo-c" @click="emits('categoryHandle')">
      <GradientSVG :src="sortLogoSrc" class="logo" />
      <ion-label v-if="titleType === '1'" class="label">{{ $t(`sort.${props.type}`) }}</ion-label>
      <ion-label v-if="titleType === '2'" class="label">{{ props.platformInfo.name + " " + $t(`sort.${props.type}`)
        }}</ion-label>
      <ion-badge class="total">{{ props.total }}</ion-badge>
    </div>
    <div class="arrow-container" v-if="showNextBtn">
      <ion-icon :class="[isInvalid('left'), 'left']" icon="/svg/arrow-left.svg"
        @click="emits('swiperToSlide', 'prev')" />
      <ion-icon :class="[isInvalid('right'), 'right']" icon="/svg/arrow-right.svg" @click="emits('swiperToSlide')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonLabel, IonIcon, IonBadge } from '@ionic/vue';
import GradientSVG from '@/components/GradientSVG/index.vue'
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
});

const emits = defineEmits(['swiperToSlide', 'categoryHandle']);


const {
  isInvalid,
  sortLogoSrc,
} = useLogic(props);
</script>

<style lang="less" scoped>
@import './index.less';
</style>
