<!-- 通知消息 -->
<script setup lang="ts">
import Empty from "@/components/Empty/index.vue";
import RipplePoint from "@/components/HotPoint/ripplePoint.vue";
import { useNotice } from "@/views/user/notification/hooks/noticeLogic";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from "@ionic/vue";
import { getImageUrl } from "@/utils";


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
  <ion-content class="common-ion-content">
    <!-- 一键已读 -->
    <div class="content-top" v-if="unreadMailCount>0">
      <ion-button class="read-all-btn" @click="readAllClick">
        <ion-icon class="read-img" :src="getImageUrl('svg/toread.svg')" />
        {{ $t("viewsUser.emailAllRead") }}
      </ion-button>
    </div>
    <!-- 消息列表 -->
    <div class="w-full" :class="unreadMailCount > 0 ? 'mt-cls' : ''">
      <div v-for="(list,index) in mailList" :key="index">
        <p v-if="typeof list == 'string'"></p>
        <div v-for="item in list" :key="item.id" v-else @click="detailHandle(item)" class="notice-msg relative">
          <div class="item-top flexBox msg-content">
            <div class="icon-msg-wrap">
              <ion-icon class="msg-icon" :src="getImageUrl('svg/notice.svg')" />
            </div>
            <div class="item-top-tips">
              <p class="middle-text-white item-title">{{ item.title }}</p>
              <p>{{ item.createTime }}</p>
            </div>
          </div>
          <!-- 邮件内容 -->
          <div class="mt-[0.75rem] small-text-white line-clamp-2 message-content" v-html="item.content" />
          <!-- 邮件红点 -->
          <RipplePoint v-show="!item.isRead" class="point-cls" size="0.5rem" />
        </div>
      </div>
    </div>
    <!-- 空列表提示 -->
    <div class="w-full h-full flexBox" v-if="loadMore === 'noMore' && !mailList.length">
      <Empty :type="'msg'" class="w-full" />
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

.notice-msg {
  padding: .75rem .5313rem .9375rem .8125rem;
  font-size: .625rem;
  line-height: .9375rem;
  color: rgba(255, 255, 255, 0.4);
  background: var(--color-bg-200);
  margin-bottom: .625rem;
  border-radius: var(--rounded-large);

  .item-title {
    font-weight: 600;
  }
}

.content-top {
  width: 100%;
  margin-top: 0.0625rem;
  display: flex;
  justify-content: center;
}

.read-img {
  width: 1.125rem;
  margin-right: 0.21875rem;
}

.mt-cls {
  margin-top: 0.8125rem;
}

.item-top-tips {
  margin-left: 0.75rem;
  width: 100%;
}

.point-cls {
  top: 0.234375rem;
  right: 0.3125rem;
}

ion-infinite-scroll-content {
  min-height: 10px; /* 修改最小高度 */
  font-size: var(--font-size-12);
  color: var(--color-text-40);
}

ion-button.read-all-btn {
  min-height: 0;
  min-width: 0;
  margin: 0;
  --background: linear-gradient(180deg, #5A25E9 0%, #7E45D2 100%);
  --color: #BDB8E1;
  --border-radius: 1.8125rem;
}

ion-button.read-all-btn::part(native) {
  padding: .1875rem .9113rem .25rem .6875rem;
  font-weight: 500;
  font-size: .75rem;
  line-height: 1.3125rem;
}

.message-content {
  color: var(--my-card-detail-color);
  font-weight: 600;
}

.line-clamp-2 {
  word-break: break-all;
}

#notice-index.style();
</style>
