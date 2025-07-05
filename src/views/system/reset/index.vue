<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class=" px-3">
        <ion-img class="w-[84px]" slot="start" src="/icons/logo_1.png"/>
        <ion-icon class="text-[28px]" slot="end" :icon="close" @click="backHandle"/>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <form class="bg-white mx-auto max-w-[1024px] px-[25px] text-black rounded-xl py-[20px]">
        <p class="text-[22px] font-bold text-center mb-[20px]">{{ $t('label.resetPassword') }}</p>
        <!-- 输入电话号码 -->
        <ion-item class="mb-[10px]">
          <ion-input mode="ios" :error-text="$t('viewsTabbar.systemReset1')" type="number" placeholder="094012903" required>
            <div class="flex items-center" slot="label">
              <ion-img class="w-[22px] inline-block" src="/icons/facebook.png"/>
              <ion-icon class="text-[16px] mx-2" :icon="chevronDown"/>
              <span class=" border-l-2 border-[#D6DDED] pl-2">+23</span>
            </div>
          </ion-input>
        </ion-item>
        <!-- 输入验证码 -->
        <ion-item class="mb-[10px]">
          <ion-input mode="ios" :type="showPassword ? 'text' : 'password'" :placeholder="$t('label.verifyCode')"/>
          <ion-button class="verify absolute mt-auto text-white right-[10px] z-10 text-[12px]" shape="round" size="small" @click="verifyHandle">{{$t('label.sendVerifyCode')}}</ion-button>
        </ion-item>
        <!-- 输入密码 -->
        <ion-item class="mb-[10px]">
          <ion-input mode="ios" :type="showPassword ? 'text' : 'password'" :error-text="$t('hint.invalidPassword')" :placeholder="$t('label.password')"/>
          <ion-icon class="text-[22px] absolute min-h-[40px] top-0 right-[15px] z-10" :src="showPassword ? '/svg/eye.svg' : '/svg/eyeOff.svg'" @click="showPasswordHandle"/>
        </ion-item>
        <!-- 确认密码 -->
        <ion-item class="mb-[10px]">
          <ion-input mode="ios" :type="showPassword ? 'text' : 'password'" :placeholder="$t('label.confirmPassword')"/>
          <ion-icon class="text-[22px] absolute min-h-[40px] top-0 right-[15px] z-10" :src="showPassword ? '/svg/eye.svg' : '/svg/eyeOff.svg'"  @click="showPasswordHandle"/>
        </ion-item>
        <ion-item class="button text-[16px] drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)] mb-[20px]">
          <label class="mx-auto">{{ $t('main.submit') }}</label>
        </ion-item>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useIonRouter } from '@ionic/vue';
import { close, chevronDown } from 'ionicons/icons';
import { IonPage, IonHeader, IonToolbar, IonContent, IonImg, IonItem, IonIcon, IonInput, IonCheckbox, IonLabel, IonButton } from '@ionic/vue';

const ionRouter = useIonRouter(); 

const showPassword = ref(false);  // 是否显示密码

/**
 * @description 返回上一页
 */
function backHandle() {
  ionRouter.replace('/login');
}

/**
 * @description 显示密码
 */
 function showPasswordHandle() {
  showPassword.value = !showPassword.value;
}

/**
 * @description 跳转登录页
 */
function loginHandle() {
  ionRouter.replace('/login');
}

/**
 * @description 发送验证码
 */
function verifyHandle() {
  console.log('发送验证码');
}

</script>

<style scoped>
ion-toolbar {
  --min-height: 44px;
  --background: #101629;
}

ion-content {
  --padding-top: 10px;
  --padding-start: 25px;
  --padding-end: 25px;
}

ion-input {
  --background: #EAEDF6;
  --color: #000;
  --placeholder-color: #8792AF;
  --placeholder-opacity: 1;
  --padding-bottom: 0px;
  --padding-end: 50px;
  --padding-start: 10px;
  --padding-top: 0px;
  --border-width: 0px;
  --border-radius: 10px;
  font-size: 12px;
}

ion-input.normal {
  --padding-end: 10px;
}

.sc-ion-input-ios-h:not(.legacy-input) {
  min-height: 40px; /* ion-input最小高度 */
}

ion-item {
  --background: transparent;
  --padding-bottom: 0px;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --inner-padding-end: 0;
  --inner-border-width: 0px;
}

ion-item.sc-ion-input-ios-h:not(.item-label):not(.item-has-modern-input), ion-item:not(.item-label):not(.item-has-modern-input) .sc-ion-input-ios-h {
  --padding-start: 10px; /* ion-input左内边距(ion-item内ion-input默认取消左内边距) */
}

ion-item.button {
  --min-height: 40px;
  --background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%);
  --border-radius: 10px;
}

ion-button.verify {
  --background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%);
  --border-radius: 10px;
}
</style>
