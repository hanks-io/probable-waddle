<script setup lang="ts">

import {
  IonModal,
  IonImg,
  IonIcon
} from "@ionic/vue";
import { close } from 'ionicons/icons';
import Button from '@/components/first/Button/index.vue';
import { formatMoneyToShow } from '@/utils/custom'
import useRedPacketRainModelLogic from '../redPacketModelLogic';
const { t } = useI18n();
const props = defineProps<{
  activityId: string | number
  openRedModel: boolean
}
>();
const emit = defineEmits<{
  (e: 'closeModel'): void

}>()

const {
  visible,
  scrollEl,
  showEnd,
  received,
  countdownTime,
  maxAmount,
  mineTime,
  activityRule,
  activityName,
  isIpad,
  activityTimes,
  closeModelClick,
  rewardModalHandle,
  joinBtnText,
  showReceiveBtn,
} = useRedPacketRainModelLogic({ props, emit });

const btnText = computed(() => showEnd.value ? joinBtnText.value : t('activity.redPacket4', { time: countdownTime.value }))

const handleClick = () => {
  if (!showEnd.value) return
  rewardModalHandle()
}



</script>
<template>
  <ion-modal ref="modal" :is-open="visible" :backdrop-dismiss="false">
    <div class="red-packet-container">
      <div class="top-container">
        <!-- 活动名称 -->
        <div class="activity-name">{{ activityName }}</div>
        <!-- 右上角退出按钮 -->
        <ion-icon class="close-icon" :icon="close" @click="closeModelClick" />
        <img class="star-light" src="/images/activity/mineral/mineral_style1_starlight.png" />

      </div>
      <div class="bottom-container">
        <!-- 开采按钮 -->

        <div class="mining-btn-container">
          <Button v-if="showReceiveBtn" class="mining-btn" :shiny="received" :disabled="!received || !showEnd"
            @click="handleClick">{{ btnText }} </Button>
        </div>


        <!-- 活动提示 -->

        <div class="tip-text">{{
          $t('viewsTabbar.mineText1', { times: activityTimes, money: formatMoneyToShow(maxAmount) }) }}</div>
        <!-- 活动开启时间 -->
        <ul ref="scrollEl" class="time-list-container">
          <li v-for="(item) in mineTime" :key="item.text" :class="[{ 'out-dated': item.isDis }]">{{ item.text }}</li>
          <li></li>

        </ul>
        <!-- 底部活动规则 -->
        <ul class="rule-text">
          <li v-for="(item, index) in activityRule" :key="index">{{ item.text }}</li>
        </ul>


      </div>


    </div>

  </ion-modal>
</template>

<style scoped lang="less">
@keyframes scaleAnimation {
  0% {
    transform: scale(2);
    /* 初始状态，100% */
  }

  50% {
    transform: scale(1);
    /* 缩小到 70% (即 30% 的缩小) */
  }

  100% {
    transform: scale(2);
    /* 恢复到 100% */
  }
}


.red-packet-container {
  background: var(--ep-color-background-fill-body-default);
  width: 22.5rem;
  border-radius: var(--ep-border-radius-surface-large, 20px);
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  height: 30rem;

  .top-container {
    height: 15rem;
    width: 100%;
    background: url('@/assets/img/activity/red_packet_modeal_bg.png') no-repeat;
    background-size: 100% 100%;
    position: relative;


    .activity-name {
      color: var(--ep-color-text-highlight-white, #FFF);
      text-align: center;
      text-shadow: 0rem .0469rem .0625rem rgba(0, 0, 0, 0.45);
      -webkit-text-stroke-width: .0625rem;
      -webkit-text-stroke-color: var(--ep-color-border-warning, #FA8313);

      font-size: var(--ep-font-size-xxl, 24px);
      font-style: normal;
      font-weight: var(--ep-font-weight-bold, 700);
      line-height: 60px;
      text-transform: capitalize;
    }

    .close-icon {
      position: absolute;
      right: 4px;
      top: 5px;
      font-size: var(--ep-font-size-xxxl, 36px);
      color: var(--ep-color-icon-default, #FFF);
      cursor: pointer;
    }

    .star-light {
      position: absolute;
      display: block;
      top: 6.25rem;
      right: 5rem;
      width: 7.5rem;
      height: 7.5rem;
      mix-blend-mode: screen;
      animation: scaleAnimation 1.5s ease-in-out infinite;
      /* 应用动画 */
    }
  }

  .bottom-container {
    position: absolute;
    top: 13.75rem;
    left: 0;
    width: 100%;
    height: 6.25rem;
    background: var(--ep-color-background-fill-body-default);
    z-index: 100;

    .mining-btn-container {
      width: 18.75rem;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -30%);


    }

    .tip-text {
      width: 18.75rem;
      text-align: left;
      color: var(--ep-color-text-brand-primary);
      margin: 40px auto 12px;
      font-size: var(--ep-font-size-m, 14px);
      font-weight: var(--ep-font-weight-bold, 700);
    }

    .time-list-container {
      width: 18.75rem;
      height: 3.1875rem;
      overflow-y: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin: 0 auto;
      padding: 0;
      list-style: none;
      font-size: var(--ep-font-size-s, 12px);
      border: .0625rem solid var(--ep-color-border-warning);
      border-radius: var(--ep-border-radius-m, 6px);
      scrollbar-width: none;

      li {
        flex: 0 0 33.33%;
        height: 1.0625rem;
        text-align: center;
        color: var(--ep-color-text-warning);
        margin-top: .375rem;
      }

      .out-dated {
        color: var(--ep-color-text-weaker);
      }
    }



    .rule-text {
      width: 18.75rem;
      text-align: left;
      color: var(--ep-color-text-weak);
      font-size: var(--ep-font-size-s, .75rem);
      margin: .75rem auto;



    }



  }


}
</style>
