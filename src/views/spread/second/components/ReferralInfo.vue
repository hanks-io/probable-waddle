<!-- 我的推广 -->
<template>
  <div class="h-full overflow-y-auto py-[0.75rem] px-[0.625rem]">
    <!-- 顶部信息栏 -->
    <ion-toolbar class="agent-info text-sm mb-[0.625rem] rounded-middle">
      <div class="flex p-[.625rem]">
        <div class="flex flex-col flex-1">
          <div class="mb-[.625rem]">
            <span class="leading-[1.0625rem] text-color-40">{{ $t('main.my') + 'ID' }}:</span>
            <span class="color-text-100">{{ userId }}</span>
          </div>
          <div class="mb-[.625rem]">
            <span class="leading-[1.0625rem] text-color-40">{{ $t('label.superior') + 'ID' }}:</span>
            <span class="color-text-100">{{ agencyInfo?.parentId || 0 }}</span>
          </div>
          <div class="leading-[1.0625rem]">
            <span class="color-text-100">{{ $t('label.collectable') }}:</span>
            <span class="color-text-currency">{{ formatMoneyToShow(userCommission) }}</span>
          </div>
        </div>
        <div class="justify-center flex-button">
          <ion-button size="small" class="claim h-[1.875rem]" :class="claimDisabled ? 'on' : 'shiny'" @click="receiveHandle"
            style="margin:0 0 0.625rem">
            {{ $t('toggle.claim') }}
          </ion-button>
          <ion-button style="margin:0;" class="history h-[1.875rem]" size="small" @click="claimHistory">
            {{ $t('toggle.history') }}
          </ion-button>
        </div>
      </div>
      <!-- 佣金领取规则 -->
      <div class="receive-rule">
        <div class="text">
          <span class="hint" v-html="$t('toggle.receiveTime', { time: config?.commissionDistributeTime })"></span>
        </div>
        <div v-show="false" class="btn-warpper">
          <div class="rule-btn" @click="showBonusRuleModal">
            <ion-icon :src="`/svg/warning.svg`" />
            <span>{{ $t('toggle.ruleBtn') }}</span>
          </div>
        </div>
      </div>
    </ion-toolbar>
    <!-- 推广信息 -->
    <div class="px-[.9375rem] py-[.625rem] bg-200 rounded-middle">
      <div class="middle-text-white font-weight-medium m-0 pb-[.8125rem] referral-tips">{{ $t('label.referralInfo') }}</div>
      <div class="w-full">
        <div class="flex my-[.625rem] justify-around w-full">
          <div class="min-w-[4.6875rem] h-[6.25rem] flex flex-col rounded-smal bg-[--spread-qr-box-bg] overflow-hidden mr-[.625rem]">
            <div class="p-[.3125rem] flex justify-center">
              <div class="h-[4.0625rem] w-[4.0625rem] ">
                <QrCode :value="shareUrl" :size="remToPx(4.0625)" :margin="0" :color="`#000000`" :bgColor="`#FFFFFF`" />
              </div>
            </div>
            <div class="flex-1 bg-[--spread-save-qr-bg] text-[.625rem] leading-7 text-center" @click="saveQrCode">
              {{ $t('toggle.saveqrcode') }}
            </div>
          </div>
          <div class="flex-1 flex flex-col text-[.625rem]  max-w-[15.625rem]">
            <p class="mb-[.4375rem] color-text-100">{{ $t('label.exclusiveLink') }}</p>
            <div class="flex justify-between agent-share-box p-[.3125rem] rounded-[.3125rem] w-full">
              <div class="color-link max-w-[12.5rem] shareUrl">{{ shareUrl }}</div>
              <div class="flex flex-col justify-between py-3 pl-1">
                <ion-icon class="text-lg mb-[.6rem] color-text-100" @click="shareOtherPlatform" :src="`/svg/share.svg`" />
                <ion-icon class="text-lg color-text-100" src="/first/svg/record-copy.svg" @click="copy(shareUrl)" />
              </div>
            </div>
          </div>
        </div>
        <!-- 分享平台列表 -->
        <ion-segment ref="segment" mode="ios" :scrollable="true" v-model="shareValue"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseLeave"
          @mousemove="handleMouseMove"
        >
          <ion-segment-button v-for="item in segmentList" :value="item.type" :key="item.type"
            :disabled="disableTab" @click="shareHandle(item.type)">
              <ion-icon :src="item.icon" class="w-[2.1875rem] h-[2.1875rem]" />
          </ion-segment-button>
        </ion-segment>
      </div>
    </div>
    <ion-list class="card" mode="ios">
      <ion-item detail>
        <ion-label class="item-title font-weight-medium">{{ $t('toggle.commissions') }}</ion-label>
        <ion-note class="text-xs more" slot="end" mode="ios" @click="routerReplace('MyCommission')">
          {{ $t('viewsSpread.more') }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.totalcommission') }}</ion-label>
        <ion-note class="text-xs cash" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.commission) }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.commissionreceived') }}</ion-label>
        <ion-note class="text-xs cash" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.claimedCommission) }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.lastcommissionreceived') }}</ion-label>
        <ion-note class="text-xs cash" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.lastCommission) }}
        </ion-note>
      </ion-item>
    </ion-list>
    <ion-list class="card" mode="ios">
      <ion-item detail>
        <ion-label class="item-title font-weight-medium">{{ $t('toggle.performance') }}</ion-label>
        <ion-note class="text-xs more" slot="end" mode="ios" @click="routerReplace('MyPerformance')">
          {{ $t('viewsSpread.more') }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.totalteammembers') }}</ion-label>
        <ion-note class="text-xs text-color-80" slot="end" mode="ios">
          {{ `(${agancyInfo?.teamAdd! + agancyInfo?.directAdd!}/${agancyInfo?.teamCount! + agancyInfo?.directCount!})` }} {{ $t('activity.agent7') }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.directMember') }}</ion-label>
        <ion-note class="text-xs text-color-80" slot="end" mode="ios">
          {{ `(${agancyInfo?.directAdd! / 1}/${agancyInfo?.directCount! / 1})` }} {{ $t('activity.agent7') }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.teamMember') }}</ion-label>
        <ion-note class="text-xs text-color-80" slot="end" mode="ios">
          {{ `(${agancyInfo?.teamAdd! / 1}/${agancyInfo?.teamCount! / 1})` }} {{ $t('activity.agent7') }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.totalperformance') }}</ion-label>
        <ion-note class="text-xs color-text-currency" slot="end" mode="ios">
          {{ formatMoneyToShow((agancyInfo?.directAchievement! + agancyInfo?.teamAchievement!)) }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.directPerformance') }}</ion-label>
        <ion-note class="text-xs color-text-currency" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.directAchievement) }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.otherPerformance') }}</ion-label>
        <ion-note class="text-xs color-text-currency" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.teamAchievement) }}
        </ion-note>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import QrCode from 'qrcode.vue';
import { copy } from '@/hooks/Copy';
import { remToPx } from '@/hooks/RemToPx';
import { formatMoneyToShow } from '@/utils/custom'
import { useReferralInfoLogic } from '@/views/spread/hooks/referralInfoLogic'
import { IonItem, IonNote, IonIcon, IonLabel, IonButton, IonSegment, IonSegmentButton, IonToolbar, IonList } from '@ionic/vue';
import { useSharePlatformLogic } from "@/views/activity/comp/share/useSharePlatformLogic";

const {
  loaded,
  userId,
  isToken,
  agencyInfo,
  segmentList,
  claimDisabled,
  agancyInfo,
  config,
  shareTitle,
  merchantCy,
  shareUrl,
  userCommission,
  saveQrCode,
  routerReplace,
  claimHistory,
  receiveHandle,
  showBonusRuleModal,
} = useReferralInfoLogic();

const {
  shareOtherPlatform,
  shareHandle,
  shareValue,
  disableTab,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove,
} = useSharePlatformLogic();

</script>

<style scoped lang="less">
.text-color {
  margin: .375rem .5rem .375rem 0;
  color: var(--color-text-40) !important;
}

.card {
  background: var(--color-bg-200);
  border-radius: .625rem;
  margin: 0.625rem 0;
  padding: 0 0.9375rem;
}

.receive-rule {
  display: flex;
  justify-content: space-between;
  padding: 0 0.625rem 0.625rem 0.625rem;
  border-bottom: 1px solid var(--color-line);
  .text {
    width: 80%;
    .hint {
      line-height: 1.0625rem;
      color: var(--color-text-40);
    }
  }
  .btn-warpper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rule-btn {
    background: rgba(255, 255, 255, 0.10);
    border-radius: var(--rounded-small);
    color: #6691D5;
    height: 1.125rem;
    width: 3.875rem;
    display: flex;
    justify-content: center;
    ion-icon {
      font-size: 1.125rem /* 16px */;
      line-height: 1.125rem /* 18px */;
    }
    span {
      font-size: 0.625rem /* 10px */;
      line-height: 1.125rem /* 18px */;
    }
  }
}

ion-item {
  --background: transparent;
  --padding-bottom: 0px;
  --padding-end: 10px;
  --padding-start: 0;
  --padding-top: 0;
  --inner-padding-end: 0;
  font-size: 0.75rem;
}

ion-item::part(detail-icon) {
  color: var(--color-link);
  font-size: .875rem;
  margin-right: 5px;
}

ion-segment {
  display: flex;
  --background: transparent;
  border-radius: 0;
}

ion-segment-button.ios {
  --border-radius: .375rem;
  --background: transparent;
  --color: var(--color-text-100);
  --indicator-color: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --indicator-box-shadow: none;
  text-transform: capitalize;
  min-width: 2.35rem;
  min-height: 2.5rem;
  max-height: 2.5rem;
  margin: 0 .375rem;
  margin-top: 0;
}

ion-segment-button.segment-button-disabled {
  opacity: 1;
}

ion-note {
  --color: var(--ion-text-color);
  margin-right: 10px;
}

ion-note.more {
  --color: var(--color-text-100);
  margin-right: 0;
}

ion-note.cash {
  --color: var(--color-currency);
}

ion-toolbar.agent-info {
  --ion-toolbar-background: var(--color-bg-200);
}

.flex-button {
  display: flex;
  flex-direction: column;
}

ion-button {
  font-weight: var(--font-weight-bold);
  --border-radius: var(--rounded-small);
}

ion-button.claim::part(native) {
  color: var(--agent-btn-color);
  background: var(--color-primary-800);
  --background-activated: var(--button-right-bg-color-shade);
  --background-focused: var(--button-right-bg-color-shade);
  --background-hover: var(--button-right-bg-color-tint);
}

ion-button.on::part(native) {
  background: var(--color-primary-btn-disable);
  color: var(--color-primary-btn-text-disable);
  --background-activated: none;
  --background-focused: none;
  --background-hover: none;
}

ion-button.history::part(native) {
  color: var(--color-text-100);
  background: var(--color-bg-100);
  --background-activated: none;
  --background-focused: none;
}

.referral-tips {
  color: var(--color-text-100);
  border-bottom: 1px solid var(--color-line);
}

.agent-share-box {
  border: 1px solid var(--spread-share-box-border-color);
  .shareUrl{
    color: var(--color-text-100);
  }
}

ion-list ion-item ion-label.item-title {
  color: var(--color-text-100);
  font-size: var(--font-size-14);
  line-height: 1.3125rem;
}

ion-button.shiny {
  position: relative;
  overflow: hidden;
}

ion-button.shiny::before {
  content: '';
  animation: shiny 4s ease-in-out infinite;
  background: var(--text-color-white-100);
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 20px;
  z-index: 100
}

.text-color-40 {
  color: var(--color-text-40);
}

.text-color-80 {
  color: var(--color-text-100);
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
