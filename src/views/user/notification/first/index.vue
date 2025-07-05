<!-- 消息中心 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{ $t('viewsUser.messageConter') }}</ion-title>
      </ion-toolbar>
      <div class="px-[0.625rem] pt-[0.625rem] tab-box">
        <ion-segment ref="segment" mode="md" v-model="segmentValue">
          <ion-segment-button class="min-h-0" :value="index" v-for="(item,index) in segmentList" :key="item" v-show="index < 1 || appStore.token">
            <ion-button fill="clear" class="base-style" :class="{ 'select-style': segmentValue == index }">
              {{ item }}
              <p class="w-[2rem] h-[1.125rem] red-point rounded-full" v-if="index == 1 && unreadMailCount">{{ unreadMailCount }}</p>
              <p class="w-[2rem] h-[1.125rem] red-point rounded-full" v-if="index == 2 && unreadAnnouncement">{{ unreadAnnouncement }}</p>
            </ion-button>
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

.tab-box {
  background: var(--color-bg-400);
  border-bottom: 1px solid var(--line-color);
}

ion-button.base-style {
  --color: var(--my-card-detail-color);
  font-size: 0.875rem;
}
ion-button.select-style {
  font-weight: bold;
  --color: var(--color-primary-800);
}

/* 设置导航标签布局方式 */
ion-segment.md { 
  display: flex;
  justify-content: left;
}

ion-segment-button.md::part(indicator) {  /* 设置指示器宽度 */
  margin-left: auto;
  margin-right: auto;
}

ion-segment-button.md::part(indicator-background) { /* 设置导航标签指示器的宽度 */
  background: var(--color-primary-800);
  height: 1px;
}

ion-segment-button.md ion-button {  /* 取消导航标签的标签与指示器之间的边距 */
  text-transform: none;             /* 取消自动字母大写 */
  height: 2.625rem;
  margin: 0;
  --padding-top: 0px;
  --padding-bottom: 5px;
  --padding-start: 0;
  --padding-end: 0;
  min-width: 0;
}

.red-point {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: .75rem;
  color: var(--text-color-white-100);
  background: var(--color-danger);
  margin-left: .25rem;
}

ion-content {
  --background: var(--color-bg-300);
}

.new-skin-symbol {
  @import '@/views/user/notification/first/styles/theme-style.less';
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
