<script setup lang="ts">
import { IonImg, IonButton } from '@ionic/vue';

import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
const {
  closeFooterModal,
  handleHomeInstallAction,
  tenantInfo,
  btnText,
  isShowPwaFooter,
  theme,
  skin,

} = usePwaLogic();
const host = location.host;
</script>
<template>
  <div class="mask h-full w-full flex justify-center items-end  fixed" v-if="isShowPwaFooter">
    <div class="content_footer_pwa w-[24.375rem] rounded-t-[.625rem] relative p-5" :class="[skin, theme]" @click.stop>
      <!-- PWA图标 -->
      <div class="flex">
        <ion-img class="cover w-[3.75rem] h-[3.75rem] mr-2" :src="tenantInfo?.icon" />
        <p class="flex-1 p-[.3125rem] text-sm">{{ $t("viewsTabbar.pwaFooterModal1", { url: host }) }}</p>
      </div>
      <div class="buttons">
        <slot name="cancelBtn" :closeFooterModal="closeFooterModal">
          <ion-button class="text-xs  cancel " mode="md" @click="closeFooterModal" fill="clear">{{
            $t('viewsTabbar.pwaFooterModal2') }}</ion-button>
        </slot>
        <slot name="actionBtn" :homeInstallAction="handleHomeInstallAction" :btnText="btnText">
          <ion-button class="line" mode="md" @click="handleHomeInstallAction">
            <button class="w-full h-full text-xs">{{ btnText }}</button>
          </ion-button>
        </slot>

      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
ion-modal#pwa-footer-modal::part(content) {
  --height: 100%;
  /* 高度由内容撑开<默认600px> */
}

.mask {
  background: var(--color-bg-mask-black);
}

.content_footer_pwa {
  background-color: var(--color-bg-modal-footer-pwa);
  color: var(--color-text-modal-footer-pwa);
}
.buttons{
   display: flex;
   align-items: center;
   justify-content: flex-end;
}
.buttons ion-button {
  --padding-start: 0.75rem;
  --padding-end: 0.75rem;
  --border-radius: 0.375rem;
  text-transform: none;
  letter-spacing: normal;
  min-width: 4.5rem;
}

ion-button.solid {
  --background: var(--color-button-bg-update, #3E9B2F);
  --color: var(--color-text-btn-basic);
  --box-shadow: none;
  margin-inline-start: .9375rem;
  margin-inline-end: .9375rem;

}

ion-button.line {
  --box-shadow: none;
  --padding-start: .5rem;
  --padding-end: .5rem;
  --color: var(--color-text-button-update1);
  border-width: 2px;
  border-style: solid;
  width: 150px;
  border-radius: var(--border-radius);
  border-color: var(--color-bd-button-update1, #FBA531);
  --background: var(--color-button-bg-update1, transparent);
}

.default.amber-purple {
  ion-button.line::part(native) {
    border-radius: 0.75rem;
  }
}

.default.amber-purple {
  ion-button.cancel {
    --color: var(--color-text-modal-footer-pwa);
  }
}

.blue-default .cancel {
  color: var(--color-text-gray-800)
}

.green-default .cancel {
  color: var(--color-text-gray-300)
}

.auroral-yellow .cancel {
  color: var(--color-text-black-100)
}

.new-skin-symbol {
  .content_footer_pwa {
    backdrop-filter: blur(4px);
    background: var(--ep-color-background-fill-surface-raised-L1);
    background-size: cover;
    color: var(--ep-color-text-default);



    .install {
      --button-font-size: .875rem;
      --button-font-weight: 500;
    }

    .cancel {
      --color: var(--ep-color-text-default);
    }
  }
}
</style>
