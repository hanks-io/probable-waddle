<template>
  <div class="tabbar-tabs-inicio-components-MarqueeView-default-index">
    <ion-icon class="megaphone" src="/svg/broadcast-2.svg" />
    <Marquee class="label text-xs my-1" :content="marqueeContent" />
    <div class="badge" @click="router.push('/notification')">
      <ion-icon src="/svg/message1.svg" />
      <p 
        class="dot"
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
