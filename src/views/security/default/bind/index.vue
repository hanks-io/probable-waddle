<template>
  <ion-page>
    <ion-header>
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{$t('main.validation')+$t('main.new')+$t(`label.${bindType}`)}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form ref="formRef" @submit="submitForm">
        <p class="text-sm mb-1 bind-white-color" v-if="bindType=='phone'">{{ $t('viewsAssets.newPhone') }}</p>
        <p class="text-sm mb-1 bind-white-color" v-else-if="bindType=='email'">{{ $t('viewsAssets.newEmail') }}</p>
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
        <ion-item class="submit">
          <ion-button class="submit-btn" mode="md" type="submit" size="default" fill="clear">
            {{ $t('main.confirm') }}
          </ion-button>
        </ion-item>
      </form> 
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import Input from '@/components/first/Input/index.vue'
import { useSecurityBindLogic } from '@/views/security/hooks/securityBindLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonInput, IonSpinner, IonButton } from '@ionic/vue';

const {
  formRef,
  bindType,
  userBindParams,
  submitForm
} = useSecurityBindLogic();

</script>

<style scoped lang="less">
@import '@/views/security/default/styles/bind/index-base.less' ;
@import '@/views/security/default/styles/bind/theme-style.less' ;
#security-default-bind.style();
.blue-default {
#security-default-bind.style();
}
.green-default,
.forest-green {
  #security-default-bind.style(
    --color-bg-400,
    --color-text-gray-200,
    --color-text-gray-100,
    --theme-color-gradient-100
  );
}
.amber-purple {
  #security-default-bind.style(
    --color-bg-400,
    --color-text-gray-200,
    --color-text-gray-100,
    --theme-color-gradient-100
  );
}
.auroral-yellow {
  #security-default-bind.style(
    @Bind04: --theme-color-800, 
    @Bind05: --color-text-black-100, 
  );
}
</style>
