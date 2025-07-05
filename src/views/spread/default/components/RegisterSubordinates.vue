<template>
  <form ref="formRef" id="register-subordinates" class="flex flex-col p-[10px] h-full rounded-[.625rem] overflow-y-auto"
    @submit="submitForm">
    <ion-content>
      <div class="illustrate">{{$t('hint.illustrate')}}</div>
      <!-- 注册方式选择器 -->
      <RegisterTypeSelector v-model="registerType" :type="OperationType.Register"/>
      <!-- 用户名注册 -->
      <ion-item class="mb-[10px]" v-if="registerType == LoginType.Account">
        <ion-input ref="usernameRef" v-model="registerParams.username" mode="ios"
          :error-text="`*${$t('hint.invalidUsername')}`" :placeholder="$t('label.username')" clearInput required
          @ionInput="usernameInput" @ionBlur="usernameBlur" autocomplete="new-password" border-width="0" />
      </ion-item>
      <!-- 账号（手机号注册） -->
      <ion-item class="mb-[10px]" v-else>
        <ion-input ref="phoneRef" mode="ios" :value="registerParams.phoneNumber" type="tel" :minlength="maxLength"
          :maxlength="maxLength" :error-text="`*${$t('hint.invalidPhone')}`" :placeholder="$t('label.phonePlaceholder')" @ionInput="phoneInput"
          clearInput required>
          <div class="flex items-center" slot="label">
            <flag :iso="country" class="rounded-xl text-[20px] mr-2" />
            <span class="register-tips pl-2 text-[#9BA7BE]">{{ areaCode }}</span>
          </div>
        </ion-input>
      </ion-item>
      <!-- 密码 -->
      <ion-item class="mb-[10px]">
        <ion-input ref="passwordRef" class="password" v-model="registerParams.password" mode="ios"
          :type="showPassword ? 'text' : 'password'" :error-text="$t('hint.invalidPassword')"
          :placeholder="$t('label.password')" required @ionInput="passwordInput" @ionBlur="passwordBlur"
          autocomplete="new-password" />
        <div class="absolute min-h-[36px] top-[4px] right-[6px] z-50 flex items-center">
          <ion-icon class="text-[20px] confirm-eye-color" :src="showPassword ? '/svg/eye.svg' : '/svg/eyeOff.svg'"  @click="showPasswordHandle" />
        </div>
      </ion-item>
      <!-- 确认密码 -->
      <ion-item class="mb-[10px]">
        <ion-input class="password" v-model="confirmPassword" mode="ios" :type="showPassword ? 'text' : 'password'"
          :placeholder="$t('label.confirmPassword')" required autocomplete="new-password" />
        <div class="absolute min-h-[36px] top-[4px] right-[6px] z-50 flex items-center">
          <ion-icon class="text-[20px] confirm-eye-color" :src="showPassword ? '/svg/eye.svg' : '/svg/eyeOff.svg'" @click="showPasswordHandle" />
        </div>
      </ion-item>
      <!-- cpf -->
      <ion-item class="mb-[10px]" v-if="registerType == LoginType.Phone && showCpfInput">
        <ion-input mode="ios" v-model="cpfValue" type="text" :minlength="11" :maxlength="11"
        :error-text="`*${$t('hint.invalidCPF')}`" :placeholder="$t('hint.tipCPF')" clearInput required>
        </ion-input>
      </ion-item>
      <!-- 真实姓名 -->
      <ion-item class="mb-[10px]" v-if="needRealName">
        <ion-input ref="realNameRef" mode="ios" v-model="realName" type="text" :minlength="2" :maxlength="25" @ionInput="realNameInput"
        :error-text="`*${$t('hint.correctInformation')}`" :placeholder="$t('hint.realName')" clearInput required>
        </ion-input>
      </ion-item>
      <!-- 手机号 -->
      <ion-item class="mb-[10px]" v-if="registerType == 'Account' && authInfo?.accountRegisterShowPhone">
        <ion-input ref="phoneRef" mode="ios" :value="registerParams.phoneNumber" type="tel" :minlength="maxLength"
          :maxlength="maxLength" :error-text="`*${$t('hint.invalidPhone')}`" :placeholder="$t('label.phonePlaceholder')" @ionInput="phoneInput"
          clearInput>
          <div class="flex items-center" slot="label">
            <flag :iso="country" class="rounded-xl text-[20px] mr-2" />
            <span class="register-tips pl-2 text-[#9BA7BE]">{{ areaCode }}</span>
          </div>
        </ion-input>
      </ion-item>
      <!-- cf人机验证 -->
      <div class="w-full overflow-hidden">
        <div id="cf-turnstile-register"></div> 
      </div>
      <!-- 阿里云图形验证 -->
      <div id="captcha-element"></div>
      <div id="captcha-button"></div>
      <!-- 注册按钮 -->
      <ion-item class="submit drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)] mt-[2rem] mx-auto w-[15.625rem]">
        <ion-button class="w-full text-sm" type="submit" fill="clear">{{ $t('main.create') }}</ion-button>
      </ion-item>
    </ion-content>
  </form>

</template>

<script setup lang="ts">
import { IonItem, IonButton, IonInput, IonIcon, IonContent } from '@ionic/vue';
import RegisterTypeSelector from "@/components/loginModal/components/typeSelector/index.vue";
import { OperationType, LoginType } from "@/enums/common";
import { useRegisterSubordinatesLogic } from '@/views/spread/hooks/registerSubordinatesLogic'

const {
  formRef,
  phoneRef,
  usernameRef,
  passwordRef,
  showPassword,
  confirmPassword,
  authInfo,
  language,
  country,
  maxLength,
  areaCode,
  registerParams,
  usernameInput,
  usernameBlur,
  passwordInput,
  passwordBlur,
  phoneInput,
  showPasswordHandle,
  submitForm,
  registerType,
  cpfValue,
  realName,
  showCpfInput,
  needRealName,
  realNameRef,
  realNameInput,
} = useRegisterSubordinatesLogic();

</script>

<style scoped lang="less">
  @import "@/views/spread/default/styles/RegisterSubordinates/base.less";
  @import "@/views/spread/default/styles/RegisterSubordinates/theme-style.less";

  #spread-default-components-registerSubordinates.style();

  .blue-default {
    #spread-default-components-registerSubordinates.style(
      --color-bg-200,
      --color-text-white-100,
      --color-bg-300,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-white-100,
      --color-text-gray-100,
      --theme-color-gradient-100
    );
  }

  .green-default {
    #spread-default-components-registerSubordinates.style(
      --color-bg-200,
      --color-text-gray-100,
      --color-bg-400,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-100,
      --theme-color-gradient-100
    );
  }

  .amber-purple {
    #spread-default-components-registerSubordinates.style(
      --color-bg-200,
      --text-color-light-purple-1-100,
      --color-bg-400,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-1-100,
      --segment-gradients-purple
    );
  }

  .forest-green {
    #spread-default-components-registerSubordinates.style(
      --color-bg-200,
      --color-text-gray-100,
      --theme-color-500,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-100,
      --theme-color-gradient-100
    );
  }

  .auroral-yellow {
    #spread-default-components-registerSubordinates.style(
      @default-components-registerSubordinates-08: --theme-color-800,
      @default-components-registerSubordinates-09: --color-text-black-100,
    );
  }
</style>
