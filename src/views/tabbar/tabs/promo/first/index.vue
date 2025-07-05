<!-- 优惠活动 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-segment ref="segment" mode="md" v-model="tabValue"  :scrollable="true">
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
            <ion-icon class="text-4xl text-[#9BA7BE]" v-else :src="`/svg/sort/${item.title}_off.svg`" />
            <ion-label class="text-xs" :style="`color:${sideValue == item.title ? '' : '#9BA7BE'}`">{{
              $t(`sort.${item.title}`) }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-content>
      <ion-content id="main">
        <ActivityList v-if="tabValue === PageType.ActivityList" :sideValue="sideValue" @navigation="navigation" :style="{ paddingBottom }"/>
        <TaskList v-if="tabValue === PageType.TaskList" :style="{ paddingBottom }"/>
        <Rebate v-if="tabValue === PageType.Rebate" :rebateId="rebateId" @toRecord="toRecord" :style="{ paddingBottom }"/>
        <Vip v-if="tabValue === PageType.Vip"/>
        <Redeem v-if="tabValue === PageType.Redeem" :style="{ paddingBottom }"/>
        <Claim v-if="tabValue === PageType.Claim" :style="{ paddingBottom }"/>
        <Unclaimed v-if="tabValue === PageType.Unclaimed" />
      </ion-content>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonLabel, IonContent, IonSegment, IonSegmentButton, IonImg, IonIcon } from '@ionic/vue';
import ActivityList from '@/views/tabbar/tabs/promo/first/ActivityList.vue'
import TaskList from '@/views/activity/task/index.vue';
import Rebate from '@/views/activity/rebate/first/index.vue';
import Vip from '@/views/activity/vip/first/index.vue';
import Redeem from '@/views/activity/redeem/first/index.vue';
import Claim from '@/views/activity/history/first/claim.vue';
import Unclaimed from '@/views/activity/history/first/unclaimed.vue';
import HotPoint from '@/components/HotPoint/index.vue'
import useLogic from '../logic';

const {
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
  paddingBottom,
  ifShowVipRedPoint
} = useLogic();


</script>

<style scoped>
ion-label.active {
  color: var(--ep-color-text-selected, var(--color-primary-800));
  font-weight: var(--ep-font-weight-bold, 700);
}

ion-label.inactive {
  color: var(--ep-color-text-weaker, var(--color-text-40))
}

ion-toolbar {
  --background: var(--ep-color-background-fill-top-nav-secondary, var(--color-bg-200));
  --padding-top: 0;
  --padding-bottom: 0;
}

ion-toolbar ion-segment.md {
  /* 设置导航标签布局方式 */
  display: flex;
  justify-content: left;
}

ion-toolbar ion-segment-button.md::part(native) {
  /* 设置导航标签的宽度 */
  --padding-start: .625rem;
  --padding-end: .625rem;

}

ion-toolbar ion-segment-button.md::part(indicator) {
  /* 设置指示器宽度 */
  /* width: 40%; */
  margin-left: auto;
  margin-right: auto;
}

ion-toolbar ion-segment-button.md::part(indicator-background) {
  /* 设置导航标签指示器的宽度 */
  background: var(--ep-color-border-selected, var(--color-primary-800));
  height: 0.125rem;
}

ion-toolbar ion-segment-button.md ion-label {
  /* 取消导航标签的标签与指示器之间的边距 */
  margin-top: 0;
  margin-bottom: 0;
  text-transform: none;
}

ion-content.side {
  --padding-start: .875rem;
  --padding-top: .625rem;
  max-width: 5.3125rem;
}

ion-content.side ion-segment {
  --background: transparent;
}

ion-content.side ion-segment-button.ios {
  --indicator-color: #1C2334;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 2px;
  --padding-bottom: 2px;
  margin-top: 0;
  margin-bottom: 6px;
  text-transform: capitalize;
  min-width: 0;
  min-height: 3.5rem;
}

ion-content#main {
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 10px;
}

ion-content#main ion-item {
  --background: transparent;
  --inner-padding-end: 0px;
  --border-radius: 10px;
  --padding-start: 15px;
  --padding-end: 15px;
  --padding-top: 0;
  --padding-bottom: 0;
  --inner-border-width: 0px;
  --min-height: 7.5rem;
  --height: 7.5rem;
  --max-height: 7.5rem;
}

ion-item::part(native) {
  /* 插槽slot内容样式 */
  padding-inline-end: 0px;
  background-repeat: no-repeat;
  background-size: 100%;
}
</style>
