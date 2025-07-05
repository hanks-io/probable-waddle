<!-- 分享助力活动 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="md">
        <BackButton class="ml-2" slot="start" />
        <ion-title class="ps-0">
          <ion-row class="items-center">
            <ion-label>{{ $t('activity.earn') }} {{ tenantInfo?.merchantCy }} {{ formatMoneyToShow(roundAmount) }} {{
              $t('activity.freeMoney') }}</ion-label>
          </ion-row>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- 助力进度信息  (rangeAmount * 100 / roundAmount) == 100-->

      <div class="px-10 pt-6">
        <ion-row class="items-center justify-between text-3xl font-black text-[#6ddf38]">
          <ion-img class="w-[3.25rem]" src="/images/activity/cash_dollar.png" />
          <p>{{ tenantInfo?.merchantCy }} {{ formatMoneyToShow(rangeAmount) }}</p>
          <ion-row class="bg-gradient-to-r from-[#49a319] to-[#2b8b2f] rounded-[.625rem] px-2 py-1"
            :class="{ shiny: isFull }" @click="pieceHandle">
            <ion-img class="w-3.5" src="/images/activity/coin.webp" />
            <p class="ml-1 text-xs text-white uppercase">{{ $t('main.withdraw') }}</p>
          </ion-row>
        </ion-row>
        <!-- 进度文本 -->
        <p class="text-sm font-black text-end text-[--color-text-unThemeWhite]">{{ formatRatioToShow((rangeAmount * 100 / roundAmount) || 0) }}%</p>
        <!-- 进度条 -->
        <div class="flex w-full h-[.625rem] rounded-[.3125rem] bg-[#6ddf39]" :class="rangeAmount ? 'justify-end' : ''">
          <span class="h-full w-[.625rem] bg-white rounded-full"
            :style="`margin-right:${(roundAmount - rangeAmount) / roundAmount * 18.75}rem`" />
        </div>
        <div class="text-[.875rem] text-center my-2 line-clamp-2">
          {{ $t('activity.youStillNeed') }}
          <span class="text-[#6ddf39]">
            {{ formatMoneyToShow(roundAmount - rangeAmount) }}
          </span>
          {{ $t('activity.toWithdraw') }}
        </div>
      </div>
      <!-- 转盘 -->
      <div class="h-[23.875rem] w-[24.375rem] relative" :style="wheelBoxStyle">
        <!-- 光圈 -->
        <div class="absolute top-[-2rem] -z-10">
          <ion-img class="aperture" src="/images/activity/share_aperture.webp" />
        </div>
        <!-- 闪烁灯 -->
        <ion-img class="wheel-light w-[14.875rem] absolute left-[4.625rem] top-[6.875rem] z-10"
          :style="`animation-duration: ${tempo}ms`" src="/images/activity/share_light.webp" />
        <!-- 指针 -->
        <div class="h-[7.75rem] flex flex-col justify-end"><ion-img class="mr-0.5 mb-[-1.275rem] h-11 z-20" :class=" apertureIsLoaded ? 'opacity-100' : 'opacity-0'" @ionImgDidLoad="apertureLoaded"
          src="/images/activity/pointer.webp" />
        </div>
        <!-- 选中闪光 -->
        <div class="absolute left-0 right-0 z-10 flex flex-col items-center mx-auto"
          :class="winning ? 'winning-box' : 'hidden'">
          <div class="mr-2 winning-arc" />
          <div class="winning-left h-20 w-[.1875rem] bg-white" />
          <div class="winning-right h-20 w-[.1875rem] bg-white" />
        </div>
        <!-- 转盘 -->
        <div class="relative flex justify-center mr-1">
          <LuckyWheel ref="luckyRef" width="13rem" height="13rem" :blocks="blocks" :prizes="prizes" :buttons="buttons"
            :defaultConfig="{ offsetDegree: -22, speed: 18, accelerationTime: 1500, decelerationTime: 3500 }"
            @start="startCallback" @end="endCallback" />
          <!-- 转盘开始按钮 turntable-shiny-->
          <div
            class="absolute top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center w-48 h-48 m-auto rounded-full wheel-start">
            <div class="button w-16 h-[5.31rem] whitespace-nowrap flex items-center justify-center text-[--color-text-unThemeWhite]" :class="{ on: startClick }">
              <p class="pt-1 text-lg font-black" v-if="winning && awardCount && prizeType == 'rangeAmount'">+{{
                convertMoneyToShow(awardCount) }}
              </p>
              <p class="pt-1 text-3xl font-black" v-else>{{ roundCount }}</p>
            </div>
          </div>
          <div
            class="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-48 h-48 m-auto rounded-full wheel-start"
            v-show="!startClick">
            <div class="button w-16 h-[5.31rem] flex items-center justify-center" v-show="isShowAnimationEl"
              :class="{ on: startClick, zoom: isAddAnimation  }">
            </div>
          </div>
          <img v-show="isShowAnimationEl" :class="['finger', { 'fingerAnimation':  isAddAnimation}]"
              src="/images/activity/finger.png" />
        </div>
        <!-- 活动倒计时  isAddAnimation-->
        <p class="absolute w-full text-xs text-center bottom-2" v-if="expireTime"><span class="text-[--color-text-second]">{{
          $t('viewsActivity.expirationTime') }} </span><span class="text-[--color-text-unThemeWhite]">{{ expireCountdown }}</span></p>
      </div>
      <!-- 分享模块 -->
      <div class="px-5 h-[2.375rem]">
        <ion-row class="text-sm bg-[--color-bg-second] py-2 px-3 rounded-[.25rem]" @click="shareHandle" v-if="expireTime">
          <p class="flex-1 text-center invite">{{ $t('activity.inviteFriendsWithdrawal') }}</p>
          <ion-icon class="text-lg text-[--color-text-basic]" :icon="shareSocial" />
        </ion-row>
      </div>
      <div class="px-5 my-5">
        <ion-row class="text-sm justify-around bg-[--color-bg-second] rounded-[.25rem]">
          <p class="py-2" :class="recordTabs == 0 ? 'piece-pChecked' : 'text-[--color-text-wheelBottomUnchecked]'" @click="recordTabs = 0">{{ $t('main.report')
            }}</p>
          <p class="py-2" :class="recordTabs == 1 ? 'piece-pChecked' : 'text-[--color-text-wheelBottomUnchecked]'" @click="recordTabs = 1">{{
            $t('main.myReference') }}</p>
        </ion-row>
      </div>
      <div class="h-40 mb-5 mx-5 p-[0.625rem] rounded-[0.625rem] overflow-hidden bg-[--color-bg-second]">
        <div class="h-40 overflow-hidden">
          <!-- 全平台助力领取记录 -->
          <div class="scroll-box text-xs text-[--color-text-second] leading-loose"
            :style="{ animationDuration: `${scrollDuration}s` }" v-show="recordTabs == 0">
            <ion-row v-for="item in assistanceCashAwards" :key="item.userId">
              <p>{{ encryptionText(item.userId) }}</p>
              <p class="flex-1 pl-28">{{ $t('activity.justGotIt') }}</p>
              <ion-row class="text-[#6ddf39] items-center">
                + {{ convertMoneyToShow(item.amount) }} 
                <p v-if="tenantInfo?.merchantCy" class="ml-2 h-4 w-4 text-center bg-[#6ddf39] leading-[1.125rem] text-[.625rem] text-white rounded-full font-black">
                  {{ tenantInfo?.merchantCy }}
                </p>
              </ion-row>
            </ion-row>
          </div>
          <!-- 我的助力记录 -->
          <ion-content v-show="recordTabs" class="h-40 overflow-y-auto hide-scrollbar">
            <div class="text-[--color-text-second] text-xs leading-loose min-h-full bg-[--color-bg-second]">
              <ion-row v-for="item in assistanceCashHelps" :key="item.userId">
                <p>{{ encryptionText(item.userId) }}</p>
                <p class="flex-1 pl-28"></p>
                <ion-row class="text-[#6ddf39] items-center">
                  + {{ convertMoneyToShow(item.helpAmount ?? 0) }} 
                  <p v-if="tenantInfo?.merchantCy" class="ml-2 h-4 w-4 text-center bg-[#6ddf39] leading-[1.125rem] text-[.625rem] text-white rounded-full font-black">
                    {{ tenantInfo?.merchantCy }}
                  </p>
                </ion-row>
              </ion-row>
            </div>
          </ion-content>
        </div>
      </div>
      <!-- 规则 -->
      <p class="rounded-[0.625rem] mb-[1.25rem] mx-5 p-[0.625rem] bg-[--color-bg-second] text-xs text-[--color-text-rule] keep-space">
        {{ rule }}
      </p>
    </ion-content>
    <!-- 帮助弹窗 -->
    <ion-modal id="modal-help" :is-open="modalHelpVisible" :backdrop-dismiss="false">
      <div class="bg-[#090F1F] flex flex-col items-center relative z-[-2] px-5">
        <!-- 关闭按钮 -->
        <ion-icon class="absolute text-3xl top-3 right-2" :icon="close" @click="modalCloseHandle" />
        <p class="text-xl my-3.5 text-[#66D73E] font-black">{{ $t('main.rules') }}</p>
        <!-- 申请说明 -->
        <div class="w-full text-sm py-2.5 leading-tight">
          <p class="mb-2.5" v-html="rule"></p>
        </div>
      </div>
    </ion-modal>
    <!-- 邀请助力弹窗 -->
    <ion-modal id="modal-piece" :is-open="modalPieceVisible" :backdrop-dismiss="false">
      <div class="bg-[--color-bg-first] flex flex-col items-center relative z-[-2] px-5">
        <!-- 关闭按钮 -->
        <ion-icon class="absolute text-3xl top-3 right-2" :icon="close" @click="modalCloseHandle" />
        <p class="w-full text-sm my-3.5 font-black text-[--color-text-basic]">{{ $t('viewsActivity.willSoonBeAbleGet') }}</p>
        <!-- 步骤 -->
        <div class="w-full text-xs p-2.5 text-center leading-tight bg-[--color-bg-second] rounded-[.625rem]">
          <p class="text-[#66D73E]">{{ $t('viewsActivity.amountAlreadyOwned') }}</p>
          <p class="text-3xl text-[#EE4639] font-black">{{ formatMoneyToShow(rangeAmount) }}{{ tenantInfo?.merchantCy }}
          </p>
          <p class="w-full text-start text-[--color-text-basic]">{{ $t('viewsActivity.numberOfInitiations') }}</p>
          <p class="w-full text-start my-2.5 text-[--color-text-basic]">{{ $t('viewsActivity.paymentMethod') }}</p>
          <div class="step bg-[--color-bg-third] text-start px-3.5 py-2.5 rounded-[.625rem]">
            <ion-row class="items-center">
              <div class="relative"><ion-checkbox mode="md" :checked="true" />
                <div class="absolute top-0 left-0 z-10 w-full h-full" />
              </div>
              <p class="text-[.625rem] text-[#66D73E] ml-1.5">{{ $t('viewsActivity.paymentRequestSubmitted') }}</p>
            </ion-row>
            <ion-icon class="h-5 text-default" :src="getImageUrl('img/common/piece_step_lines.svg')" />
            <ion-row class="items-center">
              <div class="relative"><ion-checkbox mode="md" :checked="true" />
                <div class="absolute top-0 left-0 z-10 w-full h-full" />
              </div>
              <p class="text-[.625rem] text-[#66D73E] ml-1.5">{{ $t('viewsActivity.stillNeed') }}{{
                formatMoneyToShow(roundAmount - rangeAmount) }}{{ $t('viewsActivity.applyForWithdrawal') }}</p>
            </ion-row>
            <ion-icon class="h-5 text-default" :src="getImageUrl('img/common/piece_step_lines.svg')" />
            <ion-row class="items-center">
              <div class="relative" v-if="roundAmount == rangeAmount"><ion-checkbox mode="md" :checked="true" />
                <div class="absolute top-0 left-0 z-10 w-full h-full" />
              </div>
              <ion-icon class="text-default" :icon="ellipse" v-else />
              <p class="text-[.625rem] text-default ml-1.5 text-[--color-text-basic]">{{ formatMoneyToShow(roundAmount) }} {{
                tenantInfo?.merchantCy }} {{ $t('viewsActivity.willBeDepositedIntoAccount') }}</p>
            </ion-row>
          </div>
        </div>
        <!-- 确认申请按钮 -->
        <ion-item
          class="submit w-[17.5rem] text-[16px] drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)] my-5 mx-10 pop shiny"
          :detail="false" button>
          <ion-button class="w-full text-[14px] text-white " fill="clear" v-if="roundAmount == rangeAmount"
            @click="awardReceiveHandle">
            <ion-spinner class="z-10 w-5 h-5" slot="start" name="bubbles" color="dark" v-if="btnLoading" />
            {{ $t('viewsActivity.claimNow') }}
          </ion-button>
          <ion-button class="w-full text-[14px] text-white" fill="clear" v-else @click="inviteFriendsHandle">{{
            $t('viewsActivity.inviteFriendsHelp') }}</ion-button>
        </ion-item>
      </div>
    </ion-modal>
    <!-- 分享弹窗 -->
    <ion-modal id="modal-share" :is-open="modalShareVisible" :initial-breakpoint="1" :backdrop-dismiss="false">
      <div class="flex flex-col justify-end h-full">
        <div class="p-3 text-[#898988] bg-white relative">
          <!-- 关闭按钮 -->
          <ion-icon class="absolute text-xl top-3 right-2" :icon="close" @click="modalCloseHandle('share')" />
          <!-- 分享平台列表 -->
          <p class="text-sm font-black">1. {{ $t('activity.inviteFriendsWithdrawal') }}</p>
          <ion-segment ref="segment" mode="ios" scrollable 
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseLeave"
            @mousemove="handleMouseMove">
            <ion-segment-button v-for="(item, index) in segmentList" :value="item.name" :key="item.name"
              :disabled="disableTab"  @click="launchHandle(item.name)">
              <img :src="item.icon" class="w-[2.1875rem] h-[2.1875rem]" />
            </ion-segment-button>
          </ion-segment>
          <!-- 分享链接 -->
          <ion-row class="text-sm justify-between bg-[#f9f9f9] py-2 px-3 rounded-[.25rem]">
            {{ shareUrl }}
            <span class="text-[#40a1de]" @click="copy(shareUrl)">{{ $t('main.copy') }}</span>
          </ion-row>
          <!-- 分享号码列表 -->
          <p class="text-sm font-black mt-4 mb-2.5" v-if="sharePhones.length">2. {{ $t('activity.sendRandomPlayer') }}
          </p>
          <div class="bg-[#898988] rounded-[.1875rem] p-1.5" v-if="sharePhones.length">
            <ion-row>
              <ion-col size="3" class="ps-0 pe-0 text-center text-[.625rem] leading-none"
                :class="item.isUsed ? 'text-[#BBB]' : 'text-white'" v-for="(item,index) in sharePhones" :key="index">
                {{ item.phone }}
              </ion-col>
            </ion-row>
            <ion-row class="text-xs leading-relaxed text-black">
              <ion-col size="6" class="pr-2" @click="whatsappHandle">
                <ion-row class="bg-white h-12 px-2 py-1 rounded-[.1875rem] items-center">
                  <p class="flex-1">{{ $t('activity.sendMessageOn') }}<span class="font-black"> WhatsAPP</span></p>
                  <img class="w-9" src="/images/activity/call.svg" />
                </ion-row>
              </ion-col>
              <ion-col size="6" class="pl-2" @click="sendSMSHandle">
                <ion-row class="bg-white h-12 px-2 py-1 rounded-[.1875rem] items-center">
                  <img class="mr-1 w-9" src="/images/activity/sms.png" />
                  <p class="flex-1">{{ $t('activity.sendMessageOn') }}<span class="font-black"> SMS</span></p>
                </ion-row>
              </ion-col>
            </ion-row>
          </div>
        </div>
      </div>
    </ion-modal>
    <!-- 奖励弹窗 -->
    <ion-modal id="modal-prize" :is-open="modalPrizeVisible" :backdrop-dismiss="false">
      <div class="bg-[--color-bg-first] flex flex-col items-center relative z-[-2] px-5">
        <!-- 关闭按钮 -->
        <ion-icon class="absolute text-3xl top-3 right-2" :icon="close" @click="modalCloseHandle" />
        <p class="text-xl mt-3.5 text-[#66D73E] font-black">{{ $t('viewsActivity.congratulationsAcquisition') }}</p>
        <!-- 奖品 -->
        <img class="absolute top-0 mx-auto w-36" src="/images/activity/piece_bonus.png">
        <p class="text-sm mt-36 text-[--color-text-basic]">{{ tenantInfo?.merchantCy }}{{convertMoneyToShow(awardCount) }}</p>
        <ion-item class="submit w-[17.5rem] text-[16px] drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)] my-5 mx-10"
          @click="modalCloseHandle">
          <ion-button class="w-full text-[14px] text-white" fill="clear">{{ $t('main.confirm') }}</ion-button>
        </ion-item>
      </div>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy'
import { convertMoneyToShow, formatRatioToShow, formatMoneyToShow } from '@/utils/custom'
import { encryptionText } from '@/utils'
import { close, shareSocial, ellipse } from 'ionicons/icons'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonCol,
  IonModal,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonImg,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonCheckbox,
} from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import useLogic from '../logic'
import { getImageUrl } from "@/utils";

const {
  rule,
  luckyRef,
  tempo,
  shareUrl,
  prizeType,
  recordTabs,
  expireTime,
  roundCount,
  awardCount,
  winning,
  rangeAmount,
  roundAmount,
  startClick,
  btnLoading,
  modalHelpVisible,
  modalPieceVisible,
  modalShareVisible,
  modalPrizeVisible,
  sharePhones,
  expireCountdown,
  assistanceCashHelps,
  assistanceCashAwards,
  segmentList,
  blocks,
  animationPlayState,
  isShowAnimationEl,
  isAddAnimation,
  buttons,
  isFull,
  prizes,
  tenantInfo,
  scrollDuration,
  startCallback,
  endCallback,
  modalCloseHandle,
  pieceHandle,
  shareHandle,
  launchHandle,
  whatsappHandle,
  sendSMSHandle,
  inviteFriendsHandle,
  awardReceiveHandle,
  disableTab,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove,
  apertureIsLoaded,
  apertureLoaded,
  wheelBoxStyle,
} = useLogic()


</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/piece/default/style/base-index.less";
  @import "@/views/activity/piece/default/style/theme-style.less";

  #activity-piece-default-index.style();

	.blue-default {
    #activity-piece-default-index.style(
      --color-text-white-100,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-white-100,
      --color-bg-200,
      --color-text-white-100,
      --color-text-gray-600,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-500,
      --color-bg-200,
      --color-bg-300,
      --color-bg-100,
      --color-text-white-100,
      --color-bg-300,
      --color-text-white-100
    );
	}

  .auroral-yellow {
    #activity-piece-default-index.style(
      @piece-default-index-17: --theme-color-800,
    );
	}

	.green-default {
    #activity-piece-default-index.style(
      --color-text-white-100,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-white-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-bg-200,
      --color-bg-300,
      --color-bg-100,
      --color-text-gray-100,
      --color-bg-300,
      --color-text-gray-100
    );
	}
	.forest-green {
    #activity-piece-default-index.style(
      @piece-default-index-17: --color-warning,
      @piece-default-index-18: --color-text-gray-200,
    );
	}

  .amber-purple {
    #activity-piece-default-index.style(
      --text-color-white-100,
      --text-color-white-100,
      --text-color-light-purple-2-100,
      --text-color-white-100,
      --color-bg-200,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --color-bg-200,
      --color-bg-300,
      --color-bg-100,
      --text-color-light-purple-1-100,
      --color-bg-300,
      --text-color-light-purple-1-100
    );
  }
</style>
