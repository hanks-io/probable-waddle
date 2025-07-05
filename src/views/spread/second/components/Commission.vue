<!-- 佣金列表 -->
<template>
  <div class="h-full flex flex-col py-[0.75rem] px-[0.625rem]">
    <div class="flex-between p-[.625rem] select-item" size="small" fill="clear">
      <div class="flexBox date-select px-1 py-0.5 rounded-small" id="popover-trigger">
        <p :class="dateIndex == 1 ? 'on' : ''">{{ commissionParams.startTime }}</p> ～ <p
          :class="dateIndex == 2 ? 'on' : ''">{{
            commissionParams.endTime }}</p>
        <ion-icon class="text-sm my-0.5 ml-1" src="/svg/date.svg" />
      </div>
      <AbSelect v-model="commissionParams.gameType" :show-all="true" :disabled="false" mode="md"
        label-placement="stacked" @change="typeChangeHandle" v-if="agancyInfo?.type == 'gameType'" />
    </div>
    <div class="mt-[0.75rem]">
      <ion-item class="table-title-bg" lines="none">
        <ion-grid>
          <ion-row class="small-text-white table-item-color font-weight-bold">
            <ion-col size="3">{{ $t('toggle.settlementtime') }}</ion-col>
            <ion-col size="1.5">{{ $t('toggle.types') }}</ion-col>
            <ion-col size="3">{{ $t('toggle.performance') }}</ion-col>
            <ion-col size="2">{{ $t('toggle.numberofpeople') }}</ion-col>
            <ion-col size="2.5">{{ $t('toggle.commissions') }}</ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </div>
    <div class="flex items-center justify-center">
      <ion-spinner class="mt-2.5 w-5 h-5" name="bubbles" v-if="loading" />
    </div>
    <!-- 暂无数据 -->
    <div class="flex-center h-full" v-if="!loading && !list.length">
      <Empty />
    </div>
    <div class="flex-1">
      <ion-content id="main">
        <ion-item class="table-item-bg relative" lines="none" v-for="(item, i) in list" :key="i"
          @click="detailHandle(item)">
          <ion-grid>
            <ion-row class="small-text-white table-item">
              <ion-col size="3"><span class="w-full">{{ dayjs(item.time).add(1, 'day').format('YYYY-MM-DD')
                  }}</span></ion-col>
              <ion-col size="1.5" v-if="item?.gameType"><span class="w-full">{{ $t(`sort.${item.gameType}`)
                  }}</span></ion-col>
              <ion-col size="1.5" v-else><span class="w-full">{{ $t(`sort.all`) }}</span></ion-col>
              <ion-col size="3">{{ convertMoneyToShow(item.directAchievement + item.teamAchievement) }}</ion-col>
              <ion-col size="2"><span class="w-full">{{ item.contributionCount }}</span></ion-col>
              <ion-col class="color-text-currency" size="2.5">
                <span class="w-full">{{ convertMoneyToShow(item.totalCommission) }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-icon class="absolute right-[0.25rem] top-[0.325rem] text-xs color-text-100" :icon="searchOutline" />
        </ion-item>
      </ion-content>
    </div>
    <!-- 时间选择器 -->
    <ion-popover mode="md" trigger="popover-trigger" trigger-action="click" :isOpen="showPopover" :showBackdrop="false"
      :backdropDismiss="dateIndex != 2" :animated="dateIndex == 0" @didDismiss="popoverDismiss"
      @didPresent="popoverPresent">
      <ion-datetime presentation="date" mode="ios" :value="currentDate" :min="minDate" :max="maxDate"
        :show-default-buttons="true" :cancel-text="$t('main.cancel')" :done-text="$t('mlmAgent.btnDone')"
        :locale="locale" @ionChange="dateChange" />
    </ion-popover>
    <!-- 佣金明细弹窗 -->
    <ion-modal :is-open="detailModalState" class="overflow-y-auto">
      <div class="w-full h-full comm-modal relative">
        <!-- 顶部标题 -->
        <ion-toolbar>
          <ion-button class="arrow-left-btn" slot="start" @click="detailModalClose">
            <ion-icon class="text-[1.25rem] text-[--text-color-light-purple-1-100]" slot="icon-only"
              src="/svg/arrow_left.svg" />
          </ion-button>
          <div class="text-center text-[--text-color-light-purple-1-100] font-weight-medium">{{
            $t('main.commissionDetails') }}</div>
        </ion-toolbar>
        <!-- 主体数据 -->
        <div class="h-full bg-300">
          <!-- tab切换栏 -->
          <div class="px-[0.625rem] pt-[0.625rem] bg-400">
            <ion-segment scrollable ref="segment" mode="md" v-model="commissionDetaiParams.type"
              @ionChange="detailTypeChange">
              <ion-segment-button class="min-h-0" :value="item.key" v-for="item of segmentList" :key="item.key">
                <ion-button fill="clear" class="base-style"
                  :class="{ 'select-style': commissionDetaiParams.type == item.key }">{{ item.name }}</ion-button>
              </ion-segment-button>
            </ion-segment>
          </div>
          <!-- table-表格 -->
          <div class="h-full w-full overflow-y-auto px-[0.625rem] py-[0.75rem]">
            <ion-item class="table-title-bg" lines="none">
              <ion-grid>
                <ion-row class="small-text-white table-item-color font-weight-bold">
                  <ion-col size="3">ID</ion-col>
                  <ion-col size="3">{{ $t('toggle.types') }}</ion-col>
                  <ion-col size="3">{{ $t('activity.agent34') }}</ion-col>
                  <ion-col size="3">{{ $t('toggle.commissions') }}</ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
            <div class="flex items-center justify-center">
              <ion-spinner class="mt-2.5 w-5 h-5" name="bubbles" v-if="detailLoading" />
            </div>
            <ion-item class="table-item-bg" lines="none" v-for="(item, i) in detailList" :key="i">
              <ion-grid>
                <ion-row class="small-text-white table-item">
                  <ion-col size="3"><span class="w-full">{{ item?.userId }}</span></ion-col>
                  <ion-col size="3" v-if="item?.gameType">{{ $t(`sort.${item?.gameType}`) }}</ion-col>
                  <ion-col size="3" v-else>{{ $t(`sort.all`) }}</ion-col>
                  <ion-col size="3"><span class="w-full">{{ convertMoneyToShow(item?.totalFlow!) }}</span></ion-col>
                  <ion-col size="3" class="text-[#FBA531]">
                    <span class="w-full">{{ convertMoneyToShow(item?.commission!) }}</span>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
          </div>
        </div>
      </div>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { t } from '@/i18n';
import { computed } from 'vue';
import Empty from '@/components/Empty/index.vue'
import { searchOutline, chevronBack } from 'ionicons/icons';
import { useCommissionLogic } from '@/views/spread/hooks/commissionLogic'
import { convertMoneyToShow } from '@/utils/custom'
import { IonPopover, IonIcon, IonDatetime, IonItem, IonRow, IonCol, IonGrid, IonContent, IonSelect, IonLabel, IonSelectOption, IonModal, IonInfiniteScroll, IonInfiniteScrollContent, IonSegment, IonSegmentButton, IonButton, IonToolbar, IonTitle, IonButtons, IonImg, IonHeader, IonSpinner, InfiniteScrollCustomEvent } from '@ionic/vue';
import AbSelect from '@/components/AbSelect/AbSelect.vue'

// 我的佣金 直属成员/其他成员
const segmentList = computed(() => {
  return [
    { key: 'direct', name: t('toggle.directMember') },
    { key: 'team', name: t('toggle.teamMember') }
  ]
})

const {
  dateIndex,
  currentDate,
  minDate,
  maxDate,
  showPopover,
  isDateChange,
  detailModalState,
  list,
  loading,
  detailLoading,
  detailList,
  detailGameType,
  commissionParams,
  commissionDetaiParams,
  agancyInfo,
  homeGameList,
  locale,
  isToken,
  popoverDismiss,
  popoverPresent,
  dateChange,
  typeChangeHandle,
  detailHandle,
  detailModalClose,
  detailTypeChange
} = useCommissionLogic();

</script>

<style scoped lang="less">
ion-content#main {
  /* 滚动内容 */
  --background: transperent;
}

.select-item {
  font-size: var(--font-size-12);
  line-height: 1.125rem;
  color: var(--color-text-100);
  border-radius: var(--rounded-middle) var(--rounded-middle) 0 0;
  background: var(--spread-commission-select-box-bg);
}

.date-select {
  background: var(--spread-commission-select-bg);
  height: 1.758rem;
}

ion-item::part(native) {
  padding: 0 0 0 0.625rem !important;
}

ion-grid {
  --ion-grid-padding: 0;
}

ion-col {
  --ion-grid-column-padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

ion-item.table-title-bg {
  --background: var(--color-bg-100);
  border-radius: var(--rounded-middle) var(--rounded-middle) 0 0;
}

ion-item.table-item-bg:nth-child(odd) {
  --background: transparent;
  min-height: 2.625rem;
}

ion-item.table-item-bg:nth-child(even) {
  --background: var(--color-bg-500);
  min-height: 2.625rem;
}

ion-item ion-row.table-item {
  color: var(--color-text-100) !important;
}

ion-select {
  flex: 1;
  min-height: 0;
  /* 更改最小高度 */
  --background: var(--spread-commission-select-bg);
  /* 背景颜色 */
  --border-radius: var(--rounded-small);
  /* 圆角 */
  --padding-top: 0px;
  --padding-bottom: 0px;
  --padding-start: .25rem;
  /* 内容左内边距(含label) */
  --padding-end: 0px;
  /* 内容又内边距(含后置图标) */
  color: var(--color-text-100);
  font-size: var(--font-size-12);
  height: 1.758rem;
  margin-left: 5px;
  overflow: hidden;
}

// 时间选择框 时间下划线样式
#popover-trigger p.on {
  border-bottom: 1px solid var(--color-primary-800);
}

ion-datetime {
  --background: var(--color-bg-200);
  color: var(--color-text-100);
}

ion-datetime::part(calendar-day active) {
  color: var(--agent-btn-color);
  background: var(--color-primary-800);
  box-shadow: none;
}

ion-datetime::part(month-year-button) {
  color: var(--color-text-100);
}

ion-datetime::part(month-year-button) {
  --color: var(--color-text-100);
}

.ion-color-primary {
  --ion-color-base: var(--theme-color-800) !important;
}

// -----------------佣金明细--------------
ion-modal ion-content {
  --padding-top: 0;
}

.comm-modal::after {
  content: "";
  position: absolute;
  border-radius: 263px;
  width: 16.4375rem;
  height: 3.125rem;
  opacity: 0.2;
  top: 0;
  left: -4.25rem;
  background: var(--theme-color-400);
  filter: blur(31.649999618530273px);
  z-index: 10;
  pointer-events: none;
}

.comm-modal::before {
  content: "";
  position: absolute;
  width: 7.0625rem;
  height: 3.125rem;
  opacity: 0.19;
  top: 0;
  right: -0.5rem;
  background: var(--gradients-green);
  filter: blur(31.649999618530273px);
  z-index: 50;
  pointer-events: none;
}

ion-toolbar {
  --background: var(--color-bg-300);
  font-size: 1.25rem;
  line-height: 1.875rem;
  height: 3.125rem;
}

ion-button#popover-trigger {
  --padding-start: 0;
  --padding-end: 0;
}

/* 设置导航标签布局方式 */
ion-segment.md {
  display: flex;
  justify-content: left;
}

ion-segment-button.md::part(indicator) {
  /* 设置指示器宽度 */
  margin-left: auto;
  margin-right: auto;
}

ion-segment-button.md::part(indicator-background) {
  /* 设置导航标签指示器的宽度 */
  background: var(--gradients-indicatorLine);
  height: .125rem;
}

ion-segment-button.md {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 2px;
  --padding-bottom: 2px;
  text-transform: capitalize;
  margin-right: 0.8rem;
}

ion-segment-button.md ion-button {
  /* 取消导航标签的标签与指示器之间的边距 */
  text-transform: none;
  /* 取消自动字母大写 */
  height: 2.625rem;
  margin: 0;
  --padding-top: 0px;
  --padding-bottom: 5px;
  --padding-start: 0;
  --padding-end: 0;
  min-width: 0;
}

ion-button.base-style {
  --color: var(--text-color-light-purple-2-100);
  font-size: var(--font-1size-14);
}

ion-button.select-style {
  font-weight: bold;
  --color: var(--text-color-light-purple-1-100);
}

.table-item-color {
  color: var(--text-color-light-purple-2-100) !important;
}
</style>
