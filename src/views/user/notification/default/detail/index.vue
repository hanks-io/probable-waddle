<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t('activity.agent28') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p class="detail-title">{{ notificationInfo?.title }}</p>
      <div class="announcement-content" v-html="notificationInfo?.content" />
      <p class="bottom">{{ notificationInfo?.signature }}</p>
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
  @import '@/views/user/notification/default/styles/detail/base.less';
  @import '@/views/user/notification/default/styles/detail/theme-style.less';

  #user-notification-default-detail-index.style();

  .blue-default {
    #user-notification-default-detail-index.style(
      --text-color-white-40,
      --color-text-gray-300,
      --color-text-white-100,
      --color-text-gray-200,
      --color-border,
      --color-border
    );
  }

  .green-default {
    #user-notification-default-detail-index.style(
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-line,
      --color-line
    );
  }

  .amber-purple {
    #user-notification-default-detail-index.style(
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --line-color,
      --line-color
    );
  }

  .forest-green {
    #user-notification-default-detail-index.style(
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-line,
      --color-line
    )
  }
</style>
