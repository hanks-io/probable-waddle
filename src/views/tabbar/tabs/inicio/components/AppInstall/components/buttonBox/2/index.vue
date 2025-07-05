<template>
  <div v-if="!isApp" :class="['btn-container', layoutType]">
    <div :class="['ios-btn', iosClass]" @click="appleHandle" :style="iosStyle">
      <ion-icon class="logo" :src="loadImage.ios" />
      <div class="label-container">
        <ion-label v-for="text in iosTitleList" :key="text" class="label">{{ text }}</ion-label>
      </div>
    </div>
    <div :class="['android-btn', androidClass]" @click="androidHandle" :style="androidStyle">
      <ion-icon class="logo" :src="loadImage.android" />
      <div class="label-container">
        <ion-label v-for="text in androidTitleList" :key="text" class="label">{{ text }}</ion-label>
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
  iosClass: {
    type: String,
    default: ''
  },
  androidStyle: {
    type: Object,
    default: () => ({})
  },
  androidClass: {
    type: String,
    default: ''
  },
  layoutType: {
    type: String,
    default: 'layout1'
  }
})

const {
  isApp,
  iosTitleList,
  androidTitleList,
  appleHandle,
  androidHandle
} = useAppInstallLogic(props);

</script>

<style lang="less" scoped>
@import './index.less';
</style>