<script setup lang="ts">
import { formatMoneyToShow } from "@/utils/custom";
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle } from "@ionic/vue";
import BackButton from "@/components/BackButton.vue";
import useLogic from "../hooks/useLogic";

const { auditStateColor, showLimitGame, auditDetails, goGame } = useLogic();
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t("viewsAssets.auditDetails") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" :scrollY="true">
      <div class="panel text-[0.8125rem]">
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.transactionType") }}</span>
          <span>{{ auditDetails.tradeType }}</span>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("activity.activityName") }}</span>
          <span>{{ auditDetails.activityName }}</span>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.auditStatus") }}</span>
          <span :style="{ color: auditStateColor }">{{ auditDetails.auditStatus }}</span>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.transactionAmount") }}</span>
          <span>{{ formatMoneyToShow(auditDetails.tradeAmount) }}</span>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.auditMultiplier") }}</span>
          <span>{{ auditDetails.auditMultiple }}</span>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.auditAmount") }}</span>
          <span>{{ formatMoneyToShow(auditDetails.auditAmount) }}</span>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.unauditedAmount") }}</span>
          <span>{{ formatMoneyToShow(auditDetails.unAuditAmount) }}</span>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.auditedAmount") }}</span>
          <span>{{ formatMoneyToShow(auditDetails.auditedAmount) }}</span>
        </div>
        <div v-if="showLimitGame" class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.gameRestrictions") }}</span>
          <button class="text-blue-500" @click="goGame">{{ $t("viewsAssets.goNow") }}</button>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.createTime") }}</span>
          <span>{{ auditDetails.createTime }}</span>
        </div>
        <div class="h-[45px] flex justify-between items-center mx-4">
          <span class="property">{{ $t("viewsAssets.completionTime") }}</span>
          <span>{{ auditDetails.finishTime }}</span>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="less">
.panel {
  background: var(--color-bg-card);
  border-radius: 0.375rem;
}

.panel> :not(:last-child) {
  border-bottom: 1px solid var(--color-border-input-basic);
}

span.property {
  color: var(--color-text-label-property);
}

.auroral-yellow {
  .panel> :not(:last-child) {
    border-bottom: 1px solid var(--color-line);
  }
  span.property {
    color: var(--color-text-gray-200);
}

}
</style>
