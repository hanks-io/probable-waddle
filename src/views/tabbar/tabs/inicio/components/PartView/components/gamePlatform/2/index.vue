<template>
  <Layout>
    <template #default="{ gamePartnerPic, ...rest }">
      <div class="logo-box">
        <ion-icon :icon="loadImage.icon" class="logo"/>
        <ion-icon :icon="loadImage.subIcon" class="sub-logo sub-logo-1"/>
        <ion-icon :icon="loadImage.subIcon" class="sub-logo sub-logo-2"/>
      </div>
      <ProgressiveImages v-if="gamePlatform && gamePartnerPic" class="partner-img" :src="gamePartnerPic" v-bind="rest" alt="" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import Layout from '../layout.vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';

const props = defineProps({
  gamePlatform: {
    type: Boolean,
    default: true,
  },
  loadImage: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
