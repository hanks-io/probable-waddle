<!-- 安全验证 校验登录密码-->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{$t('main.validation')}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="common-ion-content">
      <form @submit="submitForm">
        <div>
          <p class="middle-text-white font-weight-medium mb-1" v-if="bindType != 'asset'">{{ $t('viewsAssets.verifyLoginPassword') }}</p>
          <p class="minimum-text-white" v-if="bindType=='password'">{{ $t('viewsAssets.loginPasswordSet') }}</p>
          <p class="minimum-text-white" v-else-if="bindType != 'asset'">{{ $t('viewsAssets.verifyPasswordBind') }}{{ $t(`label.${bindType || 'email'}`) }}</p>
        </div>
        <!-- 验证登录密码 -->
        <div class="h-[3.125rem] w-full mt-[.625rem] mb-[2.125rem]">
		    	<Input ref="passwordRef" bgColor="--color-bg-500" v-model="verifyPasswordParams.password" type="password" :error-text="$t('hint.invalidPassword')"
           :placeholder="`${$t('label.loginPassword')}`" clearInput required autocomplete="new-password">
		    	</Input>
		    </div>
        <!-- 确认按钮 -->
		    <div class="submit mb-[20px]">
		    	<Button type="submit">{{ $t('main.confirm') }}</Button>
		    </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useSecurityVerifyLogic } from '@/views/security/hooks/securityVerifyLogic'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import Button from "@/components/second/Button/index.vue";
import Input from '@/components/first/Input/index.vue'
import BackButton from '@/components/BackButton.vue';

const {
  btnLoading,
  bindType,
  verifyPasswordParams,
  submitForm,
} = useSecurityVerifyLogic();

</script>

<style scoped lang="less">
ion-item {
  --background: transparent;
  --padding-start: 0;
  --inner-padding-end: .25rem;
  min-height: 3.375rem;
}

ion-button.verify {
  --background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%);
  --border-radius: .625rem;
  --padding-start: .625rem;
  --padding-end: .625rem;
}

ion-button.verify.on {
  --background: #626262;
}

ion-modal {
  --width: fit-content;     /* 宽度由内容撑开 */
  --height: fit-content;	  /* 高度由内容撑开 */
  --border-radius: 1.25rem;
}

ion-item#verification {
  --background: #101629;
  --padding-top: 0;
  --padding-bottom: 0;
  min-height: 0rem;
}

.amber-purple body div#app ion-router-outlet > div.ion-page::before {
  z-index: 10;
  pointer-events: none;
}
</style>
