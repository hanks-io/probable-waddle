<template>
  <ion-page>
    <ion-content>
      <!-- 活动标题 -->
      <div class="fixed top-0 header-content w-full z-30">
        <BackButton class="ml-2 absolute top-[20%] left-0"  />
        <div class="activity-name w-full h-full flex-center">{{ activityName }}</div>
      </div>
      <!-- 顶部图片 -->
      <div class="mineral-style2-top w-full z-40">
        <div class="w-full h-full relative">
          <div class="available-money absolute bottom-0 right-0">
            {{ merchantCy }} {{ formatMoneyToShow(rewardCount) }}
          </div>
        </div>
      </div>
      <!-- 倒计时/活动开启时间/活动规则 -->
      <div class="mineral-style2-conten">
        <!-- 倒计时 -->
        <div class="count-down-content flex">
          <div 
            class="count-down-item mr-[0.75rem] w-[4rem]" 
            v-for="(item,index) in overCountDownList" 
            :key="index"
            :class="{ 'forever-count-down': activityStatus && overTime > 0 && !showEndCountdown, 'over-count-down': !activityStatus && !(overTime > 0) }" 
          >
            <div class="w-full flex items-center relative">
              <ion-icon class="w-full h-[3.5rem] time-bg" src="/svg/activity/mineral/mineral_style2_count_down_bg.svg" />
              <div class="point-box absolute left-[4.25rem]" v-if="index <= 2">
                <div class="point mb-[0.25rem]"></div>
                <div class="point"></div>
              </div>
              <!-- 时间 -->
              <div class="time-value w-full h-full absolute top-0 left-0 flex-center">{{ item.value }}</div>
              <!-- 线条 -->
              <div class="time-line absolute top-[50%] left-[50%] z-20"></div>
            </div>
            <div class="w-full text-center time-name mt-[0.25rem]">{{ $t(`${item.name}`) }}</div>
          </div>
        </div>
        <!-- 活动开启时间 -->
        <div class="w-full mt-[1.5rem]">
          <div class="w-full text-center open-time activity-text-gradient">{{ $t('activity.redPacket5') }}</div>
          <div class="w-full flex flex-wrap mt-[0.5rem]">
            <div 
              class="open-time-item mb-[1rem] text-center" 
              :data-active="isAfterNow(item)"
              :class="isAfterNow(item) ? '' : 'over-open-time-item'"
              v-for="(item,index) in timeConfig" 
              :key="index"
            >
              {{ calcTime(item.hour) }}-{{ calcTime(item.hour, item.durationIn) }}
            </div>
          </div>
        </div>
        <!-- 活动规则 -->
        <div class="mineral-style2-activity-rules w-full mt-[0.5rem]">
          <!-- 规则标题 -->
          <div class="w-full flex-center mb-[0.75rem]">
            <img class="w-[5.6875rem] h-[0.75rem]" src="/images/activity/mineral/mineral_style2_rule_title.png" alt="">
            <div class="mx-[0.75rem] rules-name activity-text-gradient">{{ $t('viewsActivity.activityRules') }}</div>
            <img class="w-[5.6875rem] h-[0.75rem] rotate-180" src="/images/activity/mineral/mineral_style2_rule_title.png" alt="">
          </div>
          <!-- 规则内容 -->
          <p class="text-[1rem] leading-[1.25rem] rule-contents keep-space">{{ rule }}</p>
        </div>
      </div>
      <!-- 底部领取按钮 -->
      <div v-show="showReceiveBtn" class="mineral-style-footer-btn fixed bottom-0 w-full p-[0.75rem] z-40" :class="canReceive && activityStatus ? '' : 'mineral-style2-unAvailable-btn'">
        <ion-button 
          class="w-full h-[3rem] mineral-style2-available-btn" 
          @click="mineralStyle2AvailableClick"
        >
          <template v-if="endTime">
            {{ joinBtnText }}
          </template>
          <template v-else-if="startTime">
            {{ $t('activity.redPacket4', { time: startCountdown }) }}
          </template>
        </ion-button>
      </div>
      <!-- 领取成功弹窗 -->
      <AvailabledModal 
        v-if="openStyle2AvailableModal" 
        :activityName="activityName" 
        :availabledRewardCount="availabledRewardCount" 
        @closeAvailableModal="closeAvailableModal('style2')" 
      />
    </ion-content>
    <!-- 红包雨详情弹窗 -->
    <component :is="currentModel" :activityId="activityId" :openRedModel="openRedModel"  @closeModel="closeModel" />
  </ion-page>
</template>

<script setup lang="ts" >
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import BackButton from '@/components/BackButton.vue'

import useLogic from '@/views/activity/mineral/logic'
import AvailabledModal from '@/views/activity/mineral/style_2/modal/availabledModal.vue'
import { useModelComponents } from '@/views/tabbar/tabs/inicio/components/RedPacket/useModelComponents'

const currentModel = useModelComponents();

const {
	activityName,
  overCountDownList,
  activityStatus,
  overTime,
  showEndCountdown,
  merchantCy,
  rewardCount,
  isAfterNow,
  timeConfig,
  calcTime,
  rule,
  canReceive,
  endTime,
  startTime,
  startCountdown,
  mineralStyle2AvailableClick,
  openStyle2AvailableModal,
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
.header-content {
  opacity: 0.5;
  height: 3.125rem;
  background: #101629;
  box-shadow: 0px 2px 8px 0px rgba(42, 53, 84, 0.60);
  border: none;
  .activity-name {
    color: #FFF;
    font-size: 1.25rem;
    padding-left: 5.625rem;
    padding: .1875rem 5.625rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

ion-content {
  --background: #0d111c;
}

.mineral-style2-top {
  height: 14.9375rem;
  background: url('/images/activity/mineral/mineral_style2_top_bg.png')  no-repeat;
  background-size: 100% 100%;
  .available-money {
    padding: .5625rem .75rem;
    border-radius: 100px 0px 0px 100px;
    opacity: 0.9;
    line-height: 1.25rem;
    background: #1BAA76;
    font-size: 1.25rem;
    font-weight: 700;
  }
}

.mineral-style2-conten {
  padding: 1.5rem 1.5625rem 6.75rem;
  background: #090f1f;
  // 倒计时
  .count-down-content {
    padding: 1.25rem 1.5rem;
    border-radius: .5rem;
    background: #222634;
    box-shadow: 0px 8px 0px 0px #1B1F2E;
    .count-down-item:last-child {
      margin-right: 0;
    }
    .count-down-item {
      .point-box {
        .point {
          width: .25rem;
          height: .25rem;
          border-radius: 50%;
          background: #4C5266;
        }
      }

      .time-bg {
        color: #1BAA76;
      }

      .time-value {
        color: #F2F2F2;
        font-size: 60px;
        font-weight: 700;
        font-family: "Smooch Sans";
      }

      .time-line {
        width: 3.75rem;
        height: .125rem;
        background: #222634;
        transform: translate(-50%,-50%);
      }

      .time-name {
        font-size: .75rem;
        color: #F2F2F2;
        text-transform: uppercase;
        line-height: normal;
      }
    }
    // 活动结束倒计时-永久状态
    .forever-count-down {
      .time-bg {
        color: #0E583E;
      }
      .time-value {
        color: #0A422E;
      }
      .time-name {
        color: #3E4354;
      }
    }
    // 活动-已结束
    .over-count-down {
      .time-bg {
        color: #4C5266;
      }
      .time-value {
        color: #363B49;
      }
      .time-name {
        color: #3E4354;
      }
    }
  }
  // 活动开始时间
  .open-time {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(360deg, #465375 0%, #7F8EB3 100%);
  }

  .open-time-item {
    min-width: 6.25rem;
    font-size: .9375rem;
    line-height: 1.25rem;
    color: #FBA531;
    margin-right: 1.25rem;
    font-weight: normal;
    font-family: 'Prompt';
  }

  .open-time-item:nth-child(3),
  .open-time-item:nth-child(3n) {
    margin-right: 0;  
  }

  .over-open-time-item {
    color: #3E4354;
  }

  .mineral-style2-activity-rules {
    padding: 1.25rem .75rem;
    background: #101629;
    border-radius: .75rem;
    .rules-name {
      font-size: 1rem;
      line-height: 1.5rem;
      background: linear-gradient(0deg, #465375 0%, #7F8EB3 100%);
      white-space: nowrap;
    }

    .rule-contents {
      color: #465375;
      font-family: "SF Pro";
    }
  }
}

.mineral-style-footer-btn {
  background: linear-gradient(0deg, #101629 0%, #101629 100%), #262623;
}

.mineral-style2-available-btn {
  min-height: 0;
  font-size: 1rem;
  font-weight: 600;
  --color: #FFF;
  --border-radius: .25rem;
  --background: linear-gradient(0deg, #C08505 0%, #FFD272 100%);
  box-shadow: 0px 17px 7px 0px rgba(47, 156, 33, 0.03);
  --background-hover: none;
  --background-activated: linear-gradient(0deg, #d9b468 0%, #edca7d 100%);
  --background-focused: linear-gradient(0deg, #d9b468 0%, #edca7d 100%);
}

.mineral-style2-unAvailable-btn {
  box-shadow: 0px 0.5px 0px 0px #2C354B inset;
  ion-button.mineral-style2-available-btn {
    opacity: 0.5;
  }
}
</style>
