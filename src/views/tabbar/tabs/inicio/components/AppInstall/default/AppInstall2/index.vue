<template>
  <div class="install-container pl-[1rem] pr-[0.375rem] pt-[5.5744rem] my-2.5 text-[.625rem] h-[21.8231rem]">
    <div class="topLine font-extrabold text-[1.625rem] mb-[1rem]">
      {{ $t('viewsTabbar.DownloadApp') }}
    </div>
    <div class="middleLine font-semibold text-[0.875rem] text-[#899FBE]">
      {{ $t('viewsTabbar.DownloadAppDes') }}
    </div>
    <ion-row class="h-[2.625rem] mt-[1.875rem]">
      <ion-col size="6" @click="appleHandle">
        <div class="border border-[#31343D] h-full rounded-[.625rem] flex items-center pl-10 bg-white">
          <ion-icon class="text-3xl mr-[.3125rem] text-black" src="/svg/apple.svg" />
          <div>
            <p class="text-sub text-[.5rem] text-[#070D1F]">{{ $t('viewsTabbar.appInstall1') }}</p>
            <p class="text">{{ $t('viewsTabbar.appInstall2') }}</p>
          </div>
        </div>
      </ion-col>
      <ion-col size="6" @click="androidHandle">
        <div class="border border-[#31343D] h-full rounded-[.625rem] flex items-center pl-10 bg-white">
          <ion-icon class="text-3xl mr-[.3125rem]" src="/svg/android.svg" />
          <div>
            <p class="text-sub text-[.5rem] text-[#070D1F]">{{ $t('viewsTabbar.appInstall1') }}</p>
            <p class="text">{{ $t('viewsTabbar.appInstall3') }}</p>
          </div>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { IonRow, IonCol, IonIcon } from '@ionic/vue'
import useAppInstallLogic from '@/views/tabbar/tabs/inicio/components/AppInstall/logic'

const { appleHandle, androidHandle } = useAppInstallLogic();
</script>

<style lang="less" scoped>
.install-container{
 background: url('/images/appInstallBg.png') no-repeat center center  /cover;
  .topLine{
    background: linear-gradient(0deg, #BFF1FF, #BFF1FF),
    linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
    background-clip: text;
    color: transparent;
    box-shadow: 0px 0.13rem 0.26rem 0px #00000024;
  }
  .text{
    font-weight: 700;
    color: #4075D3;
  }
}
.border:active{
  background: rgba(255, 255, 255, 0.8);
}
ion-col {
  padding-inline-start: .375rem;
  padding-inline-end: .375rem;
  padding-top: 0;
  padding-bottom: 0;
}

.green-default {
  .install-container {
    .border {
      border-color: var(--line-color);
      background-color: var(--color-bg-200);
    }
    .text {
      color: var(--color-text-gray-100);
    }
    .text-sub {
      color: var(--color-text-gray-200);
    }
  }
}
</style>
