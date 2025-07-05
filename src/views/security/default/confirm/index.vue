<template>
  <ion-page>
    <ion-header>
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title v-if="bindType=='password'">{{$t('main.change')+$t('label.password')}}</ion-title>
        <ion-title v-else-if="['phone','mail'].includes(bindType)">{{$t('main.validation')+$t('main.new')+$t(`label.${bindType}`)}}</ion-title>
        <ion-title v-else>{{$t(`label.${bindType}`)}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form ref="formRef" @submit="submitForm" >
        <p class="confirm-white-color" v-if="bindType =='password'">{{ $t('viewsAssets.newPassword') }}</p>
        <p class="confirm-white-color" v-else-if="bindType=='phone'">{{ $t('viewsAssets.newPhone') }}</p>
        <p class="confirm-white-color" v-else-if="bindType=='email'">{{ $t('viewsAssets.newEmail') }}</p>
        <p class="confirm-white-color" v-else-if="['assetsPassword','asset'].includes(bindType)">{{ $t('main.set')+$t('label.assetsPassword') }}</p>
        <!-- 新密码 -->
        <ion-item class="password" lines="none" v-if="bindType=='password'">
          <ion-input ref="passwordRef" v-model="changePwdParams.newPassword" mode="ios" :type="showPassword ? 'text' : 'password'" :error-text="$t('hint.invalidPassword')" :placeholder="$t('main.new')+$t('label.loginPassword')" required @ionInput="passwordInput" @ionBlur="passwordBlur"/>
          <ion-icon class="confirm-eye-color" :src="showPassword ? '/svg/eye.svg' : '/svg/eyeOff.svg'" @click="showPasswordHandle"/>
        </ion-item>
        <!-- 确认密码 -->
        <ion-item class="password" lines="none" v-if="bindType=='password'">
          <ion-input ref="confirmPasswordRef" v-model="newPassword" mode="ios" :type="showPassword ? 'text' : 'password'" :error-text="$t('hint.invalidPassword')" :placeholder="$t('main.confirm')+$t('main.new')+$t('label.loginPassword')" required @ionInput="confirmPasswordInput" @ionBlur="confirmPasswordBlur"/>
          <ion-icon class="confirm-eye-color"  :src="showPassword ? '/svg/eye.svg' : '/svg/eyeOff.svg'" @click="showPasswordHandle"/>
        </ion-item>
        <!-- 新资金密码 -->
        <div class="fundPassword" v-if="bindType == 'asset'">
          <p class="confirm-asset-text-color">{{ $t('main.enter') }}{{ $t('viewsAssets.newAssetPassword') }}</p>
          <PasswordInput @input="newPasswordHandle" focus/>
          <p class="confirm-asset-text-color">{{ $t('main.confirm') }}{{ $t('viewsAssets.newAssetPassword') }}</p>
          <PasswordInput @input="confirmPasswordHandle"/>
        </div>
        <!-- 确认按钮 -->
        <ion-item class="submit" v-if="bindType != 'asset'">
          <ion-button class="submit-btn" mode="md" size="default" type="submit" fill="clear">
            {{ $t('main.confirm') }}
          </ion-button>
        </ion-item>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { usrSecurityConfirmLogic } from '@/views/security/hooks/securityConfirmLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonIcon, IonInput, IonSpinner, IonButton } from '@ionic/vue';
import PasswordInput from '@/components/PasswordInput.vue';
import BackButton from '@/components/BackButton.vue';

const {
  formRef,
  passwordRef,
  confirmPasswordRef,
  newPassword,
  showPassword,
  bindType,
  changePwdParams,
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
@import '@/views/security/default/styles/confirm/index-base.less' ;
@import '@/views/security/default/styles/confirm/theme-style.less' ;
#security-default-confirm.style();
.blue-default {
  #security-default-confirm.style();
}
.green-default {
  #security-default-confirm.style(
    --color-bg-400,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --theme-color-gradient-100
  );
}
.amber-purple {
  #security-default-confirm.style(
    --color-bg-400,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --theme-color-gradient-100
  );
}

.forest-green {
  #security-default-confirm.style(
    --color-bg-200,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --theme-color-gradient-100
  );
}
.auroral-yellow {
  #security-default-confirm.style(
    @Confirm06: --theme-color-800, 
    @Confirm07: --color-text-black-100, 
  );
}
</style>
