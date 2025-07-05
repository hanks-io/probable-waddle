<!-- 签到奖励 跟随皮肤 -->
<template>
  <ion-page>
    <NavigationBar :title="activityName" />
    <ion-content>
      <div class="main-content">
        <!-- 顶部信息 -->
        <div class="top-banner">
          <div class="banner"></div>
          <div class="level-info">
            <img class="level-icon" :src="getLevelImg(userLevelInfo.level)"></img>
            <p class="level-name">{{ userLevelInfo.levelName }}</p>
          </div>
        </div>
        <!-- 进度 -->
        <div class="level-progress">
          <div v-for="item in betLevelConfig" class="icon-item">
            <div class="level-icons" :class="getLevelBgStyle(item.level)">
              <img :src="getLevelImg(item.level)"></img>
            </div>
            <p>{{ item.levelName }}</p>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-bar"></div>
          <div class="progress-mark">
            <div v-for="item in betLevelConfig" class="mark-item">
              <div>
                <div class="img-container">
                  <StateIcon :isDone="item.isDone" />
                </div>
                <p :class="getBetAmountStyle(item.isDone)">{{ formatMoneyToShow(item.betAmount) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bet-info">
          <p class="bet-amount">{{ `&nbsp${merchantCy} ${formatMoneyToShow(betAmount)}` }}</p>
          <p class="bet-text">{{ daysText }}</p>
        </div>
        <!-- 奖励信息 -->
        <div class="reward-info">
          <div class="title">
            <img src="@/assets/img/activity/levelSignIn/icon1.png"></img>
            <p>{{ $t('activity.levelSignIn04') }}</p>
          </div>
          <div v-for="item in rewardConfig" class="item">
            <div class="day-text">
              <img src="@/assets/img/activity/levelSignIn/icon2.png"></img>
              <span>{{ $t('activity.levelSignIn05', { day: item.day }) }}</span>
            </div>
            <span class="amount">
              <span class="units">{{ `${merchantCy} ` }}</span>{{ formatMoneyToShow(item.reward) }}
            </span>
            <div class="button-wrapper">
              <div v-show="showBtn(item.status)" class="button" :class="item.status" @click="applyHandle(item)">
                {{ getBtnText(item.status) }}
              </div>
              <p v-show="!showBtn(item.status)">{{ $t('activity.levelSignIn01') }}</p>
            </div>
          </div>
        </div>
        <!-- 活动规则 -->
        <div class="rules keep-space">
          <p class="rule-title">{{ $t('viewsActivity.activityRules') }}</p>
          <div class="rule-content" v-if="ruleType === ZActivityRuleType.enum.DEFAULT">
            <p v-for="(item, index) in defaultRule" :key="index">
              {{ item }}
            </p>
          </div>
          <p v-else>{{ customRule }}</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import StateIcon from './stateIcon.vue'
import { formatMoneyToShow } from '@/utils/custom'
import useLogic from '../logic'

const {
  activityName,
  ruleType,
  defaultRule,
  customRule,
  userLevelInfo,
  betLevelConfig,
  rewardConfig,
  merchantCy,
  betAmount,
  daysText,
  ZActivityRuleType,
  getLevelImg,
  getLevelBgStyle,
  getBetAmountStyle,
  getBtnText,
  showBtn,
  applyHandle,
} = useLogic();

</script>

<style scoped lang="less">
@import "@/views/activity/levelSignIn/style_0/style/base-index.less";
@import "@/views/activity/levelSignIn/style_0/style/theme-style.less";

#activity-levelSignIn-default-index.style();

.green-default {
  #activity-levelSignIn-default-index.style();
}

.green-dark {
  #activity-levelSignIn-default-index.style(
    @activity-levelSignIn-default-index-01: ~"linear-gradient(151deg, #8FE759 6.6%, #328624 77.21%, #25651A 92.71%), linear-gradient(180deg, #FFE299 0%, #E47E2B 100%), linear-gradient(180deg, #C09977 0%, #C09977 100%)";
    @activity-levelSignIn-default-index-02: linear-gradient(180deg, #292928 0%, #242424 100%);
    @activity-levelSignIn-default-index-03: rgba(255, 255, 255, 0.80);
    @activity-levelSignIn-default-index-04: #292D36;
    @activity-levelSignIn-default-index-05: #EF6E3E;
    @activity-levelSignIn-default-index-06: #3B414D;
    @activity-levelSignIn-default-index-07: ~"linear-gradient(151deg, #8FE759 6.6%, #328624 77.21%, #25651A 92.71%), linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%)";
    @activity-levelSignIn-default-index-08: 'banner01';
    @activity-levelSignIn-default-index-11: #1A1D22;
    @activity-levelSignIn-default-index-12: rgba(255, 255, 255, 0.80);
    @activity-levelSignIn-default-index-13: #292D36;
    @activity-levelSignIn-default-index-14: #4E5666;
  );
}

.yellow-dark, .auroral-yellow {
  #activity-levelSignIn-default-index.style(
    @activity-levelSignIn-default-index-02: linear-gradient(180deg, #292928 0%, #242424 100%);
    @activity-levelSignIn-default-index-03: #B8AD7A;
    @activity-levelSignIn-default-index-04: #423D24;
    @activity-levelSignIn-default-index-05: #F9EB85;
    @activity-levelSignIn-default-index-06: #857A47;
    @activity-levelSignIn-default-index-07: ~"linear-gradient(180deg, #FFE299 0%, #E47E2B 100%), linear-gradient(151deg, #9462F2 6.6%, #7A3FE8 77.21%, #6526DB 92.71%)";
    @activity-levelSignIn-default-index-08: 'banner01';
    @activity-levelSignIn-default-index-11: #1B1B19;
    @activity-levelSignIn-default-index-12: #B8AD7A;
    @activity-levelSignIn-default-index-13: #332F1C;
    @activity-levelSignIn-default-index-14: #857A47;
  );
}

.forest-green {
  #activity-levelSignIn-default-index.style(
    @activity-levelSignIn-default-index-01: linear-gradient(180deg, #13C96A 0%, #1D9554 100%);
    @activity-levelSignIn-default-index-02: #00563A;
    @activity-levelSignIn-default-index-03: #50B388;
    @activity-levelSignIn-default-index-04: #006849;
    @activity-levelSignIn-default-index-05: #EEF93B;
    @activity-levelSignIn-default-index-06: #007B4C;
    @activity-levelSignIn-default-index-07: linear-gradient(180deg, #13C96A 0%, #1D9554 100%);
    @activity-levelSignIn-default-index-08: 'banner01';
    @activity-levelSignIn-default-index-09: rgba(255, 255, 255, 0.50);
    @activity-levelSignIn-default-index-10: rgba(255, 255, 255, 0.70);
    @activity-levelSignIn-default-index-11: #004D37;
    @activity-levelSignIn-default-index-12: #50B388;
    @activity-levelSignIn-default-index-13: #006849;
    @activity-levelSignIn-default-index-14: #00995F;
  );
};

.amber-purple {
  #activity-levelSignIn-default-index.style(
    @activity-levelSignIn-default-index-01: ~"linear-gradient(270deg, #7041F3 0%, #F5C84C 130.92%), linear-gradient(180deg, #FFE299 0%, #E47E2B 100%), linear-gradient(180deg, #C09977 0%, #C09977 100%)";
    @activity-levelSignIn-default-index-02: #211F3D;
    @activity-levelSignIn-default-index-03: #737BB2;
    @activity-levelSignIn-default-index-04: #2C294D;
    @activity-levelSignIn-default-index-05: #F5C84C;
    @activity-levelSignIn-default-index-06: #4B4778;
    @activity-levelSignIn-default-index-07: linear-gradient(270deg, #7041F3 0%, #F5C84C 130.92%), linear-gradient(180deg, #FFE299 0%, #E47E2B 100%);
    @activity-levelSignIn-default-index-08: 'banner01';
    @activity-levelSignIn-default-index-11: #262346;
    @activity-levelSignIn-default-index-12: #686299;
    @activity-levelSignIn-default-index-13: #2C294D;
    @activity-levelSignIn-default-index-14: #504B80;
  );
};

.purple-light {
  #activity-levelSignIn-default-index.style(
    @activity-levelSignIn-default-index-01: ~"linear-gradient(151deg, #9462F2 6.6%, #7A3FE8 77.21%, #6526DB 92.71%), linear-gradient(180deg, #FFE299 0%, #E47E2B 100%), linear-gradient(180deg, #C09977 0%, #C09977 100%)";
    @activity-levelSignIn-default-index-02: #E0D0FF;
    @activity-levelSignIn-default-index-03: #9462F2;
    @activity-levelSignIn-default-index-04: #DBC9FF;
    @activity-levelSignIn-default-index-05: #6526DB;
    @activity-levelSignIn-default-index-06: #C7A8FF;
    @activity-levelSignIn-default-index-07: linear-gradient(151deg, #9462F2 6.6%, #7A3FE8 77.21%, #6526DB 92.71%);
    @activity-levelSignIn-default-index-08: 'banner03';
    @activity-levelSignIn-default-index-09: rgba(0, 0, 0, 0.50);
    @activity-levelSignIn-default-index-10: rgba(0, 0, 0, 0.70);
    @activity-levelSignIn-default-index-11: #E7DBFF;
    @activity-levelSignIn-default-index-12: #9462F2;
    @activity-levelSignIn-default-index-13: #CCB2FF;
    @activity-levelSignIn-default-index-14: #9462F2;
  );
};

.blue-default {
  #activity-levelSignIn-default-index.style(
    @activity-levelSignIn-default-index-01: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
    @activity-levelSignIn-default-index-02: #101629;
    @activity-levelSignIn-default-index-03: #737BB2;
    @activity-levelSignIn-default-index-04: #151C2F;
    @activity-levelSignIn-default-index-05: #FBA531;
    @activity-levelSignIn-default-index-06: #2F3852;
    @activity-levelSignIn-default-index-07: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
    @activity-levelSignIn-default-index-08: 'banner01';
    @activity-levelSignIn-default-index-11: #090F1F;
    @activity-levelSignIn-default-index-12: #9BA7BE;
    @activity-levelSignIn-default-index-13: #202940;
    @activity-levelSignIn-default-index-14: #495780;
  );
}

</style>
