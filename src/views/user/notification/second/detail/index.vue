<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t('activity.agent28') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p class="middle-text-white email-detail-title mb-[0.734375rem]">{{ notificationInfo?.title }}</p>
      <div class="small-text-white announcement-content message-content" v-html="notificationInfo?.content" />
      <p class="text-right text-sm text-[#BDB8E1] mt-8">{{ notificationInfo?.signature }}</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { useNotificationDetail } from '@/views/user/notification/hooks/notificationDetail'

const {
  notificationInfo,
  announcementNotice,
  notificationId
} = useNotificationDetail();

</script>

<style scoped lang="less">
ion-content {
  --background: var(--color-bg-300);
}

.email-detail-title {
  font-weight: 600;
  color: #BDB8E1;
}

:deep(.announcement-content p img) {
  width: 100%;
  height: auto;
  margin-bottom: 1.3125rem;
}

.message-content {
  color: var(--my-card-detail-color);
}

/* 解决v-html显示富文本表格边框不显示 */
:deep(table) {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid var(--line-color);
  th, td {
    border: 1px solid var(--line-color);
    text-align: left;
  }
}
</style>
