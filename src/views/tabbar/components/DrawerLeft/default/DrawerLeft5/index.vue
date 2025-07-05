<!-- 首页抽屉 -->
<template>
  <ion-menu
    side="end"
    menu-id="main-menu"
    content-id="main-content"
    :swipe-gesture="false"
    @ionWillClose="menuIonDidClose"
    @ionDidClose="menuIonClose"
    @ionDidOpen="menuIonOpen"
    @ionWillOpen="menuIonDidOpen"
  >
    <ion-header>
      <ion-toolbar>
        <div class="assets-box" v-if="userId">
          <div>
            <div class="info">
              <span>ID:</span>
              <span>{{ userId }}</span>
            </div>
            <div>
              <span class="currency">{{ merchantCy }}</span>
              <span class="assets-box-number">{{ convertMoneyToShow(balance) }}</span>
            </div>
          </div>
          <ion-button class="init-btn deposit" fill="clear" @click="depositHandle">{{ $t("main.entrar") }} </ion-button>
        </div>
        <div class="primaryBtn" v-else>
          <ion-button mode="md" class="login init-btn" @click="showLogin()">{{ $t("main.login") }} </ion-button>
          <div class="register-btn-warpper">
            <ion-button mode="md" class="register init-btn" @click="showLogin('register')">{{ $t("main.signUp") }} </ion-button>
            <RewardTag class="rewardTag"></RewardTag>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>
    <!-- 抽屉内容 -->
    <ion-content class="relative menu-content">
      <!-- 分类导航 -->
      <div class="card-container" v-if="sortAll.length">
        <ion-menu-toggle v-for="item in sortAll" class="card" :key="item" @click="menuTabChange(item)">
          <div class="img-wall">
            <ion-img class="img" :src="`/icons/sort/${item}_on.png`" />
          </div>
          <ion-label class="label">{{ $t(`sort.${item}`) }}</ion-label>
        </ion-menu-toggle>
      </div>
      <div class="card-container" v-if="hotGameList.length">
        <ion-menu-toggle v-for="item in hotGameList" class="card" :key="item.id" @click="goToGame(item)">
          <div class="img-wall">
            <ion-img class="img" :src="item.logo" />
          </div>
          <ion-label class="label">{{ item.platformName + ' ' + item.name }}</ion-label>
        </ion-menu-toggle>
      </div>
      <ion-menu-toggle @click="router.push('/user/report')">
        <ion-label class="records">{{ $t("label.bettingRecords") }}</ion-label>
      </ion-menu-toggle>
      <div class="line" />
      <!-- 活动导航 -->
      <div class="card-container" v-if="activityList.length">
        <ion-menu-toggle class="card" v-for="item in activityList" @click="menuActivityHandle(item)" :key="item.id">
          <ion-img class="img" :src="item.image" />
          <ion-label class="label">{{ item.showName }}</ion-label>
        </ion-menu-toggle>
      </div>
      <!-- 功能按钮 -->
      <div v-if="isShowPwaBar" class="install" @click="handleHomeInstallAction">
        <div class="introduce">
          <p class="title">{{ $t("viewsTabbar.appInstall1") }}</p>
          <p class="label">{{ $t("viewsTabbar.pwaView1") }}</p>
        </div>
        <ion-img class="logo" :src="tenantInfo?.icon" />
      </div>
      <!-- 联系客服 -->
      <div @click="goToCustomer" class="support">
        <div class="introduce">
          <p class="title">{{ $t("main.suporte") }}</p>
          <p class="label">{{ $t("viewsTabbar.appInstall1") }}</p>
        </div>
        <i class="icon-wall">
          <ion-icon src="/svg/drawer_customer.svg" class="icon" />
          <div v-if="showUnRead" class="dot"></div>
        </i>
      </div>
      <div class="tool">
        <!-- 切换语言 -->
        <div v-show="showLangChange" class="language" @click="languageHandle">
          <ion-label class="label">{{ locale.split("-")[0] }}</ion-label>
          <flag :iso="locale.split('-')[1]" style="font-size: 0.875rem; border-radius: 50%" />
        </div>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { IonMenu, IonMenuToggle, IonIcon, IonHeader, IonContent, IonLabel, IonToolbar, IonImg, IonButton } from "@ionic/vue";
import RewardTag from "@/components/registerReward/RewardTag.vue";
import router from "@/router";
import { showLogin } from "@/hooks/ShowLogin";
import { convertMoneyToShow } from "@/utils/custom";
import useDrawerLeftLogic from "@/views/tabbar/components/DrawerLeft/logic";
import useLoginBtn from "@/views/tabbar/tabs/inicio/components/HeaderBar/logic";
import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
import useHotGame from '@/views/tabbar/components/DrawerLeft/default/DrawerLeft5/useHotGame';

const { userId, balance, merchantCy, depositHandle } = useLoginBtn();

const { goToGame, hotGameList } = useHotGame();

const {
  locale,
  sortAll,
  showUnRead,
  tenantInfo,
  activityList,
  showLangChange,
  goToCustomer,
  menuTabChange,
  menuIonClose,
  menuIonOpen,
  languageHandle,
  menuIonDidOpen,
  menuIonDidClose,
  menuActivityHandle,
} = useDrawerLeftLogic();

const {
  isShowPwaBar,
  handleHomeInstallAction,

} = usePwaLogic();



</script>

<style lang="less" scoped>
@import './index.less';
</style>
