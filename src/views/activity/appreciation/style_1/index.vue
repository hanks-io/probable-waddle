<!-- 会员答谢 -->
<template>
    <ion-page>
      <ion-content>
        <!-- 导航标签 -->
        <ion-header class="ion-no-border">
          <ion-toolbar mode="ios">
            <BackButton slot="start"  />
            <ion-title>{{ activityInfo.name }}</ion-title>
          </ion-toolbar>
        </ion-header>
        <!-- 活动时间 -->
        <div class="banner">
          <div class="boardBox">
            <div class="timeBoard  leading-[0.9375rem]">
              <p class="textBasic font-[380] text-[1rem]">{{ $t('activity.appreciation01') }}</p>
              <p class="textEmphasis font-[700] text-[1.25rem]">{{ activityInfo.endTime }}</p>
              <p></p>
            </div>
          </div>
        </div>
        <div class="mx-auto w-[21.25rem] bg-[#090f1f]">
          <div class="des">
            <!-- 循环周期 -->
            <div>
              <div class="flex items-center mt-[3.25rem] mb-[0.5625rem]">
                <ion-icon class=" text-2xl" icon="/first/svg/mysterious-icon1.svg"></ion-icon>
                <span class="ml-1 font-medium text-sm leading-7  title-text">{{ $t('activity.appreciation02') }}</span>
              </div>
              <div class="item w-full h-[3rem] rounded-[0.5rem]  flex items-center justify-center">
                <span class="textTime text-xl font-bold">
                  {{ activityInfo.cycle }}
                </span>
              </div>
            </div>
            <!-- 奖励金额 -->
            <div>
              <div class="flex items-center mt-[1.5rem] mb-[0.5625rem]">
                <ion-icon class="text-[1.6875rem]" icon="/first/svg/mysterious-icon2.svg"></ion-icon>
                <span class="ml-1 font-medium text-sm leading-7  title-text">{{ $t('activity.appreciation12') }}</span>
              </div>
              <div class="item w-full h-[3rem] rounded-[0.5rem]  flex items-center justify-center">
                <span>
                  <span class="textCoin">{{ merchantCy }}</span>
                  <span class="textReward">{{ activityInfo.maxReward }}</span>
                </span>
              </div>
            </div>
          </div>
          <!-- 活动规则 -->
          <div class="mt-[1.5rem] pb-28">
            <p class="ruleHeader ">{{ $t('activity.appreciation13') }}</p>
            <div class="ruleItem text-[1rem] font-normal textRule mb-3 text-[#7F8EB3]" v-for="(item, index) in activityInfo.description.split('\n')" :key="index">
              <p  class="ruleDes">
                {{ item }}
              </p>
            </div>
          </div>
        </div>
      </ion-content>
      <Footer>
        <!-- 领取按钮 -->
        <div class="btn" :class="activityInfo.canReceive ? 'shiny active' : 'unable'" @click="onActivityApply">{{ $t('toggle.claim') }}</div>
      </Footer>
    </ion-page>
  </template>

<script setup lang="ts">
import { IonPage, IonContent, IonToolbar, IonHeader, IonIcon, IonTitle } from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import Footer from '@/views/activity/comp/default/Footer/index.vue';
import useLogic from '../logic';

const { activityInfo, merchantCy, onActivityApply } = useLogic();

</script>

<style scoped lang="less">
// 基础公共 less
@import "@/views/activity/appreciation/style_1/style/base-index.less";

ion-toolbar {
    --background: #10162966;
    --color: #fff;
    margin-bottom: -3.125rem;
    height: 3.125rem;
}

:deep(ion-button ion-icon) {
  color: #fff ;
}


.footer {
    height: 4.5rem;
    padding-top: 0.75rem;
    background: #101629 !important;
    box-shadow: 0rem 0.0313rem 0rem 0rem #2C354B inset !important;

    .btn {
        width: 22.875rem;
        height: 3rem;
        border-radius: 0.25rem;
        line-height: 3rem;
    }

    .btn.active {
        background: linear-gradient(350.74deg, #6A3AC1 23.01%, #B271E0 131.39%);
        box-shadow: none;
    }

    .btn.unable {
        opacity: 0.5;
        background: linear-gradient(350.74deg, #6A3AC1 23.01%, #B271E0 131.39%);
        color: #fff;

    }
}
</style>
