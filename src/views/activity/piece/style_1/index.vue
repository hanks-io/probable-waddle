<!-- 助力领现金 -->
<script setup lang="ts">
import shareSpinImg from "@/assets/img/activity/share_spin1.webp";
import Button from "@/components/first/Button/index.vue";
import NavigationBar from "@/components/NavigationBar/index.vue";
import PieceModal from "../components/piece-modal.vue";
import ShareModal from "@/components/ShareModal/index.vue";
import { encryptionText, formatbr, getImageUrl } from "@/utils";
import { convertMoneyToShow, formatMoneyToShow, formatRatioToShow } from "@/utils/custom";
import {
  IonContent,
  IonIcon,
  IonModal,
  IonPage,
  IonRow
} from "@ionic/vue";
import { close } from "ionicons/icons";
import useLogic from "../logic";
import { useI18n } from "@/hooks/useI18n";

const { t } = useI18n();

const {
  rule,
  luckyRef,
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
  animationPlayState,
  isShowAnimationEl,
  isAddAnimation,
  buttons,
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
  awardReceiveHandle
} = useLogic();

const blocks = [{ imgs: [{ src: shareSpinImg, width: "100%", top: "0%", rotate: true }] }];

/**
 * 分享弹窗props
 */
const shareModalProps = ref({
  firstTitle: t("activity.inviteFriendsWithdrawal"),
  secondTitle: t("activity.sendRandomPlayer"),
  shareUrl,
  sharePhones,
  whatsappHandle,
  sendSMSHandle,
  launchHandle
});


/**
 * 邀请助力弹窗props
 */
const pieceModalProps = ref({
  closeHandle: modalCloseHandle,
  rangeAmount,
  roundAmount,
  tenantInfo,
  btnLoading,
  awardReceiveHandle,
  inviteFriendsHandle
});

const complexProgress = computed(() => {
  return formatRatioToShow((rangeAmount.value * 100 / roundAmount.value) || 0);
});
</script>

<template>
  <ion-page>
    <ion-content>
      <NavigationBar
        :title="`${$t('activity.earn')} ${tenantInfo?.merchantCy} ${formatMoneyToShow(roundAmount)} ${$t('activity.freeMoney')}`" />
      <!-- 转盘 -->
      <div class="wheelBox">
        <!-- 中奖图标 -->
        <div class="zj-icon" :class="winning ? 'winning-box' : 'hidden'">
          <div class="winning-check"></div>
        </div>
        <div class="content-wrapper">
          <img class="wheel-light" src="@/assets/img/activity/outerlayer.png" />
          <div class="wheel-bg wheel-bg-hidden" :class="!startClick ? 'wheel-light-hidden' : 'wheel-bg-show'"></div>
          <!-- 转盘灯光 -->
          <div class="light-on" :class="{ 'light-active': startClick }">
            <p v-for="i in 8" :key="i" :style="`transform: rotate(${(i - 1) * 45}deg)`"></p>
          </div>
          <div class="wheel-box">
            <LuckyWheel ref="luckyRef" width="15.375rem" height="15.375rem" :blocks="blocks" :prizes="prizes"
                        :buttons="buttons"
                        :defaultConfig="{ offsetDegree: -22, speed: 18, accelerationTime: 1500, decelerationTime: 3500 }"
                        @start="startCallback" @end="endCallback" />
          </div>
          <!-- 转盘开始按钮-->
          <div class="wheel-start-wrapper wheel-start">
            <div class="wheel-content buttons" :class="{ on: startClick }">
              <p class="wheel-content-top" v-if="winning && awardCount && prizeType == 'rangeAmount'">
                +{{ convertMoneyToShow(awardCount) }}
              </p>
              <p class="wheel-content-bot" v-else>
                {{ roundCount }}
              </p>
            </div>
          </div>
          <div class="wheel-start-wrapper wheel-start other" v-show="!startClick">
            <div class="wheel-show-ani" v-show="isShowAnimationEl" :class="{ on: startClick, zoom: isAddAnimation }">
            </div>
          </div>
          <img v-show="isShowAnimationEl" :class="['finger', { 'fingerAnimation': isAddAnimation }]"
               src="@/assets/img/activity/finger.png" />
        </div>
        <!-- 活动倒计时  isAddAnimation-->
        <p class="countdown-time" v-if="expireTime">
          <span>{{ $t("viewsActivity.expirationTime") }}</span>
          <span class="ct-txt font-weight-bold">{{ expireCountdown }}</span>
        </p>
      </div>
      <!-- 助力进度信息  (rangeAmount * 100 / roundAmount) == 100-->
      <div class="invite-wrapper">
        <div>
          <p class="textCenter progress" @click="pieceHandle"><span>{{
              tenantInfo?.merchantCy }}</span>
            {{ formatMoneyToShow(rangeAmount) }}</p>
          <div class="progress-bar" :class="[Number(complexProgress) > 0 ? 'active' : '' ]">{{ complexProgress }}%</div>
          <ion-row class="progress-row"></ion-row>
        </div>
      </div>
      <!-- 需充值提示 -->
      <div class="share-model">
        <ion-row class="deposit">
          <p class="deposit-content">
            {{ $t("activity.youStillNeed") }}
            {{ formatMoneyToShow(roundAmount - rangeAmount) }}
            {{ $t("activity.toWithdraw") }}
          </p>
          <ion-icon class="deposit-icon" :src="getImageUrl('svg/depositnew.svg')"></ion-icon>
        </ion-row>
      </div>
      <!-- 分享模块 -->
      <div class="share-model">
        <ion-row class="share share-model-row" @click="shareHandle" v-if="expireTime">
          <p class="share-invite">{{ $t("activity.inviteFriendsWithdrawal") }}
          </p>
          <ion-icon class="svg-cls" :src="getImageUrl('svg/sharenew.svg')" />
        </ion-row>
      </div>
      <div class="report-info">
        <div class="div-cls">
          <p class="p-cls" :class="recordTabs == 0 ? 'active' : ''" @click="recordTabs = 0">{{ $t("main.report")
            }}</p>
          <p class="p-cls" :class="recordTabs == 1 ? 'active' : ''" @click="recordTabs = 1">{{
              $t("main.myReference") }}</p>
        </div>
      </div>
      <div class="report-content">
        <div class="report-it">
          <!-- 全平台助力领取记录 -->
          <div class="scroll-box" :style="{ animationDuration: `${scrollDuration}s` }" v-show="recordTabs == 0">
            <ion-row v-for="item in assistanceCashAwards" :key="item.userId">
              <p class="row-p1">{{ encryptionText(item.userId) }}</p>
              <p class="row-p2">{{ $t("activity.justGotIt") }}</p>
              <div class="moneyNum row-d1">
                + <span v-if="tenantInfo?.merchantCy" class="row-d1-span">{{ tenantInfo?.merchantCy }}</span> {{
                  convertMoneyToShow(item.amount) }}
              </div>
            </ion-row>
          </div>
          <!-- 我的助力记录 -->
          <div v-show="recordTabs" class="zl-record hide-scrollbar">
            <div class="record-text">
              <ion-row v-for="item in assistanceCashHelps" :key="item.userId">
                <p class="row-p1">{{ encryptionText(item.userId) }}</p>
                <p class="row-p2"></p>
                <div class="moneyNum row-d1">
                  + <span v-if="tenantInfo?.merchantCy" class="row-d1-span">{{ tenantInfo?.merchantCy }}</span> {{
                    convertMoneyToShow(item.helpAmount ?? 0) }}
                </div>
              </ion-row>
            </div>
          </div>
        </div>
      </div>
      <!-- 规则 -->
      <p class="rule-text keep-space">
        <div class="ruleItem" v-for="(item, index) in rule.split('\n')" :key="index">
          <p class="ruleDes" :class="index == 0 ? 'title' : ''">
            {{ item.replace(/^\d+\./, "•") }}
          </p>
        </div>
      </p>
    </ion-content>
    <!-- 帮助弹窗 -->
    <ion-modal id="modal-help" :is-open="modalHelpVisible" :backdrop-dismiss="false">
      <div class="help-bg">
        <!-- 关闭按钮 -->
        <ion-icon class="icon-cls" :icon="close" @click="modalCloseHandle" />
        <p class="help-p">{{ $t("main.rules") }}</p>
        <!-- 申请说明 -->
        <div class="help-content-bg">
          <p class="p-cls" v-html="formatbr(rule)"></p>
        </div>
      </div>
    </ion-modal>
    <!-- 邀请助力弹窗  -->
    <PieceModal v-model="modalPieceVisible" v-bind="pieceModalProps" />
    <!-- 分享弹窗 -->
    <ShareModal v-model="modalShareVisible" v-bind="shareModalProps" />
    <!-- 奖励弹窗 -->
    <ion-modal id="modal-prize" :is-open="modalPrizeVisible" :backdrop-dismiss="false" class="">
      <div class="prize-content">
        <p class="prize-content-p">{{ $t("viewsActivity.congratulationsAcquisition") }}</p>
        <!-- 奖品 -->
        <div class="prize-content-bg">
          <img class="img-cls" src="@/assets/img/activity/modal_piece.png">
          <p class="p-cls">{{ $t("viewsActivity.congratulationsAcquisition") }} {{
              tenantInfo?.merchantCy }}{{ convertMoneyToShow(awardCount) }}
          </p>
        </div>
        <Button class="btn-cls" @click="modalCloseHandle">{{ $t("main.confirm") }}</Button>
      </div>
    </ion-modal>
  </ion-page>
</template>

<style scoped lang="less">
ion-header {
  background: var(--ep-color-background-fill-body-default);
}

.toolbar-title-default {
  --background: transparent;
}

.wheelBox {
  background: url(@/assets/img/activity/new-skin-bg.png) no-repeat center -3.125rem / cover;
  background-size: 100%;
  height: 23.875rem;
  width: 24.375rem;
  position: relative;
  padding-top: 5.625rem;

  .zj-icon {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: auto;
    margin-right: auto;

    &.hidden {
      display: none;
    }

    .winning-check {
      background: url(@/assets/img/activity/winning.png) no-repeat center / cover;
      width: 8.06rem;
      height: 10.56rem;
      position: absolute;
      top: -1.687rem;
      pointer-events: none;
    }
  }

  .content-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    margin-right: 0.0625rem;

    .wheel-light {
      position: absolute;
      top: -2rem;
      left: 2.43rem;
      z-index: 2;
      width: 19.125rem;
    }

    .wheel-bg {
      width: 100vw;
      height: 27.5rem;
      position: absolute;
      top: -8rem;
      background: url(@/assets/img/activity/spin-bg.webp) no-repeat center center / 100% 90%;
      z-index: 1;
    }

    .wheel-bg-hidden {
      opacity: 0;
      transition: opacity 1s ease-out 3s;
    }

    .wheel-bg-show {
      opacity: 1;
      transition: opacity 0.5s ease-in;
    }

    .light-on {
      position: absolute;
      width: 0%;
      height: 100%;
      top: 0;
      left: 3.75rem;
      z-index: 2;

      p {
        position: absolute;
        width: 0.5rem;
        height: 0.5rem;
        background: #fff;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        margin-top: -1.5px;
        margin-left: -1.5px;
        transform-origin: 8.375rem 0;
        box-shadow: 0 0 0.25rem 0.125rem #fff;
      }

      &.light-active p:nth-child(odd) {
        background: #FFCC00;
        box-shadow: 0 0 0.25rem 0.125rem #FFD700;
        animation: lightBlink 1s infinite;
        transition: all 0.3s;
      }
    }

    .wheel-box {
      position: relative;
      z-index: 2;
    }

    .wheel-start-wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12rem;
      height: 12rem;
      margin: auto;
      border-radius: 12rem;

      &.wheel-start {
        pointer-events: none;

        &.other {
          z-index: 10;
        }

        .buttons {
          top: -0.8125rem;
          background: url(@/assets/img/activity/share_start1.webp) 0 0 / 100%;
          background-size: 100%;
          background-repeat: no-repeat;

          &.on {
            animation: buttonAnimation 250ms;
          }
        }
      }

      .wheel-show-ani {
        height: 5.31rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4rem;
      }

      .wheel-content {
        position: relative;
        width: 80px;
        height: 108px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;

        .wheel-content-top {
          font-size: 1.125rem;
          font-weight: var(--ep-font-weight-bold);
          color: rgb(122 0 221);
          margin-top: 1.6rem;
          min-height: 3.4rem;
          display: flex;
          align-items: center;
        }

        .wheel-content-bot {
          padding-top: 1.75rem;
          font-size: 2.25rem;
          line-height: 2.5rem;
          font-weight: var(--ep-font-weight-bold);
          color: rgb(11 1 157);
        }
      }
    }

    .finger {
      width: 6rem;
      height: 6rem;
      margin: auto;
      z-index: 900;
      transform: translate(32px, 26px);
      opacity: 0;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  .countdown-time {
    color: var(--ep-color-text-inverse-disabled);
    font-weight: var(--ep-font-weight-bold);
    position: absolute;
    width: 100%;
    font-size: 0.75rem;
    line-height: 1rem;
    text-align: center;
    bottom: 0.5rem;

    .ct-txt {
      margin-left: 0.375rem;
    }
  }
}

.invite-wrapper {
  height: 4.75rem;

  .textCenter {
    text-align: center;
  }

  .progress {
    background: var(--ep-color-background-fill-glow-primary-opacity-100, #3A8EE3);
    height: 3.75rem;
    line-height: 3.75rem;
    text-align: center;
    font-family: "Smooch Sans", serif;
    font-size: 3.5rem;
    font-style: normal;
    font-weight: var(--ep-font-weight-bold);

    span {
      font-size: 2.5rem;
      vertical-align: bottom;
    }
  }

  .progress-bar {
    height: 0.187rem;
    position: relative;
    text-align: center;
    font-size: 0.75rem;
    padding-top: 0.0937rem;
    font-family: "Smooch Sans", serif;
    font-weight: var(--ep-font-weight-bold);
    color: var(--ep-color-text-default);
    background: #483D66;

    &.active {
      background: linear-gradient(90deg, #8C5BFF 0%, #81EFE8 21%, #54A6FF 39.5%, #8C5BFF 54.5%, #8C5BFF 54.51%, #54A6FF 70%, #81EFE8 84.5%, #8C5BFF 98.5%);
    }

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 1rem;
      position: absolute;
      top: 0.187rem;
      background: var(--ep-color-background-fill-glow-primary-opacity-40);
      clip-path: polygon(0 0, 100% 0, 93.2% 100%, 6.8% 100%);
    }
  }

  .progress-row {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: var(--ep-font-weight-bold);
  }
}

.share-model {
  width: 21.25rem;
  margin: 0 auto;
  border-radius: 0;
  text-align: left;

  .share {
    border-radius: 0px 0px 0.25rem 0.25rem;
    background: var(--ep-color-background-fill-surface-raised-L2);
  }

  .share-model-row {
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 0.5rem 0.75rem 0.5rem 0.75rem;

    .share-invite {
      flex: 1;
      font-weight: var(--ep-font-weight-bold);
      color: var(--ep-color-text-weaker);
    }

    .svg-cls {
      font-size: 1.5rem;
      line-height: 1.75rem;
      color: var(--ep-color-icon-brand-primary, var(--color-piece-text));
    }
  }

  p {
    font-size: 0.75rem;
    color: var(--ep-color-text-weaker);
  }

  .deposit {
    background: var(--ep-color-background-fill-surface-raised-L1);
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 0.5rem 0.75rem 0.5rem 0.75rem;
    display: flex;
    justify-content: space-between;

    .deposit-content {
      color: var(--ep-color-text-weaker);
      font-weight: var(--ep-font-weight-bold);
      display: flex;
      align-items: center;
      font-size: 0.75rem;
    }

    .deposit-icon {
      font-size: 1.5rem;
      color: var(--ep-color-icon-brand-primary, var(--color-piece-text));
    }
  }
}

.report-info {
  margin-top: 1.25rem;

  .div-cls {
    display: flex;
    width: 21.25rem;
    margin: 0 auto;
    border-radius: 0.625rem 0.625rem 0 0;
    overflow: hidden;

    .p-cls {
      width: 50%;
      text-align: center;
      color: var(--ep-color-text-weaker);
      background: var(--ep-color-background-fill-surface-raised-L1);
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      font-weight: var(--ep-font-weight-bold);

      &.active {
        color: var(--ep-color-text-weak);
        background-color: var(--ep-color-background-fill-surface-raised-L2);
      }
    }
  }
}

.report-content {
  width: 21.25rem;
  font-weight: var(--ep-font-weight-bold);
  color: var(--ep-color-text-weak);
  height: 20rem;
  margin: 0 auto 1.25rem;
  overflow: hidden;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: var(--ep-color-background-fill-surface-raised-L2);

  .moneyNum {
    color: var(--ep-color-text-warning);
  }

  .report-it {
    overflow: hidden;
    height: 20rem;

    .scroll-box {
      animation: scrollAnimation linear infinite;
      animation-fill-mode: both;
      font-size: 0.75rem;
      color: var(--color-piece-record-text);
      line-height: 2;
      font-weight: var(--ep-font-weight-bold);

      ion-row {
        height: 2.5rem;
        padding: 0.25rem 0.75rem;
        display: flex;
        align-items: center;

        .row-p1 {
          flex: 1;
          padding-left: 0.75rem;
        }

        .row-p2 {
          flex: 1;
          text-align: center;
        }

        .row-d1 {
          flex: 1;
          text-align: center;
          display: flex;
          justify-content: end;
          align-items: center;
          padding-right: 0.75rem;

          .row-d1-span {
            margin: 0 0.25rem;
          }
        }
      }
    }

    .zl-record {
      overflow-y: auto;
      height: 20rem;

      .record-text {
        color: var(--color-piece-record-text);
        font-size: 0.75rem;
        line-height: 2;
        min-height: 100%;

        ion-row {
          height: 2.5rem;
          padding: 0.25rem 0.75rem;
          display: flex;
          align-items: center;

          .row-p1 {
            flex: 1;
            padding-left: 0.75rem;
          }

          .row-p2 {
            flex: 1;
            text-align: center;
          }

          .row-d1 {
            flex: 1;
            text-align: center;
            display: flex;
            justify-content: end;
            align-items: center;
            padding-right: 0.75rem;

            .row-d1-span {
              margin: 0 0.25rem;
            }
          }
        }
      }
    }
  }
}

.rule-text {
  border-radius: var(--rounded-middle);
  margin: 0 1.25rem 1.25rem;
  padding: 0.625rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--ep-color-text-weak);

  .ruleItem {
    margin-bottom: 0.75rem;

    .ruleDes.title {
      font-weight: var(--ep-font-weight-bold);
      color: var(--ep-color-text-default);
      font-size: 1rem;
      margin-left: -0.125rem;
    }

    .ruleDes {
      margin-left: 0.25rem;
      padding-left: 0.4375rem;
      text-indent: -0.4375rem;
    }
  }
}

.help-bg {
  padding-bottom: 1.5rem;
  border-radius: var(--ep-border-radius-surface-small);
  background: var(--ep-color-background-fill-surface-raised-L2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: -2;
  padding-left: 1.25rem;
  padding-right: 1.25rem;

  ion-icon {
    color: var(--ep-color-icon-weaker);
  }

  .icon-cls {
    position: absolute;
    font-size: 1.875rem;
    line-height: 2.25rem;
    top: 0.75rem;
    right: 0.75rem;
  }

  .help-p {
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
    color: var(--ep-color-text-default, var(--color-primary-700));
    font-weight: var(--ep-font-weight-bold);
  }

  .help-content-bg {
    width: 100%;
    font-size: 0.875rem;
    background: var(--ep-color-background-fill-body-default);
    border-radius: var(--ep-border-radius-l);
    line-height: 1.25;
    padding: 1.25rem;

    .p-cls {
      color: var(--ep-color-text-weaker);
      font-weight: var(--ep-font-weight-medium);
    }
  }
}

.prize-content {
  border-radius: var(--ep-border-radius-surface-small);
  background: var(--ep-color-background-fill-surface-raised-L2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-left: 1.25rem;
  padding-right: 1.25rem;

  .prize-content-p {
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
    color: var(--ep-color-text-default, var(--color-primary-700));
    font-weight: var(--ep-font-weight-bold);
  }

  .prize-content-bg {
    width: 100%;
    background: var(--ep-color-background-fill-body-default);
    text-align: center;
    height: 12.25rem;
    border-radius: var(--ep-border-radius-surface-small);
    padding: 1.25rem 0;

    .img-cls {
      width: 6.75rem;
      margin-left: auto;
      margin-right: auto;
    }

    .p-cls {
      font-weight: var(--ep-font-weight-medium);
      font-size: 0.875rem;
      margin-top: 1.25rem;
      color: var(--color-currency);
    }
  }

  .btn-cls {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }
}

ion-segment {
  display: flex;
  justify-content: left;

  &.segment-button-disabled {
    opacity: 1;
  }

  &.ios {
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
    margin-top: 0;
  }
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

  &::part(container) {
    padding: 0.25rem;
    border-radius: 50%;
    border: none;
  }
}

ion-item ion-button {
  --ripple-color: transparent;
}

.font-black {
  font-weight: var(--ep-font-weight-bold);
}

.text-title {
  color: var(--color-piece-title);
}

.invite-btn-text {
  color: var(--color-piece-invite-text);
}

.hide-scrollbar {
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.aperture {
  animation: apertureAnimation 20s linear infinite;
}

.active-light {
  animation-name: lightAnimation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  pointer-events: none;
}

ion-row.shiny,
ion-button.pop.shiny {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    animation: shiny 6s ease-in-out infinite;
    background: white;
    display: inline-block;
    height: 100%;
    left: 0;
    position: absolute;
    top: -180px;
    width: 20px;
    z-index: 100;
  }
}

ion-item.pop.shiny::before {
  width: 30px !important;
}

.turntable-shiny {
  position: relative;
  overflow: hidden;

  &::before {
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
}

.winning-box {
  animation: blink 1s infinite;
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

ion-modal#modal-help,
ion-modal#modal-prize {
  --width: 22.25rem;
  --height: fit-content;
  --border-radius: var(--rounded-large);
}

@keyframes fingerTranslate {
  0% {
    opacity: 0;
    transform: translate(1000px, 800px);
  }

  25% {
    opacity: 0.2;
    transform: translate(18.75rem, 18.75rem);
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

@keyframes lightBlink {
  0% {
    opacity: 1;
  }

  30% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }

  80% {
    opacity: 0.2;
  }

  100% {
    opacity: 1;
  }
}
</style>
