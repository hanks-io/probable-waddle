<template>
  <!-- 修改密码/绑定资金密码 -->
  <ion-page>
    <ion-header class="ion-no-border">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title v-if="bindType=='password'">{{$t('main.change')+$t('label.password')}}</ion-title>
        <ion-title v-else>{{$t(`label.${bindType}`)}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="common-ion-content">
      <form ref="formRef" @submit="submitForm" >
        <p class="middle-text-white font-weight-medium mb-1" v-if="bindType=='password'">{{ $t('viewsAssets.newPassword') }}</p>
         <p class="middle-text-white font-weight-medium mb-1" v-else>{{ $t('main.set')+$t('label.assetsPassword') }}</p>
         <!-- 修改密码 -->
         <template v-if="bindType=='password'">
            <!-- 新密码 -->
            <div class="w-full h-[3.125rem] mt-[.625rem] mb-[2.125rem]">
		        	<Input ref="passwordRef" bgColor="--color-bg-500" v-model="changePwdParams.newPassword" type="password" :minlength="6"
		        		:maxlength="16" :error-text="$t('hint.invalidPassword')" :placeholder="`${$t('label.password')}`"
		        		@ionInput="passwordInput" clearInput required autocomplete="new-password">
		        	</Input>
		        </div>
            <!-- 确认密码 -->
            <div class="h-[3.125rem] w-full mt-[.625rem] mb-[2.125rem]">
		        	<Input ref="confirmPasswordRef" bgColor="--color-bg-500" v-model="newPassword" type="password" :minlength="6"
		        		:maxlength="16" :error-text="$t('hint.invalidPassword')" :placeholder="`${$t('label.confirmPassword')}`"
		        		@ionInput="confirmPasswordInput" required >
		        	</Input>
		        </div>
            <!-- 确认按钮 -->
		        <div class="submit mb-[20px]" >
		        	<Button type="submit">{{ $t('main.confirm') }}</Button>
		        </div>
         </template>
        <!-- 绑定资金密码 -->
        <div class="pb-4" v-if="bindType == 'asset'">
          <p class="middle-text-white font-weight-medium mb-1">{{ $t('main.enter') }}{{ $t('viewsAssets.newAssetPassword') }}</p>
          <PasswordInput @input="newPasswordHandle" focus/>
          <p class="middle-text-white font-weight-medium my-1">{{ $t('main.confirm') }}{{ $t('viewsAssets.newAssetPassword') }}</p>
          <PasswordInput @input="confirmPasswordHandle"/>
        </div>
      </form> 
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { usrSecurityConfirmLogic } from '@/views/security/hooks/securityConfirmLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonIcon, IonInput, IonSpinner, IonButton } from '@ionic/vue';
import PasswordInput from '@/components/PasswordInput.vue';
import Button from "@/components/second/Button/index.vue";
import Input from '@/components/first/Input/index.vue'
import BackButton from '@/components/BackButton.vue';

const { 
  formRef,
  password,
  passwordRef,
  confirmPasswordRef,
  newPassword,
  btnLoading,
  showPassword,
  bindType,
  verifyType,
  changePwdParams,
  assetPasswordParams,
  optVerifyParams,
  userBindParams,
  showPasswordHandle,
  passwordInput,
  confirmPasswordInput,
  passwordBlur,
  confirmPasswordBlur,
  newPasswordHandle,
  confirmPasswordHandle,
  submitForm
} = usrSecurityConfirmLogic();

</script>

<style scoped lang="less">
ion-item {
  --background: transparent;
  --padding-start: 0;
  --inner-padding-end: .25rem;
  min-height: 3.375rem !important;
}

.amber-purple body div#app ion-router-outlet > div.ion-page::before {
  z-index: 10;
  pointer-events: none;
}
</style>
