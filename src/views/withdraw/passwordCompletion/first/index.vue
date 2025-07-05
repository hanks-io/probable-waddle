<!-- 资金密码设置成功 -->
<script setup lang="ts">
import { goMain } from '@/hooks/navigate';
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/first/Button/index.vue'
import useLogic from '../hooks/useLogic'
import useGetDarkBtnTextColor from '@/hooks/useGetDarkBtnTextColor'
import { getTheme } from '@/theme/hooks'

const btnColor = useGetDarkBtnTextColor()
const { newSkin } = getTheme()
const classType = computed(() => !newSkin ? 'style-2' : 'raised')
const {
  goToWithdrawPage
} = useLogic()

</script>

<template>
  <ion-page>
    <NavigationBar :title="$t('viewsAssets.setPasswordDone1')" />
    <ion-content :class="['ion-padding', 'password-c']">
      <div class="mt-[3.9375rem] flex items-center flex-col">
        <div class="success-wrap">
          <ion-icon class="text-[2rem] mt-3" src="/first/svg/assets/success.svg" />
        </div>

        <p class="text-[1rem] leading-[1.375rem] py-[0.9375rem] title">{{ $t('viewsAssets.setPasswordDone2') }}</p>
        <p class="text-[0.875rem] leading-[1.375rem] label">{{ $t('viewsAssets.setPasswordDone3') }}</p>
      </div>
      <div class="flex items-center justify-center space-x-[1.125rem] mt-10">
        <Button @click="goMain()" class="btnBase go-home" background="var(--color-button-bg-gray)" :style="btnColor"
          :classType='classType'>{{
            $t('viewsAssets.setPasswordDone4') }}</Button>
        <Button @click="goToWithdrawPage" class="btnBase">{{ $t('viewsAssets.setPasswordDone5') }}</Button>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="less">
.btnBase {
  width: 10.3125rem;
  height: 2.5rem;
}

.success-wrap {
  width: 3.4375rem;
  height: 3.4375rem;
  background-color: var(--color-success);
  border-radius: 50%;
  margin: 0 auto;
  text-align: center;
}

.password-c {
  .title {
    .dynamic-font(@fontSize: --font-size-14, @fontWeight: --font-weight-medium);
  }

  .label {
    color: var(--color-text-80);
  }
}

.new-skin-symbol {
  .success-wrap {
    width: 3.4375rem;
    height: 3.4375rem;
    background-color: var(--ep-color-icon-success);
    border-radius: 50%;
    margin: 0 auto;
    text-align: center;
  }

  .password-c {
    .title {
      font-weight: var(--ep-font-weight-medium, 500);
      color: var(--ep-color-text-default);
      font-size: var(--ep-font-size-m, .875rem);
    }

    .label {
      color: var(--ep-color-text-warning);
    }
  }
}
</style>
