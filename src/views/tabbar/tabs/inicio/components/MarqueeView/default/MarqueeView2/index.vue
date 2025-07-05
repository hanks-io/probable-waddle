<template>
  <div class="marquee-container">
    <ion-icon class="megaphone" src="/svg/broadcast-2.svg" />
    <Marquee class="label text-xs" :content="marqueeContent" />
    <div class="badge" @click="router.push('/notification')">
      <p 
        class="dot bg-[#FF0000]"
        v-if="unreadMailCount || unreadAnnouncement"
      >{{ unreadMailCount + unreadAnnouncement < 99 ?
       unreadMailCount + unreadAnnouncement : 99 }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonImg } from '@ionic/vue';
import Marquee from '@/components/Marquee.vue';
import useMarqueeLogic from '@/views/tabbar/tabs/inicio/components/MarqueeView/logic';
import router from '@/router';

const { marqueeContent, unreadMailCount, unreadAnnouncement } = useMarqueeLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
