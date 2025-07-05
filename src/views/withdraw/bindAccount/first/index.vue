<script setup lang="ts">
import Input from '@/components/first/Input/index.vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import { IonPage, IonContent, IonRadio, IonRadioGroup, IonModal, IonIcon, IonImg, IonItem, IonSegment, IonSelect, IonSelectOption } from '@ionic/vue';
import useLogic from "../hooks/useLogic";
import AssetsFooter from '@/components/first/AssetsFooter.vue'
import Tab from '../../comp/Tab.vue'
import Select from '@/views/withdraw/comp/BankCardSelect.vue'
import { getTheme } from '@/theme/hooks'
import { REAL_NAME_LEN } from '../../constant'

const { theme } = getTheme()
const {
  tabList,
  typeList,
  accountInfo,
  btnDisabled,
  isSpecialCode,
  formEl,
  tabId,
  tabName,
  tabCode,
  footEl,
  distance,
  phoneCode,
  isReadonlyRealName,
  isReadonlyBANKACCOUNT,
  currentRegionCode,
  t,
  addAccount,
  selectChange,
  tabChange,
  handleInput,
  handleInputBankCard
} = useLogic()


const bankInputInfo = computed(() => {
  const info={
    type: 'bankCard',
    minLen: 1,
    maxLen: 64,
    
  }
  if(currentRegionCode.value === 'VN'){
    info.type = 'bankCardVN'
    info.minLen = 4
    info.maxLen = 19
  }
  return info
})


const getText = (phoneCode: string) => (key: string) => `${t(`hint.${key}${phoneCode}`)}`
const getHintText = getText(phoneCode.value)
</script>
<template>
  <IonPage>
    <NavigationBar :title="$t('viewsAssets.addAccount')" />
    <IonContent class="b-account">
      <Tab v-model:tab-id="tabId" :tabList="tabList" @tabChange="tabChange" />
      <div class="tip tip-1">
        <p>1.</p> {{ $t('depositWithdrawal.000017') }}
      </div>
      <div class="tip tip-2">
        <p>2.</p> {{ $t('depositWithdrawal.000018') }}
      </div>
      <div ref="formEl" :class="theme">
        <div>
          <p class="label">{{ $t('label.name') }}<span class="sign">*</span></p>
          <div class="input-area">
            <Input type="text" :placeholder="$t('hint.tipName')" ref='elObj.realNameEl' :maxlength="REAL_NAME_LEN"
              v-model="accountInfo.realName" :error-text="$t('hint.invalidName')" class="font-weight"
              @input="handleInput" :readonly="isReadonlyRealName" />
          </div>
        </div>


        <div class="item" v-if="typeList.length > 1">
          <p class="label"> {{ tabName }} <span class="sign">*</span> </p>
          <div class="input-area">
            <Select :select-list="typeList" :placeholder="$t(`hint.tipBank`)" v-model="accountInfo.code" />
          </div>

        </div>

        <div class="item" v-if="isSpecialCode">
          <p class="label">{{ tabName }} {{ $t(`label.account`) }}<span class="sign">*</span></p>
          <div class="input-area">
            <Input type="phone" :placeholder="$t(`label.${tabCode}`)" :error-text="getHintText('invalidPhone')"
              v-model="accountInfo.BANKACCOUNT" ref="elObj.BANKACCOUNTEl" :readonly="isReadonlyBANKACCOUNT"
              class="font-weight" />
          </div>
        </div>

        <div class="item" v-else>
          <p class="label">{{ tabName }} {{ $t(`label.account`) }}<span class="sign">*</span></p>
          <div class="input-area ">
            <Input :type="bankInputInfo.type" :placeholder="$t('hint.placeholderBank')" :error-text="$t('hint.invalidBank')"
              v-model="accountInfo.BANKACCOUNT" ref="elObj.BANKACCOUNTEl" class="font-weight"
              :minlength="bankInputInfo.minLen" :maxlength="bankInputInfo.maxLen" :hideCurrency="true"
              @input="handleInputBankCard" />
          </div>
        </div>

      </div>
      <!-- <div class="footer-wrap">
        <Button @Click="addAccount" :disabled="!btnDisabled"> {{ $t('viewsAssets.addAccount') }} </Button>
      </div> -->


    </IonContent>
    <AssetsFooter :disabled="!btnDisabled" ref="footEl" :isHasBottomTab="false" :btnText="t('viewsAssets.addAccount')"
      @submitForm="addAccount" />


  </IonPage>

</template>

<style scoped lang="less">
ion-content.b-account {

  --padding-start: 1.125rem;
  --padding-end: 1.125rem;
  --padding-bottom: v-bind('distance');
}

#withdraw-main-bindAccount-first-index {
  .style(@tipColor1: --ep-color-text-danger,
    @tipColor2: --ep-color-text-weaker,
    @signColor: --ep-color-danger,
    @inputBgColor: --ep-color-background-fill-surface-lowered,
    @labelColor: --ep-color-text-weaker,

  ) {
    .b-account {
      .tip {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 0.5rem;
        font-size: var(--ep-font-size-s, 0.75rem);

      }

      .tip-1 {
        color: var(@tipColor1);

      }

      .tip-2 {
        color: var(@tipColor2);
        margin: .8125rem 0 1.3125rem;
      }

      .item {
        margin-top: 1.9rem;

      }

      .text-item {
        width: 50%;
      }

      .label {
        line-height: 18px;
        margin: .375rem 0;
        color: var(@labelColor);

        .sign {
          font-weight: var(--ep-font-weight-medium, 500);
          color: var(@signColor);
          margin-left: .1875rem;
          font-size: var(--ep-font-size-m, 0.875rem);
        }


      }

      .input-area {
        width: 22.875rem;
        line-height: 2.875rem;
        background: var(@inputBgColor);
        border-radius: var(--rounded-small);

      }
    }
  }


}

.amber-purple,
.green-dark,
.yellow-dark,
.purple-light,
.blue-default,
.green-default,
.forest-green,
.auroral-yellow {
  #withdraw-main-bindAccount-first-index.style(@tipColor1: --accent-color-red,
    @tipColor2: --color-text-40,
    @signColor: --accent-color-red,
    @inputBgColor: --color-bg-400,
    @labelColor: --color-text-80);
}

.new-skin-symbol {
  #withdraw-main-bindAccount-first-index.style()
}

.new-skin-symbol {
  ion-content.b-account {
    --background: var(--ep-color-background-fill-body-default);

  }

  .label {
    line-height: 1.125rem;
    margin: .375rem 0;
    color: var(--ep-color-text-weaker);
    .sign {
      font-weight: var(--ep-font-weight-medium, 500);
      color: var(--ep-color-text-danger);
      margin-left: .1875rem;
      font-size: var(--ep-font-size-m, .875rem);
    }


  }

  .input-area {
    width: 22.875rem;
    line-height: 2.875rem;
    background: var(--ep-color-background-fill-surface-lowered);
    border-radius: var(--ep-border-radius-m);
  }

}
</style>
