<!-- 充值赠送 -->
<template>
  <ion-page>
    <ion-header>
      <!-- 顶部导航栏 -->
      <ion-toolbar class="" mode="ios">
        <BackButton />
        <ion-title>{{ activityName }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding space-y-3">
      <div v-html="content" class=" text-[--color-text-basic]">
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle } from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import useLogic from '../logic'

const {
  activityName,
  content,
} = useLogic()

</script>


<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/rechargeReward/default/style/base-index.less";
  @import "@/views/activity/rechargeReward/default/style/theme-style.less";

  #activity-rechargeReward-default-index.style();

  .blue-default {
    #activity-rechargeReward-default-index.style(
      --theme-color-gradient-100,
      --color-text-white-100,
      --line-color
    );
  };

  .green-default {
    #activity-rechargeReward-default-index.style(
      --theme-color-gradient-100,
      --color-text-gray-100,
      --line-color
    );
  };

  .amber-purple {
    #activity-rechargeReward-default-index.style(
      --segment-gradients-purple,
      --text-color-light-purple-1-100,
      --line-color
    );
  };
</style>
