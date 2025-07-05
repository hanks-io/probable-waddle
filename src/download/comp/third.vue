<template>
  <ion-content>
    <div class="w-full h-[33rem] p-4"
      :style="`background: url('${template?.appLogo}') no-repeat center center / 100% 100%`">
      <img class="h-[5.5rem]" :src="template?.appIconUrl" />
    </div>
    <!-- 安装按钮 -->
    <ion-img class="w-full" src="/gif/download-btn.gif" @click="checkHandle" />
    <ion-img class="w-full h-[27.5rem] object-fill" :src="template?.appLogoTwo" />
    <div class="swiper-box px-[2.4375rem] pt-[7.875rem] w-full h-[22.875rem]">
      <!-- 轮播图1 -->
      <swiper @swiper="onSwiper" class="mt-3" :pagination="{ clickable: false }" :modules="modules"
        :autoplay="{ delay: 2500, disableOnInteraction: false }" :slidesPerView="1" :slidesPerGroup="1"
        :initialSlide="0">
        <swiper-slide v-for="item in template?.carouselOne" :key="item">
          <ion-img class="h-[11.75rem] object-fill" :src="item" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="swiper-box px-[2.4375rem] pt-[7.875rem] w-full h-[22.875rem]">
      <!-- 轮播图2 -->
      <swiper @swiper="onSwiper" class="mt-3" :pagination="{ clickable: false }" :modules="modules"
        :autoplay="{ delay: 2500, disableOnInteraction: false }" :slidesPerView="1" :slidesPerGroup="1"
        :initialSlide="0">
        <swiper-slide v-for="item in template?.carouselTwo" :key="item">
          <ion-img class="h-[11.75rem] object-fill" :src="item" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="w-full h-[5.75rem]" />
    <div class="footer fixed z-50 bottom-0 px-3 w-full h-[5.75rem] flex items-center font-bold">
      <img class="w-[5.5rem] h-[5.5rem]" :src="template?.appIconUrl" />
      <div class="flex-1 ml-2.5 max-w-[13.75rem]">
        <p class="name ellipsis text-4xl whitespace-nowrap">{{ template?.appName }}</p>
        <p class="introduct ellipsis">{{ template?.appIntroduct }}</p>
      </div>
      <img class="w-16 h-[3.25rem]" src="/gif/download-small.gif" @click="checkHandle" />
    </div>
  </ion-content>
</template>

<script setup lang="ts">

import { Swiper, SwiperSlide } from 'swiper/vue';
import { IonContent, IonImg } from '@ionic/vue';
import useTemplateLogic from '@/download/useTemplateLogic';
const emit = defineEmits(["checkHandle"])
const checkHandle = () => {
  emit("checkHandle")
}
const {
  template,
  modules,
  onSwiper
} = useTemplateLogic();
</script>

<style scoped>
ion-content {
  --background: transparent;
}

.introduct {
  color: #FBAD31;
  font-size: .875rem;
  line-height: 1.5rem;
}

div.swiper-box {
  background: url('/images/download/swiper-bg-third.jpg') no-repeat center center / cover;
}

div.footer {
  background: url('/images/download/footer-bg-third.jpg') no-repeat center center / cover;
}

div.footer p.name {
  letter-spacing: -0.2rem;
  background: linear-gradient(0deg, #F8B419, #FFE0A7 40%, #FFF 50%, #FFE1A7 60%, #F8B419);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
