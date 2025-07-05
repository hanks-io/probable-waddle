<!-- 提现 -->
<script setup lang="ts">
import BackButton from "@/components/BackButton.vue";
import { informationCircleOutline } from "ionicons/icons";
import { WithdrawPageType } from "@/hooks/useWithdraw";
import { formatMoneyToShow } from '@/utils/custom'
import { IonPage, IonIcon, IonHeader, IonToolbar, IonContent, IonButtons, IonButton, IonInput, IonTitle } from "@ionic/vue";
import useWLogic from '../hooks/useLogic'
import AssetsTab from '@/views/withdraw/comp/AssetsTab.vue'
import BindAccount from '../comp/BindAccount.vue'
import BalanceArea from '../comp/BalanceArea.vue'
import FormInfo from '../comp/withdrawalMethod/Default.vue'
import AssetsSubmitBtn from '@/components/button/AssetsSubmitBtn.vue'
import AmountBtnList from '../comp/AmountBtnList.vue'
import ConfirmModal from '../comp/ConfirmModal.vue'
import WithdrawHint from '../comp/WithdrawHint.vue'
import { handleAssetsKeydown } from '@/utils/keydownEvent'
import { formEl, accountEl, subTabCode } from '@/views/withdraw/main/hooks/useUserInputData'
import NewAmountArea from '@/components/first/NewAmountArea.vue'
import NewBalanceArea from '@/views/withdraw/main/comp/BindBalanceArea.vue'
import Input from '@/components/first/Input/index.vue'
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
  rechargeRatio,
  isVirtualCurrency,
  remind,
  assets,
  rateType,
  hintIndex,
  demoWithdraw,
  confirmModalVisible,
  subTabList,
  subTabId,
  receiveAmount,
  accountList,
  bindAccountMax,
  btnText,
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
  t
} = useWLogic()

const amountInputRef = ref()
/**
 * @description 添加错误提示
 */
const addErrTip = () => {
  amountInputRef.value.$el.classList.add('ion-invalid', 'ion-touched')
}

/**
 * @description 移除成功
 */
const removeStatus = () => {
  amountInputRef.value.$el.classList.remove('ion-valid', 'ion-invalid', 'ion-touched')
}

const handleInput = (event: CustomEvent) => {
  const value = event.detail.value
  const isInteger = Number.isInteger(Number(value))
  console.log(isInteger, 'isInteger')
  if (!isInteger) {
    addErrTip()
    return
  } else {
    removeStatus()
  }
  amountInputChange(event)
}

const elementStore = useElementStore();
const paddingBottom = computed(() => `calc(${elementStore.tabBarHeight}px + 1rem + env(safe-area-inset-bottom))`)                       // 底部导航栏高度
</script>
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton v-if="showCloseBtn" />
        <ion-title class="text-lg">{{ $t(`main.withdraw`) }}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="recordHandle(WithdrawPageType.WITHDRAW_RECORD)">
            <ion-icon slot="icon-only" class="h-5" src="/svg/record.svg" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <template v-if="isBindFirst">
        <NewBalanceArea :betAmount="betAmount" :balance="balance" :isHideAuditRecords="isHideAuditRecords"
          @recordHandle="recordHandle(WithdrawPageType.WITHDRAW_AUDIT)" />

        <!-- 提现类型选项卡 -->
        <div class="mt-[0.75rem] mb-[1.5rem]">
          <AssetsTab :tabList="tabList" v-model:tab-id="tabId" @tabChange="mainTabChange" type="sub-tab" :isNew="true" />
        </div>


        <NewAmountArea :rechargeRatio="rechargeRatio" :isVirtualCurrency="isVirtualCurrency" :amountInput="amountInput"
          :merchantCy="merchantCy" :rateValue="rateValue" type="withdraw" >
          <template #amountBtn>
            <AmountBtnList :amountList="amountList" :isVirtualCurrency="isVirtualCurrency"  :amount="amountInput" @amountHandle="amountHandle"
              :balance="balance" />
          </template>
          <template #amountInput>
            <ion-input v-model="amountInput" :readonly="readonly" type="number" mode="ios" :placeholder="placeholder"
              required clearInput @ionInput="handleInput" @keydown="handleAssetsKeydown" :error-text="$t('toast.0003')"
              ref="amountInputRef">
              <label class="label text-base mx-[10px]" slot="label">{{ merchantCy }}</label>
            </ion-input>
          </template>

        </NewAmountArea>

        <BindAccount :accountList="accountList" :bindAccountMax="bindAccountMax" ref="accountEl" />
      </template>
      <template v-else>
        <BalanceArea :merchantCy="merchantCy" :isHideAuditRecords="isHideAuditRecords" :betAmount="betAmount"
          :balance="balance" :isDemo="isDemo" :prompt="prompt"
          @recordHandle="recordHandle(WithdrawPageType.WITHDRAW_AUDIT)" />
        <!-- 提现类型选项卡 -->
        <AssetsTab :tabList="tabList" v-model:tab-id="tabId" @tabChange="mainTabChange" type="main-tab"  />
        <div class="line h-[1px] mt-2.5" v-if="amountList.length > 0" />
        <h6 class="text-sm mt-1.5" v-if="amountList.length > 0">{{ $t("label.withdrawAmount") }}</h6>
        <!-- 充值金额按钮列表 -->
        <AmountBtnList :amountList="amountList" :isVirtualCurrency="isVirtualCurrency"  :amount="amountInput" @amountHandle="amountHandle" :balance="balance" />

        <!-- 计算手续费 -->
        <h6 class="flex items-center mt-0 text-xs tips" v-if="amountInput">
          <ion-icon class="help text-base mr-0.5" :icon="informationCircleOutline" />
          <span>{{ $t("viewsAssets.withdrawalFee") }} {{ formatMoneyToShow(rateValue) }} {{
            $t("viewsAssets.handlingFee")
          }}</span>
        </h6>

        <!-- 提现金额输入框 -->
        <div class="item-row">
          <ion-input v-model="amountInput" :readonly="readonly" type="number" mode="ios" :placeholder="placeholder"
            required clearInput @ionInput="handleInput" @keydown="handleAssetsKeydown" :error-text="$t('toast.0003')"
            ref="amountInputRef">
            <label class="label text-base mx-[10px]" slot="label">{{ merchantCy }}</label>
          </ion-input>
        </div>
        <h6 class="text-[.625rem]" v-html="remind"></h6>
        <div class="line h-[1px] mt-2.5" />



        <AssetsTab :title="$t('label.withdrawSubType')" :tabList="subTabList" v-model:tab-id="subTabId"
          @tabChange="subTabChange" type="sub-tab" />

        <FormInfo :dynamicType="subTabCode" ref="formEl" :typeId="tabId" />
      </template>

      <!-- 提交订单按钮 -->
      <AssetsSubmitBtn :btnText="btnText" @submit="handleBtnClick" />

    </ion-content>
    <!-- 确认提现弹窗 -->

    <!-- 确认提现弹窗 -->
    <ConfirmModal v-model:visible="confirmModalVisible" :merchantCy="merchantCy" :amountInput="amountInput"
      :rateValue="rateValue" :rateType="rateType" :receiveAmount="receiveAmount"
      :passwordSwitch="assets?.passwordSwitch" @passwordHandle="passwordHandle" @onWithdrawCreate="onWithdrawCreate" />

    <WithdrawHint v-model:visible="demoWithdraw" :hintIndex="hintIndex" />

  </ion-page>
</template>

<style scoped lang="less">
ion-content {
  --padding-bottom: v-bind('paddingBottom');
}

.item-row {
  background-color: var(--color-bg-input);
  border-radius: 0.375rem;
  height: 2.5rem;
  width: 100%;
  padding-left: 0.5rem;
  margin-top: 0rem;
  margin-bottom: 1.3125rem;

}

ion-input {
  min-height: 2.5rem !important;
  font-size: 0.875rem !important;
  --border-width: 0px !important;

}

.amber-purple {


  .item-row {
    background-color: var(--color-bg-400);

  }

  .label {
    color: var(--text-color-light-purple-1-100);
  }

  ion-input {
    --placeholder-color: var(--text-color-light-purple-2-100);
    --placeholder-opacity: 1
  }

}

h6.tips,
p.label {
  color: var(--color-text-blur);
}


.tips span,
ion-icon.help {
  color: var(--color-text-href);
}

label.label,
span.label {
  color: var(--color-text-label-basic);
}

div.line {
  background: var(--color-line);
}
</style>
