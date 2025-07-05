<!-- 代理活动 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName">
      <template #end>
        <div class="btn-history" @click="claimHistoryHandle">
          <ion-icon src="/first/svg/assets/record.svg" />
        </div>
      </template>
    </NavigationBar>
    <ion-content>
      <!-- 快速分享 -->
      <div class="share content-item">
        <ion-item>
          <div class="share-url">
            <div class="url-title"> {{ $t('activity.agent1', { url: '' }) }}
              <span class="url-link">{{ shareUrl }}</span>
            </div>
            <ion-buttons>
              <ion-button class="copy" @click="copy(shareUrl)">
                <ion-icon class="icon" slot="icon-only" :src="`/svg/copy.svg`"></ion-icon>
              </ion-button>
            </ion-buttons>
          </div>
        </ion-item>
        <ion-item>
          <div class="social-media">
            <div class="warpper">
              <p class="title">{{ $t('activity.agent2') }}</p>
              <!-- 奖金 -->
              <div v-if="rewardShowMode === ZDisplayMode.enum.RECEIVE" class="reward-text">
                <span>{{ merchantCy }}{{ activityInfo.rewardAmount }}</span>
              </div>
            </div>
            <!-- 分享平台配置 -->
            <ion-segment ref="segmentRef" mode="ios" scrollable :value="shareValue" @mousedown="handleMouseDown"
              @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
              <ion-segment-button v-for="(item, index) in segmentList" :value="index" :key="item.type"
                :disabled="disableTab" @click="shareHandle(item.type)">
                <ion-icon :id="`icon-${item}`" :src="item.icon" />
              </ion-segment-button>
            </ion-segment>
          </div>
        </ion-item>
        <ion-item lines="none">
          <div class="details">
            <div class="content">
              <!-- 注册投注内容 -->
              <div class="bet-register-count">
                {{ $t('activity.agent4') }}
                <span class="count-text">{{ `${activityInfo.subordinate}${$t('activity.agent7')}` }}</span>
                {{ `(${$t('activity.agent5')}` }}
                <span class="valid-text">{{ activityInfo.validCount + $t('activity.agent7') + ')' }}</span>
              </div>
              <div class="btn-details" @click="detailsHandle"> {{ $t('activity.agent8') }}</div>
            </div>
            <!-- 领取按钮 -->
            <div class="btn-claim" v-if="rewardShowMode === ZDisplayMode.enum.RECEIVE">
              <Button @click="claimHandle" :disabled="receiveBtnIsDisabled" :shiny="!receiveBtnIsDisabled">
                {{ $t('activity.agent6') }}
              </Button>
            </div>
          </div>
        </ion-item>
      </div>
      <!-- 宝箱/红包 -->
      <div v-if="rewardShowMode !== ZDisplayMode.enum.RECEIVE" class="reward-box content-item">
        <div class="real-item reward-item" v-for="(item, index) in rewardList" :value="index" :key="item.userCount"
          @click="openBoxHandle(item)">
          <div :class="item.isMeet && !item.isOpen ? 'redPacketGet' : ''" class="flex">
            <img v-show="!item.showOpenAni" class="w-[4.25rem] h-[4.25rem]" :src="getBoxIconPath(item.isOpen)"
              @click="activeRedPacketUuid = item.uuid" />
            <img v-show="item.showOpenAni" class="w-[4.25rem] h-[4.25rem] transition-all" :src="getBoxIconAniPath()" />
            <div class="text-position -translate-x-8 " v-if="item.isOpen || showRewardAmount">
              {{ getBoxAmount(item) }}
            </div>
          </div>
          <div v-show="!item.isTrue" class="arrow_icon"> > </div>
          <div class="i8n-box">
            {{ $t('activity.agent9') }}
            <span>{{ item.userCount }}</span>
            {{ $t('activity.agent7') }}
          </div>
        </div>
        <div class="reward-item"></div>
        <div class="reward-item"></div>
      </div>
      <!-- 有效推广人数 -->
      <div v-if="rewardShowMode === ZDisplayMode.enum.RECEIVE" class="validCondition-list content-item">
        <ion-item>
          <div class="title condition">
            <div>{{ $t('activity.agent10') }}</div>
            <div>{{ $t('activity.agent11') }}</div>
          </div>
        </ion-item>
        <ion-item v-for="(item, index) in rewardList" :key="index"
          :lines="(index !== rewardList.length - 1 ? undefined : 'none')">
          <div class="condition">
            <div class="count">{{ `≥${item.userCount}` }}</div>
            <div v-if="bonusType === ZRewardType.enum.RANDOM" class="reward">{{
              `${formatMoneyToShow(item.min)}~${formatMoneyToShow(item.max)}`
              }}</div>
            <div v-if="bonusType === ZRewardType.enum.FIXED" class="reward">{{ formatMoneyToShow(item.max) }}</div>
          </div>
        </ion-item>
      </div>
      <!-- 什么是有效推广人数 -->
      <div v-if="showValidCondition" class="validCondition content-item">
        <ion-item lines="full">
          <div class="title">
            <p>{{ $t('activity.agent13') }}
              <span v-if="conditionType === ZValidCondition.enum.ALL">{{ $t('activity.agent14') }}</span>
              <span v-if="conditionType === ZValidCondition.enum.ONE">{{ $t('activity.agent15') }}</span>
            </p>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.firstRecharge.status)">
          <div class="condition-item">
            <div class="condition-name">{{ $t('activity.agent16') }}</div>
            <div class="condition-text">{{
              `≥${formatMoneyToShow(activityInfo.firstRecharge.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeAmount.status)">
          <div class="condition-item">
            <div class="condition-name">{{ $t('activity.agent17') }}</div>
            <div class="condition-text">{{
              `≥${formatMoneyToShow(activityInfo.rechargeAmount.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.validBet.status)">
          <div class="condition-item">
            <div class="condition-name">{{ $t('activity.agent18') }}</div>
            <div class="condition-text">{{
              `≥${formatMoneyToShow(activityInfo.validBet.amount)}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeDay.status)">
          <div class="condition-item">
            <div class="condition-name">{{ $t('activity.agent19') }}</div>
            <div class="condition-text">{{ `≥${activityInfo.rechargeDay.days}` }}</div>
          </div>
        </ion-item>
        <ion-item v-if="isRewardOpen(activityInfo.rechargeTimes.status)">
          <div class="condition-item">
            <div class="condition-name">{{ $t('activity.agent20') }}</div>
            <div class="condition-text">{{ `≥${activityInfo.rechargeTimes.count}` }}</div>
          </div>
        </ion-item>
      </div>
      <!-- 活动描述 -->
      <div class="rule-text keep-space content-item">
        <p> {{ activityInfo.description }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy'
import {
  IonPage,
  IonIcon,
  IonContent,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonButtons,
} from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/first/Button/index.vue'
import { formatMoneyToShow } from '@/utils/custom'
import { ZValidCondition, ZDisplayMode, ZRewardType } from '@/enums/types/activity.type'
import useLogic from '../logic'

const {
  segmentRef,
  shareValue,
  segmentList,
  shareUrl,
  showRewardAmount,
  rewardShowMode,
  rewardList,
  conditionType,
  bonusType,
  activityName,
  showValidCondition,
  receiveBtnIsDisabled,
  activityInfo,
  activeRedPacketUuid,
  claimHistoryHandle,
  detailsHandle,
  claimHandle,
  openBoxHandle,
  shareHandle,
  getBoxIconPath,
  getBoxIconAniPath,
  getBoxAmount,
  isRewardOpen,
  merchantCy,
  disableTab,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove
} = useLogic()

</script>

<style scoped lang="less">
.btn-history {
  height: 1.875rem;
  padding-top: 0.375rem;
  margin-right: 1rem;
  border-radius: var(--ep-border-radius-m, 0.3125rem);

  ion-icon {
    font-size: var(--ep-font-size-xl, 1.125rem);
    color:var(--color-link)
  }
}

ion-content {
  --padding-top: 1rem;
  --padding-bottom: 1rem;
  --padding-start: 1rem;
  --padding-end: 1rem;
}

ion-item {
  --background: transparent;
  --border-color: var(--ep-color-border-default, var(--color-line));
}

ion-segment {
  --background: transparent;
  border-radius: 0;
  display: flex;
  justify-content: left;
}

ion-segment-button.segment-button-disabled {
  opacity: 1;
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
  flex: 0 0 auto;
  text-transform: capitalize;
  min-width: 0;
  max-width: 2.25rem;
  min-height: 2.5rem;
  max-height: 2.5rem;
  margin: 0.5rem 0.375rem 0.5rem 0;

  ion-icon {
    width: 2.25rem;
    height: 2.25rem;
  }
}

ion-segment-button.ios::part(native) {
  max-width: 2.25rem;
}

ion-button.copy::part(native) {
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
}

.content-item {
  background: var(--ep-color-background-fill-surface-raised-L1, var(--color-bg-200));
  margin-bottom: 1rem;
  border-radius: var(--ep-border-radius-m, var(--rounded-middle));
}

.share {
  width: 100%;

  .share-url {
    width: 100%;
    .flex-between();

    .url-title {
      color: var(--textbg-dark-white-40, var(--color-text-80));
      font-size: var(--ep-font-size-s, 0.75rem);
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .url-link {
        color: var(--ep-color-text-info, var(--color-link));
      }
    }
  }

  .social-media {
    width: 100%;

    .warpper {
      width: 100%;
      margin-top: 0.5rem;
      .flex-between();

      .title {
        font-size: var(--ep-font-size-s, 0.75rem);
        line-height: 1.5;
        color: var(--ep-color-text-default, var(--color-text-80));
      }

      .reward-text {
        .flexBox();

        span {
          font-size: var(--ep-font-size-s, 0.75rem);
          line-height: 1.5;
          font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
          color: var(--ep-color-text-warning, var(--color-currency));
        }
      }
    }
  }

  .details {
    width: 100%;

    .content {
      width: 100%;
      position: relative;
      .flex-between();
      padding-top: 1.25rem;
      padding-bottom: 1.25rem;
      font-size: var(--ep-font-size-s, 0.75rem);
      line-height: 1.5;
      font-weight: var(--ep-font-weight-regular, var(--font-weight-regular));
      color: var(--ep-color-text-default, var(--color-text-80));

      .bet-register-count {
        max-width: 15.625rem;

        .count-text {
          color: var(--ep-color-text-success, var(--color-link));
        }

        .valid-text {
          color: var(--ep-color-text-default, var(--color-text-100));
        }
      }

      .btn-details {
        color: var(--ep-color-text-info, var(--color-link));
        font-size: var(--ep-font-size-s, 0.75rem);
        line-height: 1.5;
        font-weight: var(--ep-font-weight-regular, var(--font-weight-regular));
      }
    }

    .btn-claim {
      width: 100%;
      margin-bottom: 1.25rem;
    }
  }
}

.validCondition-list {
  width: 100%;
  height: auto;

  .title {
    font-size: var(--ep-font-size-s, 0.75rem);
    line-height: 1.5;
    font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
    color: var(--ep-color-text-weaker, var(--color-agent-text));
  }

  .count {
    font-size: var(--ep-font-size-s, 0.75rem);
    line-height: 1.5;
    font-weight: var(--ep-font-weight-regular, var(--font-weight-regular));
    color: var(--ep-color-text-default, var(--color-text-80));
  }

  .reward {
    font-size: var(--ep-font-size-s, 0.75rem);
    line-height: 1.5;
    font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
    color: var(--ep-color-text-warning, var(--color-currency));
  }
}

.validCondition {
  width: 100%;
  height: auto;

  .title {
    width: 100%;
    text-align: left;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;

    p {
      font-size: var(--ep-font-size-s, 0.75rem);
      line-height: 1.5;
      font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
      color: var(--ep-color-text-weaker, var(--color-agent-text));
    }
  }
}

.validCondition ion-item:last-child {
  --border-color: transparent;
}

.copy,
.more {
  --color: var(--ep-color-text-default, var(--color-text-100));
}

.copy .icon {
  margin-left: 0.75rem;
  margin-right: 0.75rem;
  font-size: 1.75rem;
  color: var(--color-copy-button);
}

.condition {
  width: 100%;
  .flex-between();
  text-align: center;
  font-size: .75rem;
}

.condition-item {
  width: 100%;
  padding: 0.25rem 0;
  .flex-between();
  text-align: center;
  font-size: .75rem;

  .condition-name {
    width: 16.25rem;
    text-align: left;
    font-size: var(--ep-font-size-m, 0.75rem);
    color: var(--ep-color-text-default, var(--color-agent-text));
  }

  .condition-text {
    font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
    text-align: right;
    font-size: var(--ep-font-size-s, 0.75rem);
    color: var(--ep-color-text-info, var(--color-link));
  }
}

/* 红包抖动效果 */
.redPacketGet {
  animation-name: redPacketShake;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

.arrow_icon {
  position: absolute;
  top: 2rem;
  right: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ep-color-text-default, var(--color-agent-text));
}

.i8n-box {
  width: 4.25rem;
  margin-top: 0.625rem;
  margin-bottom: 0.625rem;
  white-space: normal;
  text-align: center;
  font-size: 0.65rem;
  line-height: 0.9rem;
  color: var(--ep-color-text-default, var(--color-agent-text));

  span {
    color: var(--ep-color-text-warning, var(--color-currency));
  }
}

@keyframes redPacketShake {
  0% {}

  30% {
    scale: 1.1;
    transform: rotate(0deg);
  }

  40% {
    transform: rotate(-15deg);
  }

  50% {
    transform: rotate(0deg);
  }

  60% {
    transform: rotate(-15deg);
  }

  70% {
    transform: rotate(0deg);
    scale: 1.1;
  }

  100% {
    scale: 1;
  }
}

.reward-box {
  width: 100%;
  padding: 0.625rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .real-item {
    position: relative;
  }
}

.reward-item {
  width: 25%;
}

.text-position {
  width: 4rem;
  position: absolute;
  top: 2.5625rem;
  left: 2.1rem;
  font-size: 0.6875rem;
  line-height: 0.75rem;
  text-align: center;
  font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
  color: var(--ep-color-text-default, #fff);
  text-shadow: -1px -1px 1px red, 1px -1px 1px red, -1px 1px 1px red, 1px 1px 1px red;
}

.reward-item:nth-child(4),
.reward-item:nth-child(4n) {
  width: 20%;
}

.rule-text {
  font-size: var(--ep-font-size-s, 0.75rem);
  line-height: 1.5;
  font-weight: var(--ep-font-weight-regular, var(--font-weight-regular));
  color: var(--ep-color-text-weaker, var(--color-agent-text));
  padding: 0.625rem;
}

.new-skin-symbol {
  .btn-history {

  ion-icon {
    color: var(--ep-color-icon-default);
  }
}

  .share {

    .share-url {
   

      .url-title {
        color: var(--ep-color-text-default);
      }
    }

    .copy .icon {

      color: var(--ep-color-icon-default);
    }

  }

}
</style>
