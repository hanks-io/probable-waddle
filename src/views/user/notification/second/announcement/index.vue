<!-- 公告消息 -->
<script setup lang="ts">
import Empty from "@/components/Empty/index.vue";
import { IonContent, IonIcon, IonButton } from "@ionic/vue";
import { useAnnouncement } from "@/views/user/notification/hooks/announcementLogic";
import RipplePoint from "@/components/HotPoint/ripplePoint.vue";
import svgUrl from "@/assets/svg/all-email.svg";
import { getImageUrl } from "@/utils";

const {
  readAnnouncementList,
  announcementList,
  unreadAnnouncement,
  detailHandle,
  readAllClick
} = useAnnouncement();

</script>

<template>
  <ion-content class="common-ion-content">
    <div class="content-top" v-if="unreadAnnouncement>0">
      <ion-button class="read-all-btn" @click="readAllClick">
        <ion-icon class="read-img" :src="svgUrl" />
        {{ $t("viewsUser.emailAllRead") }}
      </ion-button>
    </div>
    <div class="w-full" :class="unreadAnnouncement > 0 ? 'mt-cls' : ''">
      <div v-for="(list, index) in announcementList" :key="index">
        <p v-if="typeof list == 'string'"></p>
        <div class="announcement-msg relative" v-for="item in list" v-else @click="detailHandle(item)" :key="item.id">
          <div class="msg-content">
            <div class="icon-msg-wrap">
              <ion-icon class="msg-icon" :src="getImageUrl('svg/announcement.svg')" />
            </div>
            <div class="item-top-tips">
              <div class="middle-text-white flex-between">
                <!-- 公告标题 -->
                <p class="font-weight-medium announcement-title">{{ item.title }}</p>
              </div>
              <!-- 公告创建时间 -->
              <p class="item-title">{{ item.createTime }}</p>
            </div>
          </div>
          <!-- 公告内容 -->
          <div class="small-text-white announcement-content line-clamp-2 message-content" v-html="item.content"></div>
          <!-- 公告红点 -->
          <RipplePoint v-show="!readAnnouncementList.includes(item.id)" class="top-[0.234375rem] right-[0.3125rem]"
                       size="0.5rem" />
        </div>
      </div>
    </div>
    <!-- 空列表提示 -->
    <div class="flex-center w-full h-full" v-if="!announcementList.length">
      <Empty :type="'msg'" class="w-full" />
    </div>
  </ion-content>
</template>


<style scoped lang="less">
@import './index.less';

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
  margin-top: 0.8125rem
}

.item-top {
  margin-bottom: 1.171875rem;
  z-index: 30;
}



.item-top-tips {
  margin-left: 0.75rem;
  width: 100%;
}

:deep(.announcement-content p img) {
  margin-bottom: 1.3125rem;
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
  font-weight: 600;
  color: var(--my-card-detail-color);
}

#announcement-index.style();
</style>
