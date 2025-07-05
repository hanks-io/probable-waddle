<template>
 <div class="h-[11.5rem]" v-if="!carouselList.length"></div>
  <div class="swiper-poster" v-else>
    <swiper @swiper="onSwiper" class="mt-3" :modules="modules" :pagination="{ clickable: false }" :autoplay="{ delay: 2500, disableOnInteraction: false }" :slidesPerView="1" :slidesPerGroup="1" :initialSlide="0" :loop="isLoopEnabled">
      <swiper-slide v-for="item in carouselList" :key="item.name">
        <img class="h-40 object-cover object-center" :src="item.content" @click="swiperHandle(item)"/>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import useSwiperViewLogic from '../logic';

const emit = defineEmits(['loaded']);

const {
  carouselList,
  isLoopEnabled,
  modules,
  swiperHandle,
  onSwiper 
} = useSwiperViewLogic(emit);
</script>

<style scoped lang="less">
.swiper {
  border-radius: .375rem;
  overflow: hidden;
}

:global(div.swiper-poster .swiper .swiper-pagination ) {
  position: relative;
  bottom: 0;
}

:global(div.swiper-poster .swiper .swiper-pagination .swiper-pagination-bullet) {
  width: .5rem;
  height: .25rem;
  border-radius: .125rem;
  background: var(--color-swiper-pagination);
}

:global(div.swiper-poster .swiper .swiper-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active) {
  width: 1.25rem;
  background: var(--color-primary-btn-active) !important;
}

.swiper-box {
  margin-top: .75rem;
}

.amber-purple {
  .swiper-box {
    margin-top: 1rem;
  }
  :global(div.swiper-poster .swiper .swiper-pagination) {
    display: none;
  }
}
</style>
