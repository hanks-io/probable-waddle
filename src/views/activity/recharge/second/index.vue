<!-- 充值活动 -->
<template>
  <ion-page>
      <ion-header class="ion-no-border">
        <!-- 顶部导航栏 -->
        <ion-toolbar mode="ios">
          <BackButton />
          <ion-title>{{ activityInfo.name }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding" :scrollY="true">
        <div v-if="isLoaded" class="content-wrapper">
          <p class="recharge-activity-title font-weight-bold color-text-100">{{ $t('activity.recharge1') }}</p>
          <div class="recharge-activity-table-box rounded-middle color-border">
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
            <p class="recharge-available-tips color-text-80">{{ $t('activity.common002') }}
              <span class="color-text-currency">{{ formatMoneyToShow(activityInfo.awardCount) }}</span>
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
          {{ $t('activity.common001') }}
        </Button>
      </Footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonSkeletonText } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import BackButton from '@/components/BackButton.vue'
import Footer from '@/views/activity/comp/second/Footer/index.vue';
import Button from '@/components/second/Button/index.vue'
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

<style lang="less" scoped>

.recharge-activity-title {
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
  margin-bottom: 1.25rem;
}

.recharge-activity-table-box {
  overflow: hidden;
}

.table-cls {
  display: table;
  width: 100%;
  font-size: 0.75rem;
  line-height: 1rem;
}



.illustrate {
  width: 22.5rem;
  margin: 0.875rem auto 7rem !important;
  border-radius: var(--rounded-middle);
  background: var(--color-bg-200);
  color: var(--color-activity-rule);
  padding: .625rem;
  line-height: 1.25rem;
  box-sizing: border-box;
  font-size: .75rem;
}

.recharge-available-tips {
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-top: 1.25rem;
  margin-bottom: 1.875rem;
}

.div-cls {
  margin-bottom: 0.75rem;
}

.btn-cls {
  margin: 0 auto;
}

ion-toolbar {
  --min-height: 3.125rem;
}

ion-title {
  font-size: 1.25rem;
}

table {
  border-collapse: collapse;
  background-color: transparent;
}

table th,
table td {
  border: 1px solid var(--color-border);
  font-weight: var(--font-weight-bold);
  color: var(--color-currency);
  width: 50%;
  text-align: center;
  border-right: none;
}

table thead th {
  color: var(--color-text-40);
  height: 2.5rem;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-12);
  background-color: var(--color-bg-200);
}

table tbody td:first-child {
  color: var(--color-text-80);
}

table tbody td:last-child {
  color: var(--color-currency);
}

table.table-cls th {
  line-height: 2.25rem;
  width: 12.5%;
}

table.table-cls td {
  line-height: 1.875rem;
  width: 12.5%;
}

table th:first-child,
table td:first-child {
  border-left: none;
}

table th:last-child,
table td:last-child {
  border-right: none;
}

table thead tr:first-child th,
table thead tr:first-child td {
  border-top: none;
}

table tt:last-child th,
table tr:last-child td {
  border-bottom: none;
}
</style>
