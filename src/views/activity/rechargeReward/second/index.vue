<!-- 充值赠送 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <!-- 顶部导航栏 -->
      <ion-toolbar class="" mode="ios">
        <BackButton />
        <ion-title>{{ activityName }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding space-y-3">
      <div class="content-text" v-html="content">
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

<style scoped>
.content-text {
  color: var(--color-recharge-reward-text)
}

/* 解决v-html显示富文本表格边框不显示 */
:deep(table) {
  border-collapse: collapse;
  width: 100%;
}

:deep(table), :deep(th), :deep(td) {
    border: 1px solid var(--line-color);
}

:deep(th), :deep(td) {
    /* padding: 8px; */
    text-align: left;
}
</style>
