<template>
  <div class="tabbar-tabs-inicio-components-AppInstall-default-index">
    <!-- 分割线 -->
    <div class="divider" />
    <div class="install-container">
      <ion-row class="row">
        <ion-col class="col" size="6" @click="appleHandle">
          <div class="install-btn">
            <ion-icon class="icon" src="/svg/apple.svg" />
            <div>
              <p class="text-sub">{{ $t('viewsTabbar.appInstall1') }}</p>
              <p class="text">{{ $t('viewsTabbar.appInstall2') }}</p>
            </div>
          </div>
        </ion-col>
        <ion-col class="col" size="6" @click="androidHandle">
          <div class="install-btn">
            <ion-icon class="icon" src="/svg/android.svg" />
            <div>
              <p class="text-sub">{{ $t('viewsTabbar.appInstall1') }}</p>
              <p class="text">{{ $t('viewsTabbar.appInstall3') }}</p>
            </div>
          </div>
        </ion-col>
      </ion-row>
    </div>
  </div>

</template>

<script setup lang="ts">
  import { IonRow, IonCol, IonIcon } from '@ionic/vue'
  import useAppInstallLogic from '@/views/tabbar/tabs/inicio/components/AppInstall/logic'

  const { appleHandle, androidHandle } = useAppInstallLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
