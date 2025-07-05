<!-- 神秘彩金 -->
<template>
  <ion-page>
    <NavigationBar :title="activityInfo.name" bgColor="--ion-color-dark" />
    <ion-content>
      <div class="overflow-auto bgcolor-style-1">
        <div class="h-[16.6875rem]">
          <div class="relative">
            <!-- banner -->
            <ion-img src="/first/images/mysterious-banner_1.png"></ion-img>
            <!-- 奖励等级 -->
            <div class="absolute w-full top-[11.275rem] flex-around">
              <div v-for="(item, index) in activityInfo.rewardConfigs" class="w-[3.6275rem]"
                @click="onLevelCheck(index)">
                <div class="relative w-[3.6275rem]">
                  <ion-img class="w-[3.6275rem] h-[5.2rem]" :class="{'active-checked':checkLevel === index}" :src="getLevelBg(checkLevel, index)"></ion-img>
                  <div class="absolute top-0 left-0 w-[3.6275rem] h-[5.2rem] flex-wrap flex-center pt-[0.4rem]">
                    <ion-icon class="w-11 h-11" :src="item.icon"></ion-icon>
                    <div class="h-[1.3125rem] flex-center"
                      :class="checkLevel === index ? 'level-check-text' : 'level-uncheck-text'">
                      <p class="text-xs font-weight-bold pb-[1.2rem]">{{ $t('activity.mysterious01', { day: item.day })
                        }}</p>
                    </div>
                  </div>
                  <HotPoint :isShow="item.isCanReceive" classNames="top-0 right-[0.625rem]" />
                </div>

                <div class="h-[1.3125rem] flex-center"
                  :class="checkLevel === index ? 'level-check-text' : 'level-uncheck-text'">
                  <ion-icon v-show="checkLevel === index" class="w-[0.6813rem] h-[0.6813rem] thomecolor"
                    src="/first/svg/mysterious-icon5.svg"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 活动时间 -->
        <div class="h-[22.125rem] cotent-bgcolor-style-1 rounded-middle mx-3 mt-[1.325rem] py-3 px-6 overflow-hidden">
          <div class="flex-between normal-text text-sm mt-[0.8125rem]">
            <div class="flex-start">
              <ion-icon class="w-5 h-5" src="/first/svg/mysterious-style-1-icon1.svg"></ion-icon>
              <p class="ml-[0.4375rem] ">{{ $t('activity.mysterious02') }}</p>
            </div>
            <p class="font-weight-medium">{{ activityInfo.joinTimeStr }}</p>
          </div>
          <div class="flex-between normal-text text-sm mt-[0.6381rem]">
            <div class="flex-start">
              <ion-icon class="w-5 h-5" src="/first/svg/mysterious-style-1-icon2.svg"></ion-icon>
              <p class="ml-[0.4375rem]">{{ $t('activity.mysterious03', { day: curRewardConfig.day }) }}</p>
            </div>
            <p class="font-weight-medium"> {{ merchantCy }}{{ convertMoneyToShow(curRewardConfig.dayRecharge ?? 0) }}
            </p>
          </div>
          <div
            class="w-[20rem] h-[14.0625rem] cotent-bgcolor-inner-style-1 rounded-middle mx-auto mt-6 px-[0.9375rem] overflow-hidden normal-text">
            <div>
              <p class="mt-5 text-center receive-text">{{ $t('activity.mysterious04') }}</p>
              <div class="flex-start flex-col mt-6">
                <div>
                  <div class="w-full flex-center">
                    <div class="flex-start">
                      <ion-icon class="w-[1.375rem] h-[1.375rem]"
                        src="/first/svg/mysterious-style-1-icon3.svg"></ion-icon>
                      <p class="ml-[0.1563rem] text-lg receive-text font-weight-medium">{{ receiveTime }}</p>
                    </div>
                  </div>
                  <div class="w-full flex-start mt-2">
                    <div>
                      <div class="flex-center">
                        <ion-icon class="w-[1.375rem] h-[1.375rem]"
                          src="/first/svg/mysterious-style-1-icon4.svg"></ion-icon>
                        <p class="ml-[0.1563rem] text-lg receive-text">{{ $t('activity.mysterious07') }}</p>
                        <div>
                        </div>
                      </div>
                      <p class="ml-[1.5313rem] text-sm receive-text">{{ merchantCy }}
                        <span class="text-xl receive-text-money font-weight-bold">{{ convertMoneyToShow(dayMaxReward)
                          }}</span>
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
          <div
            class="w-full flex-around h-9 table-header-bgcolor-style-1 rounded-middle-t   text-[rgba(189,184,225,1)]  text-xs font-weight-bold">
            <span class='w-1/2 text-center'>{{ $t('activity.mysterious06') }}</span>
            <span class='w-1/2 text-center'>{{ $t('activity.mysterious07') }}</span>
          </div>
          <div v-for="(item, index) in curRewardConfig?.config" class="w-full h-[2.625rem] flex-around text-xs"
            :class="{ 'reward-item-bg': index % 2 }">
            <span class="w-1/2 text-center table-left-color-style-1 font-weight-bold">
              {{ merchantCy }} {{ convertMoneyToShow(item.recharge) }}
            </span>
            <span class="w-1/2 text-center table-right-color-style-1 font-weight-bold">
              {{ merchantCy }} {{ convertMoneyToShow(item.minAmount) }}~{{ convertMoneyToShow(item.maxAmount) }}
            </span>
          </div>
        </div>
        <!-- 活动规则 -->
        <div class="mx-3 mt-9 pb-28">
          <p class="mb-5 text-sm font-weight-medium rule-title">{{ $t('activity.appreciation13') }}</p>
          <p class="text-xs font-weight-regular rule-text keep-space">
            {{ activityInfo.description }}
          </p>
        </div>
      </div>
    </ion-content>
    <Footer v-if="showReceiveBtn || !isLogin" :class="'custom-footer'">
      <!-- 领取按钮 -->
      <Button v-if="isLogin" @click="onActivityApply" :disabled="!curRewardConfig.isCanReceive" :classType="'style-1'"  class="text-white"
        :shiny="!!curRewardConfig.isCanReceive">
        {{ $t('activity.mysterious05') }}
      </Button>
      <Button v-else @click="loginHandle" :classType="'style-1'">
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
import { convertMoneyToShow } from '@/utils/custom';
import useLogic from '@/views/activity/mysterious/logic';

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
@level-check-text: #fff;
@mysterious_style_svgcolor: #FEB805;

.bgcolor-style-1 {
  background: linear-gradient(180deg, #1B071C 20.7%, #474386 100%);

  .cotent-bgcolor-style-1 {
    border-radius: 10px;
    background: url('/first/images/cotent-bgcolor-style1.png') no-repeat;
    background-size: 100% 100%;
    backdrop-filter: blur(50.5px);
  }

  .cotent-bgcolor-inner-style-1 {
    border-radius: 10px;
    border: 1px solid #FAA648;
    background: linear-gradient(96deg, #FFCC7D 0%, #B0763E 97.21%);
  }

  .table-header-bgcolor-style-1 {
    background: rgba(255, 255, 255, 0.10);
    color: rgba(255, 255, 255, 0.4);
  }

  .table-left-color-style-1 {
    color: rgba(255, 255, 255, 0.8);
  }

  .table-right-color-style-1 {
    color: #DF8644;
  }
}

.thomecolor {
  color: @mysterious_style_svgcolor;
}

.level-check-text {
  color: @level-check-text;
}

.level-uncheck-text {
  color: var(--text-color-white-40)
}

.custom-footer {
  background-color: #393266;
  box-shadow:  0px 0.0313rem 0px 0px #5f588c inset;
}

.normal-text {
  color: rgba(255, 255, 255, 0.8)
}

.receive-text {
  color: #2F2E2D;

  .receive-text-money {
    color: #BE0527;
  }
}

.reward-item-bg {
  background: rgba(0, 0, 0, 0.10)
}

.rule-title {
  color: rgba(255, 255, 255, 0.8);
}

.rule-text {
  color: rgba(255, 255, 255, 0.4);
}
.active-checked{
  border-radius: 14px;
  box-shadow: 0px 4px 20px 0px rgba(255, 142, 86, 0.26);
}
</style>
