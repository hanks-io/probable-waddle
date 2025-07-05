<template>
  <ion-modal ref="rechargeModal" :is-open="visible" :backdrop-dismiss="false">
    <div class="recharge-modal-conten">
      <!-- 标题 -->
      <div class="flex items-center justify-between recharge-modal-title">
        {{ $t('viewsActivity.rechargePromotion15') }}
        <ion-icon class="recharge-modal-close" :src="close" @click="closeClick" />
      </div>
      <!-- 充值信息 -->
      <div class="recharge-modal-info ">
        {{ $t('label.deposit') }}
        <span class="info-amount">
          <span class="info-amount-merchantCy">{{ merchantCy }}</span>
          {{ formatMoneyToShow(props?.rechargeItemInfo?.rechargeAmount) }}
        </span>
        {{ $t('activity.rewardLabel') }}
        <span class="info-reward">
          {{ merchantCy }}
          {{ formatMoneyToShow(props?.rechargeItemInfo?.rewardAmount) }}
        </span>
      </div>
      <!-- 越南盾转换 -->
      <div v-if="isGameAmount" class="recharge-modal-info mt-[-0.75rem]">
        {{ $t('viewsActivity.rechargePromotion22') }} 
        <span class="info-reward">≈ {{ formatMoneyToShow(vietnamRechargeAmount) }} {{ merchantCy }}</span>
      </div>


      <!-- 充值大类 -->
      <component :is="componentsTab" v-model:tab-id="tabId" :loading="channelLoading" :tabList="tabList"
        @tabChange="mainTabChange" />
      <!-- <RechargeTabDefault v-model:tab-id="tabId"  :loading="channelLoading" :tabList="tabList" @tabChange="mainTabChange" /> -->
      <!-- 充值小类 -->
      <NoCycleSubTab :title="$t('viewsAssets.payment')" @tabChange="subTabChange" :tabList="subTabList"
        v-model:tab-id="subTabId" />
      <div class="text-center">
        <ion-spinner class="ml-[14px] mt-[15px]" name="bubbles" v-if="channelLoading" />
      </div>
      <template v-if="channelList.length && !channelLoading">
        <NoCycleSubTab :title="$t('viewsAssets.depositChannels')" type="channel" :tabList="channelList"
          v-model:tab-id="channelId" @tabChange="handlePayChanelChange" />

      </template>
      <!-- 越南银行下拉选择 -->

      <RechargeBankSelect v-if="bankList.length" :activeBankInfo="activeBankInfo" :bankList="bankList"
        @bankChange="bankChange" v-model:bankCode="bankCode" />
      <!-- 充值按钮 -->
      <ion-button class="recharge-modal-btn m-0 mt-[2rem]" @click="rechargeBtnClick">{{
        $t('viewsActivity.rechargePromotion16') }}</ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons';
import { formatMoneyToShow } from '@/utils/custom'
import { IonModal, IonButton, IonIcon, IonSegment, IonSegmentButton, IonSpinner } from '@ionic/vue'
import { rechargeItemObj } from '@/views/activity/rechargePromotion/data'
import { useRechargeModalLogic, useComponents } from '@/views/activity/rechargePromotion/hooks/rechargeModalLogic'
import RechargeBankSelect from '@/components/RechargeBankSelect/index.vue'
import NoCycleSubTab from '@/views/recharge/main/comp/NoCycleSubTab.vue'

const emit = defineEmits(["closeRechargeModal"]);
const props = defineProps<{
  countryCode: string;
  rechargeItemInfo: rechargeItemObj
}>();
const componentsTab = useComponents()

const {
  visible,
  merchantCy,
  tabId,
  channelLoading,
  tabList,
  subTabList,
  subTabId,
  channelList,
  channelId,
  bankList,
  bankCode,
  activeBankInfo,
  isGameAmount,
  bankChange,
  handlePayChanelChange,
  mainTabChange,
  subTabChange,
  closeClick,
  rechargeBtnClick,
  vietnamRechargeAmount
} = useRechargeModalLogic(props, { emit });
</script>

<style scoped lang="less">

ion-modal {
  --width: fit-content;
  --height: fit-content;
  --border-radius: 0.625rem;
}

#activity-rechargePromotion-modal-rechargeModal-index {

  .style(@bg: --ep-color-background-fill-body-default,
    @title: --ep-color-text-default,
    @infoColor: --ep-color-text-weaker,
    @amountColor: --ep-color-icon-warning,
    @btnColor: --ep-color-text-inverse,
    @btnBg: --ep-color-background-fill-active-primary) {
    .recharge-modal-conten {
      width: 22.875rem;
      padding: .9375rem .5rem;
      box-sizing: border-box;
      background: var(@bg);

      .recharge-modal-title {
        font-size: var(--ep-font-size-l, 1.125rem);
        line-height: 1.875rem;
        font-weight: var(--ep-font-weight-medium, 600);
        margin-bottom: .9375rem;
        color: var(@title);
      }

      .recharge-modal-info {
        font-size: var(--ep-font-size-s, 0.75rem);
        line-height: 1.125rem;
        margin-bottom: .75rem;
        color: var(@infoColor);

        .info-amount,
        .info-reward {
          font-size: var(--ep-font-size-m, 0.875rem);
          line-height: 1.3125rem;
          color: var(@amountColor);
        }

        .info-amount {
          font-weight: var(--ep-font-weight-medium, 600);
        }
      }

      ion-button.recharge-modal-btn {
        width: 100%;
        height: 2.875rem;
        font-size: var(--ep-font-size-m, 0.875rem);
        font-weight: var(--ep-font-weight-bold, 700);
        --border-radius: var(--ep-border-radius-s, 4px);
        --background-activated: none;
        --background-focused: none;
        --background-hover: none;
        --color: var(@btnColor);
        --background: var(@btnBg);
      }
    }

  }
}

.yellow-dark,
.blue-default,
.green-default,
.forest-green,
.green-dark {
  #activity-rechargePromotion-modal-rechargeModal-index.style(@bg: --color-bg-300,
    @title: --color-text-100,
    @infoColor: --color-text-40,
    @amountColor: --accent-color-orange,
    @btnColor: --color-text-100,
    @btnBg: --theme-color-800);
}

.purple-light {
  #activity-rechargePromotion-modal-rechargeModal-index.style(@bg: --color-bg-300,
    @title: --color-text-100,
    @infoColor: --color-text-40,
    @amountColor: --accent-color-orange,
    @btnColor: --text-color-white-100,
    @btnBg: --theme-color-800
  );
}

.auroral-yellow {
  #activity-rechargePromotion-modal-rechargeModal-index.style(@bg: --color-bg-300,
    @title: --color-text-100,
    @infoColor: --color-text-40,
    @amountColor: --accent-color-orange,
    @btnColor: --color-text-black-100,
    @btnBg: --theme-color-800);
}

.amber-purple {
  #activity-rechargePromotion-modal-rechargeModal-index.style(@bg: --color-bg-300,
    @title: --color-text-100,
    @infoColor: --color-text-40,
    @amountColor: --accent-color-orange,
    @btnColor: --text-color-white-100,
    @btnBg: --theme-color-gradient-100)
}
.new-skin-symbol{
  #activity-rechargePromotion-modal-rechargeModal-index.style()
}
</style>
