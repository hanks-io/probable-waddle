<!-- 公告消息 -->
<script setup lang="ts">
import Empty from "@/components/Empty/index.vue";
import { IonContent, IonIcon, IonButton } from "@ionic/vue";
import { useAnnouncement } from "@/views/user/notification/hooks/announcementLogic";
import RipplePoint from "@/components/HotPoint/ripplePoint.vue";
import { getImageUrl } from "@/utils/url";

const {
  readAnnouncementList,
  announcementList,
  unreadAnnouncement,
  detailHandle,
  readAllClick
} = useAnnouncement();

</script>
<template>
  <ion-content class="notification-content">
    <div class="content-top" v-if="unreadAnnouncement > 0">
      <ion-button class="read-all-btn" @click="readAllClick">
        <ion-icon class="read-img read-icon" :src="getImageUrl('svg/toread.svg')" />
        {{ $t("viewsUser.emailAllRead") }}
      </ion-button>
    </div>
    <div class="w-full" :class="unreadAnnouncement > 0 ? 'mt-class' : ''">
      <div v-for="(list, index) in announcementList" :key="index">
        <p v-if="typeof list == 'string'"></p>
        <div class="announcement-msg" v-for="item in list" v-else @click="detailHandle(item)" :key="item.id">
          <div class="msg-content">
            <div class="icon-msg-wrap">
              <ion-icon class="msg-icon" :src="getImageUrl('svg/announcement.svg')" />
            </div>
            <div class="item-top-tips">
              <div class="middle-text-white flex-between">
                <!-- 公告标题 -->
                <p class="font-weight-medium announcement-title">{{ item.title }}</p>
                <!-- 公告红点 -->
                <RipplePoint v-show="!readAnnouncementList.includes(item.id)" class="top-2 right-0" size="0.6rem" />
              </div>
              <!-- 公告创建时间 -->
              <p class="item-title">{{ item.createTime }}</p>
            </div>
          </div>
          <!-- 公告内容 -->
          <div class="small-text-white announcement-content line-clamp-2 message-content" v-html="item.content"></div>
        </div>
      </div>
    </div>
    <!-- 空列表提示 -->
    <div class="flex-center w-full h-full" v-if="!announcementList.length">
      <Empty />
    </div>
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
  z-index: 50;
}

.read-img {
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.375rem;
}

.mt-class {
  margin-top: 1.5rem;
}

:deep(.announcement-content p img) {
  margin-bottom: 1.25rem;
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

.new-skin-symbol {
  @import '@/views/user/notification/first/styles/announcement/theme-style.less';
}

.new-skin-symbol {
  #announcement-index.style();
}

.green-dark {
  #announcement-index.style(
    @anno-filter: blur(6.08125rem);
    @anno-bg-color: rgba(62, 155, 47, 1);
    @msg-top: -8.5rem;
    @msg-right: -3.75rem;
    @msg-icon-c1: #3E9B2F;
    @msg-icon-bg: #16191D;
    @msg-bg: #22262E;
  );
}

.yellow-dark {
  #announcement-index.style(
    @anno-bg-color: rgba(155, 119, 47, 0.24);
    @msg-icon-c1: rgba(254, 184, 5, 1);
    @msg-icon-bg: #2F2E2D;
    @read-icon-c1: rgba(254, 184, 5, 1);
    @msg-bg: #262624;
    @msg-top: -5rem;
    @msg-right: -1.75rem;
  );
}

.purple-light {
  #announcement-index.style(
    @anno-filter: blur(4.96875rem);
    @anno-bg-color: rgba(255, 135, 135, 0.4);
    @msg-icon-c1: rgba(101, 38, 219, 1);
    @msg-icon-bg: #E0D0FF;
    @msg-bg: #F4EEFF;
    @msg-top: -5rem;
    @msg-right: -1.75rem;
  );
}
</style>
