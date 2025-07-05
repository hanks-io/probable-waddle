<!-- 充值酬宾 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName" />
    <ion-content>
      <!-- 顶部图片/活动时间 -->
      <div class="top-content w-full" :style="{ backgroundImage: `url(${currentSkinTopBg})` }">
        <div class="date-content">
          <!-- 酬宾时间 -->
          <div class="reward-time mb-[1.4375rem] min-h-[4.5rem] flex items-center">{{ $t('viewsActivity.rechargePromotion09') }}</div>
          <!-- 倒计时 -->
          <div class="date-count-down flex mb-[0.625rem]">
            <CountDown v-if="activityDetail.status" :activityDetail="activityDetail" />
          </div>
          <!-- 活动倒计时提示 -->
          <div class="count-down-tips pl-[0.65rem] relative" v-if="countDownTips">
            <ion-icon class="absolute top-[1px] left-0 text-[0.625rem]" src="/svg/activity/mineral/mineral_style1_dot.svg" />
            {{ countDownTips }}
          </div>
          <!-- 酬宾开始时间 -->
          <div class="date-week h-[4.5rem] relative w-[11.3125rem] text-center z-10"
            :class="{ 'blue-purple-date-week': isBluePurple, 'amber-purple-date-week': isAmberPurple }">
            <div class="week-text">{{ currentWeekName }}</div>
            <div class="week-tips">{{ $t('viewsActivity.rechargePromotion09') }}</div>
            <div :class="{ 'amber-purple-date-box': isAmberPurple }"></div>
          </div>
        </div>
      </div>
      <!-- 充值/活动规则 -->
      <div class="recharge-promotion-content">
        <div class="recharge-rule-content w-full">
          <!-- 充值列表 -->
          <div class="recharge-item" v-for="(item, index) in rechargeList" :key="index">
            <div class="recharge-item-top flex justify-between items-center p-[0.625rem]">
              <div class="recharge-info w-full flex justify-between">
                <div class="recharge-info-left">
                  <div class="mb-[0.625rem]">{{ $t('viewsActivity.rechargePromotion12') }} {{ merchantCy }} {{
                    formatMoneysToShow(item.rechargeAmount) }}</div>
                  <div>{{ $t('viewsAssets.bonus') }} {{ merchantCy }} {{ formatMoneysToShow(item.rewardAmount) }}</div>
                </div>
                <div class="recharge-info-right ml-[0.1875rem] text-right">
                  <div class="mb-[0.25rem] total-amount">{{ merchantCy }} {{ formatMoneysToShow(item.totalAmount) }}</div>
                  <div>{{ $t('viewsActivity.rechargePromotion13') }}</div>
                </div>
              </div>
              <div class="ml-[0.625rem] recharge-btn-container" :class="{ 'outer-recharge-btn': rechargeBtnBorder }">
                <div 
                  class="recharge-btn py-[0.5625rem] flex-center" 
                  :class="{ 
                    'dis-recharge-btn': rechargedId == item.uuid && disabledBtn,
                    'recharged-btn': disabledBtn && rechargedId != item.uuid || isStartTime || !isToken
                  }"
                  @click="rechargeBtnClick(item)"
                >
                  {{ $t('viewsActivity.rechargePromotion12') }}
                </div>
              </div>
            </div>
            <div class="recharge-item-footer py-[0.5rem] text-center">
              {{ $t('viewsActivity.rechargePromotion14') }}:{{ formatMoneyToShow(item.needBetAmount) }}
            </div>
          </div>
          <!-- 活动规则 -->
          <div class="mt-[1.25rem]">
            <!-- 规则标题 -->
            <div class="w-full flex-center">
              <ion-icon class="mineral-rule-icon"
                :src="getImageUrl('svg/activity/rechargePromotion/rule-icon-left.svg')" />
              <div class="mx-[0.375rem] activity-rule-title">{{ $t('activity.appreciation13') }}</div>
              <ion-icon class="mineral-rule-icon"
                :src="getImageUrl('svg/activity/rechargePromotion/rule-icon-right.svg')" />
            </div>
            <!-- 规则内容 -->
            <div class="recharge-promotion-rule w-full">
              <div v-if="!isPhantomBlue" class="recharge-promotion-rule-border w-full h-[0.0625rem] mb-[0.9375rem]"></div>
              <p class="recharge-promotion-rule-contents keep-space">
                {{ activityRule }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
    <!-- 选择充值方式弹窗 -->
    <RechargeModal v-if="openRechargeModal" :countryCode="rechargeCountryCode" :rechargeItemInfo="rechargeItemInfo"
      @closeRechargeModal="closeRechargeModal" />


    <OrderModal :isOpen="isOpenOrderModal" :merchantCy="merchantCy" :isVirtualCurrency="isVirtualCurrency"
      v-if="isOpenOrderModal" @paySuccessCb="transferSuccessCb" />
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getImageUrl } from '@/utils'
import { getTheme } from '@/theme/hooks';
import { formatMoneyToShow, formatMoneysToShow } from '@/utils/custom'
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useRechargeLogic } from '@/views/activity/rechargePromotion/hooks/useLogic'
import RechargeModal from '@/views/activity/rechargePromotion/style_0/modal/rechargeModal.vue'
import CountDown from '@/views/activity/rechargePromotion/style_0/components/countDown.vue'
import OrderModal from '@/views/recharge/main/comp/orderModal.vue'
const isBluePurple = computed(() => getTheme()?.theme == 'purple-light');
const isAmberPurple = computed(() => getTheme()?.theme == 'amber-purple');
const isPhantomBlue = computed(() => ['phantom-blue'].includes(getTheme()?.theme));

const {
  activityName,
  activityRule,
  rechargeList,
  merchantCy,
  currentWeekName,
  isStartTime,
  currentSkinTopBg,
  openRechargeModal,
  rechargeCountryCode,
  rechargeItemInfo,
  isOpenOrderModal,
  isVirtualCurrency,
  rechargedId,
  disabledBtn,
  rechargeBtnBorder,
  isToken,
  countDownTips,
  activityDetail,
  rechargeBtnClick,
  closeRechargeModal,
  transferSuccessCb,
} = useRechargeLogic();

</script>

<style scoped lang="less">
@import "@/views/activity/rechargePromotion/style_0/style/base-index.less";
@import "@/views/activity/rechargePromotion/style_0/style/theme-style.less";

#activity-rechargePromotion-default-index.style();

.blue-default {
  #activity-rechargePromotion-default-index.style();
}

.green-default {
  #activity-rechargePromotion-default-index.style(
    linear-gradient(90deg, #7D984A 15%, #2A7D63 22.35%, #5F96CE 60%),
    #8CD565,
    #7BD800,
    #FFEDB3,
    linear-gradient(180deg, #FEEC61 0%, #AA7F01 96.53%),
    #DEBB34,
    rgba(255, 255, 255, 0.40),
    #564917,
    rgba(255, 255, 255, 0.60),
    linear-gradient(180deg, #376619 0.33%, #295115 25.46%),
    #233315,
    rgba(255, 255, 255, 0.50),
    #FEEC61,
    #5A9E01,
    #AFC69F,
    #2C5214,
    #376619,
    rgba(255, 255, 255, 0.50),
    linear-gradient(270deg, #006849 0%, #009F76 50%, #006849 100%),
    rgba(255, 255, 255, 0.50),
    #569800,
    rgba(255, 255, 255, 0.70),
    linear-gradient(180deg, #FEEC61 0%, #AA7F01 96.53%),
  );
}

.forest-green {
  #activity-rechargePromotion-default-index.style(
    linear-gradient(90deg, #008346 0%, #1785B4 30%, #002D46 63%),
    #65D5BF,
    #21FDB4,
    #00E599,
    linear-gradient(180deg, #13C96A 0%, #1D9554 100%),
    #006849,
    rgba(255, 255, 255, 0.40),
    #004D33,
    rgba(255, 255, 255, 0.60),
    linear-gradient(180deg, #009F76 0.33%, #006849 25.46%),
    #1d4231,
    rgba(255, 255, 255, 0.50),
    #FFC271,
    #00B286,
    #50B388,
    #00563A,
    #009972,
    rgba(255, 255, 255, 0.50),
    linear-gradient(270deg, #006849 0%, #009F76 50%, #006849 100%),
    rgba(255, 255, 255, 0.50),
    #00B286,
    rgba(255, 255, 255, 0.70),
    linear-gradient(180deg, #13C96A 0%, #1D9554 100%),
  );
}

.amber-purple {
  #activity-rechargePromotion-default-index.style(
    linear-gradient(90deg, #504A98 0%, #422A7D 30%, #BA5FCE 62%),
    #D5C6FD,
    #BFBDDB,
    #7041F3,
    linear-gradient(180deg, #5A5499 0%, #4D4884 96.53%),
    #1A1D22,
    rgba(255, 255, 255, 0.40),
    #BFBDDB,
    rgba(255, 255, 255, 0.60),
    linear-gradient(180deg, #514B9B 0.33%, #2E2B55 25.46%),
    #1a192c,
    rgba(255, 255, 255, 0.50),
    #BFBDDB,
    #4D4884,
    #FFBF66,
    #2D2956,
    #514B9B,
    rgba(255, 255, 255, 0.20),
    linear-gradient(180deg, #514B9B 0.33%, #2E2B55 25.46%),
    rgba(255, 255, 255, 0.50),
    #4D4884,
    rgba(255, 255, 255, 0.70),
    linear-gradient(270deg, #7041F3 0%, #F5C84C 130.92%),
  );
}

.yellow-dark,
.auroral-yellow {
  #activity-rechargePromotion-default-index.style(
    linear-gradient(90deg, #AD9E00 0%, #7D602A 30%, #CE9C5F 60%),
    #D5C265,
    #372000,
    #FFD599,
    linear-gradient(180deg, #FFBF66 0%, #FF9500 96.53%),
    #1A1D22,
    rgba(255, 255, 255, 0.40),
    #995900,
    rgba(255, 255, 255, 0.70),
    linear-gradient(180deg, #423D24 0.33%, #332F1C 25.46%),
    #1e1c14,
    rgba(255, 255, 255, 0.50),
    #FFAA33,
    #FF9500,
    #FFBF66,
    #3C3720,
    #423D24,
    rgba(255, 255, 255, 0.20),
    linear-gradient(270deg, #292D36 0%, #292D36 50%, #292D36 100%),
    rgba(255, 255, 255, 0.50),
    #FF9500,
    rgba(255, 255, 255, 0.70),
    #FF9500,
  )
}

.green-dark {
  #activity-rechargePromotion-default-index.style(
    linear-gradient(90deg, #368429 0%, #2CA5B0 30%, #5162D6 62%),
    #9AFD69,
    #00D278,
    #8FE759,
    linear-gradient(180deg, #328624 0%, #25651A 96.53%),
    #1A1D22,
    rgba(255, 255, 255, 0.40),
    #FFDC66,
    rgba(255, 255, 255, 0.60),
    linear-gradient(180deg, #292D36 0.33%, #292D36 25.46%),
    #11141d,
    rgba(255, 255, 255, 0.50),
    #FFDC66,
    #25651A,
    #1ACD4C,
    #323843,
    #323843,
    rgba(255, 255, 255, 0.20),
    linear-gradient(270deg, #292D36 0%, #25651A 50%, #292D36 100%),
    rgba(255, 255, 255, 0.50),
    #25651A,
    rgba(255, 255, 255, 0.70),
    #8FE759,
  );
}

.purple-light {
  #activity-rechargePromotion-default-index.style(
    linear-gradient(90deg, #996CF0 0%, #591CCC 30%, #8750F0 62%),
    #EAE6F8,
    #DBC9FF,
    #a17ff7,
    linear-gradient(180deg, #7D38FD 0%, #6526DB 96.53%),
    '',
    rgba(255, 255, 255, 0.40),
    #FFFFFF,
    rgba(255, 255, 255, 0.60),
    linear-gradient(180deg, #BD9CFF 0.33%, #CBB1FC 25.46%),
    #a07ff8,
    rgba(0, 0, 0, 0.50),
    #7D38FD,
    #BD9CFF,
    #9462F2,
    #DBC9FF,
    #BD9CFF,
    rgba(0, 0, 0, 0.50),
    linear-gradient(270deg, #CBB1FC 0%, #BD9CFF 50%, #CBB1FC 100%),
    rgba(0, 0, 0, 0.50),
    #BA98FF,
    rgba(0, 0, 0, 0.70),
    #8D51FC
  );
}

.purple-light {
  ion-content {
    --background: #B089FE;
  }
}

.new-skin-symbol {
  @import "@/views/activity/rechargePromotion/style_0/style/new-theme-style.less";
}
</style>
