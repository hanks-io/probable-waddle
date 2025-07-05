<template>
  <div class="install-container">
    <div class="title">
      {{ $t('viewsTabbar.DownloadApp') }}
    </div>
    <div class="introduce">
      {{ $t('viewsTabbar.DownloadAppDes') }}
    </div>
    <div class="btn-container">
      <div class="ios-btn" @click="appleHandle">
        <ion-icon class="logo" src="/svg/apple.svg" />
        <div>
          <p class="text-sub">{{ $t('viewsTabbar.appInstall1') }}</p>
          <p class="text">{{ $t('viewsTabbar.appInstall2') }}</p>
        </div>
      </div>
      <div class="android-btn" @click="androidHandle">
        <ion-icon class="logo" src="/svg/android.svg" />
        <div>
          <p class="text-sub">{{ $t('viewsTabbar.appInstall1') }}</p>
          <p class="text">{{ $t('viewsTabbar.appInstall3') }}</p>
        </div>
      </div>
    </div>
    <ion-img class="app-logo" :src="appLogo" />
  </div>
</template>

<script setup lang="ts">
import { IonRow, IonCol, IonIcon, IonImg } from '@ionic/vue'
import useAppInstallLogic from '@/views/tabbar/tabs/inicio/components/AppInstall/logic'

const { appleHandle, androidHandle,appLogo } = useAppInstallLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
