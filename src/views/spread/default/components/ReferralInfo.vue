<!-- 我的推广 -->
<template>
  <div class="h-full overflow-y-auto mx-[.625rem]">
    <!-- 顶部信息栏 -->
    <ion-toolbar class="agent-info text-sm mb-[0.625rem] rounded-[0.625rem]">
      <div class="info flex rounded-[.625rem] p-[.625rem]">
        <div class="flex flex-col flex-1">
          <div class="mb-[.625rem] agent-white-text-color">
            <span class="agent-minor-text-color leading-[1.0625rem]">{{ $t('main.my') + 'ID' }}:</span>
            <span>{{ userId }}</span>
          </div>
          <div class="mb-[.625rem] agent-white-text-color">
            <span class="agent-minor-text-color leading-[1.0625rem]">{{ $t('label.superior') + 'ID' }}:</span>
            <span>{{ agencyInfo?.parentId || 0 }}</span>
          </div>
          <div class="leading-[1.0625rem] agent-white-text-color">
            {{ $t('label.collectable') }}
            <span class="money-text">{{ formatMoneyToShow(userCommission) }}</span>
          </div>
        </div>
        <div class="justify-center flex-button">
          <ion-button size="small" class="claim h-[1.875rem]" :class="claimDisabled ? 'on ' : 'shiny'" @click="receiveHandle"
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
    <div class="agent-share-info px-[.9375rem] py-[.625rem] rounded-[.625rem]">
      <div class="text-sm m-0 pb-[.8125rem] referral-tips agent-white-text-color">{{ $t('label.referralInfo') }}</div>
      <div class="w-full">
        <div class="flex my-[.625rem] justify-around w-full">
          <div
            class="min-w-[4.6875rem] h-[6.25rem] flex flex-col rounded-[.3125rem] overflow-hidden bg-white mr-[.625rem]">
            <div class="p-[.3125rem] flex justify-center">
              <div class="h-[4.0625rem] w-[4.0625rem] bg-[#BEBEBE]">
                <QrCode :value="shareUrl" :size="remToPx(4.0625)" :margin="0" :color="`#000000`" :bgColor="`#FFFFFF`" />
              </div>
            </div>
            <div class="flex-1 save-qrcode-btn text-[.625rem] leading-7 text-center" @click="saveQrCode">
              {{ $t('toggle.saveqrcode') }}
            </div>
          </div>
          <div class="flex-1 flex flex-col text-[.625rem]  max-w-[15.625rem]">
            <p class="mb-[.4375rem] agent-white-text-color">{{ $t('label.exclusiveLink') }}</p>
            <div class="flex justify-between agent-share-link p-[.3125rem] rounded-[.3125rem] w-full">
              <div class="agent-minor-text-color max-w-[12.5rem]">{{ shareUrl }}</div>
              <div class="flex flex-col justify-between py-3 pl-1">
                <ion-icon class="text-lg mb-[.6rem] agent-share-icon-color" @click="shareOtherPlatform" :src="`/svg/share.svg`" />
                <ion-icon class="text-[1.25rem] agent-share-icon-color" src="/svg/my-copy.svg" @click="copy(shareUrl)" />
              </div>
            </div>
          </div>
        </div>
        <!-- 分享平台列表 -->
        <ion-segment ref="segment" mode="ios" scrollable v-model="shareValue"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseLeave"
          @mousemove="handleMouseMove"
        >
          <ion-segment-button v-for="(item, index) in segmentList" :value="index" :key="item.type"
            :disabled="disableTab" @click="shareHandle(item.type)">
              <ion-icon :src="item.icon" class="w-[2.1875rem] h-[2.1875rem]" />
          </ion-segment-button>
        </ion-segment>
      </div>
    </div>
    <ion-list class="card" mode="ios">
      <ion-item detail>
        <ion-label class="agent-white-text-color" style="font-size:15px">{{ $t('toggle.commissions') }}</ion-label>
        <ion-note class="text-xs more" slot="end" mode="ios" @click="routerReplace('MyCommission')">
          {{ $t('viewsSpread.more') }}
        </ion-note>
      </ion-item>
      <ion-item>
        <ion-label class="text-color">{{ $t('toggle.totalcommission') }}</ion-label>
        <ion-note class="text-xs cash" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.commission) }}
        </ion-note>
      </ion-item>
      <ion-item>
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
        <ion-label style="font-size:15px" class="agent-white-text-color">{{ $t('toggle.performance') }}</ion-label>
        <ion-note class="text-xs more" slot="end" mode="ios" @click="routerReplace('MyPerformance')">
          {{ $t('viewsSpread.more') }}
        </ion-note>
      </ion-item>
      <ion-item>
        <ion-label class="text-color">{{ $t('toggle.totalteammembers') }}</ion-label>
        <ion-note class="text-xs agent-white-text-color" slot="end" mode="ios">
          {{ `(${agancyInfo?.teamAdd! + agancyInfo?.directAdd!}/${agancyInfo?.teamCount! + agancyInfo?.directCount!})` }} {{ $t('activity.agent7') }}
        </ion-note>
      </ion-item>
      <ion-item>
        <ion-label class="text-color">{{ $t('toggle.directMember') }}</ion-label>
        <ion-note class="text-xs agent-white-text-color" slot="end" mode="ios">
          {{ `(${agancyInfo?.directAdd! / 1}/${agancyInfo?.directCount! / 1})` }} {{ $t('activity.agent7') }}
        </ion-note>
      </ion-item>
      <ion-item>
        <ion-label class="text-color">{{ $t('toggle.teamMember') }}</ion-label>
        <ion-note class="text-xs agent-white-text-color" slot="end" mode="ios">
          {{ `(${agancyInfo?.teamAdd! / 1}/${agancyInfo?.teamCount! / 1})` }} {{ $t('activity.agent7') }}
        </ion-note>
      </ion-item>
      <ion-item>
        <ion-label class="text-color">{{ $t('toggle.totalperformance') }}</ion-label>
        <ion-note class="text-xs agent-white-text-color" slot="end" mode="ios">
          {{ formatMoneyToShow((agancyInfo?.directAchievement! + agancyInfo?.teamAchievement!)) }}
        </ion-note>
      </ion-item>
      <ion-item>
        <ion-label class="text-color">{{ $t('toggle.directPerformance') }}</ion-label>
        <ion-note class="text-xs agent-white-text-color" slot="end" mode="ios">
          {{ formatMoneyToShow(agancyInfo?.directAchievement) }}
        </ion-note>
      </ion-item>
      <ion-item lines="none">
        <ion-label class="text-color">{{ $t('toggle.otherPerformance') }}</ion-label>
        <ion-note class="text-xs agent-white-text-color" slot="end" mode="ios">
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
import { IonItem, IonNote, IonIcon, IonLabel, IonButton, IonSegment, IonSegmentButton, IonToolbar, IonList, IonImg } from '@ionic/vue';
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
  @import "@/views/spread/default/styles/ReferralInfo/base.less";
  @import "@/views/spread/default/styles/ReferralInfo/theme-style.less";

  #spread-default-components-referralInfo.style();

  .blue-default {
    #spread-default-components-referralInfo.style(
      --color-bg-200,
      --color-bg-200,
      --color-line,
      --text-color-white-40,
      --rounded-small,
      --color-text-gray-200,
      --color-text-white-100,
      --accent-color-orange-1,
      --color-bg-200,
      --agent-claim-bgc,
      --agent-history-bgc,
      --agent-disabled-btn-bgc,
      --color-text-white-100,
      --color-text-white-100,
      --color-text-gray-300,
      --color-border-600,
      --theme-color-500,
      --color-line,
      --color-text-white-100,
      --color-text-gray-300
    );
  }

  .green-default {
    #spread-default-components-referralInfo.style(
      --color-bg-200,
      --color-bg-200,
      --color-line,
      --color-text-gray-200,
      --rounded-small,
      --color-text-gray-200,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-bg-200,
      --theme-color-gradient-100,
      --theme-color-gradient-200,
      --theme-color-gradient-500,
      --color-text-white-40,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-line,
      --color-bg-50,
      --color-line,
      --color-text-gray-200,
      --color-text-gray-200
    );
  }

  .amber-purple {
    #spread-default-components-referralInfo.style(
      --color-bg-200,
      --color-bg-200,
      --line-color,
      --text-color-light-purple-2-100,
      --rounded-small,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --color-bg-200,
      --segment-gradients-purple,
      --theme-color-800,
      --gradients-disabled-btn-bg,
      --text-color-white-40,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --line-color,
      --theme-color-400,
      --line-color,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100
    );
  }

  .forest-green {
    #spread-default-components-referralInfo.style(
      --color-bg-200,
      --color-bg-200,
      --color-line,
      --color-text-gray-200,
      --rounded-small,
      --color-text-gray-200,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-bg-200,
      --theme-color-gradient-100,
      --theme-color-gradient-200,
      --theme-color-gradient-500,
      --color-text-white-40,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-line,
      --color-bg-100,
      --color-line,
      --color-text-gray-200,
      --color-text-gray-200,
      @default-components-referralInfo-21: --color-text-gray-100,
    );
  }
  .auroral-yellow {
        #spread-default-components-referralInfo.style(
          @default-components-referralInfo-11: --theme-color-800,
          @default-components-referralInfo-21: --theme-color-800,
          @default-components-referralInfo-22: --color-text-black-100,
       );
  }
</style>
