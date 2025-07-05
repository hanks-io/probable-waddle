<!-- 三方合作栏 -->
<template>
  <div class="part-container my-[1.5369rem] flex flex-col items-center" v-if="mediaList.length">
    <!-- 社交媒体 -->
    <div v-if="socialMedia" class="mt-[0.375rem] text-center w-full px-[.46875rem]">
      <ion-row class="w-full justify-center">
        <img
          class="contain w-[1.5rem] h-[1.5rem] mx-2"
          :src="item.icon"
          v-for="item of mediaList"
          :key="item.id"
          @click="linkHandle(item.link, item.type)"
        />
      </ion-row>
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
.box {
  width: 4rem;
}

.divider {
  background-color: var(--line-color);
}

.green-default {
  .part-container {
    .text {
      color: var(--color-text-gray-100);
    }
  }
}
</style>
