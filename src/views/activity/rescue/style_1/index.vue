<!-- 救援金活动 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ activityName }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :class="rescueInfo.resetType">
      <div class="flex flex-col items-center rounded-[0.875rem]  mt-[2.9375rem] allBg relative mb-[6rem] pb-[3rem]" >
        <div class="overflow-hidden w-[5.1875rem] h-[5.1875rem] absolute top-0 left-0">
          <div class="ribbon">{{ rescueInfo.resetType }}</div>
        </div>
        <div class="rotateBgBack" >
          <div class="rotateBg"
            :style="bannerFollow.circleImg">
          </div>
        </div>
        <div class="Halo" :style="bannerFollow.haloImg"></div>
        <div class="followStar"></div>
        <!-- 横幅 -->
        <div class="headerBg w-[12.1875rem] h-[12.3125rem] mt-[-4.1875rem] rounded-[.625rem] "
          :style="bannerFollow.bgImg">
        </div>
        <CountDown :issueEndTime="issueEndTime" @updateTime="getAssistanceDetail" :hasSecond="true"
          class="!static mt-[-1rem]" />
        <!-- 今日损益信息 -->
        <ion-row class="lossMess justify-between w-full text-xs">
          <ion-col class="rescue-ioncol-border rounded-[.3125rem] text-center py-2">
            <span class="text-[.9375rem] rescue-text-basic font-bold"><span class="rSymbol">{{ merchantCy }}</span> {{
              convertMoneyToShow(rescueInfo.profit) }}</span>
            <p class="today-tips">{{ $t('viewsActivity.myLoss') }}</p>
          </ion-col>
          <ion-col v-if="showCouponAmount"
            class="rescue-ioncol-border rounded-[.3125rem] text-center ml-[0.75rem] py-2">
            <span class="text-[.9375rem] rescue-text-basic font-bold"><span class="rSymbol">{{ merchantCy }}</span> {{
              convertMoneyToShow(rescueInfo.reward) }}</span>
            <p class="today-tips">{{ $t('viewsActivity.discountsMustBeDeducted') }}</p>
          </ion-col>
          <ion-col class="rescue-ioncol-border rounded-[.3125rem] text-center ml-[0.75rem] py-2">
            <span class="text-[.9375rem] rescue-text-basic font-bold"><span class="rSymbol">{{ merchantCy }}</span> {{
              convertMoneyToShow(rescueInfo.rewardAmount) }}</span>
            <p class="today-tips">{{ $t('label.collectable') }}</p>
          </ion-col>
        </ion-row>
        <!-- 救援金图表 -->
        <div class="rescueTable">
          <div class="table-header">
            <div class="left"> {{ $t('viewsActivity.lossAmount') }}</div>
            <div class="right">{{ $t('label.collectable') }}</div>
          </div>
          <div class="table-body">
            <div class="item" v-for="item in rescueInfo.rewardLevels" :key="item.uuid">
              <div class="left"><ion-icon class="text-[1.125rem]" src="/images/activity/coin.svg" /><span>{{ merchantCy
                  }}</span></div>
              <div class="middle">{{ convertMoneyToShow(item.conditionAmount) }}</div>
              <div class="right" v-show="rescueInfo.rewardType === ZAssistancerewardType.enum.FIXED"> +{{
                convertMoneyToShow(item.rewardAmount) }}</div>
              <div class="right" v-show="rescueInfo.rewardType === ZAssistancerewardType.enum.RANGE"> {{
                convertRatioToShow(item.rewardAmount) }}%</div>
            </div>
          </div>
        </div>
        <!-- 活动介绍 -->
        <div class="desHeader">
          <ion-icon src="/images/activity/des.svg" />
          <div class="text">{{ $t('viewsActivity.lossFollow') }}</div>
          <ion-icon class="right" src="/images/activity/des.svg" />
        </div>
        <div
          class="desBottom bg-[--color-bg-second] p-2.5 px-[1.75rem] pt-[1rem] text-xs rounded-[.625rem] w-full text-[--color-text-second]">
          <p class="whitespace-pre-line keep-space">{{ rescueInfo.rule }}</p>
        </div>

      </div>

      <Footer v-if="showReceiveBtn">
        <div class="btn" :class="activityStatus && btnReceiveIsEnable ? 'shiny active' : 'unable'"
          @click="onActivityApply">{{ $t('toggle.claim') }}</div>
      </Footer>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ZAssistancerewardType } from '@/enums/types/activity.type'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonCol,
  IonIcon,
} from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import CountDown from '@/views/activity/comp/default/Countdown/index.vue'
import Footer from '@/views/activity/comp/default/Footer/index.vue'
import { convertMoneyToShow, convertRatioToShow } from '@/utils/custom'
import useLogic from '../logic'

const {
  activityStatus,
  activityName,
  showReceiveBtn,
  btnReceiveIsEnable,
  showCouponAmount,
  rescueInfo,
  issueEndTime,
  merchantCy,
  getAssistanceDetail,
  onActivityApply,
  bannerFollow
} = useLogic()

</script>

<style scoped lang="less">
// 基础公共 less
@import "@/views/activity/rescue/style_1/theme-style.less";
.ion-padding.DAILY{
  #activity-rescue-default-follow-index.style();
}
.ion-padding.WEEKLY {
  #activity-rescue-default-follow-index.style(
    @rescue-default-index-01: linear-gradient(180deg, #BE7DFF 0%, #25193E 18.4375rem) ,
    @rescue-default-index-02: #FC57FC,
    @rescue-default-index-03: #AB73BC,
    @rescue-default-index-04:  linear-gradient(90deg, #9753CC 0%, #385DAE 100%),
    @rescue-default-index-05:  #A941DF,
    @rescue-default-index-06: linear-gradient(270.38deg, #25193E 0.65%, #8055C4 49.64%, #25193E 100%),
    @rescue-default-index-07:  #AB73BC,
    @rescue-default-index-08: linear-gradient(90deg, #FDE064 0%, #B676F4 74.8%),
    @rescue-default-index-09:  linear-gradient(180.38deg, #327DF6 0.33%, #111542 99.67%),
    @rescue-default-index-10: #3d1761
  );
}
ion-toolbar {
  --background: #0E1420;
  --color: #FFFFFF;
}

.ion-padding {
  --padding-start: 0.9375rem;
  --padding-end: 0.9375rem;
  --background: #0b1529;
  font-family:  'Prompt' !important;
}

.ribbon {
  position: absolute;
  top: 0.9375rem;
  /* 调整角标的垂直位置 */
  left: -3.375rem;
  /* 调整角标的水平位置 */
  background-color: #ffcc33;
  /* 黄色背景 */
  color: black;
  /* 字体颜色 */
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  padding: 0.1563rem 3.75rem;
  /* 控制角标宽度 */
  transform: rotate(-45deg);
  /* 旋转角标 */
}
.rotateBgBack {
 position: absolute;
 width: 100%;
 height: 15.4375rem;
 overflow: hidden;
 top: 0;
 left: 0;
 .rotateBg {
   width: 25.625rem;
   height: 25.625rem;
   background-size: cover;
   background-repeat: no-repeat;
   position: absolute;
   top: -10.1875rem;
   left: 50%;
   margin-left: -12.8125rem;
   animation: apertureAnimation 20s linear infinite;
 }
}
.Halo {
  width: 100%;
  height: 22.375rem;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  top: -5rem;
  left: 0rem;
  transform: rotateX(25deg);
  z-index: -1;
}

.followStar {
  width: 100%;
  height: 22.375rem;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  top: -12rem;
  left: -3rem;
  transform: scale(0.4);
  background-image: url('/images/activity/followStar.png');
  z-index: 10;
  mix-blend-mode: screen;
  animation: twinkle 3s ease-in-out infinite;
  /* 应用动画，5秒为一轮 */
}

.allBg {

  .headerBg {
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 5;
  }
}

.lossMess {
  margin: 0 auto;
  width: 21rem;
  z-index: 30 !important;

  ion-col {
    --width: 6.5rem;
    --height: 4.5rem;
    margin-top: 1.125rem;
    border-radius: 0.875rem;
    padding-top: 1.375rem;
    background: #201b62;
    padding-left: 0;
    padding-right: 0;
    box-shadow:  0rem 0rem 4.6875rem 0rem #4B14FE61 inset, 0rem 0rem 0.3812rem 0rem #FFFFFF21;

    .rescue-text-basic {
      color: #F9D045;

      .rSymbol {
        font-size: 0.5rem;
      }
    }

    .today-tips {
      margin-top: 0.875rem;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 0.75rem;
      color: #e0d7ff !important;
    }
  }

}

/* 表格外层容器 */
.rescueTable {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.125rem;
  margin-top: 1.9375rem;

  .table-header {
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: space-between;

    div {
      width: 50%;
    }

    .left {
      padding-right: 1.3125rem;
    }

    .right {
      padding-left: 2.375rem;
    }
  }

  .table-body {
    .item {
      width: 100%;
      height: 2.875rem;
      line-height: 2.875rem;
      color: #FFFFFF;
      border-radius: 0.875rem;
      margin-bottom: 0.75rem;
      display: flex;
 
      .left {
        width: 4.15rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: relative;

        span {
          font-size: 0.375rem;
          position: absolute;
          right: 0.5625rem;
          transform: translateX(50%);
        }
        ion-icon {
          mix-blend-mode: luminosity;
        }
      }

      .middle {
        flex: 1;
        text-align: left;
        font-weight: 500;
        font-size: 1rem;
        padding-left: 0.2875rem;

      }

      .right {
        width: 5.8125rem;
        text-align: left;
        color: #FCD856;
        font-weight: 700;
        font-size: 1rem;
      }
    }

  }
}

.desHeader {
  margin-top: 1.8125rem;
  margin-bottom: 0.9375rem;
  height: 1.6875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;

  .right {
    transform: rotateY(180deg);
  }

  .text {
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.6875rem;
    margin: 0 0.375rem 0;
  }
}

.desBottom {
  background: transparent;
  border-top: 0.0625rem solid transparent;
  /* 设置透明边框 */
  border-image-slice: 1;

  /* 必须设置，切分整个渐变为边框 */
  p {
    line-height: 2.5;
  }
}

.footer {
  width: 22.875rem;
  margin: 0 0.75rem 1.4375rem;
  background: #293856 !important;
  height: 3.875rem;
  padding-top: 0.6875rem;
  border-radius: 0.875rem;
  border: 0.0625rem solid #394d7a;
  box-shadow: 0rem 0.25rem 1.1rem 0rem #15178A40;
 .btn {
  color: #0E1420 !important;
  font-weight: 700;
  width: 21.25rem;
 }
  .unable {
    opacity: 0.4;
    pointer-events: none;
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

@keyframes twinkle {

  0%,
  20% {
    opacity: 1;
    /* 完全可见 */
  }

  50% {
    opacity: 0;
    /* 隐藏 */
  }

  80%,
  100% {
    opacity: 1;
    /* 完全可见 */
  }
}

</style>
