<!-- 通知消息 -->
<script setup lang="ts">
import Empty from "@/components/Empty/index.vue";
import RipplePoint from "@/components/HotPoint/ripplePoint.vue";
import { useNotice } from "@/views/user/notification/hooks/noticeLogic";
import { IonContent, IonButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/vue";
import { getImageUrl } from "@/utils/url";


const {
  infiniteRef,
  loadMore,
  mailList,
  startTimestamp,
  unreadMailCount,
  detailHandle,
  ionInfinite,
  readAllClick
} = useNotice();
</script>

<template>
  <ion-content class="notification-content">
    <!-- 一键已读 -->
    <div class="content-top" v-if="unreadMailCount>0">
      <ion-button class="read-all-btn" @click="readAllClick">
        <ion-icon class="read-img read-icon" :src="getImageUrl('svg/toread.svg')" />
        {{ $t("viewsUser.emailAllRead") }}
      </ion-button>
    </div>
    <!-- 消息列表 -->
    <div class="w-full" :class="unreadMailCount > 0 ? 'mt-class' : ''">
      <div v-for="(list,index) in mailList" :key="index">
        <p v-if="typeof list == 'string'"></p>
        <div v-for="item in list" :key="item.id" v-else @click="detailHandle(item)" class="notice-msg">
          <div class="item-top flexBox msg-content">
            <!-- 邮件📢svg -->
            <div class="icon-msg-wrap">
              <ion-icon class="msg-icon" :src="getImageUrl('svg/notice.svg')" />
            </div>
            <div class="item-top-tips">
              <div class="middle-text-white flex-between">
                <!-- 邮件标题 -->
                <p class="font-weight-medium notice-title">{{ item.title }}</p>
                <!-- 邮件红点 -->
                <RipplePoint v-show="!item.isRead" class="right-[1rem]" size="0.6rem" />
              </div>
              <!-- 邮件创建时间 -->
              <p>{{ item.createTime }}</p>
            </div>
          </div>
          <!-- 邮件内容 -->
          <div class="mt-[0.75rem] small-text-white line-clamp-2 message-content" v-html="item.content" />
        </div>
      </div>
    </div>
    <!-- 空列表提示 -->
    <div class="w-full h-full flex-center" v-if="loadMore === 'noMore' && !mailList.length">
      <Empty />
    </div>
    <!-- 触底加载 -->
    <ion-infinite-scroll ref="infiniteRef" threshold="5px" @ionInfinite="ionInfinite" v-else>
      <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
                                   :loading-spinner="loadMore == 'more' ? 'bubbles' : null" />
    </ion-infinite-scroll>
  </ion-content>
</template>

<style scoped lang="less">
@import './index.less';

ion-content.notification-content {
  --padding-top: 0.75rem;
  --padding-bottom: 0.75rem;
  --padding-start: 0.75rem;
  --padding-end: 0.75rem;
  --background: var(--color-bg-300);
}

.content-top {
  width: 100%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: end;
  position: fixed;
  right: 0;
  height: 1.125rem;
}

.read-img {
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.375rem;
}

.mt-class {
  margin-top: 1.5rem;
}

.item-top-tips {
  margin-left: 0.75rem;
  width: 100%;
}

.notice-msg {
  padding: .75rem;
  font-size: .625rem;
  line-height: .9375rem;
  color: var(--color-text-40);
  background: var(--color-bg-200);
  margin-bottom: .625rem;
  border-radius: 0.375rem;
}

ion-infinite-scroll-content {
  min-height: 10px; /* 修改最小高度 */
  font-size: 0.75rem;
  color: var(--color-text-40);
}

ion-button.read-all-btn {
  min-height: 0;
  min-width: 0;
  --background: var(--message-read-all-btn-bg);
  --color: var(--color-text-100);
  --border-radius: 1.8125rem;
  font-weight: 500;
  font-size: .75rem;
  --background-focused-opacity: 1;
  --background-hover-opacity: 1;
  --background-activated-opacity: 1;
  --background-focused: var(--msg-all-button-color-shade);
  --background-hover: var(--msg-all-button-color-tint);
  --background-activated: var(--msg-all-button-color-shade);
}

ion-button.read-all-btn::part(native) {
  padding: .5rem .75rem;
}

.message-content {
  color: var(--my-card-detail-color);
}

.line-clamp-2 {
  word-break: break-all;
}

.new-skin-symbol {
  @import '@/views/user/notification/first/styles/notice/theme-style.less';
}

.new-skin-symbol {
  #notice-index.style();
}

.green-dark {
  #notice-index.style(
    @msg-icon-bg: #16191D;
    @msg-icon-c1: #3E9B2F;
  );
}

.yellow-dark {
  #notice-index.style(
    @msg-icon-bg: #2F2E2D;
    @msg-icon-c1: rgba(254, 184, 5, 1);
    @read-icon-c1: rgba(254, 184, 5, 1);
  );
}

.purple-light {
  #notice-index.style(
    @msg-icon-c1: rgba(101, 38, 219, 1);
    @msg-icon-bg: #E0D0FF;
  );
}
</style>
