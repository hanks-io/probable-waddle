<!-- 红包雨 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar bgColor="--mineral-style1-toobar-bg" :title="activityName" />
    <ion-content>
      <!-- 顶部背景图片/内容 -->
      <div class="mineral-style1-top w-full relative">
        <img class="star-light absolute top-[4.25rem] right-[1.0625rem] w-[8.875rem] h-[8.875rem]"
          src="/images/activity/mineral/mineral_style1_starlight.png" />
        <div class="w-full h-full pl-[1.0625rem] pt-[0.8125rem]">
          <!-- 活动名称 -->
          <div class="activity-name mb-[1.1875rem]">{{ activityName }}</div>
          <!-- 活动倒计时 -->
          <div class="date-tips mb-[0.625rem] flex">
            <div v-for="(item, index) in overCountDownList" :key="index" class="date-tips-item mr-[0.625rem] relative"
              :class="{ 'start-bg': !activityStatus && overTime > 0, 'over-bg': !activityStatus && !(overTime > 0) }">
              <!-- 倒计时 -->
              <div class="date-tips-item-content w-full h-full py-[0.25rem] flex flex-col items-center justify-around">
                <div class="date-value">{{ item.value }}</div>
                <div class="date-name">{{ $t(`${item.name}`) }}</div>
              </div>
              <!-- 底部线条 -->
              <div class="date-footer-line absolute bottom-0 left-[50%]"
                :class="{ 'over-footer-line': !activityStatus && !(overTime > 0) }"></div>
            </div>
          </div>
          <!-- 活动倒计时提示 -->
          <div class="flex items-center count-down-tips mb-[2.215rem]">
            <ion-icon class="text-[0.625rem] mr-[0.25rem]" src="/svg/activity/mineral/mineral_style1_dot.svg" />
            <div class="tips-content text-[0.75rem]">
              {{ $t('activity.activity') }}
              <span v-if="activityStatus">{{ $t('activity.end') }}</span>
              <span v-else-if="overTime > 0">{{ $t('activity.start') }}</span>
              <span v-else>{{ $t('activity.over') }}</span>
              <span v-if="overTime > 0">
                <span>{{ $t('activity.countdown') }}</span>
              </span>
            </div>
          </div>
          <!-- 奖励金额 -->
          <div class="mineral-style1-reward w-[11.3125rem] h-[4.5rem] text-center py-[0.75rem]">
            <div class="w-full flex-center">
              <img class="currency-icon" :src="getImageUrl(`img/virtualCurrency.png`)" alt="">
              <div class="reward-merchantCy" v-if="merchantCy">{{ merchantCy }}</div>
              <div class="reward-money">{{ formatMoneyToShow(rewardCount) }}</div>
            </div>
            <div class="reward-tips text-[0.75rem]">{{ $t('activity.redPacket6') }}</div>
          </div>
        </div>
      </div>
      <!-- 开始时间/活动规则 -->
      <div class="mineral-style1-content px-[0.9375rem] pb-[1.3125rem]">
        <div class="content-box">
          <!-- 活动开放时间 -->
          <div class="flex flex-wrap">
            <div class="open-time-item mb-[0.75rem]" :data-active="isAfterNow(item)"
              :class="isAfterNow(item) ? '' : 'over-open-time-item'" v-for="(item, index) in timeConfig" :key="index">
              {{ calcTime(item.hour) }} - {{ calcTime(item.hour, item.durationIn) }}
            </div>
          </div>
          <!-- 活动规则 -->
          <div class="mt-[0.9375rem]">
            <!-- 规则标题 -->
            <div class="w-full flex-center mb-[0.9375rem]">
              <ion-icon class="mineral-rule-icon" :src="titIcon" />
              <div class="mx-[0.375rem] rule-title">{{ $t('activity.appreciation13') }}</div>
              <ion-icon class="mineral-rule-icon right" :src="titIcon" />
            </div>
            <!-- 规则内容 -->
            <div class="mineral-rule-content w-full">
              <div class="mineral-top-border w-full h-[0.0625rem] mb-[0.9375rem]"></div>
              <p class="text-[0.75rem] leading-[1.6875rem] rule-contents keep-space">{{ rule }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部领取按钮 -->
      <div v-show="showReceiveBtn" class="fixed bottom-0 mineral-footer-btn w-full">
        <div class="footer-btn-box w-full px-[0.8125rem] py-[0.6875rem] flex-center">
          <ion-button class="w-full h-full available-btn" :class="canReceive && activityStatus ? '' : 'unAvailable-btn'"
            @click="mineralAvailableClick">
            <template v-if="endTime">
              {{ joinBtnText }}
            </template>
            <template v-else-if="startTime">
              {{ $t('activity.redPacket4', { time: startCountdown }) }}
            </template>
          </ion-button>
        </div>
      </div>
      <!-- 领取成功弹窗 -->
      <MineralStyle1Availabled v-if="openStyle1AvailableModal" :activityName="activityName"
        :availabledRewardCount="availabledRewardCount" @closeAvailableModal="closeAvailableModal('style1')" />
    </ion-content>
    <!-- 红包雨详情弹窗 -->
    <component :is="currentModel" :activityId="activityId" :openRedModel="openRedModel" @closeModel="closeModel" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue'
import { formatMoneyToShow, getImageUrl } from '@/utils'
import NavigationBar from '@/components/NavigationBar/index.vue'
import useLogic from '@/views/activity/mineral/logic'
import MineralStyle1Availabled from '@/views/activity/mineral/style_1/components/mineralStyle1Availabled.vue'
import { useModelComponents } from '@/views/tabbar/tabs/inicio/components/RedPacket/useModelComponents'
import titIcon from "@/assets/img/activity/mineral_style1_rule_icon.svg"

const currentModel = useModelComponents();
const {
  activityName,
  activityStatus,
  overCountdown,
  overCountDownList,
  overTime,
  rewardCount,
  merchantCy,
  timeConfig,
  calcTime,
  isAfterNow,
  rule,
  canReceive,
  endTime,
  startTime,
  startCountdown,
  mineralAvailableClick,
  openStyle1AvailableModal,
  availabledRewardCount,
  closeAvailableModal,
  activityId,
  openRedModel,
  closeModel,
  joinBtnText,
  showReceiveBtn,
} = useLogic()

</script>

<style scoped lang="less">
ion-content {
  font-family: 'Prompt' !important;
  --background: #0B152A;
}

.mineral-style1-top {
  height: 23.75rem;
  background: url('/images/activity/mineral/mineral_style1_top-bg.png') no-repeat;
  background-size: 100% 100%;

  .star-light {
    mix-blend-mode: screen;
    animation: scaleAnimation 1.5s ease-in-out infinite;
    /* 应用动画 */
  }
}

.activity-name {
  font-size: 2.5rem;
  line-height: 2.5rem;
  font-weight: 900;
  background: linear-gradient(90deg, #ECA326 0%, #9E2326 51.24%, #1659E6 98.54%);
  -webkit-text-stroke-width: .1313rem;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: normal;
  -webkit-text-stroke-color: #eed3a5;

  display: -webkit-box;
  /* 设置为伸缩盒模型 */
  -webkit-box-orient: vertical;
  /* 垂直方向排列 */
  overflow: hidden;
  /* 隐藏超出的部分 */
  -webkit-line-clamp: 2;
  /* 限制为 2 行 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 */
}

.date-tips {
  .date-tips-item {
    background: linear-gradient(180deg, #34ED7E 0%, #26507C 100%);
    width: 2.25rem;
    height: 2.75rem;
    border-radius: .3125rem;

    .date-tips-item-content {
      color: var(--ep-color-text-default, #FFF);

      .date-value {
        font-size: .875rem;
        line-height: .875rem;
        font-weight: 700;
      }

      .date-name {
        font-size: .5rem;
      }
    }
  }

  .start-bg {
    background: linear-gradient(180deg, #ED8D34 0%, #26507C 100%);
  }

  .over-bg {
    background: linear-gradient(180deg, #261616 0%, #1C2F43 100%);
    color: rgba(255, 255, 255, 0.5);
  }

  .date-footer-line {
    width: .375rem;
    height: .125rem;
    background: #FAAC47;
    transform: translateX(-50%);
  }

  .over-footer-line {
    background: #4F4232;
  }
}

.count-down-tips {
  color: #23DB8C;
}

.mineral-style1-reward {
  border-radius: var(--ep-border-radius-surface-small, 0.875rem);
  border: .125rem solid var(--ep-color-border-highlight-white, #BBBDFF);
  background: linear-gradient(180deg, var(--ep-color-background-fill-gradients-primary-a, #5582C4) 0%, var(--ep-color-background-fill-gradients-primary-b, #274B80) 100%);
  box-shadow: 0px 0px 12.9px 0px #4A9FFF, 0px 5px 11.5px 0px rgba(255, 255, 255, 0.38) inset;


  .currency-icon {
    width: 1.1875rem;
    height: 1.1875rem;
  }

  .reward-merchantCy {
    margin: 0 .375rem;
  }

  .reward-money,
  .reward-merchantCy {
    color: var(--ep-color-text-highlight, #F9D045);
    text-shadow: 0px 0px 9px rgba(252, 208, 88, 0.43);
    font-size: var(--ep-font-size-xl, 1.125rem);
    font-weight: var(--ep-font-weight-medium, 600);
  }

  .reward-tips {
    color: #FFF;
  }
}

.mineral-style1-content {
  transform: translateY(-4.375rem);

  .content-box {
    border-radius: .875rem;
    padding: 1.875rem .5625rem 1.1875rem .9375rem;
    background: linear-gradient(180deg, #202F51 0.33%, #111542 25.46%);
  }
}

.open-time-item {
  color: #1ACD4C;
  min-width: 6.5rem;
  padding: .5625rem 0;
  text-align: center;
  font-size: .75rem;
  border-radius: .375rem;
  border: 1px solid #2A337A;
  background: rgba(20, 23, 60, 0.50);
  margin-right: .5rem;
}

.over-open-time-item {
  background: var(--ep-color-background-fill-glow-primary-opacity-40, rgba(255, 255, 255, 0.03));
  color: rgba(255, 255, 255, 0.2);
}

.open-time-item:nth-child(3),
.open-time-item:nth-child(3n) {
  margin-right: 0;
}

.mineral-rule-icon {
  width: .8547rem;
  height: .5516rem;
  color: var(--ep-color-background-fill-active-primary, #5764FC);

  &.right {
    transform: scaleX(-1);
  }
}

.rule-title {
  color: #FFF;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.6875rem;
}

.mineral-rule-content {
  padding: .9375rem .6875rem 0 .9375rem;

  .mineral-top-border {
    background: linear-gradient(270deg, rgba(26, 37, 58, 1) 0.65%, var(--ep-color-background-fill-gradients-tertiary-a) 49.64%, rgba(25, 36, 57, 1) 100%);
  }

  .rule-contents {
    color: #95A9D3;
  }
}

.mineral-footer-btn {
  padding: 0 .75rem 1.1875rem;

  .footer-btn-box {
    height: 3.875rem;
    border-radius: .875rem;
    border: 1px solid #384E7A;
    background: #293856;
    box-shadow: 0px 4px 17.6px 0px rgba(21, 23, 138, 0.25);

    ion-button.available-btn {
      min-height: 0;
      --color: #FFF;
      font-size: .875rem;
      font-weight: 700;
      --background: linear-gradient(90deg, #E5C72B 0%, #A94B53 74.8%);
      --border-radius: .5rem;
      --background-activated: none;
      --background-focused: none;
      --background-hover: none;
    }

    ion-button.unAvailable-btn {
      opacity: 0.4;
    }
  }
}

.new-skin-symbol {
  .date-tips {
    .date-tips-item {
      background: linear-gradient(90deg, var(--ep-color-background-fill-gradients-tertiary-a) 0%, var(--ep-color-background-fill-gradients-tertiary-b) 100%);
    }
  }

  .mineral-style1-content .content-box {
    background: linear-gradient(180deg, var(--ep-color-background-fill-gradients-secondary-b) 0.33%, var(--ep-color-background-fill-gradients-secondary-a) 25.46%);

    .open-time-item:not(.over-open-time-item) {
      border: 0.125rem solid transparent;
      border-radius: 0.5rem;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      background-image: linear-gradient(to right, var(--ep-color-background-fill-body-default), var(--ep-color-background-fill-body-default)), linear-gradient(110deg, var(--ep-primary-primary-500), var(--ep-inverse-inverse-500));
      color: var(--ep-color-text-success)
    }

    .open-time-item {
      border: 1px solid transparent;
    }

    .rule-title,
    .mineral-rule-content p {
      color: var(--ep-color-text-weak)
    }

  }

  .mineral-footer-btn {
    div.footer-btn-box {
      border: 0;
      background: transparent;

      ion-button.available-btn {
        height: 2.875rem;
        --background: var(--ep-dynamic-primary, linear-gradient(90deg, rgba(58, 142, 227, 1) 0%, rgba(207, 63, 91, 1) 74.8%));
        opacity: 1;
      }

      ion-button.unAvailable-btn {
        --background: var(--ep-color-background-fill-active-disabled);
      }
    }
  }
}

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
</style>
