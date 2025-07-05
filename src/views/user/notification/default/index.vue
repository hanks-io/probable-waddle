<!-- 消息中心 -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{ $t('viewsUser.messageConter') }}</ion-title>
      </ion-toolbar>
      <div class="tab-box">
        <ion-segment ref="segment" mode="md" v-model="segmentValue">
          <ion-segment-button :value="index" v-for="(item,index) in segmentList" :key="item" v-show="index < 1 || appStore.token">
            <ion-button fill="clear" :class="segmentValue == index ? 'selected-tab' : 'base-tab'">
              {{item}}
            </ion-button>
            <p v-if="index == 1 && unreadMailCount">{{ unreadMailCount  }}</p>
            <p v-if="index == 2 && unreadAnnouncement">{{ unreadAnnouncement }}</p>
          </ion-segment-button>
        </ion-segment>
      </div>
    </ion-header>
    <ion-content :scroll-y="false">
      <Service v-show="segmentValue == 0"></Service>
      <Notice v-if="appStore.token" v-show="segmentValue == 1"/>
      <Announcement v-if="appStore.token" v-show="segmentValue == 2"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { useNotification } from '@/views/user/notification/hooks/notificationLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton, IonButton } from '@ionic/vue';
import BackButton from '@/components/BackButton.vue';
import Announcement from './announcement/index.vue';
import Service from './service/index.vue';
import Notice from './notice/index.vue';

const appStore = useAppStore(); // App状态管理

const { segmentValue, unreadMailCount, unreadAnnouncement, segmentList } = useNotification();

</script>

<style scoped lang="less">
  @import '@/views/user/notification/default/styles/base-index.less';
  @import '@/views/user/notification/default/styles/theme-style.less';

  #user-notification-default-index.style();

  .blue-default {
    #user-notification-default-index.style(
      --color-bg-300,
      --color-line,
      --color-text-gray-200,
      --color-text-white-100,
      --theme-color-600
    );
  }

  .green-default {
    #user-notification-default-index.style(
      --color-bg-300,
      --color-line,
      --color-text-gray-200,
      --color-text-gray-100,
      --theme-color-600
    );
  }

  .amber-purple {
    #user-notification-default-index.style(
       --color-bg-300,
      --line-color,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --segment-gradients-purple
    );
  }

  .forest-green {
    #user-notification-default-index.style(
      --color-bg-300,
      --color-bg-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-line
    )
  }

  .auroral-yellow {
    #user-notification-default-index.style(
      @notification-default-index-05: --theme-color-800,
    );
  }
</style>