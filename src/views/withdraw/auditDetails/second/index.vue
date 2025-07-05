<script setup lang="ts">
import { IonPage,IonContent} from '@ionic/vue';
import { formatMoneyToShow } from '@/utils/custom';
import useLogic from '../hooks/useLogic'
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/first/Button/index.vue'
const {
  auditStateColorFirst,
  showLimitGame,
  auditDetails,
  goGame
} = useLogic()
</script>
<template>
  <ion-page>
  
    <NavigationBar :title="$t('viewsAssets.auditDetails')"/>
    <ion-content class="first-content" :scrollY="true">
      <div class="record-wrap">
        <div class="record-item flex-between">
          <span >{{ $t('viewsAssets.transactionType') }}</span>
          <span>{{ auditDetails.tradeType }}</span>
        </div>
        <div class="record-item flex-between">
          <span >{{ $t('activity.activityName') }}</span>
          <span>{{ auditDetails.activityName }}</span>
        </div>
        <div class="record-item flex-between">
          <span>{{ $t('viewsAssets.auditStatus') }}</span>
          <span :style="{ color: `var(${auditStateColorFirst})` }">{{ auditDetails.auditStatus }}</span>
        </div>
        <div class="record-item flex-between">
          <span >{{ $t('viewsAssets.transactionAmount') }}</span>
          <span>{{ formatMoneyToShow(auditDetails.tradeAmount) }}</span>
        </div>
        <div class="record-item flex-between">
          <span >{{ $t('viewsAssets.auditMultiplier') }}</span>
          <span>{{ auditDetails.auditMultiple }}</span>
        </div>
        <div class="record-item flex-between">
          <span >{{ $t('viewsAssets.auditAmount') }}</span>
          <span>{{ formatMoneyToShow(auditDetails.auditAmount) }}</span>
        </div>
        <div class="record-item flex-between">
          <span >{{ $t('viewsAssets.unauditedAmount') }}</span>
          <span>{{ formatMoneyToShow(auditDetails.unAuditAmount) }}</span>
        </div>
        <div class="record-item flex-between">
          <span >{{ $t('viewsAssets.auditedAmount') }}</span>
          <span>{{ formatMoneyToShow(auditDetails.auditedAmount) }}</span>
        </div>
        <div v-if="showLimitGame" class="record-item flex-between">
          <span >{{ $t('viewsAssets.gameRestrictions') }}</span>
          <button class="link" @click="goGame">{{ $t('viewsAssets.goNow') }}</button>
        </div>
        <div class="record-item flex-between">
          <span>{{ $t('viewsAssets.createTime') }}</span>
          <span>{{ auditDetails.createTime }}</span>
        </div>
        <div class="record-item flex-between">
          <span >{{ $t('viewsAssets.completionTime') }}</span>
          <span>{{ auditDetails.finishTime }}</span>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="less">
ion-content.first-content {
  width: 24.375rem;
  box-sizing: border-box;
  --padding-top:12px;
  --padding-start: 12px;
  --padding-end: 12px;
  --background: var(--color-bg-300);
}
.record-item{
   height: 2.8125rem;
   width: 100%;
   .dynamic-font(@fontSize: --font-size-12, @color: --color-text-80);
   .link{
    color: var(--color-link)
   }
}


.record-wrap> :not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}
</style>
