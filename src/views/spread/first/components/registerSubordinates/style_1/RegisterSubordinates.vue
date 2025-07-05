<template>
  <form ref="formRef" id="register-subordinates" class="flex flex-col py-[0.75rem] px-[0.625rem] h-full overflow-y-auto"
    @submit="submitForm">
    <ion-content>
      <div class="my-[1.25rem] illustrate">{{$t('hint.illustrate')}}</div>
      <!-- 注册方式选择器 -->
      <RegisterTypeSelector v-model="registerType" :type="OperationType.Register"/>
      <!-- 账号（账号注册） -->
      <div class="h-[4.375rem]" v-if="registerType == 'Account'">
        <Input ref="usernameRef" v-model="registerParams.username" type="account" :bgColor="skinInputBg"
          :error-text="$t('hint.invalidUsername')" :placeholder="$t('label.username')"
          clearInput required @ionInput="usernameInput" @ionBlur="usernameBlur" />
      </div>
      <!-- 账号（手机号注册） -->
      <div class="h-[4.375rem]" v-else>
        <Input ref="phoneRef" v-model="registerParams.phoneNumber" type="phone" :bgColor="skinInputBg"
          :error-text="$t('hint.invalidPhone')" :placeholder="`${$t('label.phonePlaceholder')}`"
				  @ionInput="phoneInput" required>
			  </Input>
      </div>
      <!-- 密码 -->
      <div class="h-[4.375rem]">
		  	<Input ref="passwordRef" v-model="registerParams.password" type="password" :bgColor="skinInputBg"
		  		:error-text="$t('hint.invalidPassword')" :placeholder="`${$t('label.password')}`"
		  		@ionInput="passwordInput" required autocomplete="new-password">
		  	</Input>
		  </div>
      <!-- 确认密码 -->
		  <div class="h-[4.375rem]">
		  	<Input v-model="confirmPassword" type="password" :bgColor="skinInputBg" :placeholder="`${$t('label.confirmPassword')}`"
         required autocomplete="new-password">
        </Input>
		  </div>
      <!-- 手机号 -->
      <div class="h-[4.375rem]" v-if="registerType == 'Account' && authInfo?.accountRegisterShowPhone">
        <Input ref="phoneRef" v-model="registerParams.phoneNumber" type="phone" :bgColor="skinInputBg"
          :error-text="$t('hint.invalidPhone')" :placeholder="`${$t('label.phonePlaceholder')}`"
				  @ionInput="phoneInput">
			  </Input>
      </div>
      <!-- cpf -->
      <div class="h-[4.375rem]" v-if="registerType == LoginType.Phone && showCpfInput">
        <Input v-model="cpfValue" type="cpf" :minlength="11" :maxlength="11" :bgColor="skinInputBg" :placeholder="`${$t('hint.tipCPF')}`"
        :error-text="$t('hint.invalidCPF')" required>
        </Input>
      </div>
      <!-- 真实姓名 -->
      <div class="h-[4.375rem]" v-if="needRealName">
        <Input v-model="realName" type="realName" :noTrim="true" :bgColor="skinInputBg" :placeholder="`${$t('hint.realName')}`"
        :error-text="$t('hint.correctInformation')" :maxlength="REAL_NAME_LEN" :clear="true" required >
        </Input>
      </div>
      <!-- cf人机验证 -->
      <div class="w-full overflow-hidden">
        <div id="cf-turnstile-register"></div>
      </div>
      <!-- 阿里云图形验证 -->
      <div id="captcha-element"></div>
      <div id="captcha-button"></div>
      <!-- 注册按钮 -->
      <div class="submit mb-[20px]">
		  	<Button type="submit">{{ $t('main.create') }}</Button>
		  </div>
    </ion-content>
  </form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import Input from '@/components/first/Input/index.vue'
import Button from '@/components/first/Button/index.vue'
import { IonContent } from '@ionic/vue';
import RegisterTypeSelector from "@/components/loginModal/components/typeSelector/index.vue";
import { OperationType, LoginType } from "@/enums/common";
import { useRegisterSubordinatesLogic } from '@/views/spread/hooks/registerSubordinatesLogic'
import { REAL_NAME_LEN } from '@/views/withdraw/constant';


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

const skinInputBg = computed(() => {
  const data = getTheme();
  if (['green-dark','yellow-dark','purple-light',''].includes(data.theme)) {
    return '--color-bg-400'
  } else {
    return '--ep-color-background-fill-surface-lowered'
  }
})
</script>

<style scoped lang="less">
@import '@/views/spread/first/styles/RegisterSubordinates/base-index.less';

.new-skin-symbol {
  @import '@/views/spread/first/styles/RegisterSubordinates/theme-style.less';
}
</style>
