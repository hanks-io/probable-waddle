<!-- 三方合作栏 -->
<template>
  <div class="tabbar-tabs-inicio-components-PartView-default-index" v-if="mediaList.length">
    <!-- 合作游戏平台 -->
    <img class="game-brand" :src="gamePartnerPic" alt="">
    <!-- 分割线 -->
    <div v-if="gamePlatform" class="divider" />
    <!-- 社交媒体 -->
    <div v-if="socialMedia" class="social-box">
      <p class="title">{{ $t("title.socialNetworks") }}</p>
      <ion-row class="row">
        <ion-img
          class="img"
          :src="item.icon"
          v-for="item of mediaList"
          :key="item.id"
          @click="linkHandle(item.link, item.type)"
        />
      </ion-row>
    </div>
    <!-- 分割线 -->
    <div v-if="socialMedia" class="divider" />
    <!-- 充值平台 -->
    <div v-if="paymentPlatform" class="payment-box">
      <ion-img class="img" :src="paymentPartnerPic" />
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
@import './index.less';
</style>
