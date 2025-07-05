<script setup lang="ts">

import NavigationBar from '@/components/NavigationBar/index.vue'
import { IonPage, IonContent, IonRadio, IonRadioGroup, IonModal, IonIcon } from '@ionic/vue';
import useLogic from "../hooks/useLogic";
// import { close } from 'ionicons/icons';

import Button from '@/components/first/Button/index.vue';
import useGetDarkBtnTextColor from '@/hooks/useGetDarkBtnTextColor'
import Tab from '../../comp/Tab.vue'
import useHeaderBgColor from '../../hooks/useHeaderBgColor'
import { getTheme } from '@/theme/hooks'
import BankCard from '@/views/withdraw/comp/BankCard.vue'
const btnColor = useGetDarkBtnTextColor()
const { theme } = getTheme()
const {
  relatedCode,
  modelValue,
  accountList,
  deleteIFSC,
  tabList,
  tabId,
  loading,
  isDisabled,

  closeHandle,
  modifyDefault,

  deleteAccount,
  tabChange
} = useLogic()



</script>
<template>
  <IonPage>
    <NavigationBar :title="$t('viewsAssets.myAccount')" :bgColor="useHeaderBgColor()" />
    <IonContent class="w-account" :class="theme">
      <Tab :tabList="tabList" v-model:tab-id="tabId" :disabled="loading" @tabChange="tabChange" />
      <ion-radio-group :value="relatedCode" @ionChange="modifyDefault">
        <template v-for="it in accountList">
          <BankCard :cardInfo="it" type="info">

            <template #action>
              <div class="flex-between  radio-wrap"><ion-radio class='' :disabled="isDisabled" :value="it.relatedCode"
                  mode="ios"></ion-radio> <span class="ml-0.5">{{ $t('viewsAssets.default') }}</span>
              </div>
            </template>
          </BankCard>
        </template>
      </ion-radio-group>

      <BankCard type="action" />
    </IonContent>

  </IonPage>

</template>

<style scoped lang="less">
ion-content.w-account {
  --padding-top: 1.0625rem;
  --padding-bottom: 1.0625rem;
}




#withdraw-main-withdraw-account-radio-index {

  .style(@radioCheckedBg: --ep-color-icon-default, @lineColor: --ep-color-icon-default, @checkBorderColor: --ep-color-icon-weaker,
    @markColor: --ep-color-background-fill-surface-raised-L1, @textColor: --ep-color-text-weaker) {
    .radio-wrap {
      color: var(@textColor);
      gap: 0.25rem;
      font-size: var(--ep-font-size-s, .75rem);

      ion-radio::part(container) {
        width: 1rem;
        height: 1rem;

        border-radius: 50%;
        border: 1px solid var(@lineColor);
      }

      ion-radio::part(mark) {
        background: none;
        transition: none;
        transform: none;
        border-radius: 0;
      }

      ion-radio.radio-checked::part(container) {
        background: var(@radioCheckedBg);
        border-color: var(@checkBorderColor);
      }

      ion-radio.radio-checked::part(mark) {
        width: 4px;
        height: 9px;

        border-width: 0px 2px 2px 0px;
        border-style: solid;
        border-color: var(@markColor);

        transform: rotate(45deg);
      }
    }




  }
}






.purple-light,
.amber-purple,
.auroral-yellow,
.green-default,

.blue-default,
.green-dark,
.yellow-dark {
  #withdraw-main-withdraw-account-radio-index.style(@radioCheckedBg: --color-text-100, @lineColor: --color-text-40, @checkBorderColor: --color-text-80,
    @markColor: --color-bg-200, @textColor: --color-text-80);

}

.forest-green {
  #withdraw-main-withdraw-account-radio-index.style(@radioCheckedBg: --color-text-100, @lineColor: --color-text-40, @checkBorderColor: --color-text-80,
    @markColor: --color-bg-200, @textColor: --color-text-gray-200);

}

.new-skin-symbol {
  #withdraw-main-withdraw-account-radio-index.style();

}
</style>
