<!-- 公告消息 -->
<template>
  <ion-content>
    <div class="btn" v-if="unreadAnnouncement>0">
      <ion-button class="read-all-btn" @click="readAllClick">
        <img :src="currentAllBtnPng" />
        {{ $t('viewsUser.emailAllRead') }}
      </ion-button>
    </div>
    <div class="list" :class="unreadAnnouncement > 0 ? 'unRead' : ''">
      <div v-for="(list, index) in announcementList" :key="index">
        <p class="notice-item-date" v-if="typeof list == 'string'">{{ list }}</p>
        <div class="notice-item" v-for="item in list" v-else @click="detailHandle(item)">
          <div class="item">
            <p class="notice-item-title">{{ item.title }}</p>
            <p class="dot" v-if="!readAnnouncementList.includes(item.id)">•</p>
          </div>
          <span class="notice-item-content" v-html="replaceImgTag(item.content)"/>
        </div>
      </div>
    </div>
    <!-- 空列表提示 -->
    <div class="empty" v-if="!announcementList.length">
      <div class="img"></div>
      <ion-label color="medium">{{ $t('label.noRecord') }}</ion-label>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { IonContent, IonButton, IonIcon, IonImg, IonLabel } from '@ionic/vue';
import { useAnnouncement } from '@/views/user/notification/hooks/announcementLogic'

// 当前一键领取按钮 png图片
const currentAllBtnPng = computed(() => {
  const data = getTheme();
  if (data.theme === 'auroral-yellow') {
    return '/svg/auroral-yellow-all-email.svg'
  }
  return `/icons/${data.theme}-all-email.png`
})

const {
  readAnnouncementList,
  announcementList,
  unreadAnnouncement,
  replaceImgTag,
  detailHandle,
  readAllClick
} = useAnnouncement();

</script>

<style scoped lang="less">
  @import '@/views/user/notification/default/styles/announcement/base.less';
  @import '@/views/user/notification/default/styles/announcement/theme-style.less';

  #user-notification-default-announcement-index.style();

  .blue-default {
    #user-notification-default-announcement-index.style(
      --color-bg-50,
      --color-text-white-100,
      --notice-read-all-btn-focused-bgc,
      --notice-read-all-btn-hover-bgc,
      --notice-read-all-btn-focused-bgc,
      --color-bg-200,
      --color-text-gray-200,
      --color-text-white-100,
      --color-text-gray-200
    );
  }

  .green-default {
    #user-notification-default-announcement-index.style(
      --color-bg-50,
      --color-text-gray-100,
      --notice-read-all-btn-focused-bgc,
      --notice-read-all-btn-hover-bgc,
      --notice-read-all-btn-focused-bgc,
      --color-bg-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200
    );
  }

  .amber-purple {
    #user-notification-default-announcement-index.style(
      --color-bg-100,
      --color-text-gray-100,
      --notice-read-all-btn-focused-bgc,
      --notice-read-all-btn-hover-bgc,
      --notice-read-all-btn-focused-bgc,
      --color-bg-200,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100
    );
  }

  .forest-green {
    #user-notification-default-announcement-index.style(
      --color-bg-100,
      --color-text-gray-100,
      --notice-read-all-btn-focused-bgc,
      --notice-read-all-btn-hover-bgc,
      --notice-read-all-btn-focused-bgc,
      --color-bg-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200
    )
  }

  .auroral-yellow {
    #user-notification-default-announcement-index.style(
      @notification-default-announcement-index-01: --color-bg-100,
    )
  }
</style>