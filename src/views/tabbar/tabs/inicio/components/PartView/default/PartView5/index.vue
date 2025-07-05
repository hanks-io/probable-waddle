<!-- 三方合作栏 -->
<template>
  <div class="part-container">
    <!-- 社交媒体 -->
    <div v-if="socialMedia && mediaList.length" class="social-box">
      <ProgressiveImages
        v-for="item of mediaList"
        class="social-img"
        :src="item.icon"
        :key="item.id"
        @click="linkHandle(item.link, item.type)"
      />
    </div>
    <!-- 合作游戏平台 -->
    <ProgressiveImages v-if="gamePlatform && gamePartnerPic" class="partner-img" :src="gamePartnerPic" alt="" />
    <!-- 充值平台 -->
    <ProgressiveImages v-if="paymentPlatform && paymentPartnerPic" class="payment-img" :src="paymentPartnerPic" />
  </div>
</template>

<script setup lang="ts">
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
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
