<template>
  <div class="tabbar-tabs-inicio-components-MarqueeView-default-index">
    <div class="megaphone-wrapper">
      <ion-icon class="megaphone" src="/svg/broadcast-3.svg" />
      <Marquee class="label text-xs my-1" :content="marqueeContent" />
      <div class="badge" @click="router.push('/notification')">
        <ion-icon src="/svg/message2.svg" />
        <p 
          class="dot"
          v-if="unreadMailCount || unreadAnnouncement"
        >{{ unreadMailCount + unreadAnnouncement < 99 ?
        unreadMailCount + unreadAnnouncement : 99 }}
        </p>
      </div>
    </div>
    <ion-button class="unset-btn search" @click="navigateToSearch">
      <ion-icon class="search-icon icon-btn" slot="icon-only" src="/svg/search.svg" />
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';
import Marquee from '@/components/Marquee.vue';
import useMarqueeLogic from '@/views/tabbar/tabs/inicio/components/MarqueeView/logic';
import router from '@/router';

const { marqueeContent, unreadMailCount, unreadAnnouncement, navigateToSearch } = useMarqueeLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
