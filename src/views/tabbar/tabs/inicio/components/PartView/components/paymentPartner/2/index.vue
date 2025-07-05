<template>
  <swiper
    v-if="isInitCompleted"
    :class="['image-wrapper', layoutType]"
    :modules="[Autoplay]"
    :autoplay="{
      delay: 1500,
      disableOnInteraction: false,
    }"
    :loop="true"
    :slides-per-view="slidesPerView"
    :space-between="spaceBetween"
    :slides-offset-before="slidesOffsetBefore"
    :slides-offset-after="slidesOffsetAfter"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <swiper-slide v-for="i in imageLength" :key="i">
      <i class="payment-img" :style="getImageStyle(i)" />
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import useSpriteSwiper from './useSpriteSwiper';
import usePaymentPartnerLogic from '@/views/tabbar/tabs/inicio/components/PartView/components/paymentPartner/logic';

const props = defineProps({
  spaceBetween: {
    type: Number,
    default: 0,
  },
  slidesPerView: {
    type: Number,
    default: 3,
  },
  slidesOffsetBefore: {
    type: Number,
    default: 0,
  },
  slidesOffsetAfter: {
    type: Number,
    default: 0,
  },
  layoutType: {
    type: String,
    default: 'layout1',
  },
});

const { paymentPartnerPic } = usePaymentPartnerLogic();
const { onSwiper, getImageStyle, onSlideChange, imageLength, isInitCompleted } = useSpriteSwiper({ url: paymentPartnerPic?.value || '' });

</script>

<style lang="less" scoped>
@import './index.less';
</style>