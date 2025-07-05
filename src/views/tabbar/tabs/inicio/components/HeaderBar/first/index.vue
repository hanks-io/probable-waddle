<template>
  <ion-toolbar class="header">
    <HeaderBarLeft @menuHandle="menuHandle" :iconSrc="appLogo" />
    <div class="assets-box flex items-center py-[2px] pl-2 pr-[3px] rounded-md text-[12px]" slot="primary" v-if="userId">
      <p class="currency mr-1">{{ merchantCy }}</p>
      <p class="assets-box-number">{{ convertMoneyToShow(balance) }}</p>
      <div class="wallet h-[26px] py-[4px] px-[6px] rounded-[4px] ml-[6px]" @click="rechargeHandle">
        <ion-icon class="text-[18px]" src="/first/svg/tabbar/deposit_on.svg"/>
      </div>
    </div>

    <div class="flex" slot="primary" v-else>
      <Button class="login" height="26px" :style="{'--background':'var(--login-button-bg)', '--button-text-color': 'var(--login-button-color)'}" @click="showLogin()">
        {{ $t('main.login') }}
      </Button>
      <div class="register-btn-warpper">
        <Button class="register ml-2" height="26px" :style="{'--background':'var(--register-button-bg)', '--button-text-color': 'var(--register-button-color)'}" @click="showLogin('register')">
          {{ $t('main.signUp') }}
        </Button>
        <RewardTag class="rewardTag"></RewardTag>
      </div>
    </div>
    <ion-button id="click-language" class="btn pl-2 m-0" fill="clear" slot="end" >
      <ion-icon class="text-lg" slot="icon-only" src="/first/svg/earth.svg"/>
    </ion-button>
    <ion-popover id="language" mode="md" trigger="click-language" side="bottom" alignment="end" dismiss-on-select>
      <ion-button fill="clear" v-for="lang in supportLanguages" :key="lang" @click="changeLanguage(lang)">
        <ion-row class="w-full items-center flex-nowrap">
          <flag :iso="getCurrency(lang)" class="rounded-xl text-[20px] mr-2" />
          {{ getLanguageName(lang, locale) }}
        </ion-row>
      </ion-button>
    </ion-popover>
  </ion-toolbar>
</template>

<script setup lang="ts">
import { getCurrency } from '@/i18n';
import { showLogin } from '@/hooks/ShowLogin';
import { getLanguageName, convertMoneyToShow } from '@/utils/custom';
import { IonToolbar, IonIcon, IonButton, IonPopover, IonRow } from '@ionic/vue';
import HeaderBarLeft from '../../../../../components/HeaderBarLeft/first/index.vue';
import Button from '@/components/first/Button/index.vue';
import RewardTag from "@/components/registerReward/RewardTag.vue";
import useHeaderBarLogic from '../logic';

const { locale, supportLanguages, userId, appLogo, balance, merchantCy, menuHandle, rechargeHandle, changeLanguage } = useHeaderBarLogic();

</script>

<style scoped lang="less">
ion-toolbar.header {
  --padding-start: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-end: .5rem;
  --background: var(--color-bar-bg);
}

.purple-light .assets-box-number {
  color: var(--text-color-black-100);
}

ion-label.login {
  /* 自定义按钮样式 */
  background: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
}

ion-label.recharge,
ion-label.register {
  /* 自定义按钮样式 */
  background: linear-gradient(to bottom, #13C96A, #1D9554);
}
.login, .register {
  --button-font-size: 12px;
}
.login {
  --button-text-color: #FFF;
}

div.assets-box {
  background: var(--color-bg-400);
}

p.currency {
  color: var(--color-currency);
} 

.purple-light div.wallet {
  background: var(--accent-color-orange);
}

div.wallet {
  background: var(--color-primary-800);
}

div.wallet ion-icon {
  color: var(--color-primary-btn-text-active);
}

ion-button#click-language {
  --padding-start: 0;
  --padding-end: 0;
}

ion-popover#language::part(content) {
  margin-top: 1.5rem;
  margin-left: .125rem;
  width: fit-content;
  border-radius: .375rem;
}

ion-popover ion-button {
  --color: var(--color-text-100);
  --padding-top: 0;
  --padding-bottom: 0;
  --border-radius: 0;
  margin-inline: 0;
  margin-top: 0;
  margin-bottom: 0;
  height: 3.25rem;
}

ion-button.btn {
  ion-icon {
    color: var(--home-earth-color);
  }
}

.register-btn-warpper {
  min-width: 4.375rem;
  position: relative;
  .rewardTag {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
  }
}
</style>
