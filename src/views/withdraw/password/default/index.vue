<!-- 设置提现密码 -->
<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSpinner } from '@ionic/vue';
import PasswordInput from '@/components/PasswordInput.vue';
import BackButton from '@/components/BackButton.vue';
import useLogic from '../hooks/useLogic'
const {
    loaded,
    btnLoading,
    passwordHandle,
    confirmPasswordHandle,
    confirmHandle,
} = useLogic()
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar mode="ios">
                <BackButton />
                <ion-title>{{ $t('main.withdraw') + ' ' + $t('label.password') }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <p class="header">{{ $t('main.set') + ' ' + $t('main.withdraw') + ' ' + $t('label.password') }}</p>
            <h6 class="top label">{{ $t('main.new')  + ' '+ $t('main.withdraw')  + ' '+ $t('label.password') }}</h6>
            <PasswordInput @input="passwordHandle" focus />
            <h6 class="middle label">{{ $t('main.confirm') + ' ' + $t('main.new') + ' ' + $t('label.password') }}</h6>
            <PasswordInput @input="confirmPasswordHandle" />
            <h6 class="bottom label">{{ $t('tip.firstWithdrawal') }}</h6>
            <ion-button class="confirm" expand="block" @click="confirmHandle">
                <ion-spinner slot="start" name="bubbles" v-if="btnLoading" />
                {{ $t('label.withdrawNow') }}
            </ion-button>
        </ion-content>
    </ion-page>
</template>


<style scoped lang="less">
@import "@/views/withdraw/password/default/styles/index-base.less";
@import "@/views/withdraw/password/default/styles/theme-style.less";
#withdraw-password-default-index.style();
.blue-default {
#withdraw-password-default-index.style();
}
.green-default {
    #withdraw-password-default-index.style(
        --theme-color-gradient-100,
        --theme-color-gradient-100,
        --theme-color-700
    );
}
.amber-purple {
    #withdraw-password-default-index.style(
        --theme-color-gradient-100,
        --theme-color-gradient-100,
        --theme-color-700,
        --text-color-light-purple-2-100
    );
}
.auroral-yellow{
    #withdraw-password-default-index.style(
       --theme-color-800,
       --theme-color-800,
       --theme-color-700,
       --color-text-black-100,


    );
}
</style>
