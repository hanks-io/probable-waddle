<!-- 充值活动 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityInfo.name" />
    <ion-content :scrollY="true">
      <div v-if="isLoaded" class="content-wrapper">
        <p class="recharge-activity-title">{{ $t("activity.recharge1") }}</p>
        <div class="recharge-activity-table-box">
          <table class="table-cls">
            <thead>
            <tr>
              <th>{{ $t("activity.recharge8") }}</th>
              <th>{{ $t("activity.recharge9") }}</th>
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
          <p class="recharge-available-tips">{{ $t("activity.common002") }}
            <span>{{ formatMoneyToShow(activityInfo.awardCount) }}</span>
          </p>
        </div>
        <!-- 活动规则 -->
        <div class="illustrate keep-space">
          <div class="div-cls" v-for="(item, index) in descriptionList" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
      <ion-skeleton-text v-if="!isLoaded" :animated="true" style="width: 100%; height: 100%;"></ion-skeleton-text>
    </ion-content>
    <!-- 领取按钮 -->
    <Footer v-if="showBtnClaim">
      <Button class="btn-cls" :disabled="!activityInfo.awardCount" :shiny="!!activityInfo.awardCount"
              @click="claimHandle">
        {{ $t("activity.common001") }}
      </Button>
    </Footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonSkeletonText } from "@ionic/vue";
import { formatMoneyToShow } from "@/utils/custom";
import NavigationBar from "@/components/NavigationBar/index.vue";
import Footer from "@/views/activity/comp/first/Footer/index.vue";
import Button from "@/components/first/Button/index.vue";
import useLogic from "../logic";

const {
  activityInfo,
  rewardList,
  showBtnClaim,
  isLoaded,
  claimHandle,
  descriptionList
} = useLogic();

</script>

<style scoped lang="less">
@import "@/views/activity/recharge/first/styles/base-index.less";

.new-skin-symbol {
  @import "@/views/activity/recharge/first/styles/theme-style.less";
}
</style>
