<!-- 设置提现密码 -->
<script setup lang="ts">

import { IonPage, IonContent, IonButton, IonSpinner } from '@ionic/vue';
import PasswordInput from '@/components/PasswordInput.vue';

import useLogic from '../hooks/useLogic'
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/first/Button/index.vue'
const {
    loaded,
    btnLoading,
    passwordHandle,
    confirmPasswordHandle,
    confirmHandle,
} = useLogic()
</script>
<template>
    <ion-page class="ion-no-border" v-if="loaded">
        <NavigationBar :title="$t('main.withdraw') + ' ' + $t('label.password')" />
        <ion-content :class="['ion-padding', 'w-password-wrap']">
            <p class="text-[.875rem] title">{{ $t('main.set') + ' ' + $t('main.withdraw') + ' ' + $t('label.password') }}</p>
            <h6 class="text-xs label">{{ $t('main.new') + ' ' + $t('main.withdraw') + ' ' + $t('label.password') }}</h6>
            <PasswordInput @input="passwordHandle" focus />
            <h6 class="text-xs label">{{ $t('main.confirm') + ' ' + $t('main.new') + ' ' + $t('label.password') }}</h6>
            <PasswordInput @input="confirmPasswordHandle" />
            <h6 class="text-[.625rem] mb-7 label">{{ $t('tip.firstWithdrawal') }}</h6>
            <Button @click="confirmHandle" :suffixLoading="btnLoading">{{ $t('label.withdrawNow') }}</Button>
        </ion-content>
    </ion-page>
</template>


<style scoped lang="less">
.w-password-wrap {
    .title {
        .dynamic-font(@fontSize: --font-size-14, @fontWeight: --font-weight-medium);

    }

    .label {
        color: var(--color-text-80);
    }

}
</style>
