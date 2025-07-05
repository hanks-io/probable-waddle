<template>
  <ion-toolbar class="header">
    <header-bar-left @menuHandle="menuHandle" :iconSrc="appLogo" />
    <div class="assets-box" slot="primary"
      v-if="userId">
      <ProgressiveImages v-if="assetsImgUrl" class="assets-img" :src="assetsImgUrl"/>
      <p class="currency">{{ merchantCy }}</p>
      <p class="assets-box-number">{{ convertMoneyToShow(balance) }}</p>
      <div v-if="showAssetsIcon" class="wallet" @click="depositHandle">
        <ion-icon src="/first/svg/tabbar/deposit_on.svg" />
      </div>
      <ion-button v-else class="init-btn deposit" fill="clear" @click="depositHandle"
      >{{ $t("main.entrar") }}
      </ion-button>
    </div>
    <div class="primaryBtn" slot="primary" v-else>
      <ion-button 
        mode="md"
        class="login init-btn btn-margin" 
        @click="showLogin()"
      >{{ $t("main.login") }}
      </ion-button>
      <div class="register-btn-warpper btn-margin">
        <ion-button 
          mode="md"
          class="register init-btn btn-margin"
          @click="showLogin('register')"
        >{{ $t("main.signUp") }}
        </ion-button>
        <RewardTag class="rewardTag"></RewardTag>
      </div>
    </div>
    <ion-button v-if="hideButton('search')" class="unset-btn search" fill="clear" slot="end" @click="navigateToSearch">
      <ion-icon class="search-icon icon-btn" slot="icon-only" src="/svg/search.svg" />
    </ion-button>
    <ion-button v-if="hideButton('language')" id="click-language"
      class="unset-btn earth" fill="clear" slot="end">
      <ion-icon class="language-icon icon-btn" slot="icon-only" src="/first/svg/earth.svg" />
    </ion-button>
    <ion-popover v-if="hideButton('language')" id="language" mode="md" trigger="click-language" side="bottom" alignment="end" dismiss-on-select>
      <ion-button fill="clear" v-for="lang in supportLanguages" :key="lang" @click="changeLanguage(lang)">
        <flag :iso="getCurrency(lang)" class="flag" />
          {{ getLanguageName(lang, locale) }}
      </ion-button>
    </ion-popover>
  </ion-toolbar>
</template>

<script setup lang="ts">
import { getCurrency } from '@/i18n';
import { useAppStore } from "@/store/app";
import { showLogin } from "@/hooks/ShowLogin";
import { getLanguageName, convertMoneyToShow } from '@/utils/custom';
import { IonToolbar, IonButton, IonIcon, IonLabel, IonRow, IonPopover } from "@ionic/vue";
import HeaderBarLeft from "@/views/tabbar/components/HeaderBarLeft/default/index.vue";
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import RewardTag from "@/components/registerReward/RewardTag.vue"
import useHeaderBarLogic from "@/views/tabbar/tabs/inicio/components/HeaderBar/logic";

const appStore = useAppStore();

const {
  assetsImgUrl,
  hideButton,
  userId,
  locale,
  appLogo,
  merchantCy,
  balance,
  menuHandle,
  depositHandle,
  showAssetsIcon,
  changeLanguage,
  navigateToSearch,
  supportLanguages
} = useHeaderBarLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
