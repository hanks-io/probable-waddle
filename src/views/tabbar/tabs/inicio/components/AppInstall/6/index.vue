<template>
  <div v-if="!isApp" class="text-[.625rem]">
    <p class="title text-xl font-bold mt-2.5 mb-6 text-center">{{ $t('title.downloadApp') }}</p>
    <ion-row class="h-[3.375rem]">
      <ion-col size="6" @click="appleHandle">
        <div class="box h-full rounded-[.625rem] flex items-center justify-center">
          <ion-icon class="text-3xl mr-[.3125rem]" src="/svg/apple.svg" />
          <div>
            <p class="text-[.625rem] text-[#86888D]">{{ $t('viewsTabbar.appInstall1') }}</p>
            <p class="text-[.75rem]">{{ $t('viewsTabbar.appInstall2') }}</p>
          </div>
        </div>
      </ion-col>
      <ion-col size="6" @click="androidHandle">
        <div class="box h-full rounded-[.625rem] flex items-center justify-center">
          <ion-icon class="text-3xl mr-[.3125rem]" src="/svg/android.svg" />
          <div>
            <p class="text-[.625rem] text-[#86888D]">{{ $t('viewsTabbar.appInstall1') }}</p>
            <p class="text-[.75rem]">{{ $t('viewsTabbar.appInstall3') }}</p>
          </div>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { IonRow, IonCol, IonIcon } from '@ionic/vue'
import useAppInstallLogic from '../logic'

const { isApp, appleHandle, androidHandle } = useAppInstallLogic();
</script>

<style scoped>
p.title{
  color: var(--trilateral-cooperation-color)
}

ion-col {
  padding-inline-start: .625rem;
  padding-inline-end: .625rem;
  padding-top: 0;
  padding-bottom: 0;
}

ion-col div.box {
  background: var(--install-box-bg);
}
</style>
