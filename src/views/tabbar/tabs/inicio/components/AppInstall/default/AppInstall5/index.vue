<template>
  <div class="app-install">
    <ProgressiveImages src="/images/dwarf.png" class="showy"/>
    <div class="app-install-content">
      <div class="title">
        <ion-icon class="title-logo" src="/svg/safe.svg" />
        <ion-label class="title-text">{{ $t('viewsTabbar.DownloadApp') }}</ion-label>
      </div>
      <p class="description">
        {{ $t('viewsTabbar.DownloadAppDes') }}
      </p>
      <div class="btn-container">
        <div class="ios-btn" @click="appleHandle">
          <ion-icon class="logo" src="/svg/apple.svg" />
          <ion-label class="text">{{ $t('viewsTabbar.appInstall4') }}</ion-label>
        </div>
        <div class="android-btn" @click="androidHandle">
          <ion-icon class="logo" src="/svg/android.svg" />
          <ion-label class="text">{{ $t('viewsTabbar.appInstall5') }}</ion-label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel } from '@ionic/vue'
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'
import useAppInstallLogic from '@/views/tabbar/tabs/inicio/components/AppInstall/logic'

const { appleHandle, androidHandle, appLogo } = useAppInstallLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
