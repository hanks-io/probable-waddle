<!-- 首页抽屉 -->
<template>
  <ion-menu menu-id="main-menu" content-id="main-content"  :swipe-gesture="false"
   @ionWillClose="menuIonDidClose"
   @ionDidClose="menuIonClose"
   @ionDidOpen="menuIonOpen"
   @ionWillOpen="menuIonDidOpen"
   >
    <ion-header>
      <ion-toolbar>
        <header-bar-left @menuHandle="menuHandle" :iconSrc="appLogo" :btnDisabled="btnDisabled"/>
      </ion-toolbar>
    </ion-header>
    <!-- 抽屉内容 -->
    <ion-content class="relative">
      <!-- 分类导航 -->
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="item in sortAll" :key="item">
            <ion-menu-toggle class="game-type-tab"
              :class="tabValue == item ? 'active-game-type' : ''" @click="menuTabChange(item)"
            >
              <ion-img class="img" :src="`/icons/sort/${item}_on.png`" />
              <ion-label :class="[tabValue == item ? 'text' : 'text-sub', 'text-xs']"
              >{{ 
               $t(`sort.${item}`)}}
              </ion-label>
            </ion-menu-toggle>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-menu-toggle class="records" @click="router.push('/user/report')">
        <ion-label class="label">{{ $t('label.bettingRecords') }}</ion-label>
      </ion-menu-toggle>
      <!-- 活动导航 -->
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="item in activityList" :key="item.id">
            <ion-menu-toggle @click="menuActivityHandle(item)">
              <div class="menu-activity"
                :style="gameCardBgStyle(item.image)">
              </div>
            </ion-menu-toggle>
          </ion-col>
        </ion-row>
      </ion-grid>
      <!-- 功能按钮 -->
      <div class="footer">
         <!-- 切换语言 -->
        <div v-show="showLangChange" class="language" @click="languageHandle">
          <ion-icon class="icon" src="/svg/language.svg" />
          <span class="label">{{ $t('label.language') }}</span>
          <ion-icon class="arrow" :icon="caretDown" />
        </div>
        <!-- 联系客服 -->
        <div @click="goToCustomer" class="support">
          <ion-icon src="/svg/drawer_customer.svg" class="icon" />
          <div class="label">{{ $t('main.suporte') }}</div>
          <div v-if="showUnRead" class="dot"></div>
        </div>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { caretDown } from 'ionicons/icons';
import { IonMenu, IonMenuToggle, IonIcon, IonHeader, IonGrid, IonRow, IonCol, IonContent, IonLabel, IonToolbar, IonImg, menuController } from '@ionic/vue';
import HeaderBarLeft from '@/views/tabbar/components/HeaderBarLeft/default/index.vue';
import useDrawerLeftLogic from '@/views/tabbar/components/DrawerLeft/logic';
import router from '@/router';

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
  menuIonDidClose,
  menuHandle,
  menuTabChange,
  menuActivityHandle,
  languageHandle,
  menuIonClose,
  menuIonOpen,
  menuIonDidOpen,
 } = useDrawerLeftLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
