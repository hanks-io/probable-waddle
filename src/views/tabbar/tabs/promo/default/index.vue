<!-- 优惠活动 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-segment ref="segment" mode="md" v-model="tabValue" :scrollable="true">
          <template v-for="it in tabList" :key="it.type">
            <ion-segment-button :value="it.value" v-if="it.isShow" @click.stop="tabChange(it.value)">
              <ion-label :class="tabValue == it.value ? 'active' : 'inactive'">{{
                it.name }}</ion-label>
              <HotPoint :isShow="it.isShowRedPoint" classNames="top-[0.625rem] right-[-0.625rem]" />
              <HotPoint :isShow="it.name == 'VIP' && ifShowVipRedPoint " classNames="top-[0.625rem] right-[-0.625rem]" />
            </ion-segment-button>
          </template>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <div class="flex h-full">
      <ion-content v-if="isShowLeftSide" class="side">
        <ion-segment class="flex flex-col" ref="segment" mode="ios" v-model="sideValue" @ionChange="sideChange">
          <ion-segment-button v-for="item in segmentList" :value="item.title">
            <ion-img class="w-9" v-if="sideValue == item.title" :src="`/icons/sort/${item.title}_on.png`" />
            <ion-icon class="text-4xl text-[--color-text-unChecked]" v-else :src="`/svg/sort/${item.title}_off.svg`" />
            <ion-label class="text-xs" :style="`color:${sideValue == item.title ? '' : 'var(--color-text-unChecked)'}`">{{
              $t(`sort.${item.title}`) }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-content>
      <ion-content id="main">
          <ActivityList v-if="tabValue === PageType.ActivityList" :sideValue="sideValue" @navigation="navigation" :style="{ paddingBottom }"/>
          <Rebate v-if="tabValue === PageType.Rebate" :rebateId="rebateId" @toRecord="toRecord" :style="{ paddingBottom }"/>
          <Vip v-if="tabValue === PageType.Vip" :style="{ paddingBottom }"/>
          <Redeem v-if="tabValue === PageType.Redeem" :style="{ paddingBottom }"/>
          <Claim v-if="tabValue === PageType.Claim" :style="{ paddingBottom }"/>
          <Unclaimed v-if="tabValue === PageType.Unclaimed" :style="{ paddingBottom }"/>
          <TaskList v-if="tabValue === PageType.TaskList" :style="{ paddingBottom }"/>
      </ion-content>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonLabel, IonContent, IonSegment, IonSegmentButton, IonImg, IonIcon } from '@ionic/vue';
import ActivityList from '@/views/tabbar/tabs/promo/default/ActivityList.vue'
import Rebate from '@/views/activity/rebate/default/index.vue';
import Vip from '@/views/activity/vip/default/index.vue';
import Redeem from '@/views/activity/redeem/default/index.vue';
import Claim from '@/views/activity/history/default/claim.vue';
import Unclaimed from '@/views/activity/history/default/unclaimed.vue';
import TaskList from '@/views/activity/task/index.vue';
import HotPoint from '@/components/HotPoint/index.vue'
import useLogic from '../logic';

const {
  paddingBottom,
  rebateId,
  sideValue,
  tabValue,
  isShowLeftSide,
  tabList,
  segmentList,
  PageType,
  tabChange,
  sideChange,
  navigation,
  toRecord,
  ifShowVipRedPoint
} = useLogic();


</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/tabbar/tabs/promo/default/style/base-index.less";
  @import "@/views/tabbar/tabs/promo/default/style/theme-style.less";

  // 这主题样式
  #tabbar-tabs-promo-default-index.style();

  .blue-default {
    #tabbar-tabs-promo-default-index.style(
      --color-text-white-100,
      --color-text-gray-200,
      --theme-color-gradient-100,
      --color-bg-200,
      --color-bg-100,
      --color-text-white-100,
      --color-text-gray-200
    );
  };

  .forest-green {
    #tabbar-tabs-promo-default-index.style(
      @--text-color-active: --color-text-gray-100,
      @--indicator-text-color-segment: --color-text-gray-100,
    );
  };

  .green-default {
    #tabbar-tabs-promo-default-index.style(
      --color-text-gray-100,
      --color-text-gray-200,
      --theme-color-gradient-100,
      --color-bg-200,
      --color-bg-100,
      --color-text-gray-100,
      --color-text-gray-200
    );
  };

  .amber-purple {
    #tabbar-tabs-promo-default-index.style(
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --segment-gradients-purple,
      --color-bg-200,
      --color-bg-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100
    );
  };

  .auroral-yellow {
    #tabbar-tabs-promo-default-index.style(
      @--gradient-segment-button-bg: --theme-color-800;
    );
  }
</style>
