<template>
  <div class="px-3">
    <div class="marquee-box flex justify-center items-center mt-[0.8125rem] mb-[0.625rem] px-[0.4375rem] pt-[0.75rem] pb-[0.8125rem] rounded-[.25rem] relative min-h-[1.875rem]">
      <ion-icon class="text-[1.5rem] mr-[0.625rem]" src="/svg/broadcast-1.svg"/>
      <Marquee class="marquee" :content="marqueeContent"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonImg } from '@ionic/vue';
import Marquee from '@/components/Marquee.vue';
import useMarqueeLogic from '../logic';
import router from '@/router';

const { marqueeContent, unreadMailCount, unreadAnnouncement } = useMarqueeLogic();
</script>

<style scoped>
div.left {
  background: linear-gradient(90deg, var(--color-bg-300) 46.36%, rgba(28, 35, 52, 0) 100%);
}

div.right {
  background: linear-gradient(270deg, var(--color-bg-300), rgba(28, 35, 52, 0) 100%);
}

.marquee {
  color: var(--marquee-color);
  font-weight: var(--marquee-weight);
  font-size: var(--marquee-size);
  flex: 1;
  overflow: hidden;
}
.marquee-box {
  box-sizing: border-box;
  background: var(--color-bg-200);
}
</style>
