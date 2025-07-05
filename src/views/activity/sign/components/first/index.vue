<!-- 签到活动-类1 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName" />
    <ion-content>
      <section>
        <!-- 顶部宣传图片 -->
        <div class="sign-top w-full">
          <div class="sign-title text-gradient pt-[2.5rem] pl-[0.604375rem]">{{ $t('activity.checkIn') }}</div>
          <div class="sign-info mt-[1.625rem]">
            <div class="current-level">{{ $t('viewsTabbar.currentLevel') }}：{{ $t('main.VIP') }}{{ currentVipLevel }}</div>
            <div class="white-text-04 text-[0.75rem] mt-[0.39rem]">
              <span>{{ $t('activity.signInfo') }} </span>
              <span class="text-important"> {{ $t('activity.signDay',{ value: signInfo?.signInDays }) }}</span>
              <span class="mx-[0.625rem]">/</span>
              <span class="text-important">{{ $t('activity.agent11') }} {{ formatMoneyToShow(cumulativeRewardsMoney) }}</span>
            </div>
          </div>
          <!-- 宝箱 -->
          <img class="treasure-chest" src="/images/sign/treasure-chest.png" />
          <!-- 彩色光圈 -->
          <img class="colorful-halo" src="/images/sign/colorful-halo.png" />
        </div>
        <div class="sign-main">
          <div class="sing-date flex">
            <div class="date-days relative" v-for="(item,index) in signInfo.rewardConfig" :key="index" @click="checkInClick(item, 'style0')">
              <div class="gold-box w-full h-[3.64125rem] relative">
                <!-- 额外赠送金额 -->
                <div 
                  v-if="item.extraReward > 0" 
                  class="sign-extra-reward absolute top-[-0.65rem] left-[50%] font-bold text-center"
                  :class="{ 'claimed-item': item.isClaimed, 'available-item': item.isAvailable, 'show-extra-text': !showExtraRewardAmount }"
                >
                  {{ showExtraRewardAmount ? `${$t('viewsAssets.Extra')} +${formatMoneyToShow(item.extraReward)}` : $t('activity.signExtraText') }}
                </div>
                <!-- 金币-背景 -->
                <img class="w-full h-full" src="/images/sign/gold-bg.png" />
                <!-- 金币图片 -->
                <img v-if="item.iconType == 'DEFAULT'" class="w-[2.25rem] h-[2.25rem] z-10 absolute top-[0.375rem] left-[0.75rem]" :src="`/images/sign/sing-date-bg-style02-${handleStyle01DefaultPng(index+1)}.png`" />
                <img v-else class="w-[2.25rem] h-[2.25rem] z-10 absolute top-[0.375rem] left-[0.75rem]" :src="item.icon" />
                <!-- 金额 -->
                <div class="item-money w-full text-center text-gradient absolute bottom-0 left-[50%]">
                  <template v-if="showRewardAmount">
                    {{ item.amountType == 'RANDOM' ? `${ formatMoneyToShow(item.amountMin) }~${ formatMoneyToShow(item.amountMax) }` : `+${ formatMoneyToShow(item.amountMax) }` }}
                  </template>
                  <template v-else>
                    {{ item.amountType == 'RANDOM' ? $t('activity.signRandomText') : $t('activity.signRewardText') }}
                  </template>
                </div>
              </div>
              <!-- 当前天数 -->
              <div class="item-day flex items-center justify-center">{{ $t('date.days') }} {{ handleDateDay(item.day) }}</div>
              <!-- 已签到图标 -->
              <div v-if="item.isClaimed" class="w-full h-full z-20 sign-checked absolute top-0 left-0">
                <img class="w-[1.625rem] h-[1.19625rem] absolute" src="/images/sign/sign-checked.png" />
              </div>
            </div>
          </div>
          <!-- 活动描述 -->
          <div class="sing-explanation keep-space">
            <p>{{ activityRule }}</p>
          </div>
        </div>
        <!-- 签到按钮 -->
        <div class="w-full h-[5rem] fixed sign-footer-btn z-50">
          <ion-button class="w-full h-[2.5rem] sign-yellow-btn" @click="receiveClickBtn('style0')">{{ $t('activity.signInfo') }}</ion-button>
        </div>
      </section>
      <!-- 未满足领取条件 弹窗 -->
      <UnmetReceiveModal v-if="openUnmetReceive" @closeUnmetReceive="closeReceiveModel('unmet')" :unmetInfo="unmetInfo" />
      <!-- 满足领取条件 弹窗 -->
      <ReceiveModelLogic v-if="openReceive" @closeReceive="closeReceiveModel('receive')" :receiveInfo="unmetInfo" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { useSignLogic } from '@/views/activity/sign/hooks/signLogic'
import NavigationBar from '@/components/NavigationBar/index.vue'
import UnmetReceiveModal from './modal/unmetReceiveModal.vue'
import ReceiveModelLogic from './modal/receiveModel.vue'

const {
  activityName,
  activityRule,
  signInfo,
  cumulativeRewardsMoney,
  currentVipLevel,
  openUnmetReceive,
  openReceive,
  unmetInfo,
  showRewardAmount,
  showExtraRewardAmount,
  handleDateDay,
  checkInClick,
  closeReceiveModel,
  receiveClickBtn,
  handleStyle01DefaultPng
} = useSignLogic();
</script>

<style scoped lang="less">
  @import "@/views/activity/sign/components/first/style/base-index.less";
</style>
