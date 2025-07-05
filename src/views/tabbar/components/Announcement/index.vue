<template>
  <div class="wrapper ">
    <div :class="['announcement-wrapper', tabPositionClassName]">
      <Tab :tabList="tabList" @tabChange="tabChange" :tabPositionClassName="tabPositionClassName"
        v-model:tabId="tabId" v-if="isShowTab" />
      <div :class="['content', tabPositionClassName, { text: announcementType === 'text' }]"
        :style="{ backgroundImage: `url(${announceBgImg})` }"  @click="announcementType === 'img' && onLinkHandle() ">
        <ion-toolbar v-if="announcementType === 'text'" mode="ios">
          <ion-title>{{ title }}</ion-title>
        </ion-toolbar>
        <div :class="{ text: announcementType === 'text' }" @click="onLinkHandle">
          <div v-if="announcementType === 'text'" v-html="announcementDetail" />
        </div>
      </div>
    </div>
    <div class="check-box">
      <ion-checkbox mode="md" :checked="todayInvisible" slot="start" aria-label="Label" label-placement="end"
        @ionChange="checkHandle" />
      <p @click="checkHandle">{{ $t('viewsTabbar.unRemindTody') }}</p>
    </div>
    <ion-icon style="color:#9AA2AC" slot="icon-only" :icon="close" @click="dismiss({type:'close'})" />
  </div>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons';
import { IonIcon, IonCheckbox, IonToolbar, IonTitle, IonImg } from '@ionic/vue';
import useLogic from './logic';
import Tab from './Tab.vue';

const {
  announcementDetail,
  announcementType,
  todayInvisible,
  announceBgImg,
  title,
  dismiss,
  tabId,
  tabList,
  isShowTab,
  tabPositionClassName,
  tabChange,
  onLinkHandle,
  checkHandle
} = useLogic(); // 公告弹窗逻辑

</script>

<style lang="less" scoped>
@import "./styles/index.less";
</style>
