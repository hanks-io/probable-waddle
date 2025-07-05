<template>
  <div class="text-[.625rem]">
    <p class="title text-xl font-bold">{{ $t('title.downloadApp') }}</p>
    <p class="sub mb-6">{{ $t('subtitle.downloadApp') }}</p>
    <div class="h-[3.375rem] box-container">
      <div class="box flex-1 rounded-[.625rem] flex items-center justify-center" @click="appleHandle">
        <ion-icon class="absolute top-0 left-0 text-[3.125rem]" style="color:#F5C84C" src="/svg/light-1.svg" />
        <ion-icon class="text-3xl mr-[.3125rem] opacity-40" src="/svg/apple.svg" />
        <div class="label">
          <p class="text-[.625rem] text-[#86888D]">{{ $t('viewsTabbar.appInstall1') }}</p>
          <p class="text-[.75rem]">{{ $t('viewsTabbar.appInstall2') }}</p>
        </div>
      </div>
      <div class="box flex-1 rounded-[.625rem] flex items-center justify-center" @click="androidHandle">
        <ion-icon class="absolute top-0 left-0 text-[3.125rem]" style="color:#3EE48A" src="/svg/light-1.svg" />
        <ion-icon class="text-3xl mr-[.3125rem] opacity-40" src="/svg/android.svg" />
        <div class="label">
          <p class="text-[.625rem]">{{ $t('viewsTabbar.appInstall1') }}</p>
          <p class="text-[.75rem]">{{ $t('viewsTabbar.appInstall3') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonRow, IonCol, IonIcon } from '@ionic/vue'
import useAppInstallLogic from '../logic'

const { appleHandle, androidHandle } = useAppInstallLogic();
</script>

<style scoped lang="less">
p.title{
  color: var(--trilateral-cooperation-color)
}
.sub {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--trilateral-cooperation-color-1)
}
.box-container {
  display: flex;
  column-gap: .75rem;
  .box {
    position: relative;
    overflow: hidden;
    background: var(--install-box-bg);
    border-radius: 10px;
    border: 1px solid var(--dark-line-stroke-line, #5F588C);
    &:nth-child(1) {
      margin-left: -0.5rem;
    }
    &:nth-child(2) {
      margin-right: -0.5rem;
    }
    .label {
      &>p:nth-child(1) {
        font-weight: 400;
        color: var(--text-color-light-purple-2-100);
      }
      &>p:nth-child(2) {
        font-weight: 500;
        color: var(--text-color-light-purple-1-100);
      }
    }
  }
}

</style>
