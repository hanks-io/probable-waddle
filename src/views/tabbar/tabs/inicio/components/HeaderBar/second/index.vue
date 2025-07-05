<template>
  <ion-toolbar class="header">
    <HeaderBarLeft @menuHandle="menuHandle" :iconSrc="appLogo" />
    <div class="assets-box flex items-center py-[2px] pl-2 pr-[3px] text-[12px]" slot="primary" v-if="userId">
      <p class="currency mr-1">{{ merchantCy }}</p>
      <p class="assets-box-number">{{ convertMoneyToShow(balance) }}</p>
      <div class="wallet w-[20px] h-[20px] rounded-full ml-[10px]" @click="rechargeHandle">
        <ion-icon class="text-[0.875rem]" src="/first/svg/tabbar/deposit_on.svg"/>
      </div>
    </div>

    <div class="flex flex-shrink-0" slot="primary" v-else>
      <Button class="login" height="30px" @click="showLogin()">
        {{ $t("main.login") }}
      </Button>
      <div class="register-btn-warpper ml-1 flex-shrink-0">
        <Button class="register" height="30px" @click="showLogin('register')">
          {{ $t("main.signUp") }}
        </Button>
        <RewardTag class="rewardTag"></RewardTag>
      </div>
    </div>
    <ion-button class="btn flex-shrink-0 ml-1 min-h-0 min-w-0 m-0" fill="clear" slot="end" @click="router.push('/game/search/POPULAR')">
      <ion-icon class="text-[1rem]" slot="icon-only" src="/first/svg/find.svg" />
    </ion-button>
    <ion-button id="click-language" class="btn flex-shrink-0 ml-1 min-h-0 min-w-0 m-0" fill="clear" slot="end">
      <ion-icon class="text-[0.875rem]" slot="icon-only" src="/svg/language-1.svg" />
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
import { getCurrency } from "@/i18n";
import { showLogin } from "@/hooks/ShowLogin";
import { getLanguageName, convertMoneyToShow } from "@/utils/custom";
import { IonToolbar, IonIcon, IonButton, IonPopover, IonRow } from "@ionic/vue";
import HeaderBarLeft from "@/views/tabbar/components/HeaderBarLeft/second/index.vue";
import Button from "@/components/second/Button/index.vue";
import RewardTag from "@/components/registerReward/RewardTag.vue";
import useHeaderBarLogic from "../logic";
import router from "@/router";

const { locale, supportLanguages, userId, appLogo, balance, merchantCy, menuHandle, rechargeHandle, changeLanguage } = useHeaderBarLogic();
</script>

<style scoped lang="less">
@import '@/views/tabbar/tabs/inicio/components/HeaderBar/index.less';

ion-toolbar.header {
  --padding-start: 0.75rem;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-end: 0.75rem;
  --background: transparent;
}

.login,
.register {
  --button-font-weight: 900;
  --layout-radius-basic: 10px;
  --button-font-size: 10px;
  min-width: 3rem;

  :deep(.button &.second-button) {
    --padding-start: 0.125rem;
    --padding-end: 0.125rem;
  }
}

.login {
  --ion-toolbar-color: var(--bg-inicio-HeaderBar-btn-login);
  --ion-toolbar-background: var(--bg-inicio-HeaderBar-btn-login);
}

.register {
  --ion-toolbar-color: var(--bg-inicio-HeaderBar-btn-register);
  --ion-toolbar-background: var(--bg-inicio-HeaderBar-btn-register);
}
ion-button.btn {
  width: 30px;
  height: 30px;
  --border-width: 1px;
  --border-style: solid;
  --border-radius: 10px;
  --border-color: var(--line-color);
  ion-icon {
    color: var(--text-color-light-purple-1-100);
  }
}

div.assets-box {
  font-weight: 400;
  background: var(--bg-inicio-HeaderBar-assets);
  border: 1px solid transparent;
  border-radius: 0.625rem;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  .assets-box-number {
    color: var(--color-base);
  }
}

p.currency {
  color: var(--color-inicio-HeaderBar-assets-prefix);
} 

div.wallet {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-inicio-HeaderBar-assets-icon);
}

div.wallet ion-icon {
  color: var(--color-inicio-HeaderBar-assets-icon);
}

ion-button.btn {
  width: 30px;
  height: 30px;
  --padding-start: 0;
  --padding-end: 0;
  --border-width: 1px;
  --border-style: solid;
  --border-radius: 10px;
  --background: var(--bg-inicio-HeaderBar-btn);
  --border-color: var(--line-color);
  --color: var(--color-base);
}
ion-popover#language::part(content) {
  margin-top: 1.5rem;
  margin-left: .125rem;
  width: max-content;
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

.register-btn-warpper {
  min-width: 3.2rem;
  position: relative;
  .rewardTag {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    z-index: 10;
  }
}
</style>
