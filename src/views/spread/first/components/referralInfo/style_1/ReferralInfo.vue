<!-- 我的推广 -->
<template>
  <div class="h-full overflow-y-auto py-[0.75rem] px-[0.625rem]">
    <!-- 顶部信息栏 -->
    <ion-toolbar class="agent-info mb-[0.625rem]">
      <div class="flex px-[.625rem] pt-[.625rem]">
        <div class="flex flex-col flex-1">
          <div class="mb-[.625rem]">
            <span class="leading-[1.0625rem] spread-user-info-weaker">{{ $t('main.my') + 'ID' }}:</span>
            <span class="spread-user-info-default-text">{{ userId }}</span>
          </div>
          <div class="mb-[.625rem]">
            <span class="leading-[1.0625rem] spread-user-info-weaker">{{ $t('label.superior') + 'ID' }}:</span>
            <span class="spread-user-info-default-text">{{ agencyInfo?.parentId || 0 }}</span>
          </div>
          <div class="mb-[.625rem]">
            <span class="leading-[1.0625rem] spread-user-info-default-text">{{ $t('label.collectable') }}:</span>
            <span class="spread-info-amount-text">{{ formatMoneyToShow(userCommission) }}</span>
          </div>
        </div>
        <div class="justify-center flex-button">
          <ion-button  
            size="small" 
            class="claim h-[1.875rem] mb-[0.625rem]" 
            :class="claimDisabled ? 'on' : 'shiny'"
            @click="receiveHandle"
          >
            {{ $t('toggle.claim') }}
          </ion-button>
          <ion-button  class="history h-[1.875rem] mb-[0.625rem]" size="small" @click="claimHistory">
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
    <div class="px-[.9375rem] py-[.625rem] spread-user-agent-type">
      <div class="middle-text-white m-0 pb-[.8125rem] referral-tips">
        {{ $t('label.referralInfo') }}
      </div>
      <div class="w-full">
        <div class="flex my-[.625rem] justify-around w-full">
          <div class="min-w-[4.6875rem] h-[6.25rem] flex flex-col spread-qr-box mr-[.625rem]">
            <div class="p-[.3125rem] flex justify-center">
              <div class="h-[4.0625rem] w-[4.0625rem] bg-[#BEBEBE]">
                <QrCode :value="shareUrl" :size="remToPx(4.0625)" :margin="0" :color="`#000000`" :bgColor="`#FFFFFF`" />
              </div>
            </div>
            <div class="flex-1 spread-save-qr-btn leading-7 text-center" @click="saveQrCode">
              {{ $t('toggle.saveqrcode') }}
            </div>
          </div>
          <div class="flex-1 flex flex-col text-[.625rem] max-w-[15.625rem]">
            <p class="mb-[.4375rem] exclusive-link">{{ $t('label.exclusiveLink') }}</p>
            <div class="flex justify-between agent-share-box p-[.3125rem] w-full">
              <div class="spread-user-share-link max-w-[12.5rem]">{{ shareUrl }}</div>
              <div class="flex flex-col justify-between py-3 pl-1">
                <ion-icon class="mb-[.6rem] spread-user-share-icon" @click="shareOtherPlatform"
                  :src="`/svg/share.svg`" />
                <ion-icon class="spread-user-share-icon" src="/first/svg/record-copy.svg" @click="copy(shareUrl)" />
              </div>
            </div>
          </div>
        </div>
        <!-- 分享平台列表 -->
        <ion-segment ref="segment" mode="ios" :scrollable="true" v-model="shareValue" @mousedown="handleMouseDown"
          @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
          <ion-segment-button v-for="item in segmentList" :value="item.type" :key="item.type" :disabled="disableTab"
            @click="shareHandle(item.type)">
            <ion-icon :src="item.icon" class="w-[2.1875rem] h-[2.1875rem]" :class="`icon-${item.name}`" />
          </ion-segment-button>
        </ion-segment>
      </div>
    </div>
    <ion-list class="card" mode="ios">
      <ion-item detail>
        <ion-label class="item-title">{{ $t('toggle.commissions') }}</ion-label>
        <ion-note class="spread-user-item-more" slot="end" mode="ios" @click="routerReplace('MyCommission')">
          {{ $t('viewsSpread.more') }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.totalcommission') }}</ion-label>
        <ion-note class="spread-user-item-amount" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.commission) }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.commissionreceived') }}</ion-label>
        <ion-note class="spread-user-item-amount" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.claimedCommission) }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.lastcommissionreceived') }}</ion-label>
        <ion-note class="spread-user-item-amount" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.lastCommission) }}
        </ion-note>
      </ion-item>
    </ion-list>
    <ion-list class="card" mode="ios">
      <ion-item detail>
        <ion-label class="item-title">{{ $t('toggle.performance') }}</ion-label>
        <ion-note class="spread-user-item-more" slot="end" mode="ios" @click="routerReplace('MyPerformance')">{{
          $t('viewsSpread.more') }}</ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.totalteammembers') }}</ion-label>
        <ion-note class="spread-user-text-80" slot="end" mode="ios">{{ `(${agancyInfo?.teamAdd! +
          agancyInfo?.directAdd!}/${agancyInfo?.teamCount! + agancyInfo?.directCount!})` }} {{ $t('activity.agent7')
          }}</ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.directMember') }}</ion-label>
        <ion-note class="spread-user-text-80" slot="end" mode="ios">{{ `(${agancyInfo?.directAdd! /
          1}/${agancyInfo?.directCount! /
          1})`
          }} {{ $t('activity.agent7') }}</ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.teamMember') }}</ion-label>
        <ion-note class="spread-user-text-80" slot="end" mode="ios">{{ `(${agancyInfo?.teamAdd! /
          1}/${agancyInfo?.teamCount! / 1})`
          }}
          {{ $t('activity.agent7') }}</ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.totalperformance') }}</ion-label>
        <ion-note class="spread-info-amount-text" slot="end" mode="ios">{{
          formatMoneyToShow((agancyInfo?.directAchievement! + agancyInfo?.teamAchievement!))
        }}</ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.directPerformance') }}</ion-label>
        <ion-note class="spread-info-amount-text" slot="end" mode="ios">{{
          formatMoneyToShow(agancyInfo?.directAchievement) }}</ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="spread-user-item-tips">{{ $t('toggle.otherPerformance') }}</ion-label>
        <ion-note class="spread-info-amount-text" slot="end" mode="ios">{{
          formatMoneyToShow(agancyInfo?.teamAchievement) }}</ion-note>
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
@import '@/views/spread/first/styles/ReferralInfo/base-index.less';

.new-skin-symbol {
  @import '@/views/spread/first/styles/ReferralInfo/theme-style.less';
}
</style>
