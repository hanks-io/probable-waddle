<!-- 首页抽屉 -->
<template>
  <ion-menu
    content-id="main-content"
    menu-id="main-menu"
    :swipe-gesture="false"
    @ionDidClose="menuIonClose"
    @ionDidOpen="menuIonOpen"
    @ionWillClose="menuIonDidClose"
    @ionWillOpen="menuIonDidOpen"
  >
    <ion-header class="menu-header">
      <ion-toolbar>
        <div class="logo-box">
          <ion-buttons class="close-btn" @click="menuHandle">
            <ion-icon class="close-img" :icon="close" />
          </ion-buttons>
          <ProgressiveImages class="app-logo" :src="appLogo" />
        </div>

        <div v-if="userId" class="assets-box">
          <div class="assets-box-inner">
            <ProgressiveImages class="assets-img" :src="assetsImgUrl"/>
            <div class="assets-box-info">
              <div class="assets-box-info-inner">
                <ion-label class="currency">{{ merchantCy }}</ion-label>
                <ion-label class="assets-box-number">{{ convertMoneyToShow(balance) }}</ion-label>
              </div>
              <ion-label class="assets-box-intro">{{ $t("label.balance") }}</ion-label>
            </div>
          </div>
          <ion-button 
            class="init-btn deposit" 
            fill="clear" 
            @click="depositHandle"
          >
            {{ $t("main.entrar") }}
          </ion-button>
        </div>

        <div v-else class="primaryBtn">
          <ion-button 
            class="login init-btn" 
            mode="md" 
            @click="showLogin()"
          >
            {{ $t("main.login") }}
          </ion-button>
          <div class="register-btn-warpper">
            <ion-button 
              class="register init-btn" 
              mode="md" 
              @click="showLogin('register')"
            >
              {{ $t("main.signUp") }}
            </ion-button>
            <RewardTag class="rewardTag" />
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <!-- 抽屉内容 -->
    <ion-content class="relative menu-content">
      <!-- 分类导航 -->
      <div v-if="tabs.length" class="card-container">
        <ion-menu-toggle 
          v-for="item in tabs" 
          :key="item.id"
          class="card" 
          @click="jumpPlatformCategoryPage(item.id)"
        >
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
          <ion-label class="label">{{ item.name }}</ion-label>
        </ion-menu-toggle>
      </div>
      <ion-menu-toggle>
        <BonusPool class="bonus-pool" :loadImage="{ icon1: '/svg/bonus1.svg' }"/>
      </ion-menu-toggle>
      <div v-if="hotGameList.length" class="hot-game-box">
        <div class="hot-game-title">
          <div class="hot-game-icon-box">
            <ion-img class="hot-game-icon" src="/icons/platform/ONE_API_HOT-2.png" />
            <ion-label class="label">{{ $t("sort.POPULAR") }}</ion-label>
          </div>
          <ion-label class="hot-game-intro">{{ $t("main.gameSelection") }}</ion-label>
        </div>
        <div class="hot-game-list-box">
          <div class="hot-game-list" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
            <ion-menu-toggle 
              v-for="item in hotGameList" 
              :key="item.id"
              :class="[cardStyle, 'card']" 
              @click="goToGame(item)"
            >
              <ion-img class="img" :src="item.logo" />
            </ion-menu-toggle>
          </div>
        </div>
      </div>
      <div v-if="!isApp" class="btn-container">
        <div class="ios-btn" @click="appleHandle">
          <ion-icon class="logo" src="/svg/apple.svg" />
          <ion-label class="text">{{ $t('viewsTabbar.appInstall4') }}</ion-label>
        </div>
        <div class="android-btn" @click="androidHandle">
          <ion-icon class="logo" src="/svg/android.svg" />
          <ion-label class="text">{{ $t('viewsTabbar.appInstall5') }}</ion-label>
        </div>
      </div>

      <div class="line" />

      <PartView class="social-content" :gamePlatform="false" :paymentPlatform="false"/>

      <LanguageSelectionBox class="language-selection-box"/>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
// Ionic 组件
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonMenu,
  IonMenuToggle,
  IonToolbar
} from "@ionic/vue";
import { close } from 'ionicons/icons';

// 自定义组件
import RewardTag from "@/components/registerReward/RewardTag.vue";
import ProgressiveImages from "@/components/GameCard/progressiveImages.vue";
import PartView from '@/views/tabbar/tabs/inicio/components/PartView/default/PartView5/index.vue';
import LanguageSelectionBox from '@/views/tabbar/components/DrawerLeft/default/DrawerLeft6/languageSelectionBox.vue';
import BonusPool from '@/components/BonusPool/2/index.vue';
// 路由
import router from "@/router";

// Hooks 和工具函数
import { showLogin } from "@/hooks/ShowLogin";
import { convertMoneyToShow } from "@/utils/custom";
import useDrawerLeftLogic from "@/views/tabbar/components/DrawerLeft/logic";
import useHotGame from '@/views/tabbar/components/DrawerLeft/default/DrawerLeft5/useHotGame';
import useLoginBtn from "@/views/tabbar/tabs/inicio/components/HeaderBar/logic";
import useCustomDraggable from '@/hooks/useCustomDraggable';
import useAppInstallLogic from '@/views/tabbar/tabs/inicio/components/AppInstall/logic'
import { useHeaderToolbar } from '@/hooks/useLoadComponent';
import GradientSVG from '@/components/GradientSVG/index.vue'
import pathMaps from '@/theme/configuration/pathMaps'


const loadImage = computed(() => pathMaps.tabbar_inicio_Segment_nav.icon1[1])


const { userId, balance, merchantCy, depositHandle } = useLoginBtn();
const { goToGame, cardStyle, hotGameList } = useHotGame();

const { appleHandle, androidHandle } = useAppInstallLogic();

const { handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseMove } = useCustomDraggable();

const { 
  assetsImgUrl,
} = useHeaderToolbar();


const {
  isApp,
  tabs,
  appLogo,
  menuHandle,
  menuIonClose,
  menuIonOpen,
  menuIonDidOpen,
  menuIonDidClose,
  jumpPlatformCategoryPage,
} = useDrawerLeftLogic();

</script>

<style lang="less" scoped>
@import './index.less';
</style>
