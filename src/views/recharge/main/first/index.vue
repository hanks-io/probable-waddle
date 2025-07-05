<script setup lang="ts">
import {
  IonPage,
  IonIcon,
  IonSpinner,
  IonButton,
  IonContent,
  IonHeader,
} from '@ionic/vue'
import AssetsHeader from '@/components/first/AssetsHeader.vue'
import AssetsFooter from '@/components/first/AssetsFooter.vue'
import useRecharge from '../hooks/useNewRecharge'
import AmountBtnList from '../comp/AmountBtnList.vue'
import Input from '@/components/first/Input/index.vue'
import { formatMoneyToShow } from '@/utils/custom'
import NavigationBar from '@/components/NavigationBar/index.vue'
import RechargeTab from '../comp/Tab.vue'
import AssetsTab from '@/views/withdraw/comp/AssetsTab.vue'
import BannerArea from '../comp/BannerArea.vue'
import TextTip from '../comp/TextTip.vue'
import AmountInput from '../comp/AmountInput.vue'
import ActivitySwitch from '../comp/ActivitySwitch.vue'
import QRCode from '@/views/recharge/QRCode/index.vue'
import NoCycleSubTab from '@/views/recharge/main/comp/NoCycleSubTab.vue'
import NewAmountArea from '@/components/first/NewAmountArea.vue'
import BankList from '@/views/recharge/main/comp/BankList.vue'
import OrderModal from '@/views/recharge/main/comp/orderModal.vue'
import router from '@/router'



const footEl = ref(null)
const elementStore = useElementStore()

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
  theme,
  isQRCode,
  isSelectedChannel,
  bankCode,
  bankList,

  isVirtualCurrency,
  QRCodeInfo,
  bankChange,
  payChannelChange,
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
  transferSuccessCb,
  btnInfo,
  isFromActivity,
  t,
  isDefaultBanner,
} = useRecharge()

const tabBarHeight = computed(() => elementStore.tabBarHeight || 85)
const { height }
  = useElementBounding(footEl)
const BTN_MARGIN_TOP = 24
const distance = computed(() => `calc(${height.value + BTN_MARGIN_TOP}px)`)
//  第三分充值用, 没有充值按钮 
const distance2 = computed(() => `${((tabBarHeight.value + (isHasBottomTab.value ? 18 : 0)) / 16)}rem`)

const handleClickFinish = () => {
  if (isFromActivity.value) {
    router.back()
  } else {
    iframeCloseHandle()
  }

}
 
</script>
<template>
  <IonPage>
    <!-- 链接第三方显示的头部 -->
    <NavigationBar :title="`${t('main.entrar')}`" v-if="isShowThirdParty">
      <template #start>
        <ion-button class="finish" @click="handleClickFinish" fill="clear">{{ $t('main.finish')
          }}</ion-button>
      </template>
      <template #end>
        <div class="icon-area flex-center" :class="[theme]"><ion-icon slot="icon-only" class="record"
            @click="recordHandle" src="/first/svg/assets/record.svg" /></div>
      </template>
    </NavigationBar>

    <IonHeader mode="ios" v-else>

      <AssetsHeader :contentText="`${t('main.entrar')}`" :isShowCloseicon="showCloseBtn" @recordHandle="recordHandle" />


    </IonHeader>
    <IonContent class="recharge-qr-code" v-if="isQRCode">
      <QRCode v-bind="{ ...QRCodeInfo, merchantCy: merchantCy || '' }" />
    </IonContent>

    <!-- 充值页面 -->
    <IonContent v-if="!isShowThirdParty" :class="['first-content']">







      <RechargeTab :tab-id="tabId" :loading="channelLoading" :tabList="tabList" @tabChange="mainTabChange" />
      <template v-if="isSelectedChannel">
        <div class="sub-tab-wrap">
          <NoCycleSubTab :title="$t('viewsAssets.payment')" @tabChange="subTabChange" :tabList="subTabList"
            v-model:tab-id="subTabId" />
          <div class="text-center">
            <ion-spinner class="ml-[14px] mt-[15px]" name="bubbles" v-if="channelLoading" />
          </div>
          <template v-if="channelList.length && !channelLoading">
            <NoCycleSubTab :title="$t('viewsAssets.depositChannels')" type="channel" :tabList="channelList"
              v-model:tab-id="channelId" @tabChange="payChannelChange" />
            <BankList :bankList="bankList" @bankChange="bankChange" v-model:bankCode="bankCode" />
          </template>
        </div>

        <NewAmountArea :isVirtualCurrency="isVirtualCurrency" :amountInput="amountInput" :merchantCy="merchantCy">

          <template #textTip>
            <TextTip :isParticipate="isParticipate" :limitPlatformList="limitPlatformList"
              :withdrawFlowStr="withdrawFlowStr" :description="description" />
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

        <AssetsTab :title="$t('viewsAssets.payment')" :tabList="subTabList" v-model:tab-id="subTabId"
          @tabChange="subTabChange" class="px-12 pay-channe" type="sub-tab" />
        <AmountInput>

          <template #amount>
            <Input v-model="amountInput" type='recharge' :placeholder="placeholder" mode="ios" :noBonus="!isHasBonus"
              :isInteger="true" :readOnly="readOnly" @input="amountInputChange" :maxAmount="maxAmount"
              :minAmount="minAmount" :extra="`${formatMoneyToShow(amountOfGift)}`" />
          </template>
        </AmountInput>
        <TextTip :isParticipate="isParticipate" :limitPlatformList="limitPlatformList"
          :withdrawFlowStr="withdrawFlowStr" :description="description" style="padding: 0 0.75rem;" />
        <div class="AmountBtnList-wrap">
          <AmountBtnList :amountBtnList="amountList" :amountInput="amountInput" @amountHandle="amountHandle"
            :isVirtualCurrency="isVirtualCurrency" />
        </div>


      </template>






      <BannerArea :merchantCy="merchantCy" :bannerUrl="bannerUrl" :amountOfGift="amountOfGift" :rateOfGift="rateOfGift"
        @clickHandle="bannerHandle" :isDefaultBanner="isDefaultBanner" v-show="isParticipate" />

      <ActivitySwitch v-if="activityIsOpen" v-model:isParticipate="isParticipate"
        @handleSwitch="handleRechargeActivity" />


    </IonContent>

    <AssetsFooter v-if='!isShowThirdParty' :merchantCy="merchantCy" :amount="amountInput" :disabled="btnInfo.disabled"
      ref="footEl" :textContent="$t('viewsAssets.TDR')" :isHasBottomTab="isHasBottomTab" :btnText="btnInfo.btnText"
      @submitForm="handleBtnClick" />

    <!-- 第三方iframe页面 -->
    <ion-content id="iframe" :class="['third-content', { hidden: !thirdUrl }]">
      <iframe class="w-full h-full" id="iframe-content" v-if="thirdUrl" v-show="iframeLoaded" :src="thirdUrl"
        @load="iframeLoadHandle" @error="btnLoading = false" frameborder="0" />
      <div class="flex items-center justify-center h-full" v-if="!iframeLoaded">
        <ion-spinner class="w-20 h-20" name="dots" color="light" />
      </div>
    </ion-content>

    <OrderModal :isOpen="isOpenOrderModal" :merchantCy="merchantCy" :isVirtualCurrency="isVirtualCurrency"
      v-if="isOpenOrderModal" @paySuccessCb="transferSuccessCb" />






  </IonPage>
</template>

<style scoped lang="less">
ion-content.first-content {
  --background: var(--ep-color-background-fill-body-default, var(--color-bg-300));
  --padding-bottom: v-bind('distance');
}

ion-content.third-content {
  --background: var(--ep-color-background-fill-body-default, var(--color-bg-300));
  --padding-bottom: v-bind('distance2');
}

ion-content.recharge-qr-code {
  --background: var(--ep-color-background-fill-body-default, var(--color-bg-300));
  --padding-bottom: v-bind('distance2');

}


ion-button.finish {
  --color: var(--text-color-white-100)
}

ion-content#iframe {
  --background: #FFF;
}

.icon-area {
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  .bg-link();


  ion-icon.record {
    .font-size(--font-size-16);
    .color-text-100();

  }
}





.pay-channe {
  margin-top: .75rem;

}





::-webkit-scrollbar {
  display: none !important;
  width: 0px;
  height: 0px;
}

.icon-area.purple-light {
  background-color: var(--text-color-black-100);

  ion-icon.record {
    color: var(--text-color-white-100);
  }
}

.icon-area.amber-purple {
  background-color: var(--theme-color-800);
}

.new-skin-symbol {
  ion-button.finish {
    --color: var(--ep-color-text-default)
  }

  ion-icon.record {
    color: var(--ep-color-icon-default);
  }

}

.AmountBtnList-wrap {
  width: 23.125rem;
  margin: .625rem auto 0;
}

.sub-tab-wrap {
  width: 22.875rem;
  ;
  margin: 0 auto;
}
</style>
