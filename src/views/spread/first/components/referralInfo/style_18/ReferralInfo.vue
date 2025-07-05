<!-- 我的推广 -->
<template>
  <div class="wrapper">
    <!-- 分享模块 -->
    <div class="share-board">
      <p class="title">{{ $t('toggle.000001') }}</p>
      <p class="id">{{ $t('toggle.000002') }}{{ agencyInfo?.parentId || 0 }}</p>
      <div class="share-url">
        <div class="qr-box">
          <QrCode :value="shareUrl" :size="remToPx(3.875)" :margin="0" :color="`#000000`" :bgColor="`#FFFFFF`" />
          <div class="save-qr-btn" @click="saveQrCode">
            {{ $t('toggle.saveqrcode') }}
          </div>
        </div>
        <div class="divder"></div>
        <div class="url-box">
          <p>{{ shareUrl }}</p>
          <div class="copy-btn" @click="copy(shareUrl)">
            <ion-icon :icon="iconCopy"></ion-icon>
            <p>{{ $t('toggle.000003') }}</p>
          </div>
        </div>
      </div>
      <!-- 分享平台列表 -->
      <SharePlatform class="shares" />
    </div>
    <!-- 个人佣金 -->
    <div class="commission-amount">
      <div class="title-warpper">
        <div class="commission-title">
          <p>{{ $t('toggle.commissions') }}</p>
          <ion-icon class="icon-tips" :icon="iconTips" id="trigger-distribute-time" />
        </div>
        <div class="record-btn" @click="routerReplace('MyCommission')">
          <ion-icon :icon="iconRecord"></ion-icon>
          <p>{{ $t('toggle.000004') }}</p>
        </div>
        <ion-popover trigger="trigger-distribute-time">
          <ion-content>
            <span v-html="$t('toggle.receiveTime', { time: config?.commissionDistributeTime })"></span>
          </ion-content>
        </ion-popover>
      </div>
      <div class="commission-content">
        <div class="commission-warpper">
          <p class="label">{{ $t('toggle.commissionreceived') }}</p>
          <p class="amount">{{ merchantCy+" " }}{{ formatMoneyToShow(money) }}</p>
        </div>
      </div>
      <div class="commission-bottom">
        <p class="label">{{ $t('toggle.000005') }}
          <span class="amount">{{ merchantCy }}{{ formatMoneyToShow(userCommission) }}</span>
        </p>
        <ion-button size="small" :disabled="claimDisabled" class="claim" @click="receiveHandle">
          {{ $t('toggle.claim') }}
        </ion-button>
      </div>
    </div>
    <!-- 团队佣金 -->
    <div class="team-commission">
      <ion-segment mode="ios" v-model="tabValue">
        <ion-segment-button value="today">
          <ion-label>{{ $t('toggle.000006') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="historical">
          <ion-label>{{ $t('toggle.000007') }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <!-- 团队人数 -->
      <div class="team-details-item">
        <div class="total">
          <ion-icon :src="iconTeam" />
          <span class="total-label">{{ $t('toggle.totalteammembers') }}</span>
          <span class="total-amount">{{ totalCount }}</span>
        </div>
        <div class="details">
          <div class="details-board">
            <p class="details-label">{{ $t('toggle.directMember') }}</p>
            <p class="details-amount">{{ directCount }}</p>
          </div>
          <div class="details-board">
            <p class="details-label">{{ $t('toggle.teamMember') }}</p>
            <p class="details-amount">{{ teamCount }}</p>
          </div>
        </div>
      </div>
      <!-- 团队业绩 -->
      <div class="team-details-item">
        <div class="total">
          <ion-icon :src="iconTrophy" />
          <span class="total-label">{{ $t('toggle.totalperformance') }}</span>
          <span class="total-amount">{{ formatMoneyToShow(totalAchievement) }}</span>
        </div>
        <div class="details">
          <div class="details-board">
            <p class="details-label">{{ $t('toggle.directMember') }}</p>
            <p class="details-amount">{{ formatMoneyToShow(directAchievement) }}</p>
          </div>
          <div class="details-board">
            <p class="details-label">{{ $t('toggle.teamMember') }}</p>
            <p class="details-amount">{{ formatMoneyToShow(teamAchievement) }}</p>
          </div>
        </div>
      </div>
      <!-- 佣金 -->
      <div class="team-details-item">
        <div class="total">
          <ion-icon :src="iconCoins" />
          <span class="total-label">{{ $t('toggle.totalcommission') }}</span>
          <span class="total-amount">{{ formatMoneyToShow(totalCommission) }}</span>
        </div>
        <div class="details">
          <div class="details-board">
            <p class="details-label">{{ $t('toggle.000008') }}</p>
            <p class="details-amount">{{ tabValue === 'today' ? formatMoneyToShow(directCommission) : '-' }}</p>
          </div>
          <div class="details-board">
            <p class="details-label">{{ $t('toggle.000009') }}</p>
            <p class="details-amount">{{ tabValue === 'today' ? formatMoneyToShow(teamCommission) : '-' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import QrCode from 'qrcode.vue';
import { copy } from '@/hooks/Copy';
import { remToPx } from '@/hooks/RemToPx';
import { formatMoneyToShow, convertRatioToShow } from '@/utils/custom'
import { useReferralInfoLogic } from '@/views/spread/hooks/referralInfoLogic'
import { IonIcon, IonLabel, IonButton, IonSegment, IonSegmentButton, IonPopover, IonContent } from '@ionic/vue';

import SharePlatform from "@/views/activity/comp/share/sharePlatform.vue";
import iconCopy from '@/assets/img/promotion/icon-copy.svg';
import iconTips from '@/assets/img/promotion/icon-tips.svg';
import iconRecord from '@/assets/img/promotion/icon-record.svg';
import iconTeam from '@/assets/img/promotion/icon-team.svg';
import iconTrophy from '@/assets/img/promotion/icon-trophy.svg';
import iconCoins from '@/assets/img/promotion/icon-coins.svg';

const {
  isToken,
  agencyInfo,
  claimDisabled,
  agancyInfo,
  config,
  merchantCy,
  shareUrl,
  userCommission,
  saveQrCode,
  routerReplace,
  receiveHandle,
} = useReferralInfoLogic();

type SegmentType = 'today' | 'historical';
const tabValue = ref<SegmentType>('today');

const claimedCommission = computed(() => agancyInfo.value.claimedCommission);
const directCount = computed(() => tabValue.value === 'today' ? agancyInfo.value.directAdd : agancyInfo.value.directCount);
const teamCount = computed(() => tabValue.value === 'today' ? agancyInfo.value.teamAdd : agancyInfo.value.teamCount);
const directAchievement = computed(() => tabValue.value === 'today' ? agancyInfo.value.dayDirectAchievement : agancyInfo.value.directAchievement);
const teamAchievement = computed(() => tabValue.value === 'today' ? agancyInfo.value.dayTeamAchievement : agancyInfo.value.teamAchievement);
const directCommission = computed(() => tabValue.value === 'today' ? agancyInfo.value.dayDirectCommission : 0);
const teamCommission = computed(() => tabValue.value === 'today' ? agancyInfo.value.dayTeamCommission : 0);

const totalCount = computed(() => (directCount.value) + (teamCount.value));
const totalAchievement = computed(() => (directAchievement.value) + (teamAchievement.value));
const totalCommission = computed(() => tabValue.value === 'today' ? agancyInfo.value.dayCommission : agancyInfo.value.commission);

const money = ref(0);
const moneyAddTime = 2; // 金额增长时间(秒)
const animationKey = ref(0);

watch(claimedCommission, (newValue) => {
  if (isToken.value) {
    addNumber(newValue);
  }
},{ immediate: true });

function addNumber(nowNumber: string | number) {
  cancelAnimationFrame(animationKey.value);
  const lastNumber = Number(nowNumber);
  const diffNumber = lastNumber - money.value;
  let changeTimes = moneyAddTime * 60;
  const randomNumber = diffNumber / changeTimes;
  
  const step = () => {
    changeTimes -= 1;
    money.value = Math.abs(money.value + randomNumber);
    if (changeTimes <= 0) {
      cancelAnimationFrame(animationKey.value);
    } else {
      animationKey.value = requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

</script>

<style scoped lang="less">

ion-popover {
  --backdrop-opacity: 0.6;
  --box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
  --width: 18.75rem;
}

ion-popover ion-content {
  --padding-start: 0.75rem;
  --padding-end: 0.75rem;
  --padding-top: 0.75rem;
  --padding-bottom: 0.75rem;
  --color: var(--ep-color-text-weaker, rgba(255, 255, 255, 0.40));
  font-size: var(--ep-font-size-s, 0.75rem);
  font-weight: var(--ep-font-weight-regular, 400);
  line-height: 1.5;
}

.wrapper {
  height: 100%;
  overflow-y: auto;
  padding: 12px 0.75rem;
}

.shares {
  margin-top: 1.125rem;
}

.share-board {
  overflow-y: hidden;
  width: 100%;
  height: 16.625rem;  
  padding: 0 0.625rem;
  border-radius: var(--ep-border-radius-xl, 0.625rem);
  background-color: var(--ep-color-background-fill-surface-raised-L1, #18254E);
  background-image: url('@/assets/img/promotion/share-url-bg.png');
  background-size: cover;
  background-position: center;
  background-blend-mode: normal;
  backdrop-filter: blur(4px);

  .title {
    color: var(--ep-color-text-default, #FFF);
    font-size: var(--ep-font-size-xxl, 1.5rem);
    font-weight: var(--ep-font-weight-blod, 700);
    line-height: 1.5;
    margin-top: 1.25rem;
  }

  .id {
    color: var(--ep-color-text-weaker, rgba(255, 255, 255, 0.40));
    font-size: var(--ep-font-size-m, 0.875rem);
    font-weight: var(--ep-font-weight-regular, 400);
    line-height: 1.5;
   }

  .share-url {
    .flex-start();
    width: 100%;
    height: 6.25rem;
    margin-top: 0.625rem;
    border-radius: var(--ep-border-radius-m, 0.375rem);
    border: 0.0625rem solid var(--ep-color-border-default, #242B42);
    background: var(--ep-neutral-black-black-20, rgba(0, 0, 0, 0.20));

    .qr-box {
      .flex-center();
      flex-direction: column;
      width: 5rem;
      padding: 0.25rem 0.5625rem 0.125rem 0.5625rem;
      margin: 0.3125rem 0;
      QrCode {
        border-radius: var(--ep-border-radius-s, 0.25rem) var(--ep-border-radius-s, 0.25rem) 0 0 ;
      }
      .save-qr-btn {
        width: 3.875rem;
        height: 1.1875rem;
        background: var(--ep-color-icon-info, #5C82F5);
        color: var(--ep-color-text-default, #FFF);
        text-align: center;
        font-size: var(--ep-font-size-xs, 0.625rem);
        font-weight: var(--ep-font-weight-regular, 400);
        line-height: 1.5;
        border-radius: 0 0 var(--ep-border-radius-m, 0.375rem) var(--ep-border-radius-m, 0.375rem);
      }
    }

    .divder {
      width: 0.0625rem;
      height: 5.4375rem;
      border-right: 0.0625rem solid var(--ep-color-border-default, #242B42);
    }

    .url-box {
      width: 100%;
      height:  100%;
      padding: 0.25rem 0.4375rem 0.5625rem 0.625rem;
      position: relative;
      p {
        color: var(--ep-color-text-brand-primary, #3A8EE3);
        font-size: var(--ep-font-size-s, 0.75rem);
        font-weight: var(--ep-font-weight-regular, 400);
        text-align: left;
        line-height: 1.5;
      }
      .copy-btn {
        position: absolute;
        right: 0.4375rem;
        bottom: 0.5625rem;
        width: 4.875rem;
        height: 1.75rem;
        .flex-center();
        border-radius: var(--ep-border-radius-s, 0.25rem);
        border: 1px solid var(--ep-color-border-default, #242B42);
        background: var(--ep-color-background-fill-surface-raised-L2, #1A1F30);
        ion-icon {
          color: var(--ep-color-icon-weaker, #FFF);
          font-size: 1rem;
          margin-right: 0.25rem;
        }
        p {
          color: var(--ep-color-text-default, #FFF);
          font-size: var(--ep-font-size-xs, 0.625rem);
          font-style: normal;
          font-weight: var(--ep-font-weight-regular, 400);
          line-height: 1.5;
        }
      }
    }
   }
}

.share-platform-list {
  width: 100%;
  height: 2.5rem;
  margin-top: 1.125rem;
  .flex-center();
  flex: 1;

  ion-segment {
    display: flex;
    --background: transparent;
    border-radius: 0;
  }

  ion-segment-button.ios {
    --border-radius: .375rem;
    --background: transparent;
    --indicator-color: transparent;
    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 0;
    --padding-bottom: 0;
    --indicator-box-shadow: none;
    text-transform: capitalize;
    min-width: 2.5rem;
    min-height: 2.5rem;
    max-height: 2.5rem;
    margin: 0 .375rem;
    margin-top: 0;

    ion-icon {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  ion-segment-button.segment-button-disabled {
    opacity: 1;
  }

  .divder {
    width: 0.0625rem;
    height: 2.5rem;
    margin-left: 0.3125rem;
    border-right: 1px solid var(--ep-color-border-default, #242B42);
  }

  .icon-share {
    min-width: 2.5rem;
    height: 2.5rem;
    color: var(--ep-color-icon-brand-primary, #0A77DA);
    margin-left: 0.625rem;
  }
}

.commission-amount {
  overflow: hidden;
  width:100%;
  margin: 0.9375rem 0;

  padding: 0 0.75rem;
  border-radius: var(--ep-border-radius-xl, 0.625rem);
  background: var(--ep-color-background-fill-surface-raised-L1, #18254E);
  backdrop-filter: blur(0.25rem);
  .title-warpper {
    margin-top: 0.5625rem;
    .flex-between();
    .commission-title {
      .flexBox();
      p {
        margin-right: 0.5rem;
        color: var(--ep-color-text-default, #FFF);
        text-align: center;
        font-size: var(--ep-font-size-l, 1rem);
        font-weight: var(--ep-font-weight-medium, 600);
        line-height: 1.5;
      }
      .icon-tips {
        font-size: 1.125rem;
        color: var(--ep-color-icon-weaker);
      }
    }
    .record-btn {
      width:4.5625rem;
      height: 1.75rem;
      .flex-center();
      border-radius: var(--ep-border-radius-s, 0.25rem);
      border: 1px solid var(--ep-color-border-default, #1E2D67);
      background: var(--ep-color-background-fill-surface-raised-L2, #1D2A55);

      ion-icon {
        color: var(--ep-color-icon-weaker, #FFF);
        font-size: 1rem;
        margin-right: 0.25rem;
      }
      p {
        color: var(--ep-color-text-default, #FFF);
        font-size: var(--font-size-xs, 0.625rem);
        font-style: normal;
        font-weight: var(--font-weight-regular, 400);
        line-height: 1.5;
      }
    }
  } 
  .commission-content {
    width: 100%;
    height: 5rem;
    margin-top: 0.8125rem;
    padding-left: 1.0625rem;
    border-radius: var(--ep-border-radius-m, 0.375rem);
    background-color: var(--ep-color-background-fill-surface-raised-L2, #1D2A55);
    background-image: url('@/assets/img/promotion/commission-amount-bg.png');
    background-size: cover;
    background-position: center;
    background-blend-mode: normal;
    .flexBox();

    .commission-warpper {
      .label {
        color: var(--ep-color-text-default, #FFF);
        font-size: var(--ep-font-size-s, 0.75rem);
        font-weight: var(--ep-font-weight-regular, 400);
        line-height: 1.5;
      }
      .amount {
        color: var(--ep-color-text-highlight, #F5C84C);
        text-shadow: 0.5px 1px 0px #A52410;
        font-size: var(--ep-font-size-xxl, 1.5rem);
        font-weight: var(--ep-font-weight-blod, 700);
        line-height: 1.5;
      }
    }
    
  }
  .commission-bottom{
    margin-top: 0.6875rem;
    .flex-between();
    .label {
      color: var(--ep-color-text-weaker, rgba(255, 255, 255, 0.40));
      font-size: var(--ep-font-size-s, 0.75rem);
      font-weight: var(--ep-font-weight-regular, 400);
      line-height: 1.5;
    }
    .amount {
      color: var(--ep-color-text-warning, #FC974C);
      font-size: var(--ep-font-size-s, 0.75rem);
      font-weight: var(--ep-font-weight-blod, 700);
      line-height: 1.5;
    }
    ion-button.claim {
      height: 1.875rem;
      margin-bottom: 0.625rem;
      color: var(--ep-color-text-inverse, #FFF);
      font-size: var(--ep-font-size-m, 0.875rem);
      font-weight: var(--ep-font-weight-blod, 700);
      line-height: 1.5;
      --background: var(--ep-color-background-fill-active-primary, #D64258);
    }
  }
}

.team-commission {
  width: 100%;
  padding: 1.25rem 0.75rem;
  border-radius: var(--ep-border-radius-xl, 0.625rem);
  background: var(--ep-color-background-fill-surface-raised-L1, #18254E);

  ion-segment {
    border-radius: var(--ep-border-radius-m, 0.375rem);
    --background: var(--ep-color-background-fill-body-default, #131F42);
  }

  ion-segment-button.ios {
    --border-radius: var(--ep-border-radius-s, 0.25rem);
    --color: var(--ep-color-text-weak, rgba(255, 255, 255, 0.60));
    --color-checked: var(--ep-color-text-default, #FFF);
    --indicator-color: var(--ep-color-background-fill-surface-raised-L2, #1D2A55);
    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 0;
    --padding-bottom: 0;
    --indicator-box-shadow: none;
    text-transform: capitalize;
    min-width: 2.5rem;
    min-height: 2.0625rem;
    max-height: 2.0625rem;
    margin: 0.1875rem 0.1875rem;
    font-size: var(--ep-font-size-m, 0.875rem);
    font-weight: var(--ep-font-weight-medium, 600);
  }

  ion-segment-button.ios.segment-button-after-checked {
    font-size: var(--ep-font-size-m, 0.875rem);
    font-weight: var(--ep-font-weight-regular, 400);
  }

  .team-details-item {
    width: 100%;
    margin-top: 1.5rem;
    .total {
      .flexBox();
      ion-icon {
        color: var(--ep-color-icon-weaker, #FFF);
        width: 1.5rem;
        height: 1.5rem;
      }
      .total-label {
        margin: 0 0.375rem;
        color: var(--ep-color-text-default, #FFF);
        font-size: var(--ep-font-size-m, 0.875rem);
        font-weight: var(--ep-font-weight-medium, 600);
        line-height: 1.5;
      }
      .total-amount {
        color: var(--ep-color-text-brand-primary, #0A77DA);
        font-size: var(--ep-font-size-m, 0.875rem);
        font-weight: var(--ep-font-weight-medium, 600);
        line-height: 1.5;
      }
    }
    .details {
      width: 100%;
      margin-top: 0.5rem;
      .flex-between();
      .details-board {
        width: 10.25rem;
        height: 3.875rem;
        padding: 0.625rem;
        .flex-column();
        border-radius: var(--ep-border-radius-s, 0.25rem);
        background: var(--ep-color-background-fill-surface-raised-L2, #1D2A55);
        .details-label {
          color: var(--ep-color-text-weakest, rgba(255, 255, 255, 0.20));
          font-size: var(--ep-font-size-xs, 0.625rem);
          font-weight: var(--ep-font-weight-regular, 400);
          line-height: 1.5;
        }
        .details-amount {
          color: var(--ep-color-text-weak, rgba(255, 255, 255, 0.60));
          font-size: var(--ep-font-size-xl, 1.125rem);
          font-weight: var(--ep-font-weight-regular, 400);
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
