<template>
  <div class="game-head">
    <div class="logo-c">
      <GradientSVG :src="sortLogoSrc" class="logo" />
      <ion-label v-if="titleType === '1'" class="flex-1 font-extrabold text-sm">{{ $t(`sort.${props.type}`)
        }}</ion-label>
      <ion-label v-if="titleType === '2'" class="flex-1 font-extrabold text-sm">{{ props.platformInfo.name + " " +
        $t(`sort.${type}`) }}</ion-label>
    </div>
    <ion-label class="todo" @click="emits('categoryHandle')">
      <span class="all mr-1">{{ $t(`sort.ALL`) }}</span>
    </ion-label>
  </div>
</template>

<script setup lang="ts">
import { chevronBack, chevronForward } from "ionicons/icons";
import { IonLabel, IonIcon, IonImg } from '@ionic/vue';
import GradientSVG from '@/components/GradientSVG/index.vue';
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
@import "./index.less";
</style>
