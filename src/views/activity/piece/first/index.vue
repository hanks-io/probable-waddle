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
            <ion-row class="items-center justify-between text-3xl font-black color-text-currency">
              <ion-img class="w-[3.25rem]" src="/images/activity/cash_dollar.png" />
              <p>{{ tenantInfo?.merchantCy }} {{ formatMoneyToShow(rangeAmount) }}</p>
              <ion-row class="bg-gradient-to-r from-[#49a319] to-[#2b8b2f] rounded-large px-2 py-1"
                :class="{ shiny: isFull }" @click="pieceHandle">
                <ion-img class="w-3.5" src="/images/activity/coin.webp" />
                <p class="ml-1 text-xs color-text-100 uppercase">{{ $t('main.withdraw') }}</p>
              </ion-row>
            </ion-row>
            <!-- 进度文本 -->
            <p class="text-sm font-black color-text-100 text-end">{{ formatRatioToShow((rangeAmount * 100 / roundAmount) || 0) }}%</p>
            <!-- 进度条 -->
            <div class="flex w-full h-[.625rem] rounded-middle bg-[#6ddf39]" :class="rangeAmount ? 'justify-end' : ''">
              <span class="h-full w-[.625rem] bg-white rounded-full"
                :style="`margin-right:${(roundAmount - rangeAmount) / roundAmount * 18.75}rem`" />
            </div>
            <div class="text-[.875rem] text-center my-2 line-clamp-2 color-text-100 whitespace-nowrap">
              {{ $t('activity.youStillNeed') }}
              <span class="color-text-currency">
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
            <div class="h-[7.75rem] flex flex-col justify-end">
              <ion-img class="mr-0.5 mb-[-1.275rem] h-11 z-20" :class=" apertureIsLoaded ? 'opacity-100' : 'opacity-0'" @ionImgDidLoad="apertureLoaded" 
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
                <div class="button w-16 h-[5.31rem] whitespace-nowrap flex items-center justify-center" :class="{ on: startClick }">
                  <p class="pt-1 text-lg font-black" v-if="winning && awardCount && prizeType == 'rangeAmount'">
                    +{{ convertMoneyToShow(awardCount) }}
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
              <img v-show="isShowAnimationEl" :class="['finger', { 'fingerAnimation':  isAddAnimation}]" src="/images/activity/finger.png" />
            </div>
            <!-- 活动倒计时  isAddAnimation-->
            <p class="absolute w-full text-xs text-center bottom-2" v-if="expireTime">
              <span>{{ $t('viewsActivity.expirationTime') }}</span>
              <span class="ml-[0.375rem] font-weight-bold">{{ expireCountdown }}</span>
            </p>
          </div>
          <!-- 分享模块 -->
          <div class="px-5 h-[2.375rem]">
            <ion-row class="text-sm bg-200 py-2 px-3 rounded-small" @click="shareHandle" v-if="expireTime">
              <p class="flex-1 text-center invite-btn-text font-weight-bold">{{ $t('activity.inviteFriendsWithdrawal') }}</p>
              <ion-icon class="text-lg text-normal" :icon="shareSocial" />
            </ion-row>
          </div>
          <div class="px-5 my-5">
            <ion-row class="text-sm justify-around bg-200 rounded-small">
              <p class="py-2" :class="recordTabs == 0 ? 'color-text-100 font-weight-bold' : 'color-text-40'" @click="recordTabs = 0">{{ $t('main.report')
                }}</p>
              <p class="py-2" :class="recordTabs == 1 ? 'color-text-100 font-weight-bold' : 'color-text-40'" @click="recordTabs = 1">{{
                $t('main.myReference') }}</p>
            </ion-row>
          </div>
          <div class="h-40 mb-5 mx-5 p-[0.625rem] rounded-middle overflow-hidden bg-200">
            <div class="h-40 overflow-hidden">
              <!-- 全平台助力领取记录 -->
              <div class="scroll-box text-xs record-text leading-loose"
                :style="{ animationDuration: `${scrollDuration}s` }" v-show="recordTabs == 0">
                <ion-row v-for="item in assistanceCashAwards" :key="item.userId">
                  <p class="w-40 tabular-nums">{{ encryptionText(item.userId) }}</p>
                  <p class="flex-1">{{ $t('activity.justGotIt') }}</p>
                  <ion-row class="color-text-currency items-center">
                    + {{ convertMoneyToShow(item.amount) }} 
                    <p v-if="tenantInfo?.merchantCy" class="ml-2 h-4 w-4 text-center bg-[#6ddf39] leading-[1.125rem] text-[.625rem] color-text-100 rounded-full font-black">
                      {{ tenantInfo?.merchantCy }}
                    </p>
                  </ion-row>
                </ion-row>
              </div>
              <!-- 我的助力记录 -->
              <div v-show="recordTabs" class="overflow-y-auto h-40 hide-scrollbar">
                <div class="record-text text-xs leading-loose min-h-full bg-200">
                  <ion-row v-for="item in assistanceCashHelps" :key="item.userId">
                    <p>{{ encryptionText(item.userId) }}</p>
                    <p class="flex-1 pl-28"></p>
                    <ion-row class="color-text-currency items-center">
                      + {{ convertMoneyToShow(item.helpAmount ?? 0) }} 
                      <p v-if="tenantInfo?.merchantCy" class="ml-2 h-4 w-4 text-center bg-[#6ddf39] leading-[1.125rem] text-[.625rem] color-text-100 rounded-full font-black">
                        {{ tenantInfo?.merchantCy }}
                      </p>
                    </ion-row>
                  </ion-row>
                </div>
              </div>
            </div>
          </div>
          <!-- 规则 -->
          <p class="rounded-middle mb-[1.25rem] mx-5 p-[0.625rem] bg-200 text-xs rule-text keep-space">
            {{ rule }}
          </p>
        </ion-content>
        <!-- 帮助弹窗 -->
        <ion-modal id="modal-help" :is-open="modalHelpVisible" :backdrop-dismiss="false">
          <div class="bg-[#090F1F] flex flex-col items-center relative z-[-2] px-5">
            <!-- 关闭按钮 -->
            <ion-icon class="absolute text-3xl top-3 right-2" :icon="close" @click="modalCloseHandle" />
            <p class="text-xl my-3.5 color-primary-700 font-black">{{ $t('main.rules') }}</p>
            <!-- 申请说明 -->
            <div class="w-full text-sm py-2.5 leading-tight">
              <p class="mb-2.5">{{ rule }}</p>
            </div>
          </div>
        </ion-modal>
        <!-- 邀请助力弹窗 -->
        <ion-modal id="modal-piece" :is-open="modalPieceVisible" :backdrop-dismiss="false">
          <div class="bg-400 flex flex-col items-center relative z-[-2] px-5">
            <!-- 关闭按钮 -->
            <ion-icon class="absolute text-3xl top-3 right-2 text-normal" :icon="close" @click="modalCloseHandle" />
            <p class="w-full text-sm my-3.5 font-black text-title">{{ $t('viewsActivity.willSoonBeAbleGet') }}</p>
            <!-- 步骤 -->
            <div class="w-full text-xs p-2.5 text-center leading-tight bg-200 rounded-large">
              <p class="color-primary-700">{{ $t('viewsActivity.amountAlreadyOwned') }}</p>
              <p class="text-3xl color-text-currency font-black">{{ formatMoneyToShow(rangeAmount) }}{{ tenantInfo?.merchantCy }}
              </p>
              <p class="w-full text-start text-title">{{ $t('viewsActivity.numberOfInitiations') }}</p>
              <p class="w-full text-start my-2.5 text-title">{{ $t('viewsActivity.paymentMethod') }}</p>
              <div class="step bg-400 text-start px-3.5 py-2.5 rounded-[.625rem]">
                <ion-row class="items-center">
                  <div class="relative"><ion-checkbox mode="md" :checked="true" />
                    <div class="absolute top-0 left-0 z-10 w-full h-full" />
                  </div>
                  <p class="text-[.625rem] color-primary-700 ml-1.5">{{ $t('viewsActivity.paymentRequestSubmitted') }}</p>
                </ion-row>
                <ion-icon class="text-default h-5" :src="getImageUrl('img/common/piece_step_lines.svg')" />
                <ion-row class="items-center">
                  <div class="relative"><ion-checkbox mode="md" :checked="true" />
                    <div class="absolute top-0 left-0 z-10 w-full h-full" />
                  </div>
                  <p class="text-[.625rem] color-primary-700 ml-1.5">{{ $t('viewsActivity.stillNeed') }}{{
                    formatMoneyToShow(roundAmount - rangeAmount) }}{{ $t('viewsActivity.applyForWithdrawal') }}</p>
                </ion-row>
                <ion-icon class="text-default h-5" :src="getImageUrl('img/common/piece_step_lines.svg')" />
                <ion-row class="items-center">
                  <div class="relative" v-if="roundAmount == rangeAmount"><ion-checkbox mode="md" :checked="true" />
                    <div class="absolute top-0 left-0 z-10 w-full h-full" />
                  </div>
                  <ion-icon class="text-default checkBox-bg" :icon="ellipse" v-else />
                  <p class="text-[.625rem] text-default ml-1.5 text-normal">{{ formatMoneyToShow(roundAmount) }} {{
                    tenantInfo?.merchantCy }} {{ $t('viewsActivity.willBeDepositedIntoAccount') }}</p>
                </ion-row>
              </div>
            </div>
            <!-- 确认申请按钮 -->
            <div class="w-[17.5rem] my-5"
              :detail="false" button>
                <Button v-if="roundAmount == rangeAmount" :suffixLoading="btnLoading" @click="awardReceiveHandle">{{ $t('viewsActivity.claimNow') }}</Button>
                <Button v-else @click="inviteFriendsHandle">{{ $t('viewsActivity.inviteFriendsHelp') }}</Button>
            </div>
          </div>
        </ion-modal>
        <!-- 分享弹窗 -->
        <ion-modal id="modal-share" :is-open="modalShareVisible" :initial-breakpoint="1" :backdrop-dismiss="false">
          <div class="flex flex-col justify-end h-full">
            <div class="p-3 color-text-50 bg-300 relative share-modal-bg">
              <!-- 关闭按钮 -->
              <ion-icon class="absolute text-xl top-3 right-2" :icon="close" @click="modalCloseHandle('share')" />
              <!-- 分享平台列表 -->
              <p class="text-sm font-black">1. {{ $t('activity.inviteFriendsWithdrawal') }}</p>
              <ion-segment ref="segment" mode="ios" scrollable @mousedown="handleMouseDown"
                @mouseup="handleMouseUp"
                @mouseleave="handleMouseLeave"
                @mousemove="handleMouseMove">
                <ion-segment-button v-for="(item, index) in segmentList" :value="index" :key="item.name"
                  :disabled="disableTab"  @click="launchHandle(item.name)">
                  <ion-icon :src="item.icon" class="w-[2.1875rem] h-[2.1875rem]" />
                </ion-segment-button>
              </ion-segment>
              <!-- 分享链接 -->
              <ion-row class="text-sm justify-between bg-400 my-3 py-2 px-3 rounded-small border border-[#292D36] color-link">
                {{ shareUrl }}
                <span @click="copy(shareUrl)">{{ $t('main.copy') }}</span>
              </ion-row>
              <!-- 分享号码列表 -->
              <p class="text-sm font-black mt-4 mb-2.5" v-if="sharePhones.length">2. {{ $t('activity.sendRandomPlayer') }}
              </p>
              <div class="bg-200 rounded-[.1875rem] p-1.5" v-if="sharePhones.length">
                <ion-row>
                  <ion-col size="3" class="ps-0 pe-0 text-center text-[.625rem] leading-none"
                    :class="item.isUsed ? 'text-[#BBB]' : 'color-text-100'" v-for="(item,index) in sharePhones" :key="index">
                    {{ item.phone }}
                  </ion-col>
                </ion-row>
                <ion-row class="text-xs leading-relaxed color-text-80">
                  <ion-col size="6" class="pr-2" @click="whatsappHandle">
                    <ion-row class="bg-100 h-12 px-2 py-1 rounded-[.1875rem] items-center">
                      <p class="flex-1">{{ $t('activity.sendMessageOn') }}<span class="font-black"> WhatsAPP</span></p>
                      <img class="w-9" src="/images/activity/call.svg" />
                    </ion-row>
                  </ion-col>
                  <ion-col size="6" class="pl-2" @click="sendSMSHandle">
                    <ion-row class="bg-100 h-12 px-2 py-1 rounded-[.1875rem] items-center">
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
          <div class="bg-400 flex flex-col items-center relative z-[-2] px-5">
            <!-- 关闭按钮 -->
            <ion-icon class="absolute text-3xl top-3 right-2" :icon="close" @click="modalCloseHandle" />
            <p class="text-xl mt-3.5 color-primary-700 font-black">{{ $t('viewsActivity.congratulationsAcquisition') }}</p>
            <!-- 奖品 -->
            <img class="absolute top-0 mx-auto w-36" src="/images/activity/piece_bonus.png">
            <p class="text-sm mt-36 color-text-currency">{{ tenantInfo?.merchantCy }}{{ convertMoneyToShow(awardCount) }}</p>
            <Button class="my-5" @click="modalCloseHandle">{{ $t('main.confirm') }}</Button>
          </div>
        </ion-modal>
	</ion-page>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy'
import { convertMoneyToShow, formatRatioToShow, formatMoneyToShow } from '@/utils/custom'
import { encryptionText } from '@/utils'
import { close, shareSocial, ellipse } from 'ionicons/icons'
import Button from '@/components/first/Button/index.vue'
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
  IonImg,
  IonSegment,
  IonSegmentButton,
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

<style scoped>
.aperture {
  animation: apertureAnimation 20s linear infinite;
}

.wheel-light {
  animation-name: lightAnimation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  pointer-events: none;
}

.wheel-start {
  pointer-events: none;
}

.wheel-start .button {
  background: url('/images/activity/share_start.webp');
  background-size: 100%;
}

.wheel-start .button.on {
  animation: buttonAnimation 250ms;
}

.text-title {
  color: var(--color-piece-title);
}

.invite-btn-text {
  color: var(--color-piece-invite-text);
}

.text-normal {
  color: var(--color-piece-text);
}

.record-text {
  color: var(--color-piece-record-text);
}

ion-segment {
  display: flex;
  justify-content: left;
}

ion-segment-button.segment-button-disabled {
  opacity: 1;
}

ion-segment-button.ios {
  --border-radius: var(--rounded-small);
  --background: transparent;
  --color: var(--color-bg-100);
  --indicator-color: transparent;
  --indicator-box-shadow: none;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  text-transform: capitalize;
  min-width: 2.25rem;
  min-height: 5.5rem;
  max-height: 5.5rem;
  margin: 0 0.1875rem;
  margin-top: 0;
}

ion-modal#modal-help,
ion-modal#modal-piece,
ion-modal#modal-prize {
  --width: 22.25rem;
  --height: fit-content;
  /* 高度由内容撑开 */
  --border-radius: var(--rounded-large);
}


ion-row.shiny,
ion-button.pop.shiny {
  position: relative;
  overflow: hidden;
}

.turntable-shiny {
  position: relative;
  overflow: hidden;

}

ion-row.shiny::before,
ion-item.pop.shiny::before {
  content: '';
  animation: shiny 6s ease-in-out infinite;
  background: white;
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 20px;
  z-index: 100
}

ion-item.pop.shiny::before {
  width: 30px !important;
}

.turntable-shiny::before {
  content: '';
  animation: turntableShiny 6s ease-in-out infinite;
  background: #fff;
  display: inline-block;
  height: 3.3rem;
  left: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 3.3rem;
  z-index: 100000;
  border-radius: 50%;
  overflow: hidden;

}


ion-modal#modal-share {
  --background: transparent;
}

div.scroll-box {
  animation: scrollAnimation linear infinite;
  animation-fill-mode: both;
}

.checkBox-bg {
  color: var(--color-piece-checkbox-bg);
}

ion-checkbox {
  --size: 0.9375rem;
  --checkbox-background-checked: #66D73E;
  --checkbox-background: #EAEDF6;
  --border-color: #EAEDF6;
  --checkmark-color: #fff;
  --checkmark-width: 4px;
  --border-radius: 4px;
  margin-inline-end: 0;
}

ion-checkbox::part(container) {
  padding: 0.25rem;
  border-radius: 50%;
  border: none;
}

ion-item ion-button {
  --ripple-color: transparent;
  /* 取消按钮点击动效 */
}

.winning-box {
  animation: blink 1s infinite;
}

.winning-arc {
  margin-left: .375rem;
  width: 5.5rem;
  height: 2.5rem;
  border: solid .25rem;
  border-color: white;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-radius: 50%/1.1rem 1.1rem 0 0;
  background-color: transparent;
}

.winning-left {
  transform: rotate(22deg) translate3d(-.625rem, -2.375rem, 0);
  transform-origin: bottom;
}

.winning-right {
  transform: rotate(-22deg) translate3d(2.375rem, -7rem, 0);
  transform-origin: bottom;
}
.finger {
	width: 6rem;
	height: 6rem;
   margin: auto;
	z-index: 900;
	transform: translate(32px, 26px);
  opacity: 0;
  @apply absolute top-0 bottom-0 left-0 right-0 
	

}
.fingerAnimation {
	animation: fingerTranslate 6s ease-in-out infinite;
	animation-play-state: v-bind("animationPlayState");
}
.zoom {
  opacity: 0;
  animation: zoom 6s ease-in-out infinite;
  z-index: 1000;
  animation-play-state: v-bind("animationPlayState");
}

.rule-text {
  color: var(--color-activity-rule);
}
.new-skin-symbol .share-modal-bg{
    border-radius: var(--ep-border-radius-surface-small) var(--ep-border-radius-surface-small) 0 0;
    background: var(--ep-color-background-fill-surface-raised-L2);
}

@keyframes fingerTranslate {
	0% {
		opacity: 0;
		transform: translate(1000px, 800px)
	}

	25% {
		opacity: 0.2;
		transform: translate(18.75rem, 18.75rem)
	}

	70% {
		opacity: 1;
		transform: translate(2rem, 1.625rem);
	}


	80% {
		opacity: 1;
		transform: translate(2rem, 1.625rem) scale(90%);
	}


	90% {
		opacity: 1;
		transform: translate(2rem, 1.625rem) scale(110%);
	}

	100% {
		opacity: 0.5;
		transform: translate(2rem, 1.625rem) scale(100%);

	}

}

@keyframes zoom {
  0% {
    opacity: 0;
    
  }

  70% {
    opacity: 0;
    
  }

  80% {
    opacity: 0.4;
    transform: scale(120%);
  }


  90% {
    opacity: 0.6;
    transform: scale(130%);
  }

  100% {
    opacity: 0;
    transform: scale(135%);
  }
}


@keyframes buttonAnimation {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(.9);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes apertureAnimation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes lightAnimation {
  0% {
    transform: rotate(0deg);
  }

  49.99% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(22.5deg);
  }

  99.99% {
    transform: rotate(22.5deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes scrollAnimation {

  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  99.99% {
    transform: translate3d(0, -20%, 0);
  }
}

@keyframes turntableShiny {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  50% {
    opacity: 0.3;
    transform: scale(0.5);
  }

  81% {
    opacity: 0.6;
    transform: scale(0.8);

  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }

  80% {
    opacity: 0.5;
    transform: scale(1) rotate(45deg);
  }

  81% {
    opacity: 1;
    transform: scale(3) rotate(45deg);
  }

  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}

@keyframes blink {

  /* 光标闪烁 */
  0% {
    opacity: 1;
  }

  49% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

.hide-scrollbar {
  overflow: auto; /* 允许滚动 */
  -ms-overflow-style: none; /* IE和Edge隐藏滚动条 */
  scrollbar-width: none; /* Firefox隐藏滚动条 */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari和Opera隐藏滚动条 */
}
</style>
