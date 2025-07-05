<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonHeader,
} from '@ionic/vue'
import AssetsHeader from '@/components/first/AssetsHeader.vue'
import AssetsFooter from '@/components/first/AssetsFooter.vue'
import useWLogic from '../hooks/useLogic'
import { useElementBounding } from '@vueuse/core'
import AssetsTab from '../../comp/AssetsTab.vue'
import Input from '@/components/first/Input/index.vue'
import { WithdrawPageType } from '@/hooks/useWithdraw'
import FormInfo from '../comp/withdrawalMethod/First.vue'
import BindAccount from '../comp/BindAccount.vue'
import BalanceArea from '../comp/BalanceArea.vue'
import AmountBtnList from '../comp/AmountBtnList.vue'
import FeeTip from '../comp/FeeTip.vue'
import ConfirmModal from '../comp/ConfirmModal.vue'
import WithdrawHint from '../comp/WithdrawHint.vue'
import { getTheme } from '@/theme/hooks';
import { formEl, accountEl, subTabCode } from '@/views/withdraw/main/hooks/useUserInputData'
import NewAmountArea from '@/components/first/NewAmountArea.vue'
import NewBalanceArea from '@/views/withdraw/main/comp/BindBalanceArea.vue'
const { theme } = getTheme();
const { t } = useI18n() // 国际化

const footEl = ref(null)

const {
  amountInput,
  rateValue,
  isHasBottomTab,
  showCloseBtn,
  tabList,
  tabId,
  merchantCy,
  balance,
  isDemo,
  prompt,
  betAmount,
  readonly,
  placeholder,
  amountList,
  withdrawalConfig,
  isBindFirst,
  remind,
  assets,
  rateType,
  hintIndex,
  demoWithdraw,
  confirmModalVisible,
  subTabList,
  subTabId,
  maxAmount,
  minAmount,
  tabTagInfo,
  accountList,
  receiveAmount,
  bindAccountMax,
  btnText,
  rechargeRatio,
  isVirtualCurrency,
  isHideAuditRecords,
  recordHandle,
  mainTabChange,
  amountInputChange,
  amountHandle,
  subTabChange,
  modalDismiss,
  passwordHandle,
  onWithdrawCreate,
  handleBtnClick,
} = useWLogic()

const setMaxValue = () => {
  const floorBalance = (balance: string | number) => {
    return Math.floor(Number(balance)).toString()
  }
  amountInput.value = maxAmount.value > balance.value ? `${floorBalance(balance.value)}` : `${floorBalance(maxAmount.value)}`

}
const { height }
  = useElementBounding(footEl)
const distance = computed(() => `${((height.value) * (isHasBottomTab.value ? 1.1 : 3)) / 16}rem`)
const btnDisabled = computed(() => {
  if (isDemo.value) return false
  if (Number(amountInput.value) <= 0) return false
  const disabledConditions = {
    'demo': () => isDemo.value,
    'amount': () => Number(amountInput.value) <= 0,

  }
  const disabled = Object.values(disabledConditions).some(condition => condition())
  if (disabled) return false
  if (isBindFirst.value && !accountList.value.length) return true
  return Number(amountInput.value) < Number(minAmount.value)


})





</script>
<template>
  <IonPage>
    <IonHeader mode="ios">
      <AssetsHeader :contentText="`${t('main.withdraw')}`" :isShowCloseicon="showCloseBtn"
        @recordHandle="() => recordHandle(WithdrawPageType.WITHDRAW_RECORD)" :isAlone="isBindFirst" />
    </IonHeader>

    <ion-content :class="['first-content', theme]">
      <div class="header-bottom-area" v-if="!isBindFirst">
        <div class="line"></div>
        <AssetsTab :tabList="tabList" v-model:tab-id="tabId" type="main-tab"
          :title="$t('viewsAssets.WithdrawalChannels')" activeBgColor="--color-bg-100" @tabChange="mainTabChange" />
        <BalanceArea :merchantCy="merchantCy" :isHideAuditRecords="isHideAuditRecords" :betAmount="betAmount"
          :balance="balance" :isDemo="isDemo" :prompt="prompt"
          @recordHandle="recordHandle(WithdrawPageType.WITHDRAW_AUDIT)" />
        <div class="input-wrap">
          <Input type="withdraw" v-model="amountInput" :readonly="readonly" :placeholder="placeholder"
            @setMaxValue="setMaxValue" @input="amountInputChange" :error-text="$t('toast.0003')" />
        </div>
        <AmountBtnList :amountList="amountList"  :isVirtualCurrency="isVirtualCurrency"  :amount="amountInput" @amountHandle="amountHandle" :balance="balance" />
        <FeeTip :amountInput="amountInput" :merchantCy="merchantCy" :rateValue="rateValue" :remind="remind" />
      </div>
      <div v-if="isBindFirst" class="mt-[0.75rem]">
        
        <NewBalanceArea :betAmount="betAmount" :balance="balance" :isHideAuditRecords="isHideAuditRecords"
          @recordHandle="recordHandle(WithdrawPageType.WITHDRAW_AUDIT)" />

        <!-- 提现类型选项卡 -->
        <div class="mt-[0.75rem] mb-[1.5rem] wrapper-tab">
          <AssetsTab :tabList="tabList" v-model:tab-id="tabId" @tabChange="mainTabChange" type="sub-tab"
            :isNew="true" />
        </div>


        <NewAmountArea :rechargeRatio="rechargeRatio" :isVirtualCurrency="isVirtualCurrency" :amountInput="amountInput"
          :merchantCy="merchantCy" :rateValue="rateValue" type="withdraw" >


          <template #amountBtn>
            <AmountBtnList :amountList="amountList" :isVirtualCurrency="isVirtualCurrency"  :amount="amountInput" @amountHandle="amountHandle"
              :balance="balance" />
          </template>
          <template #amountInput>
            <Input type="withdraw" v-model="amountInput" :readonly="readonly" :placeholder="placeholder"
              @setMaxValue="setMaxValue" @input="amountInputChange" :error-text="$t('toast.0003')" />
          </template>

        </NewAmountArea>

        <BindAccount :accountList="accountList" :bindAccountMax="bindAccountMax" ref="accountEl" />
      </div>
      <template v-else>
        <div class="m-b">
          <AssetsTab :title="$t('label.withdrawSubType')" :tabList="subTabList" v-model:tab-id="subTabId"
            :tagInfo="tabTagInfo" @tabChange="subTabChange" type="sub-tab" />
        </div>
        <FormInfo :dynamicType="subTabCode" ref="formEl" :typeId="tabId" />
      </template>

    </ion-content>
    <AssetsFooter :merchantCy="merchantCy" :disabled="btnDisabled" ref="footEl" :textContent="$t('viewsAssets.receive')"
      :isHasBottomTab="isHasBottomTab" :btnText="btnText" @submitForm="handleBtnClick" />
    <!-- 确认提现弹窗 -->
    <ConfirmModal v-model:visible="confirmModalVisible" :merchantCy="merchantCy" :amountInput="amountInput"
      :rateValue="rateValue" :rateType="rateType" :receiveAmount="receiveAmount"
      :passwordSwitch="assets?.passwordSwitch" @passwordHandle="passwordHandle" @onWithdrawCreate="onWithdrawCreate" />



    <!-- 体验金无法提现弹窗  -->
    <WithdrawHint v-model:visible="demoWithdraw" :hintIndex="hintIndex" />

  </IonPage>
</template>

<style scoped lang="less">
#withdraw-main-first-home-index {

  .style(@bgColor: --ep-color-background-fill-surface-raised-L1,
    @inputBg: var--ep-color-background-fill-surface-lowered,
    @lineColor: --ep-color-border-default,

  ) {
    .header-bottom-area {
      width: 100%;
      background: var(@bgColor);
      padding: 0 .75rem;
      border-radius: 0 0 var(--eq-border-radius-xl, .625rem) var(--eq-border-radius-xl, .625rem);

      .line {
        width: 100%;
        height: 1px;
        margin-bottom: 12px;
        background-color: var(@lineColor);
      }

      .input-wrap {
        height: 2.875rem;
        width: 22.875rem;
        margin-bottom: 1.5rem;
        background: var(@inputBg);
        border-radius: var(--eq-border-radius-s, .25rem);

      }

    }

    ion-content.first-content {
      --padding-bottom: v-bind('distance');
    }

    .wrapper-tab {
      width: 22.875rem;
      margin: 0.75rem auto 1.5rem;
    }

    .m-b {
      margin-top: 1rem;
      margin-bottom: .75rem;
      padding-left: .75rem;
    }
  }
}

.new-skin-symbol {

  #withdraw-main-first-home-index.style()
}

.amber-purple {
  #withdraw-main-first-home-index.style(@bgColor: --color-bg-100, @inputBg: --color-bg-400, @lineColor: --color-line)
}

.purple-light {
  #withdraw-main-first-home-index.style(@bgColor: --color-bg-500, @inputBg: --color-bg-400, @lineColor: --color-line)
}

.green-dark,
.yellow-dark {
  #withdraw-main-first-home-index.style(@bgColor: --color-bg-200, @inputBg: --color-bg-300, @lineColor: --color-line)
}

.new-skin-symbol {
  .header-bottom-area {
    width: 100%;
    background-color: var(--ep-color-background-fill-surface-raised-L1);
    padding: 0 .75rem;
    border-radius: 0 0 var(--ep-border-radius-xl, .625rem) var(--ep-border-radius-xl, .625rem);

    .line {
      width: 100%;
      height: 1px;
      margin-bottom: 12px;
      background-color: var(--ep-color-border-default);
    }

    .input-wrap {
      height: 2.875rem;
      width: 22.875rem;
      margin-bottom: 1.5rem;
      background: var(--ep-color-background-fill-surface-lowered);
      border-radius: var(--ep-border-radius-s, .25rem);

    }

  }

  ion-content.first-content {
    --background: var(--ep-color-background-fill-body-default);
    --padding-bottom: v-bind('distance');
  }

  .m-b {
    margin-top: 1rem;
    margin-bottom: .75rem;
    padding-left: .75rem;
  }

}
</style>
