<script setup lang="ts">
import { close } from 'ionicons/icons';
import { IonIcon, IonImg, } from '@ionic/vue';
import { getImageUrl } from '@/utils/url';
import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
const appStore = useAppStore() // 应用信息

const {
  handleHomeInstallAction,
  tenantInfo,
  btnText,
  isShowPwaInfo,
  pwaBarVisible,
  closeHeaderBar
} = usePwaLogic()

const isShow = computed(
  () => appStore.isShowPwaBar && pwaBarVisible.value && isShowPwaInfo.value
);

</script>
<template>
  <div class="pwa-header-wrap" v-if="isShow">
    <div class="close-btn-bg">
    </div>
    <ion-icon class="close-icon" :icon="close" @click="closeHeaderBar" />
    <div class="left-area">
      <div class="pwa-icon-wrap">
        <ion-img class="pwa-icon" slot="start" :src="tenantInfo?.icon" />
      </div>

      <div class="pwa-name">{{ $t('viewsTabbar.pwaView1') }}</div>
      <ion-img class="pwa-money" :src="getImageUrl('img/inicio/pwa-money.png')" />


    </div>
    <div class="btn" @click="handleHomeInstallAction">
      <ion-icon class="download-svg" :src="getImageUrl('svg/download-new.svg')" slot="start" />
      <span class="btn-text">{{ btnText }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.pwa-header-wrap {
  width: 100%;
  height: 3.125rem;
  background: var(--ep-color-background-fill-surface-lowered);
  position: relative;
  display: flex;
  align-items: center;

  .close-btn-bg {
    position: absolute;
    height: 3.875rem;
    width: 3.875rem;
    border-radius: 50%;
    background: var(--ep-color-background-fill-surface-raised-L2);
    transform: translate(-50%, -50%);

  }

  .close-icon {
    position: absolute;
    left: .25rem;
    top: .25rem;
    font-size: var(--ep-font-size-m);
    color: var(--ep-color-icon-default);
  }

  .left-area {
    display: flex;
    align-items: center;
    margin-left: 2.3125rem;

    .pwa-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: var(--ep-border-radius-l);
      overflow: hidden;

      .pwa-icon {
        width: 100%;
        height: 100%
      }
    }

    .pwa-name {
      width: 8.25rem;
      font-size: var(--ep-font-size-s);
      line-height: 1.125rem;
      color: var(--ep-color-text-default);
      margin: 0 .4375rem;
    }

    .pwa-money {
      width: 2rem;
      height: 2rem;
    }
  }

  .btn {
    width: 6.75rem;
    height: 2.125rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .5rem .625rem;
    box-sizing: border-box;
    border-radius: var(--ep-border-radius-m);
    background: var(--ep-dynamic-tertiary);
    margin-left: 18px;

    .download-svg {
      font-size: 1.625rem;
      color: var(--ep-color-icon-inverse);
    }

    .btn-text {
      font-size: var(--ep-font-size-s);
      color: var(--ep-color-text-inverse);
      font-weight: var(--ep-font-weight-bold);
    }
  }

}
</style>
