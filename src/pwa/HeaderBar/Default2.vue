<!-- PWA导航栏 -->
<template>
  <ion-toolbar id="pwa-bar" class="pwa-HeaderBar-Default2"  v-if="isShowPwaBar">
    <ion-buttons class="close-btn" :slot="closeButtonPosition" @click="closeHeaderBar">
      <ion-icon :icon="close" />
    </ion-buttons>
    <!-- PWA图标 -->
    <ion-img class="logo" slot="start" :src="tenantInfo?.icon" />
    <p class="label">
      <ion-label class="text-stroke" :data-text="$t('viewsTabbar.pwaText1')">{{ $t('viewsTabbar.pwaText1') }}</ion-label>
      <ion-label class="text-stroke" :data-text="$t('viewsTabbar.pwaText2')">{{ $t('viewsTabbar.pwaText2') }}</ion-label>
    </p>
    <div slot="primary" class="toolbar-end" @click="handleHomeInstallAction">
      <ion-img class="btn-img" src="/images/money1.png" />
      <ion-label class="install">
        <button class="install-btn">{{ btnText }}</button>
      </ion-label>
    </div>
  </ion-toolbar>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons';
import { IonToolbar, IonIcon, IonImg, IonLabel, IonButtons } from '@ionic/vue';

import { usePwaToolbar } from '@/hooks/useLoadComponent';

import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
const tenantStore = useTenantStore(); // 租户store


const {
  closeButtonPosition,
} = usePwaToolbar();


const {
  handleHomeInstallAction,
  tenantInfo,
  btnText,
  isShowPwaBar,
  closeHeaderBar
} = usePwaLogic()




</script>

<style lang="less" scoped>
@import './Default2.less';

.green-default {
  .home-type-Platform.v01, .home-type-Platform.v02 {
    #pwa-HeaderBar-Default2.v01.style();

    .pwa-HeaderBar-Default2 {
  
      .close-btn {
        margin-inline-start: 0.25rem;
        margin-inline-end: 0.625rem;
      }
    }
  }
}

.forest-green {
  .home-type-Platform.v01, .home-type-Platform.v02 {
    #pwa-HeaderBar-Default2.v01.style(
      @line-color1: #849D69;
      @bg1: url('/images/deep-forest-green.png') no-repeat center / 100% 100%;
      @gradient1: linear-gradient(180deg, #F5F8DD 38.17%, #CBFA6A 100%);
    );

    .pwa-HeaderBar-Default2 {
  
      .close-btn {
        margin-inline-start: 0.25rem;
        margin-inline-end: 0.625rem;
      }
    }
  }
}

.amber-purple {
  .home-type-Platform.v01 {
    #pwa-HeaderBar-Default2.v01.style(
      @line-color1: rgba(232, 221, 248, 0.37);
      @bg1: url('/images/pwa-amber-purple.png') no-repeat center / 100% 100%;
      @bg3: #A46AFA;
      @gradient1: linear-gradient(180deg, #E8DDF8 38.17%, #A46AFA 100%);
      @shadow1: "inset 0 0.1875rem 0 0 rgb(215, 173, 249), inset 0 -0.1875rem 0 0 rgb(81, 31, 238)";
      @shadow3: "0 0 0.0938rem #5F588C, 0 0 0.0938rem #5F588C, 0 0 0.0938rem #5F588C, 0 0 0.0938rem #5F588C";
    );

    .pwa-HeaderBar-Default2 {
  
      .close-btn {
        margin-inline-start: 0.25rem;
        margin-inline-end: 0.625rem;
      }
    }
  }
}

.blue-default {
  .home-type-Platform.v02 {
    #pwa-HeaderBar-Default2.v01.style(
      @line-color1: rgba(22, 128, 220, 0.37);
      @line-color2: #182344;
      @bg1: url('/images/pwa-blue-default.png') no-repeat center / 100% 100%;
      @bg3: #37A6F8;
      @gradient1: linear-gradient(180deg, #EDF8FF 38.17%, #6EABFF 100%);
      @shadow1: "inset 0 0.1875rem 0 0 #7bdcfa, inset 0 -0.1875rem 0 0 #2b5bea";
      @shadow3: "0 0 0.0938rem #182344, 0 0 0.0938rem #182344, 0 0 0.0938rem #182344, 0 0 0.0938rem #182344";
    );

    .pwa-HeaderBar-Default2 {
  
      .close-btn {
        margin-inline-start: 0.25rem;
        margin-inline-end: 0.625rem;
      }
    }
  }
}

</style>
