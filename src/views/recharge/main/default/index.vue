<!-- 充值 -->
<script setup lang="ts">
import {
  IonPage,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonSpinner,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonTitle,

} from "@ionic/vue";
import Input from '@/components/first/Input/index.vue'
import BackButton from "@/components/BackButton.vue";
import { formatMoneyToShow } from "@/utils/custom";
import AmountBtnList from '../comp/AmountBtnList.vue'
import useRecharge from '../hooks/useNewRecharge'
import BannerArea from '../comp/BannerArea.vue'
import RechargeTab from '../comp/TabDefault.vue'
import SubTab from '../comp/SubTabDefault.vue'
import TextTip from '../comp/TextTipDefault.vue'
import AssetsSubmitBtn from '@/components/button/AssetsSubmitBtn.vue'
import { handleAssetsKeydown } from '@/utils/keydownEvent'
import QRCode from '@/views/recharge/QRCode/index.vue'
import ActivitySwitch from '../comp/ActivitySwitch.vue'
import NoCycleSubTab from '@/views/recharge/main/comp/NoCycleSubTab.vue'
import NewAmountArea from '@/components/first/NewAmountArea.vue'
import BankList from '@/views/recharge/main/comp/BankList.vue'
import OrderModal from '@/views/recharge/main/comp/orderModal.vue'
const {
  isShowThirdParty,
  isHasBottomTab,
  showCloseBtn,
  channelLoading,
  isParticipate,
  thirdUrl,
  tabId,
  tabList,
  description,
  subTabList,
  subTabId,
  amountInput,
  placeholder,
  maxAmount,
  minAmount,
  readOnly,
  channelList,
  channelId,
  amountList,
  isHasBonus,
  activityIsOpen,
  amountOfGift,
  rateOfGift,
  bannerUrl,
  merchantCy,
  withdrawFlowStr,
  limitPlatformList,
  btnLoading,
  iframeLoaded,

  isOpenOrderModal,
  expireTime,
  isQRCode,
  QRCodeInfo,
  isSelectedChannel,

  isVirtualCurrency,
  bankList,
  bankCode,
  subTabChange,
  iframeCloseHandle,
  recordHandle,
  mainTabChange,
  amountInputChange,
  amountHandle,
  handleRechargeActivity,
  bannerHandle,
  iframeLoadHandle,
  handleBtnClick,
  payChannelChange,
  bankChange,
  transferSuccessCb,
  t,
  isDefaultBanner,
  btnInfo,
} = useRecharge()



const elementStore = useElementStore();
const paddingBottom = computed(() => `calc(${elementStore.tabBarHeight}px + 1rem + env(safe-area-inset-bottom))`)                      // 底部导航栏高度

const handleKeydown = (event: KeyboardEvent) => {
  handleAssetsKeydown(event, 'recharge')
}


</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-button class="finish" v-if="isShowThirdParty && isHasBottomTab" @click="iframeCloseHandle" fill="clear">{{
          $t("main.finish") }}</ion-button>

        <BackButton v-if="showCloseBtn" />

        <ion-title class="text-lg">{{ $t(`main.entrar`) }}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="recordHandle">
            <ion-icon slot="icon-only" class="h-5 record" src="/svg/record.svg" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="!isShowThirdParty" class="recharge-content">
      <!-- 充值类型列表 -->
      <RechargeTab v-model:tab-id="tabId" :loading="channelLoading" :tabList="tabList" @tabChange="mainTabChange" />

      <template v-if="isSelectedChannel">

        <NoCycleSubTab :title="$t('viewsAssets.payment')" @tabChange="subTabChange" :tabList="subTabList"
          v-model:tab-id="subTabId" />
        <div class="text-center">
          <ion-spinner class="ml-[14px] mt-[15px]" name="bubbles" v-if="channelLoading" />
        </div>
        <template v-if="channelList.length && !channelLoading">
          <NoCycleSubTab  :title="$t('viewsAssets.depositChannels')"
            type="channel" :tabList="channelList" v-model:tab-id="channelId" @tabChange="payChannelChange" />
          <BankList :bankList="bankList" @bankChange="bankChange" v-model:bankCode="bankCode" />
        </template>


        <NewAmountArea  :isVirtualCurrency="isVirtualCurrency" :amountInput="amountInput"
        :merchantCy="merchantCy">

          <template #textTip>
            <TextTip :isParticipate="isParticipate" :limitPlatformList="limitPlatformList"
              :withdrawFlowStr="withdrawFlowStr" />
          </template>
          <template #amountBtn>
            <AmountBtnList :amountBtnList="amountList" :amountInput="amountInput" @amountHandle="amountHandle"
              :isVirtualCurrency="isVirtualCurrency" />
          </template>
          <template #amountInput>
            <Input v-model="amountInput" type='recharge' :placeholder="placeholder" mode="ios" :noBonus="!isHasBonus"
              :isInteger="true" :readOnly="readOnly" @input="amountInputChange" :maxAmount="maxAmount"
              :minAmount="minAmount" :extra="`${formatMoneyToShow(amountOfGift)}`" />
          </template>

        </NewAmountArea>



      </template>
      <template v-else>
        <!-- 充值方法列表 -->
        <SubTab :tabList="subTabList" v-model:tab-id="subTabId" @tabChange="subTabChange" />
    

        <div class="line" />

        <!-- 充值提示 -->
        <h6 class="text-description">
          <span v-if="!isParticipate">
            {{ description }}
          </span>
        </h6>
        <!-- 充值金额输入框 -->
        <ion-input class="money-input" v-model="amountInput" type="number" mode="ios" :readOnly="readOnly"
          :placeholder="placeholder" required clearInput @ionInput="amountInputChange" @keydown="handleKeydown">
          <label slot="start" class="left-label">{{ merchantCy }}</label>
          <span slot="end" v-if='isHasBonus' class="gift">
            <span>
              {{ $t("tags.GIVE_AWAY") }}
              <span class="bonus">{{ `+${formatMoneyToShow(amountOfGift)}` }}</span>
            </span>
          </span>
        </ion-input>

        <!-- 提现打码提示 -->
        <TextTip :isParticipate="isParticipate" :limitPlatformList="limitPlatformList"
          :withdrawFlowStr="withdrawFlowStr" />
        <!-- 优惠-充值金额按钮列表 -->
        <AmountBtnList :amountBtnList="amountList" :amountInput="amountInput" @amountHandle="amountHandle"
          :isVirtualCurrency="isVirtualCurrency" />
      </template>

      <BannerArea :merchantCy="merchantCy" :bannerUrl="bannerUrl" :amountOfGift="amountOfGift" :rateOfGift="rateOfGift"
        :isDefaultBanner="isDefaultBanner" @clickHandle="bannerHandle" v-show="isParticipate" />

      <ActivitySwitch v-if="activityIsOpen" v-model:isParticipate="isParticipate"
        @handleSwitch="handleRechargeActivity" />


      <AssetsSubmitBtn :btnText="btnInfo.btnText" @submit="handleBtnClick" />





    </ion-content>
    <IonContent class="recharge-qr-code" v-if="isQRCode">
      <QRCode v-bind="{ ...QRCodeInfo, merchantCy: merchantCy || '' }" />
    </IonContent>

    <ion-content id="iframe" :class="[{ hidden: !thirdUrl || isQRCode }]">
      <iframe class="w-full h-full" v-if="thirdUrl" v-show="iframeLoaded" :src="thirdUrl" @load="iframeLoadHandle"
        @error="btnLoading = false" frameborder="0" />
      <div class="flex items-center justify-center h-full" v-if="!iframeLoaded">
        <ion-spinner class="w-20 h-20" name="dots" color="light" />
      </div>
    </ion-content>

    <OrderModal :isOpen="isOpenOrderModal" :merchantCy="merchantCy" :isVirtualCurrency="isVirtualCurrency"
    v-if="isOpenOrderModal" @paySuccessCb="transferSuccessCb" />

  </ion-page>
</template>

<style scoped lang="less">
/* 公共样式 */
ion-content {
  --padding-bottom: v-bind('paddingBottom');
  --padding-start: .9375rem;
  --padding-end: .9375rem
}


ion-content#iframe {
  --background: #fff;
}

:global(ion-input.money-input label div input::placeholder) {
  font-size: .75rem;
}

#recharge-main-default-index {
  .style(@finishColor: var(--color-text-white-100), @descTextColor: --color-text-gray-100, @inputBg: --color-bg-200, @checkboxTextColor: --color-text-white-100, @placeholderColor: --color-text-gray-200, @inputColor: --color-text-gray-100) {
    ion-button.finish {
      --color: var(@finishColor);
    }

    .text-description {
      line-height: .9375rem;
      font-size: .875rem;
      color: var(@descTextColor)
    }

    .line {
      background: var(--color-line);
      height: .0625rem;
      margin-top: .9375rem;
    }

    ion-input.money-input {
      /* 输入框样式 */
      --placeholder-opacity: 1;
      --padding-bottom: 0;
      --padding-start: 0.625rem;
      --padding-end: 0.625rem;
      --padding-top: 0;
      --color: var(--color-text-white-100);
      --placeholder-color: var(@placeholderColor);
      --background: var(@inputBg);
      overflow: hidden;
      border-radius: var(--rounded-middle);
      font-size: 0.875rem;
      height: 3.125rem;
      margin: 1.125rem 0;


      .left-label {
        margin-inline-end: .3125rem;
        color: var(@inputColor);
      }

      .gift {
        font-size: var(--font-size-16);
        color: var(@inputColor);

        .bonus {
          color: var(--color-success)
        }
      }
    }


    .checkbox-area {
      margin: .5625rem 0;
      font-size: .875rem;

      .text {
        color: var(@checkboxTextColor);
      }
    }

  }

  .checkBoxstyle(@checkedColor: --theme-color-800, @bgColor: --color-bg-300, @borderColor: --line-color, @checkmarkColor: --color-text-100, @color: --color-text-100) {


    ion-checkbox {
      --size: 16px;
      --border-width: 0px;
      --border-color-checked: #6815ec;
      --checkbox-background-checked: var(@checkedColor);
      --checkbox-background: var(@bgColor);
      --border-color: var(@borderColor);
      --checkmark-color: var(@checkmarkColor);
      --checkmark-width: 4px;
      --border-radius: 4px;
      --color: var(@color);
      margin-inline-end: 0;
    }

    ion-checkbox::part(container) {
      padding: 0.125rem;
      border-radius: 4px;
      border: 2px solid var(@borderColor);
    }

  }
}

#recharge-main-default-index.style();

/* 绿色皮肤单独样式 */
.green-default,
.green-v01,
.green-v02 {
  #recharge-main-default-index.style(@inputBg: --color-bg-400, @checkboxTextColor: --color-text-gray-100);
}



/* 琥珀紫皮肤单独样式 */
.amber-purple {
  #recharge-main-default-index.style(@finishColor: --text-color-light-purple-1-100, @descTextColor: --text-color-light-purple-1-100, @inputBg: --color-bg-400, @checkboxTextColor: --text-color-light-purple-1-100, @placeholderColor: --text-color-light-purple-2-100, @inputColor: --text-color-light-purple-1-100);

  ion-header {
    background: var(--color-bg-100);

    .record {
      color: var(--text-color-light-purple-1-100);
    }
  }

  #recharge-main-default-index.checkBoxstyle(@checkedColor: --theme-color-700, );




}

.auroral-yellow {
  #recharge-main-default-index.style(@checkboxTextColor: --color-text-gray-200);
  #recharge-main-default-index.checkBoxstyle(@checkmarkColor: --color-text-black-100);

}
</style>
