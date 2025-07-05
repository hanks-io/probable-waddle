<!-- 通知消息 -->
<template>
  <ion-content>
    <!-- 一键已读 -->
    <div class="btn" v-if="unreadMailCount>0">
      <ion-button class="read-all-btn" @click="readAllClick">
        <img :src="currentAllBtnPng" />
        {{ $t('viewsUser.emailAllRead') }}
      </ion-button>
    </div>
    <div class="list" :class="unreadMailCount > 0 ? 'unRead' : ''">
      <div v-for="list in mailList" :key="list.id">
        <p class="notice-item-date" v-if="typeof list == 'string'">{{ list }}</p>
        <div class="notice-item" v-for="item in list" v-else @click="detailHandle(item)">
          <div class="item">
            <p class="notice-item-title">{{ item.title }}</p>
            <p class="dot" v-if="!item.isRead">•</p>
          </div>
          <div class="notice-item-content" v-html="item.content" />
        </div>
      </div>
    </div>
    <!-- 空列表提示 -->
    <div class="empty" v-if="loadMore == 'noMore' && !mailList.length">
      <div class="img"></div>
      <ion-label color="medium">{{ $t('label.noRecord') }}</ion-label>
    </div>
    <!-- 触底加载 -->
    <ion-infinite-scroll ref="infiniteRef" threshold="0.3125rem" @ionInfinite="ionInfinite" v-else>
      <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
    </ion-infinite-scroll>
  </ion-content>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { useNotice } from '@/views/user/notification/hooks/noticeLogic'
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonButton, IonIcon, IonImg, IonLabel } from '@ionic/vue';

// 当前一键领取按钮 png图片
const currentAllBtnPng = computed(() => {
  const data = getTheme();
  if (data.theme === 'auroral-yellow') {
    return '/svg/auroral-yellow-all-email.svg'
  }
  return `/icons/${data.theme}-all-email.png`
})

const {
  infiniteRef,
  loadMore,
  mailList,
  startTimestamp,
  mailListParams,
  unreadMailCount,
  detailHandle,
  ionInfinite,
  getMailList,
  readAllClick
} = useNotice();

</script>

<style scoped lang="less">
  @import '@/views/user/notification/default/styles/notice/base.less';
  @import '@/views/user/notification/default/styles/notice/theme-style.less';

  #user-notification-default-notice-index.style();

  .blue-default {
    #user-notification-default-notice-index.style(
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
    #user-notification-default-notice-index.style(
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
    #user-notification-default-notice-index.style(
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
    #user-notification-default-notice-index.style(
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
    #user-notification-default-notice-index.style(
      @notification-default-notice-index-01: --color-bg-100,
    )
  }
</style>