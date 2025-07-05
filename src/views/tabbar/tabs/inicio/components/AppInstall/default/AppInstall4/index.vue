<template>
  <div class="app-install">
    <div class="ios-btn" @click="appleHandle">
      <ion-icon class="logo" src="/svg/ios1.svg"/>
      <div class="info">
        <ion-label class="title">{{ $t('viewsTabbar.appInstall2') }}</ion-label>
        <ion-label class="sub">{{ $t('viewsTabbar.appInstall1') }}</ion-label>
      </div>
    </div>
    <div class="android-btn" @click="androidHandle">
      <div class="info">
        <ion-label class="title">{{ $t('viewsTabbar.appInstall3') }}</ion-label>
        <ion-label class="sub">{{ $t('viewsTabbar.appInstall1') }}</ion-label>
      </div>
      <ion-icon class="logo" src="/svg/android1.svg"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonIcon, IonLabel } from '@ionic/vue'
  import useAppInstallLogic from '@/views/tabbar/tabs/inicio/components/AppInstall/logic'

  const { appleHandle, androidHandle } = useAppInstallLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>