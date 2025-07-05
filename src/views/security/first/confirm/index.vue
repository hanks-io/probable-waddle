<template>
  <!-- 修改密码/绑定资金密码 -->
  <ion-page>
    <NavigationBar :title="headerTitle" />
    <ion-content class="common-ion-content">
      <form ref="formRef" @submit="submitForm">
        <p class="security-update-password-tips mb-1" v-if="bindType == 'password'">{{ $t('viewsAssets.newPassword') }}
        </p>
        <p class="security-update-password-tips mb-1" v-else>{{ $t('main.set') + $t('label.assetsPassword') }}</p>
        <!-- 修改密码 -->
        <template v-if="bindType == 'password'">
          <!-- 新密码 -->
          <div class="w-full h-[3.125rem] mt-[.625rem] mb-[2.125rem]">
            <Input :bgColor="securityInputBg" v-model="changePwdParams.newPassword" type="password"
              :error-text="$t('hint.invalidPassword')" :placeholder="`${$t('label.password')}`" clearInput required
              autocomplete="new-password">
            </Input>
          </div>
          <!-- 确认密码 -->
          <div class="h-[3.125rem] w-full mt-[.625rem] mb-[2.125rem]">
            <Input ref="confirmPasswordRef" :bgColor="securityInputBg" v-model="newPassword" type="password"
              :error-text="$t('hint.invalidPassword')" :placeholder="`${$t('label.confirmPassword')}`" required>
            </Input>
          </div>
          <!-- 确认按钮 -->
          <div class="submit mb-[1.25rem]">
            <Button type="submit">{{ $t('main.confirm') }}</Button>
          </div>
        </template>
        <!-- 绑定资金密码 -->
        <div class="pb-4" v-if="bindType == 'asset'">
          <p class="security-bind-asset-tips mb-1">{{ $t('main.enter') }}{{ $t('viewsAssets.newAssetPassword') }}</p>
          <PasswordInput @input="newPasswordHandle" focus />
          <p class="security-bind-asset-tips my-1">{{ $t('main.confirm') }}{{ $t('viewsAssets.newAssetPassword') }}</p>
          <PasswordInput @input="confirmPasswordHandle" />
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { usrSecurityConfirmLogic } from '@/views/security/hooks/securityConfirmLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/vue';
import PasswordInput from '@/components/PasswordInput.vue';
import Button from '@/components/first/Button/index.vue'
import Input from '@/components/first/Input/index.vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
const { t } = useI18n()
const {
  formRef,
  confirmPasswordRef,
  newPassword,
  bindType,
  changePwdParams,
  newPasswordHandle,
  confirmPasswordHandle,
  submitForm
} = usrSecurityConfirmLogic();

const securityInputBg = computed(() => {
  const data = getTheme();
  if (['green-dark', 'yellow-dark', 'purple-light', ''].includes(data.theme)) {
    return '--color-redeem-input-bg'
  } else {
    return '--ep-color-background-fill-surface-lowered'
  }
})

const headerTitle = computed(() => bindType.value == 'password' ? `${t('main.change')} ${t('label.password')}` : `${t(`label.${bindType.value}`)}`)

</script>

<style scoped lang="less">
ion-content.common-ion-content {
  --background: var(--color-bg-300);
}

.security-update-password-tips,
.security-bind-asset-tips {
  font-size: var(--font-size-14);
  color: var(--color-text-100);
  line-height: 1.3125rem;
  font-weight: var(--font-weight-medium);
}

.new-skin-symbol {
  ion-content.common-ion-content {
    --background: var(--ep-color-background-fill-body-default);
  }

  .security-update-password-tips,
  .security-bind-asset-tips {
    font-size: var(--ep-font-size-m);
    color: var(--ep-color-text-default);
    line-height: 1.3125rem;
    font-weight: var(--ep-font-weight-medium);
  }
}
</style>
