<!-- 忘记密码 -->
<template>
  <div class="h-full w-full flex-center" @click="closeModal">
    <div class="bg-200 w-[20.375rem] min-h-[21.5625rem] rounded-large max-h-full" :style="getBgImgStyle()" @click.stop>
      <div class="relative w-full min-h-[3.125rem] my-3 px-4">
        <ion-icon class="absolute top-5 right-5 text-xs btn-close" src="/first/svg/login/close.svg" @click="closeModal"></ion-icon>
        <div>
          <div class="forget-title">{{ $t('label.forgotPassword') }}</div>
          <div class="forget-tips">{{ $t('label.forgotPasswordTips') }}</div>
        </div>
      </div>
      <div class="px-4">
        <form ref="formRef" @submit="submitForm">
          <div class="flex justify-between step-unpass-text text-xs px-8 pt-4 pb-6 mb-2">
            <div class="h-7 flex-center flex-col">
              <span class="step-index flex-center" :class="[step>=1?'on':'', step==1? 'current' : '']">
                <ion-icon v-if="step > 1" class="text-xs" src="/first/svg/login/ok.svg"></ion-icon>
                <span v-else >{{ '1' }}</span>
              </span>
            </div>
            <div class="flex flex-1 h-7 items-center" >
              <div class="w-full h-[.125rem]" :class="step>=2?'step-pass-bg':'step-unpass-bg'"></div>
            </div>
            <div class="h-7 flex-center flex-col">
              <span class="step-index flex-center" :class="[step>=2?'on':'', step==2? 'current' : '']">
                <ion-icon v-if="step > 2" class="text-xs" src="/first/svg/login/ok.svg"></ion-icon>
                <span v-else >{{ '2' }}</span>
              </span>
            </div>
            <div class="flex flex-1 h-7 items-center">
              <div class="w-full h-[.125rem]" :class="step>=3?'step-pass-bg':'step-unpass-bg'"></div>
            </div>
            <div class="h-7 flex-center flex-col">
              <span class="step-index flex-center" :class="[step>=3?'on':'', step==3? 'current' : '']">
                <ion-icon v-if="step > 3" class="text-xs" src="/first/svg/login/ok.svg"></ion-icon>
                <span v-else >{{ '3' }}</span>
              </span>
            </div>
          </div>
          <div v-if="step==1" class="">
            <AccountTypeSelector v-model="accountType" :type="OperationType.Login" />
          </div>
          <div class="step-title mb-[0.5625rem]">
            <p v-show="step==1" >{{ $t('components.forget1') }}</p>
            <div v-show="step==2">
              <p>{{ $t('components.forget2') }}</p>
              <p class="forget-tips">{{ $t('components.sendVerifyCode', { phone: verifyIdentifier }) }}</p>
            </div>
            <p v-show="step==3" >{{ $t('components.forget3') }}</p>
          </div>
          <!-- 用户信息输入框 -->
          <div v-if="step==1" class="mb-[1.875rem]">
            <Input v-show="accountType === LoginType.Phone" v-model="identifier" :placeholder="$t('label.phonePlaceholder')" :error-text="$t('hint.invalidPhone')" 
              type="phone" bgColor="--color-bg-400" clearInput required/>
            <Input v-show="accountType === LoginType.Account" v-model="identifier" :placeholder="$t('label.account')" :error-text="$t('hint.invalidUsername')" 
              type="account" bgColor="--color-bg-400" clearInput required/>
          </div>
          <!-- 验证码输入框 -->
          <div v-else-if="step==2" class="mb-[1.875rem]">
            <Input v-model="optVerifyParams.otp" :verifySended="verifySended" :countdown="countdown" :verifyHandle="verifyHandle"
              :loading="verifyLoading" type="captcha" bgColor="--color-bg-400" :error-text="$t('hint.invalidVerifyCode')"
              :placeholder="$t('label.verifyCode')" required>
            </Input>
            <div class="mt-2 text-end hidden" v-if="verifyTypeList.length > 1" @click="changeVerifyType">
              <p class="text-[.625rem] text-[#1680DC]" v-if="validateType=='phone'">{{ $t('components.phoneisnotwith') }}，{{ $t('components.switchverificationmethod') }}</p>
              <p class="text-[.625rem] text-[#1680DC]" v-if="validateType=='email'">{{ $t('components.temporarilyunabletocheckemail') }}，{{ $t('components.switchverificationmethod') }}</p>
            </div>
          </div>
          <!-- 输入新密码 -->
          <div v-else-if="step==3">
            <!-- 密码 -->
            <div class="mb-[1.875rem]">
              <Input v-model="forgetParams.newPassword" type="password" bgColor="--color-bg-400" :error-text="$t('hint.invalidPassword')"
              :placeholder="$t('label.password')" clearInput required autocomplete="new-password" errorHeight="1.25rem">
              </Input>
            </div>
            <!-- 确认密码 -->
            <div class="mb-[1.875rem]">
              <Input v-model="confirmPassword" type="password" bgColor="--color-bg-400" :error-text="$t('hint.invalidPassword')"
              :placeholder="`${$t('label.confirmPassword')}`" clearInput required autocomplete="new-password" errorHeight="1.25rem">
              </Input>
            </div>
          </div>
          <!-- 确认按钮 -->
          <Button class="mb-5" spinner="bubbles" type="submit" :suffixLoading="loading">
            {{ $t('main.confirm') }}
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import Input from '@/components/first/Input/index.vue'
import Button from '@/components/first/Button/index.vue'
import AccountTypeSelector from "@/components/loginModal/components/typeSelector/index.vue";
import { OperationType, LoginType } from "@/enums/common";
import useLogic from '@/components/changePwModal/logic';

const {
  step,
  identifier,
  validateType,
  verifySended,
  countdown,
  loading,
  verifyLoading,
  verifyTypeList,
  verifyIdentifier,
  confirmPassword,
  optVerifyParams,
  forgetParams,
  changeVerifyType,
  verifyHandle,
  submitForm,
  closeModal,
  getBgImgStyle,
  accountType,
} = useLogic();

</script>

<style scoped lang="less">
@import "@/components/changePwModal/styles/forget.less";
</style>
