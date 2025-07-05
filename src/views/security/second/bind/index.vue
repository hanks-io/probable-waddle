<!-- 绑定邮箱/手机号 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{$t('main.validation')+$t('main.new')+$t(`label.${bindType}`)}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="common-ion-content">
      <form ref="formRef" @submit="submitForm">
        <p class="middle-text-white font-weight-medium mb-1">{{ $t('viewsAssets.newEmail') }}</p>
        <!-- 新邮箱 -->
        <div v-if="bindType === 'email'" class="w-full h-[3.125rem] mt-[.625rem] mb-[2.125rem]">
		    	<Input bgColor="--color-redeem-input-bg" v-model="userBindParams.identifier" type="email" :error-text="$t('hint.invalidEmail')" :placeholder="`${$t('label.email')}`"
		    		:isSecurity="true" clearInput required>
		    	</Input>
        </div>
        <!-- 新手机号 -->
        <div v-if="bindType === 'phone'" class="w-full h-[3.125rem] mt-[.625rem] mb-[2.125rem]">
		    	<Input bgColor="--color-redeem-input-bg" v-model="userBindParams.identifier" type="phone" :error-text="$t('hint.invalidPhone')" :placeholder="`${$t('label.phonePlaceholder')}`"
		    		clearInput required>
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
import BackButton from '@/components/BackButton.vue';
import Input from '@/components/first/Input/index.vue'
import Button from "@/components/second/Button/index.vue";
import { useSecurityBindLogic } from '@/views/security/hooks/securityBindLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonInput, IonSpinner, IonButton } from '@ionic/vue';

const {
  btnLoading,
  formRef,
  bindType,
  userBindParams,
  submitForm
} = useSecurityBindLogic();

</script>

<style scoped lang="less">
ion-item {
  --background: transparent;
  --padding-start: 0.625rem;
  --inner-padding-end: .25rem;
  min-height: 3.375rem !important;
}

ion-button.verify {
  --background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%);
  --border-radius: 10px;
}

ion-button.verify.on {
  --background: #626262;
  --padding-start: 20px;
  --padding-end: 20px;
}

.amber-purple body div#app ion-router-outlet > div.ion-page::before {
  z-index: 10;
  pointer-events: none;
}
</style>
