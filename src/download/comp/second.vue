<template>
  <ion-content>
    <ion-toolbar mode="md">
      <img class="h-10" slot="start" :src="template?.appLogo" />
      <ion-title>
        <p class="text-xs"><span class="font-bold text-xl">{{ template?.mainTitleLeft }}</span> - <span>{{
          template?.mainTitleRight }}</span></p>
        <p class="text-[.5rem] text-gray-500">{{ template?.subTitle }}</p>
      </ion-title>
    </ion-toolbar>
    <!-- 轮播图 -->
    <swiper @swiper="onSwiper" class="mt-3" :modules="modules" :autoplay="{ delay: 2500, disableOnInteraction: false }"
      :slidesPerView="1" :slidesPerGroup="1" :initialSlide="0">
      <swiper-slide class="px-2.5" v-for="item in template?.carousel" :key="item">
        <div class="rounded-[.625rem] overflow-hidden">
          <ion-img class="h-48 object-fill" :src="item" />
        </div>
      </swiper-slide>
    </swiper>
    <!-- 跑马灯 -->
    <div class="flex items-center bg-[#161D16] mt-6 pl-2.5 py-1.5">
      <div class="bell h-4 w-4 mr-2" />
      <Marquee class="text-xs flex-1 font-bold"
        :content="[{ name: template?.marqueeText, content: template?.marqueeText, id: template?.marqueeText, linkType: 'none', linkValue: '' }]" />
    </div>
    <div class="flex items-center justify-center text-[#5A985A] leading-none py-7">
      <p class="text-sm">--------</p>
      <div class="flex flex-col items-center mx-2">
        <p>{{ $t('viewsSystem.downloadIndex48') }}</p>
        <p class="text-[.625rem]">{{ $t('viewsSystem.downloadIndex49') }}</p>
      </div>
      <p class="text-sm">--------</p>
    </div>
    <!-- 应用信息 -->
    <div class="mx-2.5 bg-[#161D16] rounded-md p-2.5 flex text-[.625rem]">
      <div class="mt-1.5 mr-2.5 flex flex-col items-center">
        <img class="h-20" :src="template?.appIconUrl" />
        <p class="my-1.5">{{ $t('viewsSystem.downloadIndex50') }}</p>
        <div class="star h-2.5 w-[4.25rem]" />
        <p>(827376)</p>
      </div>
      <div class="flex flex-col flex-1">
        <p class="text-[#FFCC4A] text-base ellipsis  w-[16.875rem]">{{ template?.appName }}</p>
        <p class="flex-1 introduct" v-for="it in introductlist" :key="it">{{ it }}</p>
        <!-- 安装按钮 -->
        <div class="shiny" @click="checkHandle">
          <div class="btn flex flex-col items-center text-xs">
            <div class="flex items-center">
              <span class="text-sm">{{ $t('viewsSystem.downloadIndex01') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-[#161D16] mt-4">
      <ion-img class="h-[9.75rem] object-fill" :src="template?.bottomIcon" />
    </div>
    <!-- 底部 -->
    <div class="flex flex-col items-center text-[#3F5F3F] text-[.625rem] py-7">
      <p>{{ $t('viewsSystem.downloadIndex51') }}</p>
      <p class="font-bold">{{ $t('viewsSystem.downloadIndex52') }}</p>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { IonContent, IonToolbar, IonImg, IonTitle } from '@ionic/vue';
import Marquee from '@/components/Marquee.vue';
import useTemplateLogic from '@/download/useTemplateLogic';
const emit = defineEmits(["checkHandle"])
const checkHandle = () => {
  emit("checkHandle")
}
const {
  template,
  introductlist,
  modules,
  onSwiper
} = useTemplateLogic();
</script>

<style scoped>
ion-toolbar {
  --background: #000;
  margin-top: .75rem;
  padding-bottom: .75rem;
  padding-left: .625rem;
  padding-right: .625rem;
}

ion-content {
  --background: #000;
}

.introduct {
  width: 16.875rem;
}

div.star {
  background: url('/dw/star.png') no-repeat center center / cover;
}

div.bell {
  background: url('/dw/bell.png') no-repeat center center / cover;
}

div.shiny {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

div.shiny>div.btn {
  width: 100%;
  padding: 10px 8px;
  background: #01875f;
  color: white;
  cursor: pointer;
}

div.shiny::before {
  content: '';
  animation: shiny 6s ease-in-out infinite;
  background: white;
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px
}

@keyframes shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }

  80% {
    opacity: 0.5;
    transform: scale(0) rotate(45deg);
  }

  81% {
    opacity: 1;
    transform: scale(4) rotate(45deg);
  }

  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}
</style>
