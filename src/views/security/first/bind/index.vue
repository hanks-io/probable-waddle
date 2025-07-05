<!-- 绑定邮箱/手机号 -->
<template>
  <ion-page>
    <NavigationBar :title="headerTitle"/>
    <ion-content class="common-ion-content">
      <form ref="formRef" @submit="submitForm">
        <p v-if="bindType === 'email'" class="security-bind-email-tips mb-1">{{ $t('viewsAssets.newEmail') }}</p>
        <p v-if="bindType === 'phone'" class="security-bind-email-tips mb-1">{{ $t('viewsAssets.newPhone') }}</p>
        <!-- 新邮箱 -->
        <div v-if="bindType === 'email'" class="w-full h-[3.125rem] mt-[.625rem] mb-[2.125rem]">
		    	<Input :bgColor="securityInputBg" v-model="userBindParams.identifier" type="email" :error-text="$t('hint.invalidEmail')" :placeholder="`${$t('label.email')}`"
		    		:isSecurity="true" clearInput required>
		    	</Input>
        </div>
        <!-- 新手机号 -->
        <div v-if="bindType === 'phone'" class="w-full h-[3.125rem] mt-[.625rem] mb-[2.125rem]">
		    	<Input :bgColor="securityInputBg" v-model="userBindParams.identifier" type="phone" :error-text="$t('hint.invalidPhone')" :placeholder="`${$t('label.phonePlaceholder')}`"
		    		clearInput required>
		    	</Input>
        </div>
        <!-- 确认按钮 -->
		    <div class="submit mb-[1.25rem]">
		    	<Button type="submit">{{ $t('main.confirm') }}</Button>
		    </div>
      </form> 
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import Input from '@/components/first/Input/index.vue'
import Button from '@/components/first/Button/index.vue'
import { useSecurityBindLogic } from '@/views/security/hooks/securityBindLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonInput, IonSpinner, IonButton } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
const {
  formRef,
  bindType,
  userBindParams,
  submitForm
} = useSecurityBindLogic();
const { t } = useI18n()
const headerTitle = computed(() => `${t('main.validation')} ${t('main.new')} ${t(`label.${bindType.value}`)}`)
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
@import '@/views/security/first/styles/bind/base-index.less';

.new-skin-symbol {
  @import '@/views/security/first/styles/bind/theme-style.less';
}
</style>
