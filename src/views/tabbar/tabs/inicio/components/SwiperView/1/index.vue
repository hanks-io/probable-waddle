<template>
  <div class="swiper-poster" v-if="showIonImg">
    <swiper @swiper="onSwiper" :modules="modules" :pagination="{ clickable: false }" :autoplay="{ delay: 2500, disableOnInteraction: false }" :slidesPerView="1" :slidesPerGroup="1" :initialSlide="0" :loop="isLoopEnabled">
      <swiper-slide v-for="item in carouselList" :key="item.name">
        <img class="poster-img" :src="item.content" @click="swiperHandle(item)"/>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { IonImg } from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import useSwiperViewLogic from '../logic';

const emit = defineEmits(['loaded']);

const { 
  carouselList,
  isLoopEnabled,
  modules,
  showIonImg,
  swiperHandle,
  onSwiper 
} = useSwiperViewLogic(emit);
</script>

<style scoped lang="less">
@import '@/views/tabbar/tabs/inicio/components/SwiperView/styles/default.less';
</style>
