<template>
  <div>
    <ion-toolbar class="header">
      <ion-img class="logo" slot="start" :src="appLogo" />
      <div class="assets-box" slot="end"
        v-if="userId">
        <p class="currency">{{ merchantCy }}</p>
        <p class="assets-box-number">{{ convertMoneyToShow(balance) }}</p>
        <div v-if="showAssetsIcon" class="wallet" @click="depositHandle">
          <ion-icon src="/first/svg/tabbar/deposit_on.svg" />
        </div>
        <ion-button v-else class="init-btn deposit" fill="clear" @click="depositHandle"
        >{{ $t("main.entrar") }}
        </ion-button>
      </div>
    </ion-toolbar>
    <div class="primaryBtn">
      <ion-button 
        mode="md"
        class="login init-btn" 
        @click="btnClick1"
      >{{ btnText1 }}
      </ion-button>
      <div class="register-btn-warpper">
        <ion-button 
          mode="md"
          class="register init-btn" 
          @click="btnClick2"
        >{{ btnText2 }}
        </ion-button>
        <RewardTag class="rewardTag" v-if="!userId"></RewardTag>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { getCurrency } from '@/i18n';
import { useAppStore } from "@/store/app";
import { showLogin } from "@/hooks/ShowLogin";
import { getLanguageName, convertMoneyToShow } from '@/utils/custom';
import { IonToolbar, IonButton, IonIcon, IonLabel, IonRow, IonPopover, IonImg } from "@ionic/vue";
import HeaderBarLeft from "@/views/tabbar/components/HeaderBarLeft/default/index.vue";
import RewardTag from "@/components/registerReward/RewardTag.vue";
import useHeaderBarLogic from "@/views/tabbar/tabs/inicio/components/HeaderBar/logic";
import useButton from "@/views/tabbar/tabs/inicio/components/HeaderBar/default/HeaderBar2/useButton";

const appStore = useAppStore();

const {
  userId,
  locale,
  appLogo,
  merchantCy,
  balance,
  themeConfig,
  menuHandle,
  depositHandle,
  showAssetsIcon,
  changeLanguage,
  navigateToSearch,
  supportLanguages
} = useHeaderBarLogic();

const { btnText1, btnText2, btnClick1, btnClick2 } = useButton();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
