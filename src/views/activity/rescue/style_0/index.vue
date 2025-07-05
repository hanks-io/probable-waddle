<!-- 救援金活动 -->
<template>
    <ion-page>
      <NavigationBar :title="activityName"/>
      <ion-content class="ion-padding ">
        <div class="flex flex-col items-center">
          <!-- 横幅 -->
          <div class="w-full h-[9.375rem] rounded-[.625rem] relative text-white" :style="banner" >
            <CountDown :issueEndTime="issueEndTime" @updateTime="getAssistanceDetail"/>
          </div>
          <!-- 活动倒计时 -->
          <div class="text-center text-xs my-3.5" v-if="calcStatus">
            <span class="py-1 px-1.5 rounded-[.3125rem] activityTime  text-[--color-text-basic]">
              <span>{{  showEndCountdown ? $t('activity.activity') : $t('activity.foreverActivity') }}</span>
              <span v-if="activityStatus">{{ showEndCountdown ? $t('activity.end') : $t('activity.foreverEnd') }}</span>
              <span v-else-if="overTime > 0">{{ $t('activity.start') }}</span>
              <span v-else>{{ $t('activity.over') }}</span>
              <span v-if="overTime > 0">
                <span>{{ $t('activity.countdown') }}：</span>
                <span v-if="showEndCountdown">{{ overCountdown }}</span>
                <span v-else>{{ $t('activity.forever') }}</span>
              </span>
            </span>
          </div>
         
          <!-- 救援金图表 -->
          <p class="text-[0.875rem] font-black mb-2 rescueHeader text-[--color-text-basic]">{{ $t('viewsActivity.rescueAmount') }}</p>
          <div class="rounded-[.3125rem] rescueBorder  w-full border-[1px] overflow-hidden">
            <table class="modal w-full text-sm leading-[1.875rem] ">
              <thead>
                <tr>
                  <th class="rewardTheadColor">{{ $t('viewsActivity.lossAmount') }}</th>
                  <th class="rewardTheadColor">{{ $t('label.collectable') }}</th>
                </tr>
              </thead>
              <tbody class="rescueBody  font-bold">
                <tr v-for="item in rescueInfo.rewardLevels" :key="item.uuid">
                  <th class="rescueBodyLeft text-[--color-text-basic]">{{ convertMoneyToShow(item.conditionAmount) }}</th>
                  <th v-show="rescueInfo.rewardType === ZAssistancerewardType.enum.FIXED">
                    {{convertMoneyToShow(item.rewardAmount) }}
                  </th>
                  <th v-show="rescueInfo.rewardType === ZAssistancerewardType.enum.RANGE">
                    {{convertRatioToShow(item.rewardAmount) }}%
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 今日损益信息 -->
          <p class="text-[0.875rem] font-black mt-5 mb-2 rescue-text-basic-today">{{ profitTitle }}</p>
          <ion-row class="profitLoss justify-between w-full text-xs">
            <ion-col class="rescue-ioncol-border rounded-[.3125rem] text-center py-2">
              <p class="mb-2.5 today-tips">{{ $t('viewsActivity.myLoss') }}</p>
              <span class="text-[.9375rem] rescue-text-basic font-bold">{{ merchantCy }} {{ convertMoneyToShow(rescueInfo.profit) }}</span>
            </ion-col>
            <ion-col v-if="showCouponAmount" class="rescue-ioncol-border rounded-[.3125rem] text-center ml-5 py-2">
              <p class="mb-2.5 today-tips">{{ $t('viewsActivity.discountsMustBeDeducted') }}</p>
              <span class="text-[.9375rem] rescue-text-basic font-bold">{{ merchantCy }} {{ convertMoneyToShow(rescueInfo.reward) }}</span>
            </ion-col>
            <ion-col class="rescue-ioncol-border rounded-[.3125rem] text-center ml-5 py-2">
              <p class="mb-2.5 today-tips">{{ $t('label.collectable') }}</p>
              <span class="text-[.9375rem] rescue-text-basic font-bold">{{ merchantCy }} {{ convertMoneyToShow(rescueInfo.rewardAmount) }}</span>
            </ion-col>
          </ion-row>
          <!-- 领取按钮  -->
          <!-- <ion-item v-if="showReceiveBtn" class="submit w-[17.5rem] text-[16px] mt-5 mx-10"
            :class="activityStatus && btnReceiveIsEnable ? 'drop-shadow-[0_2px_4px_rgba(32,139,229,0.25)] shiny' : 'unable'"
            :detail="false" button @click="onActivityApply">
            <ion-label class="w-full text-center">{{ $t('toggle.claim') }}</ion-label>
          </ion-item> -->
          <!-- 活动介绍 -->
          <div class="rescueDes bg-[--color-bg-second] p-2.5 text-xs rounded-[.625rem] w-full mt-5 mb-[7rem] text-[--color-text-second]">
            <p class="whitespace-pre-line keep-space">{{ rescueInfo.rule }}</p>
          </div>
  
        </div>
  
      </ion-content>
      <Footer v-if="showReceiveBtn && skin == 'default'" >
        <div class="btn" :class="activityStatus && btnReceiveIsEnable ? 'shiny active' : 'unable'"
          @click="onActivityApply">{{ $t('toggle.claim') }}</div>
      </Footer>
      <FooterFirst v-if="showReceiveBtn && skin == 'first'">
        <ButtonFirst :disabled="!(activityStatus && btnReceiveIsEnable)" :shiny="activityStatus && btnReceiveIsEnable" @click="onActivityApply">
          {{$t('toggle.claim') }}
        </ButtonFirst>
      </FooterFirst>
      <FooterSecond v-if="showReceiveBtn && skin == 'second'">
        <ButtonSecond :disabled="!(activityStatus && btnReceiveIsEnable)" :shiny="activityStatus && btnReceiveIsEnable" @click="onActivityApply">
          {{$t('toggle.claim') }}
        </ButtonSecond>
      </FooterSecond>
      <!-- 申请弹窗(暂时用不上，留着吧，万一后面又要加) -->
      <ion-modal id="modal-apply" :is-open="modalVisible" :backdrop-dismiss="false">
        <form class="bg-[#090F1F] flex flex-col items-center relative z-[-2] px-2.5" @submit="submitForm">
          <!-- 关闭按钮 -->
          <ion-icon class="absolute top-3 right-2 text-3xl" :icon="close" @click="modalCloseHandle" />
          <p class="text-xl my-3.5">{{ $t('activity.agent24') }}</p>
          <!-- 申请说明 -->
          <div class="text-xs border-b border-t border-[#2A324E] py-2.5">
            {{ $t('viewsActivity.applyDescription') }}：<br>
            {{ $t('viewsActivity.applyOne') }}<br>
            {{ $t('viewsActivity.applyTwo') }}<br>
            {{ $t('viewsActivity.applyThree') }}
          </div>
          <!-- 亏损金额输入框-->
          <p class="text-sm w-full text-left my-2.5">{{ $t('viewsActivity.pleaseEnterLoss') }}</p>
          <ion-item class="input w-full" lines="none">
            <ion-input v-model="applyAmount" mode="ios" type="number" :placeholder="$t('viewsActivity.pleaseEnterLoss')"
              required />
          </ion-item>
          <!-- 确认申请按钮 -->
          <ion-item class="submit w-[17.5rem] text-[16px] drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)] my-5 mx-10">
            <ion-button class="w-full text-[14px] text-white" fill="clear" type="submit">
              <ion-spinner class="z-10 w-5 h-5" slot="start" name="bubbles" color="warning" v-if="btnLoading" />
              {{ $t('main.confirm') }}
            </ion-button>
          </ion-item>
        </form>
      </ion-modal>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { close } from 'ionicons/icons'
  import { ZAssistancerewardType } from '@/enums/types/activity.type'
  import { getTheme } from '@/theme/hooks';
  import { IonPage, IonContent, IonRow, IonCol, IonModal, IonIcon, IonInput, IonSpinner, IonItem, IonButton } from '@ionic/vue'
  import NavigationBar from '@/components/NavigationBar/index.vue'
  import CountDown from '@/views/activity/comp/default/Countdown/index.vue'
  import Footer from '@/views/activity/comp/default/Footer/index.vue'
  import FooterFirst from '@/views/activity/comp/first/Footer/index.vue';
  import ButtonFirst from '@/components/first/Button/index.vue'
  import FooterSecond from '@/views/activity/comp/second/Footer/index.vue';
  import ButtonSecond from '@/components/second/Button/index.vue'
  import { convertMoneyToShow, convertRatioToShow } from '@/utils/custom'
  import useLogic from '../logic'

  const { skin } = getTheme();
  
  const {
    overTime,
    applyAmount,
    calcStatus,
    btnLoading,
    overCountdown,
    modalVisible,
    activityStatus,
    showEndCountdown,
    activityName,
    showReceiveBtn,
    btnReceiveIsEnable,
    profitTitle,
    showCouponAmount,
    rescueInfo,
    banner,
    issueEndTime,
    merchantCy,
    modalCloseHandle,
    submitForm,
    getAssistanceDetail,
    onActivityApply,
  } = useLogic()
  
  </script>
  
  <style scoped lang="less">
    // 基础公共 less
    @import "@/views/activity/rescue/style_0/base-index.less";
    @import "@/views/activity/rescue/style_0/theme-style.less";
    
    #activity-rescue-default-index.style();
  
    .blue-default {
      #activity-rescue-default-index.style(
        --color-border-600,
        --color-bg-200,
        --color-bg-200,
        --color-text-white-100,
        --color-text-white-100,
        --color-border-600,
        --color-text-gray-700,
        --accent-color-yellow,
        --color-border-600,
        --color-text-gray-700,
        --color-bg-200,
        --color-text-gray-200
      );
    }
  
    .green-default {
      #activity-rescue-default-index.style(
        --color-line,
        --color-bg-200,
        --color-bg-200,
        --color-text-gray-100,
        --color-text-gray-100,
        --color-line,
        --color-text-gray-100,
        --accent-color-yellow,
        --color-line,
        --color-text-gray-200,
        --color-bg-200,
        --color-text-gray-200
      );
    }
  
    .amber-purple {
      #activity-rescue-default-index.style(
        --line-color,
        --color-bg-200,
        --color-bg-200,
        --text-color-light-purple-1-100,
        --text-color-light-purple-1-100,
        --line-color,
        --text-color-light-purple-1-100,
        --accent-color-yellow,
        --line-color,
        --text-color-light-purple-2-100,
        --color-bg-200,
        --text-color-light-purple-2-100
      );
    }
    .amber-purple,
    .green-dark ,
    .yellow-dark ,
    .purple-light {
      #activity-rescue-default-index.style(
        @rescue-default-index-01 : --color-border,
        --color-bg-300,
        --color-bg-200,
        --text-color-light-purple-1-100,
        @rescue-default-index-05 : --color-currency,
        --line-color,
        --text-color-light-purple-1-100,
        --accent-color-yellow,
        @rescue-default-index-09 : --color-border,
        @rescue-default-index-10 : --color-text-40,
        --color-bg-200,
        --text-color-light-purple-2-100,
        @rescue-default-index-13: --color-bg-200,
        @rescue-default-index-14: --color-border,
        @rescue-default-index-15: --color-text-40,
        @rescue-default-index-16: --color-currency,
        @rescue-default-index-17: --color-text-100,
        @rescue-default-index-18: --color-text-80,
        @rescue-default-index-19: --color-text-100,
        @rescue-default-index-20: --color-bg-200,
        @rescue-default-index-21: --color-bg-200,
        @rescue-default-index-22: --color-activity-rule,
        @rescue-default-index-23: --color-bg-200,
      );

      table th {
        font-weight: 700;
        border-right: none;
        border-bottom: none;
      }
      table thead th {
         height: 2.5rem;
      }
      table thead th:first-child {
         border-left: none;
      }
      table tbody th:first-child {
         border-left: none;
      }
  
    }

    .auroral-yellow {
      #activity-rescue-default-index.style(
        @rescue-default-index-01: --color-border,
        @rescue-default-index-09: --color-border,
      );
    }

  .new-skin-symbol {
    #activity-rescue-default-index.style(@rescue-default-index-01:  --ep-color-border-default, 
    @rescue-default-index-02: --ep-color-background-fill-surface-raised-L2, 
    @rescue-default-index-20: --ep-color-background-fill-surface-raised-L2,
      @rescue-default-index-21: --ep-color-background-fill-surface-raised-L1, 
      @rescue-default-index-22: --ep-color-text-weak, 
      @rescue-default-index-14: --ep-color-border-default,
      @rescue-default-index-17: --ep-color-text-default,
      @rescue-default-index-15: --ep-color-text-default,
      @rescue-default-index-18: --ep-color-text-default,
      @rescue-default-index-05:--ep-color-text-default,
      @rescue-default-index-10: --ep-color-text-weak
      );
      .activityTime{
        color: var(--ep-color-text-default);
      }
    .rescueBorder {
      border-radius: var(--ep-border-radius-m);
      table {
        font-size: var(--ep-font-size-s);
        tbody tr {
          th {
            background-color: var(--ep-color-background-fill-surface-lowered);

            &:not(:first-child) {
              font-weight: var(--ep-font-weight-bold);
              color: var(--ep-color-text-warning)
            }
          }
        }
      }
    }
    .profitLoss {
      ion-col {
        border-radius: var(--ep-border-radius-m);
        p {
          color: var(--ep-color-text-weak);
          font-size: var(--ep-font-size-s);
        }
        span {
          font-size: var(--ep-font-size-m);
        }
      }
    }
  }
  </style>
  