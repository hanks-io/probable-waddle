<!-- 佣金列表 -->
<template>
  <div class="h-full flex flex-col pt-[0.625rem] px-[.625rem] text-xs agent-commission">
    <div class="flex justify-between p-[.625rem] select-item text-[#8f9cb4]" size="small" fill="clear">
      <div class="flex items-center select-date px-1 py-0.5 rounded-[.375rem]" id="popover-trigger">
        <p :class="dateIndex == 1 ? 'on' : ''">{{ commissionParams.startTime }}</p> ～ <p
          :class="dateIndex == 2 ? 'on' : ''">{{
            commissionParams.endTime }}</p>
        <ion-icon class="text-base my-0.5 ml-1" src="/svg/date.svg" />
      </div>
      <AbSelect v-model="commissionParams.gameType" :show-all="true" :disabled="false" mode="md"
        label-placement="stacked" @change="typeChangeHandle" v-if="agancyInfo?.type == 'gameType'" />
    </div>
    <ion-item class="text-[.6875rem] commission-item-title" lines="none">
      <ion-grid>
        <ion-row>
          <ion-col size="3">{{ $t('toggle.settlementtime') }}</ion-col>
          <ion-col size="1.5">{{ $t('toggle.types') }}</ion-col>
          <ion-col size="3">{{ $t('toggle.performance') }}</ion-col>
          <ion-col size="2">{{ $t('toggle.numberofpeople') }}</ion-col>
          <ion-col size="2.5">{{ $t('toggle.commissions') }}</ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
    <div class="flex items-center justify-center">
      <ion-spinner class="mt-2.5 w-5 h-5" name="bubbles" v-if="loading" />
    </div>
    <!-- 暂无数据 -->
    <div class="flex flex-col items-center justify-center" v-if="!loading && !list.length">
      <div class="w-[7.5rem] h-[7.5rem] mt-[9.1rem] empty-bg-img"></div>
      <ion-label color="medium">{{ $t('label.noRecord') }}</ion-label>
    </div>
    <div class="flex-1">
      <ion-content id="main">
        <ion-item class="commission-list text-[.6875rem] relative" lines="none" v-for="(item, i) in list" :key="i"
          @click="detailHandle(item)">
          <ion-grid>
            <ion-row class="table-content-text-color">
              <ion-col size="3"><span class="w-full">{{ dayjs(item.time).add(1, 'day').format('YYYY-MM-DD')
              }}</span></ion-col>
              <ion-col size="1.5" v-if="item?.gameType"><span class="w-full">{{ $t(`sort.${item.gameType}`)
              }}</span></ion-col>
              <ion-col size="1.5" v-else><span class="w-full">{{ $t(`sort.all`) }}</span></ion-col>
              <ion-col size="3">{{ convertMoneyToShow(item.directAchievement + item.teamAchievement) }}</ion-col>
              <ion-col size="2"><span class="w-full">{{ item.contributionCount }}</span></ion-col>
              <ion-col class="money-text" size="2.5">
                <span class="w-full">{{ convertMoneyToShow(item.totalCommission) }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-icon class="absolute right-[0.25rem] top-[0.375rem] text-xs table-content-text-color"
            :icon="searchOutline" />
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
    <ion-modal :is-open="detailModalState">
      <!-- 顶部标题 -->
      <ion-toolbar class="detail-title">
        <ion-button class="arrow-left-btn" slot="start" @click="detailModalClose">
          <ion-icon class="text-[1.5rem] text-[--color-text-title-basic]" slot="icon-only" src="/svg/arrow_left.svg" />
        </ion-button>
        <div class="text-center text-[1.25rem]">{{ $t('main.commissionDetails') }}</div>
      </ion-toolbar>
      <!-- 主体数据 -->
      <div class="h-full w-full model-detail-main">
        <!-- tab切换栏 -->
        <div class="px-[1rem] tab-box">
          <ion-segment class="detail-type pt-[.625rem] flex justify-start" ref="segment" mode="md"
            v-model="commissionDetaiParams.type" @ionChange="detailTypeChange">
            <ion-segment-button class="min-h-0 mr-[0.625rem]" value="direct">
              <ion-label>{{ $t('toggle.directMember') }}</ion-label>
            </ion-segment-button>
            <ion-segment-button class="min-h-0" value="team">
              <ion-label> {{ $t('toggle.teamMember') }}</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>
        <!-- table-表格 -->
        <div class="h-full w-full overflow-y-auto px-[1rem]">
          <ion-item class="text-[.6875rem] detail-list-title" lines="none">
            <ion-grid>
              <ion-row>
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
          <ion-item class="detail-list text-[.6875rem]" lines="none" :class="i % 2 ? 'odd' : ''"
            v-for="(item, i) in detailList" :key="i">
            <ion-grid>
              <ion-row>
                <ion-col size="3"><span class="w-full">{{ item?.userId }}</span></ion-col>
                <ion-col size="3" v-if="item?.gameType">{{ $t(`sort.${item?.gameType}`) }}</ion-col>
                <ion-col size="3" v-else>{{ $t(`sort.all`) }}</ion-col>
                <ion-col size="3"><span class="w-full">{{ convertMoneyToShow(item?.totalFlow) }}</span></ion-col>
                <ion-col size="3" class="money-text">
                  <span class="w-full">{{ convertMoneyToShow(item?.commission) }}</span>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
        </div>
      </div>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { convertMoneyToShow } from '@/utils/custom';
import { searchOutline, chevronBack } from 'ionicons/icons';
import { useCommissionLogic } from '@/views/spread/hooks/commissionLogic'
import { IonPopover, IonIcon, IonDatetime, IonItem, IonRow, IonCol, IonGrid, IonContent, IonSelect, IonLabel, IonSelectOption, IonModal, IonInfiniteScroll, IonInfiniteScrollContent, IonSegment, IonSegmentButton, IonButton, IonToolbar, IonTitle, IonButtons, IonImg, IonHeader, IonSpinner, InfiniteScrollCustomEvent } from '@ionic/vue';
import AbSelect from '@/components/AbSelect/AbSelect.vue'

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
@import "@/views/spread/default/styles/Commission/base.less";
@import "@/views/spread/default/styles/Commission/theme-style.less";

#spread-default-components-commission.style();

.blue-default {
  #spread-default-components-commission.style(--color-bg-800,
    --theme-color-600,
    --color-bg-1100,
    --color-bg-300,
    --color-text-gray-300,
    --color-text-gray-300,
    --color-bg-300,
    --color-bg-100,
    --color-bg-300,
    --color-text-white-100,
    --color-text-gray-100,
    --color-bg-900,
    --color-bg-800,
    --color-text-gray-200,
    --color-text-white-100,
    --agent-commission-detail-segment-bottom-border-color,
    --color-bg-100,
    --color-text-white-100,
    --color-bg-100,
    --color-bg-300,
    --color-bg-200,
    --color-text-white-100,
    --agent-datetime-select-text-color,
    --agent-ion-datetime-calendar-day-bgc,
    --agent-ion-color-primary,
    --color-bg-1200,
    --color-text-white-100,
    --color-text-gray-200,
    --color-text-white-100);
}

.green-default {
  #spread-default-components-commission.style(--color-bg-300,
    --theme-color-500,
    --color-bg-200,
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-bg-300,
    --color-bg-100,
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-bg-100,
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-100,
    --theme-color-600,
    --color-bg-100,
    --color-text-gray-100,
    --color-bg-100,
    --color-bg-300,
    --color-bg-200,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-bg-50,
    --color-text-gray-100,
    --color-bg-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-100);
}

.amber-purple {
  #spread-default-components-commission.style(--color-bg-300,
    --theme-color-400,
    --color-bg-200,
    --color-bg-300,
    --text-color-light-purple-2-100,
    --text-color-light-purple-2-100,
    --color-bg-300,
    --color-bg-100,
    --color-bg-300,
    --text-color-light-purple-2-100,
    --text-color-light-purple-1-100,
    --color-bg-100,
    --color-bg-300,
    --text-color-light-purple-2-100,
    --text-color-light-purple-1-100,
    --theme-color-700,
    --color-bg-100,
    --text-color-light-purple-1-100,
    --color-bg-100,
    --color-bg-300,
    --color-bg-200,
    --text-color-light-purple-2-100,
    --text-color-light-purple-1-100,
    --theme-color-800,
    --text-color-light-purple-1-100,
    --color-bg-100,
    --text-color-light-purple-1-100,
    --text-color-light-purple-2-100,
    --text-color-light-purple-1-100);
}

.forest-green {
  #spread-default-components-commission.style(--color-bg-300,
    --theme-color-500,
    --color-bg-200,
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-bg-300,
    --color-bg-100,
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-bg-100,
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-100,
    --theme-color-600,
    --color-bg-100,
    --color-text-gray-100,
    --color-bg-100,
    --color-bg-300,
    --color-bg-200,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-bg-100,
    --color-text-gray-100,
    --color-bg-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-100);
}

.auroral-yellow {
  #spread-default-components-commission.style(@default-components-commission-24: --theme-color-800,
    @default-components-commission-25: --theme-color-800,
    @default-components-commission-30: --theme-color-800);
}
</style>
