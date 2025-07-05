<template>
  <div class="tabbar-tabs-inicio-components-GameWrapper-Head-Head1-index">
    <ion-img v-if="props.platformInfo.logo.includes('.png')" :src="props.platformInfo.logo" class="logo-img" />
    <ion-icon v-else :src="props.platformInfo.logo" class="logo-icon" />
    <ion-label v-if="titleType === '1'" class="label">{{ $t(`sort.${props.type}`) }}</ion-label>
    <ion-label v-if="titleType === '2'" class="label">{{ props.platformInfo.name.toUpperCase() + " " +
      $t(`sort.${type}`) }}</ion-label>
    <ion-label class="todo" @click="emits('categoryHandle')">
      <span class="all">{{ $t(`sort.ALL`) }}</span>
      <span class="amount">{{ props.total }}</span>
    </ion-label>
    <div class="arrow-container" v-if="showNextBtn">
      <ion-icon class="left" :icon="chevronBack" @click="emits('swiperToSlide', 'prev')" />
      <ion-icon class="right" :icon="chevronForward" @click="emits('swiperToSlide')" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 这个头部用于第一版，只有热门游戏，不需要配置logo
 */
import { chevronBack, chevronForward } from 'ionicons/icons';
import { IonLabel, IonIcon, IonImg } from '@ionic/vue';
import useLogic from '@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/logic'


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
} = useLogic(props);
</script>

<style lang="less" scoped>
@import './index.less';
</style>
