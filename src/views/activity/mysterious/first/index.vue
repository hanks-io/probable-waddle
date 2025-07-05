<!-- 神秘彩金 -->
<template>
  <ion-page>
    <NavigationBar :title="activityInfo.name" />
    <ion-content>
      <div class="overflow-auto">
        <div class="h-[16.6875rem]">
          <div class="relative">
            <!-- banner -->
            <ion-img src="/first/images/mysterious-banner.png"></ion-img>
            <!-- 奖励等级 -->
            <div class="absolute w-full top-[11.75rem] flex-around">
              <div v-for="(item, index) in activityInfo.rewardConfigs" class="w-[2.8125rem]" @click="onLevelCheck(index)">
                <div class="relative w-[2.8125rem]">
                  <ion-img class="w-[2.8125rem] h-[2.8125rem]" :src="getLevelBg(checkLevel, index)"></ion-img>
                  <div class="absolute top-0 left-0 w-[2.8125rem] h-[2.8125rem] flex-center">
                    <ion-icon class="w-8 h-8" :src="item.icon"></ion-icon>
                  </div>
                  <HotPoint :isShow="item.isCanReceive" classNames="top-0 right-[0.625rem]" />
                </div>
                <div class="h-[1.3125rem] flex-center" :class="checkLevel ===  index ? 'level-check-text' : 'level-uncheck-text'">
                  <p class="font-weight-bold mysterious-text-xs">{{ $t('activity.mysterious01', { day: item.day}) }}</p>
                </div>
                <div class="h-[1.3125rem] flex-center" :class="checkLevel ===  index ? 'level-check-text' : 'level-uncheck-text'">
                  <ion-icon v-show="checkLevel ===  index" class="w-[0.7813rem] h-[0.7813rem]" src="/first/svg/mysterious-icon5.svg"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 活动时间 -->
        <div class="h-[18.625rem] mysterious-time mx-3 mt-[0.625rem] px-[0.625rem] overflow-hidden">
          <div class="flex-between normal-text mysterious-text-sm mt-[0.8125rem]">
            <div class="flex-start">
              <ion-icon class="w-5 h-5" src="/first/svg/mysterious-icon1.svg"></ion-icon>
              <p class="ml-[0.4375rem] ">{{ $t('activity.mysterious02') }}</p>
            </div>
            <p class="font-weight-medium">{{ activityInfo.joinTimeStr }}</p>
          </div>
          <div class="flex-between normal-text mysterious-text-sm mt-[0.6381rem]">
            <div class="flex-start">
              <ion-icon class="w-5 h-5" src="/first/svg/mysterious-icon2.svg"></ion-icon>
              <p class="ml-[0.4375rem]">{{ $t('activity.mysterious03', { day: curRewardConfig.day}) }}</p>
            </div>
            <p class="font-weight-medium"> {{merchantCy}}{{ convertMoneyToShow(curRewardConfig.dayRecharge ?? 0) }}</p>
          </div>
          <div class="w-[21.625rem] h-[13.0625rem] mysterious-time-info mx-auto mt-3 px-[0.9375rem] overflow-hidden normal-text">
            <div>
              <p class="mt-5 text-center mysterious-time-tips">{{ $t('activity.mysterious04') }}</p>
              <div class="flex-start flex-col mt-6">
              <div>
                <div class="w-full flex-center">
                  <div class="flex-start">
                    <TimeIcon />
                    <p class="ml-[0.1563rem] mysterious-text-lg receive-text font-weight-medium">{{ receiveTime }}</p>
                  </div>
                </div>
                <div class="w-full flex-start mt-2">
                  <div>
                    <div class="flex-center">
                      <CoinIcon />
                      <p class="ml-[0.1563rem] mysterious-text-lg">{{ $t('activity.mysterious07') }}</p>
                      <div>
                      </div>
                    </div>
                    <p class="ml-[1.5313rem] mysterious-text-sm">{{ merchantCy }}
                      <span class="mysterious-reward-amount">{{ convertMoneyToShow(dayMaxReward) }}</span>
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 奖励列表 -->
        <div class="mx-3 mt-[1.125rem]">
          <div class="w-full flex-around h-9 mysterious-reward-list mysterious-text-xs font-weight-bold">
            <span class='w-1/2 text-center'>{{ $t('activity.mysterious06') }}</span>
            <span class='w-1/2 text-center'>{{ $t('activity.mysterious07') }}</span>
          </div>
          <div 
            v-for="(item, index) in curRewardConfig?.config" 
            class="w-full h-[2.625rem] flex-around mysterious-text-xs" 
            :class="{'reward-item-bg': index%2 }"
          >
            <span class="w-1/2 text-center mysterious-reward-item-left">
              {{ merchantCy }} {{ convertMoneyToShow(item.recharge) }}
            </span>
            <span class="w-1/2 text-center mysterious-reward-item-right font-weight-bold">
              {{ merchantCy }} {{ convertMoneyToShow(item.minAmount) }}~{{convertMoneyToShow(item.maxAmount)}}
            </span>
          </div>
        </div>
        <!-- 活动规则 -->
        <div class="mx-3 mt-9 pb-28">
          <p class="mb-5 mysterious-text-sm font-weight-medium title-text">{{ $t('activity.appreciation13') }}</p>
          <p class="mysterious-text-xs font-weight-regular rule-text keep-space">
            {{ activityInfo.description }}
          </p>
        </div>
      </div>
    </ion-content>
    <Footer v-if="showReceiveBtn || !isLogin">
			<!-- 领取按钮 -->
      <Button v-if="isLogin" @click="onActivityApply" :disabled="!curRewardConfig.isCanReceive" :shiny="!!curRewardConfig.isCanReceive">
        {{ $t('activity.mysterious05') }}
      </Button>
      <Button v-else @click="loginHandle">
        {{ $t('activity.mysterious10') }}
      </Button>
		</Footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonImg } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/first/Button/index.vue'
import Footer from '@/views/activity/comp/first/Footer/index.vue';
import HotPoint from "@/components/HotPoint/index.vue";
import TimeIcon from '@/views/activity/mysterious/first/timeIcon.vue';
import CoinIcon from '@/views/activity/mysterious/first/coinIcon.vue';
import { convertMoneyToShow } from '@/utils/custom';
import useLogic from '../logic';

const { 
  activityInfo,
  merchantCy,
  checkLevel,
  curRewardConfig,
  receiveTime,
  onActivityApply,
  onLevelCheck,
  getLevelBg,
  isLogin,
  loginHandle,
  dayMaxReward,
  showReceiveBtn,
} = useLogic();


</script>

<style scoped lang="less">
@import "@/views/activity/mysterious/first/styles/base-index.less";

.new-skin-symbol { 
  @import "@/views/activity/mysterious/first/styles/theme-style.less";
}
</style>
