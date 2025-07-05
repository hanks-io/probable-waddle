<!-- 充值活动 -->
<template>
  <ion-page>
      <ion-header>
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ activityInfo.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" :scrollY="true">
      <div v-if="isLoaded" class="content-wrapper">
        <p class="recharge-activity-title">{{ $t('activity.recharge1') }}</p>
        <div class="recharge-activity-table-box">
          <table class="table-cls">
            <thead>
              <tr>
                <th>{{ $t('activity.recharge8') }}</th>
                <th>{{ $t('activity.recharge9') }}</th>     
              </tr>
            </thead>
            <tbody>
              <tr v-for="reward in rewardList" :key="reward.uuid">
                <td>{{ formatMoneyToShow(reward.conditionAmount) }}</td>
                <td>{{ formatMoneyToShow(reward.rewardAmount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 可领取奖励 -->
        <div v-if="showBtnClaim">
          <p class="recharge-available-tips">{{ $t('activity.common002') }}
            <span class="span">{{formatMoneyToShow(activityInfo.awardCount) }}</span>
          </p>
        </div>
        <!-- 活动规则 -->
        <div class="illustrate keep-space">
          <div class="div-cls" v-for="(item, index) in descriptionList"  :key="index">
					  {{ item }}
			   </div>
        </div>
      </div>
      <ion-skeleton-text v-if="!isLoaded" :animated="true" style="width: 100%; height: 100%;"></ion-skeleton-text>
    </ion-content>
     <!-- 领取按钮 -->
     <Footer v-if="showBtnClaim">
      <div :class="['btn', !!activityInfo.awardCount ? 'active shiny' : 'unable']" @click="claimHandle">{{ $t('activity.common001') }}</div>
    </Footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonSkeletonText, IonButton } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import BackButton from '@/components/BackButton.vue'
import Footer from '../../comp/default/Footer/index.vue'
import useLogic from '../logic'

const {
  activityInfo,
  rewardList,
  showBtnClaim,
  isLoaded,
  claimHandle,
  descriptionList
} = useLogic()
</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/recharge/default/style/base-index.less";
  @import "@/views/activity/recharge/default/style/theme-style.less";

  #activity-recharge-default-index.style();

	.blue-default {
  	#activity-recharge-default-index.style(
      --color-bg-200,
      --color-text-gray-200,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --color-border-600,
      --color-border-600,
      --color-text-gray-200,
      --color-bg-100,
      --color-bg-200,
      ---color-text-white-100,
      --accent-color-yellow,
      ---color-text-white-100,
      --color-border-600,
      --color-bg-200,
      --color-text-gray-200,
      --color-text-emphasis
    );
	}

	.green-default {
    #activity-recharge-default-index.style(
      --color-bg-200,
      --color-text-gray-200,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --color-line,
      --color-line,
      --color-text-gray-200,
      --color-bg-100,
      --color-bg-200,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-text-gray-100,
      --color-line,
      --color-bg-200,
      --color-text-gray-200,
      --accent-color-yellow
    );
	}

  .amber-purple {
    #activity-recharge-default-index.style(
      --color-bg-200,
      --text-color-light-purple-2-100,
      --segment-gradients-purple,
      --segment-gradients-purple,
      --line-color,
      --line-color,
      --text-color-light-purple-2-100,
      --color-bg-100,
      --color-bg-200,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --text-color-light-purple-1-100,
      --line-color,
      --color-bg-200,
      --text-color-light-purple-2-100,
      --accent-color-yellow
    );
  }

  .auroral-yellow {
    #activity-recharge-default-index.style(
      @recharge-default-index-05: --color-border,
      @recharge-default-index-06: --color-border
    );
  }
</style>
