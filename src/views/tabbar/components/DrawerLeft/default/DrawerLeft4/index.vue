<!-- 首页抽屉 -->
<template>
  <ion-menu menu-id="main-menu" content-id="main-content"  :swipe-gesture="false"
   @ionWillClose="menuIonDidClose"
   @ionDidClose="menuIonClose"
   @ionDidOpen="menuIonOpen"
   @ionWillOpen="menuIonDidOpen"
   >

    <ion-header class="relative" >
      <div v-if="pwaBarVisible" class="pwa-wall">
        <PwaHeaderBar v-show="pwaBarVisible && !hidePwaBar" />
      </div>
      <ion-toolbar>
        <header-bar-left @menuHandle="menuHandle" :iconSrc="appLogo" :btnDisabled="btnDisabled" textColor="#fff" imgPosition="start" />
      </ion-toolbar>
    </ion-header>
    <!-- 抽屉内容 -->
    <ion-content class="relative">
      <!-- 分类导航 -->
      <ion-grid>
        <ion-row class="px-[0.375rem]">
          <ion-col size="6" v-for="(item,index) in tabs" :key="item.id" class="pr-[0.4375rem] pb-[0.5625rem]">
            <ion-menu-toggle class="card"
              :class="tabValue == item.id ? 'on' : ''" @click="jumpPlatformCategoryPage(item.id)">
              <div class="img-wall">
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
              <ion-label class="label" >{{ item.name }}</ion-label>
            </ion-menu-toggle>
          </ion-col>
        </ion-row>
      </ion-grid>
      <bet-records />
      <!-- 功能按钮 -->
      <div class="support-container">
        <!-- 联系客服 -->
        <div @click="goToCustomer" class="support">
          <ion-icon src="/svg/drawer_customer.svg" class="icon" />
          <div>{{ $t('main.suporte') }}</div>
          <div v-if="showUnRead" class="absolute top-[0.625rem] left-[1.875rem] bg-[#FF0000] w-[.375rem] h-[.375rem] rounded-full"></div>
        </div>
         <!-- 切换语言 -->
        <div v-show="showLangChange" class="language" @click="languageHandle">
          <span>{{ locale.split('-')[0].toUpperCase() }}</span>
          <flag :iso="locale.split('-')[1]" style="font-size:0.875rem; border-radius: 50%;" />
        </div>
      </div>
      <!-- 活动导航 -->
      <ion-grid class="mt-[0.6875rem] px-[0.625rem]">
        <ion-row>
          <ion-col size="12" v-for="item in activityList" :key="item.id">
            <ion-menu-toggle @click="menuActivityHandle(item)">
              <div class="menu-activity flex flex-col items-center h-[6.375rem] rounded-[0.375rem] pt-2 bg-no-repeat text-center"
                :style="gameCardBgStyle(item.image)">
              </div>
            </ion-menu-toggle>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { caretDown } from 'ionicons/icons';
import { getBuildVersion } from '@/utils/app'
import { IonMenu, IonMenuToggle, IonIcon, IonHeader, IonGrid, IonRow, IonCol, IonContent, IonLabel, IonToolbar, IonImg, menuController } from '@ionic/vue';
import HeaderBarLeft from '@/views/tabbar/components/HeaderBarLeft/default/index.vue';
import useDrawerLeftLogic from '@/views/tabbar/components/DrawerLeft/logic';
import PwaHeaderBar from '@/pwa/HeaderBar/Default2.vue'
import betRecords from '@/views/tabbar/components/DrawerLeft/components/betRecords/1/index.vue'
import GradientSVG from '@/components/GradientSVG/index.vue'
import pathMaps from '@/theme/configuration/pathMaps'


const loadImage = computed(() => pathMaps.tabbar_inicio_Segment_nav.icon1[1])


const {
  jumpPlatformCategoryPage,
  tabs, 
  hidePwaBar,
  tabValue,
  appLogo,
  showLangChange,
  showUnRead,
  activityList,
  btnDisabled,
  goToCustomer,
  gameCardBgStyle,
  menuIonDidClose,
  menuHandle,
  menuActivityHandle,
  languageHandle,
  menuIonClose,
  menuIonOpen,
  menuIonDidOpen,
  pwaBarVisible,
  locale,
 } = useDrawerLeftLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
