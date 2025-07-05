<!-- 签到活动-类2 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName" />
    <ion-content>
      <section>
        <!-- 顶部宣传图片 -->
        <div class="sign-top-style02 w-full"></div>
        <!-- 签到/规则说明 -->
        <div class="sign-main-style02 flex flex-col">
          <!-- 签到标题 -->
          <div class="sign-style02 w-full relative">
            <div class="sign-title-style02 text-gradient z-10 w-full absolute top-[4.5rem] text-center">{{ spacedCheckIn }}</div>
            <img class="w-[2.5rem] h-[2.5rem] absolute left-[1.85rem] top-[3.68rem]" src="/images/sign/sign-aperture-style02.png" />
            <img class="w-[3rem] h-[3rem] absolute left-[6.52rem] top-[3.25rem]" src="/images/sign/sign-aperture-style02.png" />
            <img class="w-[2.5rem] h-[2.5rem] absolute left-[8.8rem] top-[3.5rem]" src="/images/sign/sign-aperture-style02.png" />
            <img class="w-[2.8rem] h-[2.8rem] absolute right-[3.95rem] top-[3.1rem]" src="/images/sign/sign-aperture-style02.png" />
          </div>
          <!-- 签到背景图片/内容 -->
          <div class="sign-date-box-style02 w-full z-20 mt-[-4.125rem] p-[0.5625rem]">
            <div class="sign-date-main-style02 py-[0.835625rem]">
              <!-- VIP等级/累计天数/奖励金额 -->
              <div class="flex justify-center receive-box-style02">
                <div class="mr-[1.625rem] receive-item relative" v-for="(item,index) in signReceivedInfo" :key="index">
                  <img class="w-[1.51375rem] h-[1.51375rem] absolute left-[-1rem] top-[-0.25rem]" :src="`/images/sign/${item.icon}.png`" />
                  <div v-if="item.type == 'reward'">+{{ formatMoneyToShow(item.value) }}</div>
                  <div v-if="item.type == 'date'">x {{ item.value }}</div>
                  <div v-if="item.type == 'vip'">{{ 'VIP' }} {{ item.value }}</div>
                </div>
              </div>
              <!-- 签到提示 -->
              <div v-if="showSignPrompt" class="mt-[0.649375rem] text-center sign-prompt">{{ $t('activity.signPrompt') }}</div>
              <!-- 当前日期 -->
              <div class="sign-current-date mt-[0.961875rem] flex-center">
                <div class="date-line"></div>
                <div class="mx-[0.2925rem] current-date">{{ currentDate[1] }} {{ '/' }} {{ currentDate[0] }}</div>
                <div class="date-line"></div>
              </div>
              <!-- 签到日期 -->
              <div class="mt-[1rem] flex flex-wrap date-list-style02" :class="{ 'less-date-list': signInfo.rewardConfig.length <= 7 }">
                <div  
                  class="date-list-item flex-around flex-col justify-around mb-[1.375rem] relative" 
                  :class="{ 'less-date-list-item' : signInfo.rewardConfig.length <= 7, 'received-item-style02': item.isClaimed, 'available-item-style02': item.isAvailable }" 
                  v-for="(item,index) in signInfo.rewardConfig" 
                  :key="index"
                >
                  <!-- 日期 -->
                  <div class="item-style02-days font-bold">{{ $t('date.days') }} {{ item.day }}</div>
                  <!-- 已领取图标 -->
                  <img  v-if="item.isClaimed"  class="w-[0.875rem] h-[0.625rem] absolute right-[0.375rem]" src="/images/sign/sign-checked.png" />
                  <!-- 图片 -->
                  <div class="sign-date-img flex flex-col items-center">
                    <img v-if="item.iconType == 'DEFAULT'" class="w-[2.25rem] h-[2.25rem] z-20" :class="{ 'available-img': item.isAvailable, 'received-img': item.isClaimed }" :src="`/images/sign/sing-date-bg-style02-${handleStyle01DefaultPng(index+1)}.png`" />
                    <img v-else class="w-[2.25rem] h-[2.25rem] z-20" :class="{ 'available-img': item.isAvailable, 'received-img': item.isClaimed }" :src="item.icon" />
                  </div>
                  <!-- 额外赠送金额 -->
                  <div class="min-h-[0.766875rem] z-30" v-if="item.extraReward > 0" >
                    <div 
                      class="extra-give-money  font-bold text-center min-w-[3.5rem]" 
                      :class="{ 'available-item' : item.isAvailable, 'text-gradient': !item.isAvailable, 'show-extra-text': !showExtraRewardAmount }"
                    >
                      {{ showExtraRewardAmount ? `${$t('viewsAssets.Extra')} +${formatMoneyToShow(item.extraReward)}` : $t('activity.signExtraText') }}
                    </div>
                  </div>
                  <!-- 奖励金额 -->
                  <div class="reward-money-style02 font-bold flex-center relative" :class="{ 'text-gradient': item.isClaimed }">
                    <ion-icon v-if="item.isUnMet" src="/svg/activity/sign-date-lock.svg" />
                    <ion-icon v-if="item.isClaimed"  class="text-[4rem] z-30 absolute top-[-1.45rem] left-[-1.25rem]" src="/svg/activity/received-money-bg.svg" />
                    <template v-if="showRewardAmount">
                      {{ item.amountType == 'RANDOM' ? `${ formatMoneyToShow(item.amountMin) }~${ formatMoneyToShow(item.amountMax) }` : `+${ formatMoneyToShow(item.amountMax) }` }}
                    </template>
                    <template v-else>
                      {{ item.amountType == 'RANDOM' ? $t('activity.signRandomText') : $t('activity.signRewardText') }}
                    </template>
                  </div>
                </div>
              </div>
            </div>  
          </div>
          <!-- 规则说明 -->
          <div class="mt-[0.875rem] sing-explanation-style02 keep-space">
            <p>{{ activityRule }}</p>
          </div>
        </div>
        <!-- 签到按钮 -->
        <div class="w-full h-[5rem] fixed sign-footer-btn z-50">
          <ion-button class="w-full h-[3.0625rem] sign-yellow-btn" @click="receiveClickBtn('style1')">{{ $t('activity.signInfo') }}</ion-button>
        </div>
      </section>
      <!-- 未满足 弹窗 -->
      <UnmetReceiveModal v-if="openUnmetReceive" @closeUnmetReceive="closeReceiveModel('unmet')" :unmetInfo="unmetInfo" />
      <!-- 领取弹窗 -->
      <ReceivedModal v-if="openStyle01Receive" :receivedInfo="unmetInfo" @closeReceived="closeStyle01Received" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts" >
import { formatMoneyToShow } from '@/utils/custom'
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import ReceivedModal from './modal/receivedModal.vue'
import UnmetReceiveModal from '@/views/activity/sign/components/first/modal/unmetReceiveModal.vue'
import { useSignLogic } from '@/views/activity/sign/hooks/signLogic'

const {
  activityName,
  activityRule,
  signReceivedInfo,
  currentDate,
  signInfo,
  spacedCheckIn,
  openStyle01Receive,
  unmetInfo,
  openUnmetReceive,
  showRewardAmount,
  showExtraRewardAmount,
  showSignPrompt,
  receiveClickBtn,
  closeStyle01Received,
  closeReceiveModel,
  handleStyle01DefaultPng
} = useSignLogic();

</script>

<style scoped lang="less">
  @import "@/views/activity/sign/components/second/style/base-index.less";
</style>
