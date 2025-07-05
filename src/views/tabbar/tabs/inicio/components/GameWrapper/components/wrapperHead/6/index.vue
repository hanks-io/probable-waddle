<template>
  <div class="game-head">
    <div class="logo-c">
      <ion-icon :src="platformLogoSrc" :class="[iconStyle, 'logo']" />
      <ion-label v-if="titleType === '1'" class="label">{{ $t(`sort.${props.type}`) }}</ion-label>
      <ion-label v-if="titleType === '2'" class="label">{{ props.platformInfo.name + " " + $t(`sort.${type}`)
        }}</ion-label>
      <ion-badge class="total">{{ props.total }}</ion-badge>
    </div>
    <div class="arrow-container" v-if="showNextBtn">
      <ion-icon class="left" :icon="chevronBack" @click="emits('swiperToSlide', 'prev')" />
      <ion-icon class="right" :icon="chevronForward" @click="emits('swiperToSlide')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { chevronBack, chevronForward } from "ionicons/icons";
import { IonLabel, IonIcon, IonImg, IonBadge } from '@ionic/vue';
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

const iconStyle = computed(() => {
  return ['POPULAR', 'SPORTS'].includes(props.type) ? 'logo1' : ''
});

const {
  isInvalid,
  platformLogoSrc
} = useLogic(props);
</script>

<style lang="less" scoped>
@import './index.less';
</style>
