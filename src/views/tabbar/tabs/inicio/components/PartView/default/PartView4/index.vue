<template>
  <!-- 社交媒体 -->
  <div v-if="socialMedia" class="social-box">
    <p class="title">{{ $t("title.socialNetworks") }}</p>
    <div class="img-container">
      <ion-img class="img" :src="item.icon" v-for="item of mediaList" :key="item.id" @click="linkHandle(item.link, item.type)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonImg } from "@ionic/vue";
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
.social-box {
  margin-top: 2.5rem;
  text-align: center;
  width: 100%;
  padding-inline: 0.9375rem;

  .title {
    margin-bottom: 1.25rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #899fbe;
  }

  .img-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1.125rem;

    .img {
      flex-shrink: 0;
      width: 2.875rem;
      height: 2.875rem;
      border-radius: .75rem;
      border: .375rem solid rgba(137, 159, 190, 0.13);
      overflow: hidden;
      object-fit: cover;
    }
  }
}
</style>
