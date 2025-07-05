<!-- 救援金活动 -->
<template>
  <ion-page :class="[defStyle]">
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title class='commission-title'>{{ activityName }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="commission-content">
      <!-- 头部 -->
      <div class="flex flex-col items-center">
        <div class="topcontent">
          <div class="topcontent-text">
            <div class="topcontent-text-title">{{ $t('activity.commission14') }}</div>
            <div class="topcontent-text-content font-weight-bold">{{ merchantCy }} {{ currentLastRewardAmount }}</div>
          </div>
          <div v-for="i in stars" :class="`st-light-${i}`"></div>
          <div class="text-title">
            <div class="inner"></div>
          </div>
        </div>
        <div class="text font-weight-bold flex items-center"><ion-icon class="mr-[0.25rem]" :src="`/images/activity/commission/textFixLeft.svg`"></ion-icon>{{ activityName }}<ion-icon class="ml-[0.25rem]" :src="`/images/activity/commission/textFixRight.svg`"></ion-icon></div>
        <ComissionAmount v-bind="{
          receivedTitle: commissionReceivedTitle,
          receivedAmount: currentRewardAmount,
          isShowDetail: isShowDetail,
          rewardAmountTitle: rewardAmountTitle,
          rewardAmount: commissionReceived,
          merchantCy: merchantCy,
        }" @pathToDetail="pathToDetail" />
      </div>
      <!-- 列表 -->
      <div class="mx-3">
        <div
          class="table-header w-full flex-around h-9 bg-slate-50-a rounded-middle-t color-text-40 text-xs font-weight-bold">
          <span class='w-1/2 text-center'>{{ $t(tableTitle) }}</span>
          <span class='w-1/2 text-center'>{{ $t('activity.commission05') }}</span>
        </div>
        <div v-for="(item, index) in commissionList" class="table-item w-full h-[2.625rem] flex-around text-xs"
          :class="{ 'reward-item-bg': index % 2 }">
          <span class="w-1/2 text-center left-item">
            {{ item?.conditionAmount }}
          </span>
          <span class="w-1/2 text-center  right-item font-weight-bold">
            <span class="mr-[0.1563rem]" v-if="item?.isShowMerchantCy">{{ merchantCy }}</span> {{ item?.rewardAmount }}
          </span>
        </div>
      </div>
      <div class="rule-content mx-3 keep-space">
        {{ activityRule }}
      </div>
    </ion-content>
    <Footer class="footer">
      <div :class="['commission', { disabled: btnDisabled, shiny: !btnDisabled }]" @click="receiveCommission">
        {{ $t('activity.mysterious05') }}
      </div>
    </Footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import Footer from '@/views/activity/comp/first/Footer/index.vue'
import { useCommissionLogic } from '@/views/activity/commission/logic';
import ComissionAmount from '@/views/activity/commission/comp/ComissionAmount.vue'
import { getCustomerActivityId } from '@/utils';
const defStyle = ref(getCustomerActivityId()?.defStyle || 'style_0')
const stars = [1, 2, 3, 4];
const {
  isShowDetail,
  commissionList,
  merchantCy,
  rewardAmountTitle,
  commissionReceivedTitle,
  currentRewardAmount,
  commissionReceived,
  tableTitle,
  btnDisabled,
  currentLastRewardAmount,
  activityRule,
  activityName,
  pathToDetail,

  receiveCommission
} = useCommissionLogic();

</script>
<style scoped lang="less">
@import url('@/views/activity/commission/style_1/commom.less');
.commission-content{
  --padding-bottom: 7.5rem;
}
.topcontent {
  background: url('/images/activity/commission/bg.png') no-repeat;
  background-size: contain;
  width: 100%;
  height: 19.375rem;
  position: relative;

  &-text {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 12.3rem;

    &-title {
      padding-top: .3rem;
      font-size: 0.625rem;
      color: #29861C;
      font-family: Noto Sans SC;
      font-weight: 900;
      line-height: 0.8rem;
    }

    &-content {
      font-size: 1.25rem;
      color: #E43F11;
      line-height: 1;
    }
  }

  .st-light-1 {
    .st-light();
  }

  .st-light-2 {
    .st-light(6rem, 6rem, 5.5rem, 2.3rem, 1.1s, .8s, 2);
  }

  .st-light-3 {
    .st-light(6rem, 6rem, 2.7rem, 8.6rem, 1s, .6s, 3);
  }

  .st-light-4 {
    .st-light(6rem, 6rem, 17.4rem, 5rem, 1.2s, 1.3s, 4);
  }

  @keyframes shine {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0.6);
    }

    100% {
      transform: scale(1.16);
    }
  }

  .text-title {
    background: url('/images/activity/commission/Ellipse1.png') no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    width: 100%;
    height: 2.3rem;
    bottom: -0.3125rem;
    left: 0.1rem;
    display: flex;
    justify-content: center;

    .inner {
      height: 2rem;
      width: 80%;
      border-radius: 95%;
      background: rgba(228, 254, 150, 0.40);
      filter: blur(2.3rem);
    }
  }
}



.footer {
  background: #005029 !important;
  border-top: 1px solid #026C38 !important;
  box-shadow: none !important;
  padding: 16px 14px !important;

}
.rule-content{
   font-weight: 500;
   font-size: 0.75rem;
   line-height: 1.25rem;
   color: rgba(255, 255, 255, 0.4);
   margin-top: .875rem;

}

.commission {
  width: 22.875rem;
  height: 2.9375rem;
  margin: .625rem auto;
  border-radius: 3.25rem;
  background: linear-gradient(94.57deg, #FFD417 11.55%, #F6DA59 56.45%, #CF804F 97.07%);
  box-shadow: 0px 4px 20px 0px #FF8E5642;
  text-align: center;
  line-height: 2.9375rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #613B0E;
  cursor: pointer;

}

.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.shiny {
  position: relative;
  overflow: hidden;
  border-radius: 0.25rem;
}

.shiny::before {
  content: "";
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px;
  z-index: 99;
  animation: shiny 4s ease-in-out infinite;
}

@keyframes shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }

  80% {
    opacity: 0.5;
    transform: scale(0) rotate(45deg);
  }

  81% {
    opacity: 1;
    transform: scale(4) rotate(45deg);
  }

  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}
</style>
