<template>
  <div v-if="!isApp" class="btn-container">
    <div class="ios-btn" @click="appleHandle" :style="iosStyle">
      <div class="logo-container">
        <ion-icon class="logo" :src="loadImage.ios" />
        <ion-label class="text">{{ iosTitle }}</ion-label>
      </div>
    </div>
    <div class="android-btn" @click="androidHandle" :style="androidStyle">
      <div class="logo-container">
        <ion-icon class="logo" :src="loadImage.android" />
        <ion-label class="text">{{ androidTitle }}</ion-label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel } from '@ionic/vue';
import useAppInstallLogic from '@/views/tabbar/tabs/inicio/components/AppInstall/logic'


const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({}),
  },
  iosTitleKeys: {
    type: Array,
    default: () => ['viewsTabbar.appInstall4']
  },
  androidTitleKeys: {
    type: Array,
    default: () => ['viewsTabbar.appInstall5']
  },
  iosStyle: {
    type: Object,
    default: () => ({})
  },
  androidStyle: {
    type: Object,
    default: () => ({})
  }
})

const {
  isApp,
  iosTitle,
  androidTitle,
  appleHandle,
  androidHandle
} = useAppInstallLogic(props);

</script>

<style lang="less" scoped>
@import './index.less';
</style>
