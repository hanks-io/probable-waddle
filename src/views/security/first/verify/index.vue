<!-- 安全验证-->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="$t('main.validation')" />
    <ion-content class="common-ion-content">
      <form @submit="submitForm">
        <div>
          <p class="security-verify-password mb-1" v-if="bindType != 'asset'">{{ $t('viewsAssets.verifyLoginPassword') }}</p>
          <p class="security-verify-tips" v-if="bindType=='password'">{{ $t('viewsAssets.loginPasswordSet') }}</p>
          <p class="security-verify-tips" v-else-if="bindType != 'asset'">{{ $t('viewsAssets.verifyPasswordBind') }}{{ $t(`label.${bindType || 'email'}`) }}</p>
        </div>
        <!-- 验证登录密码 -->
        <div class="h-[3.125rem] w-full mt-[.625rem] mb-[2.125rem]">
		    	<Input :bgColor="securityInputBg" v-model="verifyPasswordParams.password" type="password" :error-text="$t('hint.invalidPassword')"
           :placeholder="`${$t('label.loginPassword')}`" clearInput required autocomplete="new-password">
		    	</Input>
		    </div>
        <!-- 确认按钮 -->
		    <div class="submit mb-[1.25rem]" >
		    	<Button type="submit">{{ $t('main.confirm') }}</Button>
		    </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { useSecurityVerifyLogic } from '@/views/security/hooks/securityVerifyLogic'
import { IonPage, IonContent } from '@ionic/vue';
import Button from '@/components/first/Button/index.vue'
import Input from '@/components/first/Input/index.vue'
import NavigationBar from '@/components/NavigationBar/index.vue'

const {
  btnLoading,
  bindType,
  verifyPasswordParams,
  submitForm,
} = useSecurityVerifyLogic();

const securityInputBg = computed(() => {
  const data = getTheme();
  if (['green-dark','yellow-dark','purple-light',''].includes(data.theme)) {
    return '--color-redeem-input-bg'
  } else {
    return '--ep-color-background-fill-surface-lowered'
  }
})

</script>

<style scoped lang="less">
@import '@/views/security/first/styles/verify/base-index.less';

.new-skin-symbol {
  @import '@/views/security/first/styles/verify/theme-style.less';
}
</style>
