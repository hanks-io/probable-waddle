<!-- 三方合作栏 -->
<template>
  <div class="part-container my-3.5 flex flex-col items-center w-full" v-if="mediaList.length">
    <div v-if="socialMedia" class="title">{{ $t("title.socialNetworks") }}</div>
    <!-- 分割线 -->
    <div v-if="socialMedia" class="divider" />
    <!-- 社交媒体 -->
    <div v-if="socialMedia" class="text-center w-full">
      <ion-row class="w-full justify-evenly">
        <ion-img class="social-img" :src="item.icon" v-for="item of mediaList" :key="item.id"
          @click="linkHandle(item.link, item.type)" />
      </ion-row>
    </div>
    <div v-if="gamePlatform" class="title">{{ $t("title.supported") }}</div>
    <!-- 分割线 -->
    <div v-if="gamePlatform" class="divider" />
    <!-- 充值平台 -->
    <div v-if="paymentPlatform" class="mt-3.5">
      <ion-img class="w-full my-6" :src="paymentPartnerPic" />
    </div>
    <div v-if="gamePartnerPic" class="title">{{ $t("title.gamePlatform") }}</div>
    <!-- 分割线 -->
    <div v-if="gamePartnerPic" class="divider" />
    <!-- 合作游戏平台 -->
    <div class="mb-[0.5487rem] w-full mt-[1.4375rem] flex justify-center">
      <img class="game-img" :src="gamePartnerPic" alt="">
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonImg, IonRow } from "@ionic/vue";
import usePartViewLogic from "@/views/tabbar/tabs/inicio/components/PartView/logic";

withDefaults(
  defineProps<{
    gamePlatform?: boolean;
    socialMedia?: boolean;
    paymentPlatform?: boolean;
  }>(),
  {
    gamePlatform: true,
    socialMedia: true,
    paymentPlatform: true,
  },
);

const { mediaList, paymentPartnerPic, gamePartnerPic, linkHandle } = usePartViewLogic();
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
