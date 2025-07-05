<!-- 资金密码设置成功 -->
<script setup lang="ts">
import { goMain } from "@/hooks/navigate";
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButton, IonIcon } from "@ionic/vue";
import useLogic from "../hooks/useLogic";

const { goToWithdrawPage } = useLogic();
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <ion-title>{{ $t("viewsAssets.setPasswordDone1") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="top">
        <ion-icon src="/svg/recharge/recharge_succsess.svg" />
        <p class="status">{{ $t("viewsAssets.setPasswordDone2") }}</p>
        <p class="tip">{{ $t("viewsAssets.setPasswordDone3") }}</p>
      </div>
      <div class="btn">
        <ion-button class="btnBase btnGoHomePage" @click="goMain()">{{ $t("viewsAssets.setPasswordDone4") }}</ion-button>
        <ion-button class="btnBase btnContinueWithdraw" @click="goToWithdrawPage">{{ $t("viewsAssets.setPasswordDone5") }}</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="less">
@import "@/views/withdraw/passwordCompletion/default/styles/index-base.less";
@import "@/views/withdraw/passwordCompletion/default/styles/theme-style.less";
#withdraw-passwordCompletion-default-index.style();
.blue-default {
    #withdraw-passwordCompletion-default-index.style();
}
.green-default {
    #withdraw-passwordCompletion-default-index.style(
      --color-text-white-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --color-line
    );
}
.amber-purple {
    #withdraw-passwordCompletion-default-index.style(
      --color-text-white-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --color-line
    );
}
.auroral-yellow{
  #withdraw-passwordCompletion-default-index.style(
    @index02:--theme-color-800,
    @index03:--theme-color-800,
    @index04:--color-line,
    @homeBtnColor: --color-text-black-100,
    @withdrawBtnBgColor:--color-bg-200
  )
}
</style>
