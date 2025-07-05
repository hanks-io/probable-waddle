<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t('activity.agent28') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p class="middle-text-white font-weight-medium mb-[.3125rem] notification-detail-title">{{ notificationInfo?.title }}</p>
      <div class="small-text-white announcement-content message-content" v-html="notificationInfo?.content" />
      <p class="text-right not-signature text-[#9BA7BE] mt-8">{{ notificationInfo?.signature }}</p>
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

:deep(.announcement-content p img) {
  width: 100%;
  height: auto;
  margin-bottom: 1.25rem;
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

.not-signature {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.new-skin-symbol {
  @import '@/views/user/notification/first/styles/detail/theme-style.less';
  ion-toolbar{
    --background: var(--ep-color-background-fill-top-nav-secondary);
  }
  ion-title{
    color: var(--ep-color-text-default);
    font-size: var(--ep-font-size-l);
    font-weight: var(--ep-font-weight-medium);
  }
}
</style>
