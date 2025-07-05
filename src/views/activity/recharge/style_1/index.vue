<!-- 充值活动 -->
<template>
  <ion-page class="recharge-container">
    <ion-header>
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios" class="recharge-container-header">
        <BackButton />
        <ion-title class="recharge-container-header-title">{{ activityInfo.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="recharge-container-content" :scrollY="true">
      <div v-if="isLoaded" class="recharge-container-content-box">
        <div class="img-wall">
          <progressiveImages class="float-img" src="/images/four-pointed-star.png" />
          <progressiveImages class="main-img" src="/images/recharge-main.png" />
          <ion-label class="title">{{ $t('activity.recharge1') }}</ion-label>
        </div>
        <!-- 可领取奖励 -->
        <div class="reward-box" v-if="showBtnClaim">
          <div class="reward-box-img-wall">
            <ion-img class="reward-box-img-wall-img" src="/images/money3.png" alt="" />
            <ion-label class="reward-box-img-wall-label">{{ merchantCy }}</ion-label>
          </div>
          <div class="reward-box-amount">
            <ion-label class="reward-box-amount-label">{{ $t('activity.common002').replace(/:|：/, '') }}</ion-label>
            <ion-label class="reward-box-amount-value">{{ formatMoneyToShow(activityInfo.awardCount) }}</ion-label>
          </div>
        </div>
        <div class="content-box">
          <div class="content-box-title">
            <ion-label>{{ $t('activity.recharge8') }}</ion-label>
            <ion-label>{{ $t('activity.recharge9') }}</ion-label>
          </div>
          <ul class="content-box-list">
            <li v-for="reward in rewardList" :key="reward.uuid" class="content-box-list-item">
              <div class="amount">
                <GradientSVG class="amount-icon" src="/first/svg/tabbar/deposit_on.svg" styleId="paint0_linear_679_214">
                  <template #default>
                    <svg class="svg-wall">
                      <defs>
                        <linearGradient id="paint0_linear_679_214" x1="9.06836" y1="0" x2="9.06836" y2="18"
                          gradientUnits="userSpaceOnUse">
                          <stop stop-color="#F5ED67" />
                          <stop offset="1" stop-color="#D78922" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </template>
                </GradientSVG>
                <ion-label class="amount-label">{{ formatMoneyToShow(reward.conditionAmount) }}</ion-label>
              </div>
              <div class="reward">
                <span class="plus">+</span>
                {{ formatMoneyToShow(reward.rewardAmount) }}
              </div>
            </li>
          </ul>
        </div>

        <div class="description" v-if="descriptionList.length">
          <div class="description-title">
            <ion-icon class="before-icon" src="/svg/three-lines-left.svg" />
            <ion-label>{{ descriptionList[0].replace(/:|：/, '') }}</ion-label>
            <ion-icon class="after-icon" src="/svg/three-lines-right.svg" />
          </div>

          <ul class="description-list">
            <li class="description-list-item" v-for="item in descriptionList.slice(1)" :key="item">{{ item }}</li>
          </ul>

        </div>


        <Footer class="footer" v-if="showBtnClaim">
          <component :is="templateBtn" :disabled="!activityInfo.awardCount" :shiny="true" @click="claimHandle">{{
            $t('activity.common001') }}</component>
        </Footer>
      </div>
      <ion-skeleton-text v-if="!isLoaded" :animated="true" style="width: 100%; height: 100%;"></ion-skeleton-text>
    </ion-content>


  </ion-page>
</template>

<script setup lang="ts">
import { IonLabel, IonImg, IonIcon, IonButton, IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonSkeletonText } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom';
import BackButton from '@/components/BackButton.vue';
import GradientSVG from '@/components/GradientSVG/index.vue';
import progressiveImages from '@/components/GameCard/progressiveImages.vue';
import useLogic from '../logic'
import { useBtnComponents } from '@/views/activity/commission/logic';
import Footer from '@/views/activity/comp/first/Footer/index.vue'
const templateBtn = useBtnComponents();
const {
  merchantCy,
  descriptionList,
  activityInfo,
  rewardList,
  showBtnClaim,
  isLoaded,
  claimHandle,
} = useLogic()

</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
</style>
<style scoped lang="less">
@import './index.less';
</style>
