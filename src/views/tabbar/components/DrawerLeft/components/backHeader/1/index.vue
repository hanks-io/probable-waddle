<template>
  <Layout>
    <template #default="{ logo }">
      <ion-toolbar class="header-logo" v-bind="$attrs">
        <ion-menu-toggle v-bind="closeProps">
          <ion-icon class="close" :src="loadImage.close" />
        </ion-menu-toggle>
        <ion-img class="logo" v-bind="logoProps" :src="logo" />
      </ion-toolbar>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { IonToolbar, IonMenuToggle, IonIcon, IonImg } from '@ionic/vue'
import Layout from '@/views/tabbar/components/DrawerLeft/components/backHeader/layout.vue'

const props = defineProps({
  logoProps: {
    type: Object,
    default: () => ({})
  },
  closeProps: {
    type: Object,
    default: () => ({})
  },
  loadImage: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
