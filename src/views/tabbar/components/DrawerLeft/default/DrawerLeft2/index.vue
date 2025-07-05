<!-- 首页抽屉 -->
<template>
  <ion-menu menu-id="main-menu" content-id="main-content"  :swipe-gesture="false"
   @ionWillClose="menuIonWillClose"
   @ionDidClose="menuIonClose"
   @ionDidOpen="menuIonOpen"
   @ionWillOpen="menuIonWillOpen"
   >
    <ion-header>
      <ion-toolbar>
        <header-bar-left @menuHandle="menuHandle" :iconSrc="appLogo" :btnDisabled="btnDisabled" imgPosition="start"/>
      </ion-toolbar>
    </ion-header>
    <!-- 抽屉内容 -->
    <ion-content class="relative">
      <!-- 分类导航 -->
    <div class="ml-[0.625rem] mr-[1.25rem] pr-[0.3125rem] py-[0.4375rem] rounded-md bg-[#00000047]">
      <div class="h-[18.75rem] overflow-auto">
      <ion-grid class="pt-0">
        <ion-row>
          <ion-col size="12" v-for="(item,index) in tabs" :key="item.code">
            <ion-menu-toggle class="card flex  items-center  rounded-[.625rem] pb-[0.3125rem]"
              :class="tabValue == item ? 'on' : ''" @click="menuTabChangeTwo(item.id,index)">
              <div class="w-7 h-7 icon">
                <GradientSVG v-if="item.code === 'ONE_API_HOT'" class="type-icon" :src="loadImage(item.code)" styleId="DrawerLeft_ONE_API_HOT__1">
                  <template #default>
                    <svg class="svg-wall">
                      <defs>
                        <linearGradient id="DrawerLeft_ONE_API_HOT__1" x1="11.5677" y1="1.54517" x2="18.4448" y2="21.4853" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#e0cb7f"/>
                          <stop offset="1" stop-color="#ae4137"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </template>
                </GradientSVG>
                <i v-else class="type-img" :style="loadImage(item.code)"/>
              </div>
              <ion-label :class="[tabValue == item ? 'text' : 'text-sub', 'text-xs']">{{ item.name }}</ion-label>
            </ion-menu-toggle>
          </ion-col>
        </ion-row>
      </ion-grid>
      </div>
    </div>
      <ion-menu-toggle class="records flex mt-[0.9375rem] mb-[0.625rem] ml-[0.625rem] mr-[1.25rem] rounded-[0.375rem] items-center justify-center text-center h-10 px-[1.375rem]" @click="router.push('/user/report')">
        <ion-label class="text-sm text-[#fff] leading-tight">{{ $t('label.bettingRecords') }}</ion-label>
      </ion-menu-toggle>
      <!-- 活动导航 -->
      <ion-grid>
        <ion-row>
          <ion-col size="12" v-for="item in activityList" :key="item.id">
            <ion-menu-toggle @click="menuActivityHandle(item)" class="flex pb-[0.1563rem] items-center">
              <div class="w-7 menu-activity mr-[0.375rem] flex justify-start items-center h-7 rounded-[0.1875rem] pt-2 bg-no-repeat text-center"
                :style="gameCardBgStyle(item.image)">
              </div>
              <ion-label class="text-sm">{{ item.showName }}</ion-label>
            </ion-menu-toggle>
          </ion-col>
        </ion-row>
      </ion-grid>
      <!-- 功能按钮 -->
      <div class="p-[.625rem] flex flex-col">
        <!-- 联系客服 -->
        <div @click="goToCustomer" class="support flex justify-between items-center relative mb-[.625rem] w-[11.5625rem] h-[2.8125rem] rounded-md pl-[1rem]">
          <div class="left">
            <div class="text-sub text-[.75rem]">{{ $t('main.suporte') }}</div>
            <div class=" text-[0.625rem] text-[#787878]">24/7</div>
          </div>
          <ion-icon src="/svg/drawer_customer.svg" class="text text-[1.625rem] mr-[0.625rem] rounded-full" />
          <div v-if="showUnRead" class="absolute top-[0.75rem] right-[0.875rem] bg-[#FF0000] w-[.375rem] h-[.375rem] rounded-full"></div>
          <div  class="line absolute top-[0.5313rem] left-0  w-[0.125rem] h-[1.75rem]"></div>
        </div>
         <!-- 切换语言 -->
        <div v-show="showLangChange" class="language flex justify-between items-center relative mb-[.625rem] w-[11.5625rem] h-[2.8125rem] rounded-md pl-[1rem]" @click="languageHandle">
          <div class="left">
          <span class="text-sub flex-1 text-xs">{{ $t('label.language') }}</span>
          <div class=" text-[0.625rem] text-[#787878]">{{ getLanguageName(locale,locale) }}</div>
        </div>
         <ion-icon class="text text-[1.375rem] p-[0.125rem] mr-[0.625rem] rounded-full" src="/svg/language.svg" />
          <div  class="line absolute top-[0.5313rem] left-0  w-[0.125rem] h-[1.75rem]"></div>
        </div>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { caretDown } from 'ionicons/icons';
import { getBuildVersion } from '@/utils/app'
import { IonMenu, IonMenuToggle, IonIcon, IonHeader, IonGrid, IonRow, IonCol, IonContent, IonLabel, IonToolbar, IonImg, menuController } from '@ionic/vue';
import HeaderBarLeft from '@/views/tabbar/components/HeaderBarLeft/default/index.vue';
import useDrawerLeftLogic from '@/views/tabbar/components/DrawerLeft/logic';
import router from '@/router';
import GradientSVG from '@/components/GradientSVG/index.vue'
import pathMaps from '@/theme/configuration/pathMaps'


const loadImage = computed(() => pathMaps.tabbar_inicio_Segment_nav.icon1[1])

const { 
  tabValue,
  appLogo,
  showLangChange,
  showUnRead,
  sortAll,
  activityList,
  btnDisabled,
  goToCustomer,
  gameCardBgStyle,
  menuIonWillClose,
  menuHandle,
  menuTabChangeTwo,
  menuActivityHandle,
  languageHandle,
  menuIonClose,
  menuIonOpen,
  menuIonWillOpen,
  getLanguageName,
  locale,
  tabs
 } = useDrawerLeftLogic();
</script>

<style lang="less" scoped>
ion-header{
  box-shadow: none;
}
ion-modal#modal-language {
  --width: fit-content;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}
ion-header ion-toolbar {
    --background: #141B24CC;
    --border-width: 0 0 0 0 !important;
}
/* 整体滚动条样式 */
::-webkit-scrollbar {
  width: 0.125rem;
  background: #21232a;
}
/* 滑块样式 */
::-webkit-scrollbar-thumb {
    background-color: #2172ae;
    border-radius: 0.0625rem;
}
ion-menu {
  /* 抽屉菜单样式 */
  --max-width: 13.75rem;
  --background: transparent;
  background: rgba(0, 0, 0, 0.7);
}

ion-menu::part(container) {
  border-radius: 0px 1.25rem 1.25rem 0px;
  height: calc(100% - 2.75rem);
  backdrop-filter: blur(0.25rem);
}
ion-menu ion-content::part(background) {
  /* 抽屉菜单背景样式(不含头部)) */
  background: #141B24CC;
}
ion-menu ion-content::part(scroll) {
padding-left: 5px;
}
ion-menu::part(container) {
top: 2.75rem;
}

ion-menu-button {
  /* 菜单按钮样式 */
  --padding-start: 5px;
  --padding-end: 5px;
  width: auto;
}

.card {
  .icon{
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.06) 100%);
    border-radius: 0.1875rem;

    .type-icon, .type-img {
      width: 100%;
      height: 100%;
    }

    .type-img {
      display: block;
      background-size: 800% 400%;
    }
  }
  ion-label {
    color: #fff;
    font-size: 0.875rem;
    margin-left: 0.375rem;
  }
}

ion-menu-button::part(native) {
  /* 菜单按钮图标样式 */
  font-size: 24px;
}

ion-menu-toggle.on {
  animation: fadeToTransparent 200ms linear forwards;
}

ion-menu-toggle.records {
  background: #1C2432;
}

@keyframes fadeToTransparent {
  from {
    background: #343947;
  }

  to {
    background: rgba(255, 0, 0, 0);
  }
}

.support{
  background: linear-gradient(90deg, #11316E 0%, #1C2432 40%, #1C2432 100%);
 .line{
  background: linear-gradient(180deg, #1061FF 0%, #0037A1 100%);
 }
 .text{
  background: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
 }
}
.language{
  background: linear-gradient(90deg, #902B8C 0%, #1C2432 40%, #1C2432 100%);

 .line{
  background: linear-gradient(180deg, #FA10FF 0%, #C50CA8 100%);
 }
 .text{
  background: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
 }
}
.green-default {
  ion-menu ion-content::part(background) {
    background: var(--color-bg-300);
  }
  .card {
    background: var(--color-bg-200);
  }
  .text {
    color: var(--color-text-gray-100);
  }
  .text-sub {
    color: var(--color-text-gray-200);
  }
}
</style>
