<!-- 安全验证 -->
<template>
  <ion-page>
    <ion-header>
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t('main.validation') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form @submit="submitForm">
        <div>
          <p class="mb-1 text-sm verify-white-color" v-if="bindType != 'asset'">{{ $t('viewsAssets.verifyLoginPassword')}}</p>
          <p class="text-[.625rem] verify-minor-color" v-if="bindType == 'password'">{{ $t('viewsAssets.loginPasswordSet')}}</p>
          <p class="text-[.625rem] verify-minor-color" v-else-if="bindType != 'asset'">
            {{$t('viewsAssets.verifyPasswordBind') }}{{ $t(`label.${bindType || 'email'}`) }}
          </p>
        </div>
        <!-- 验证登录密码 -->
        <div class="h-[3.125rem] w-full mt-[.625rem] mb-[2.125rem]">
          <Input bgColor="--color-redeem-input-bg" v-model="verifyPasswordParams.password" type="password" :error-text="$t('hint.invalidPassword')"
            :placeholder="`${$t('label.loginPassword')}`" clearInput required autocomplete="new-password">
          </Input>
		    </div>
        <!-- 确认按钮 -->
        <ion-item class="submit">
          <ion-button mode="md" size="default" type="submit" fill="clear">
            {{ $t('main.confirm') }}
          </ion-button>
        </ion-item>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import Input from '@/components/first/Input/index.vue'
import { useSecurityVerifyLogic } from '@/views/security/hooks/securityVerifyLogic'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonIcon } from '@ionic/vue';
import BackButton from '@/components/BackButton.vue';

const {
  btnLoading,
  bindType,
  verifyPasswordParams,
  submitForm,
} = useSecurityVerifyLogic();

</script>

<style scoped lang="less">
@import '@/views/security/default/styles/verify/index-base.less' ;
@import '@/views/security/default/styles/verify/theme-style.less' ;
#security-default-verify.style();
.blue-default {
  #security-default-verify.style();
}
.green-default,
.forest-green {
  #security-default-verify.style(
    --color-text-gray-200,
    --color-bg-400,
    --color-text-gray-200,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --theme-color-gradient-100
  );
}
.amber-purple {
  #security-default-verify.style(
    --color-text-gray-100,
    --color-bg-400,
    --color-text-gray-200,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --theme-color-gradient-100
  );
}
.auroral-yellow {
  #security-default-verify.style(
    @Verify04: --theme-color-800, 
    @Verify10: --color-text-black-100, 
  );
}
</style>
