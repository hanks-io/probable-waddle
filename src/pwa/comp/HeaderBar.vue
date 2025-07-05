<script setup lang="ts">
import { IonToolbar, IonIcon, IonImg, IonButtons } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
import { usePwaToolbar } from '@/hooks/useLoadComponent';
const tenantStore = useTenantStore(); // 租户store


const {
  closeHeaderBar,
  handleHomeInstallAction,
  tenantInfo,
  btnText,
  isShowPwaBar,
  theme,
  skin,

} = usePwaLogic();

const {
  giftImgUrl,
} = usePwaToolbar();


</script>
<template>
  <ion-toolbar id="pwa-header-bar" :class="['text-xs',skin,theme]" v-if="isShowPwaBar">
    <!-- PWA图标 -->
    <ion-img class="cover w-9 h-9 ml-3 mr-2" slot="start" :src="tenantInfo?.icon" />
    <div class="flex items-center h-full">
      <p>{{ $t('viewsTabbar.pwaView1') }}</p>
      <ion-img class="w-24 h-8" :src="giftImgUrl" />
    </div>
    <div class="install rounded-[6px] ml-1 p-[5px] min-w-16 text-center" slot="primary">
      <slot name="actionBtn"   
      :homeInstallAction="handleHomeInstallAction" :btnText="btnText">
    
        <button class="w-full h-full"  @click="handleHomeInstallAction">{{ btnText  }}</button>
   
      </slot>


    </div>
    <ion-buttons class="close-btn mx-2.5" slot="end" @click="closeHeaderBar">
      <ion-icon class="text-lg close" :icon="close" />
    </ion-buttons>
  </ion-toolbar>
</template>

<style scoped lang="less">
#pwa-header-bar {
  --background: var(--color-bar-bg-pwa);
}

#pwa-header-bar.blue-default {
  --background: linear-gradient(90deg, #202940 0%, #131A2C 100%);

  .home-type-GameType.v01 &{
    border-radius: 0.625rem;
    --background: linear-gradient(95deg, #0C526C 4.14%, #533E08 100%);
  }

  .install {
    /* 自定义按钮样式 */
    background: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
  }
}

#pwa-header-bar.green-default {
  --background: var(--theme-color-gradient-300);

  .install {
    /* 自定义按钮样式 */
    background: var(--theme-color-gradient-200);
    color: var(--color-bg-400);
  }
}
#pwa-header-bar.default.amber-purple {
  .install {
    /* 自定义按钮样式 */
    background: var(--theme-color-gradient-200);
    color: var(--accent-color-white);
  }
}

#pwa-header-bar.auroral-yellow {
  --background: linear-gradient(95deg, #0C526C 4.14%, #533E08 100%);

  .install {
    background: linear-gradient(0deg, #23D8DB 1.92%, #23DB8C 96.15%);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text-black-100);
  }

  .close-btn {
    margin-inline-start: 0.25rem;
  }
}

.close {
  color: var(--color-text-white-100);
}
</style>
