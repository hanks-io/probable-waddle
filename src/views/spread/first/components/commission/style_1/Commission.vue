<!-- 佣金列表 -->
<template>
  <div class="h-full flex flex-col py-[0.75rem] px-[0.625rem] spread-commission-info">
    <div class="p-[.625rem] spread-select-item" size="small" fill="clear">
      <div class="spread-date-select px-1 py-0.5" id="popover-trigger">
        <p :class="dateIndex == 1 ? 'on' : ''">{{ commissionParams.startTime }}</p> ～ <p
          :class="dateIndex == 2 ? 'on' : ''">{{
            commissionParams.endTime }}</p>
        <ion-icon class="my-0.5 ml-1" src="/svg/date.svg" />
      </div>
      <AbSelect v-model="commissionParams.gameType" :show-all="true" :disabled="false" interface="popover" mode="md"
        label-placement="stacked" @change="typeChangeHandle" v-if="agancyInfo?.type == 'gameType'" />
    </div>
    <div class="mt-[0.75rem]">
      <ion-item class="table-title-bg" lines="none">
        <ion-grid>
          <ion-row class="sparead-table-title">
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
            <ion-row class="spread-table-item">
              <ion-col size="3" class="spread-table-item-light"><span class="w-full">{{ dayjs(item.time).add(1,
                'day').format('YYYY-MM-DD') }}</span></ion-col>
              <ion-col size="1.5" v-if="item?.gameType"><span class="w-full">{{ $t(`sort.${item.gameType}`)
                  }}</span></ion-col>
              <ion-col size="1.5" v-else><span class="w-full">{{ $t(`sort.all`) }}</span></ion-col>
              <ion-col size="3">{{ convertMoneyToShow(item.directAchievement + item.teamAchievement) }}</ion-col>
              <ion-col size="2"><span class="w-full">{{ item.contributionCount }}</span></ion-col>
              <ion-col class="spread-commission-amount" size="2.5">
                <span class="w-full">{{ convertMoneyToShow(item.totalCommission) }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-icon class="absolute right-[0.25rem] top-[0.375rem] spread-table-item-search" :icon="searchOutline" />
        </ion-item>
      </ion-content>
    </div>
    <!-- 时间选择器 -->
    <ion-popover mode="md" trigger="popover-trigger" trigger-action="click" :isOpen="showPopover" :showBackdrop="false"
      :backdropDismiss="dateIndex != 2" :animated="dateIndex == 0" @didDismiss="popoverDismiss"
      @didPresent="popoverPresent">
      <ion-datetime presentation="date" mode="ios" :value="currentDate" :min="minDate" :max="maxDate"
        :show-default-buttons="true" :locale="locale" :cancel-text="$t('main.cancel')"
        :done-text="$t('mlmAgent.btnDone')" @ionChange="dateChange" />
    </ion-popover>
    <!-- 佣金明细弹窗 -->
    <ion-modal :is-open="detailModalState" class="overflow-y-auto">
      <!-- 顶部标题 -->
      <NavigationBar :title="$t('main.commissionDetails')">
        <template #start>
          <ion-icon slot="start" @click="detailModalClose" class="text-[1.5rem] commission-modal-back"
            src="/svg/arrow_left.svg" />
        </template>
      </NavigationBar>
      <!-- 主体数据 -->
      <div class="h-full commission-modal-detail-conten">
        <!-- tab切换栏 -->
        <div class="px-[0.625rem] pt-[0.625rem] commission-modal-detail-segment">
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
              <ion-row class="sparead-table-title">
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
              <ion-row class="spread-table-item">
                <ion-col size="3" class="spread-table-item-light"><span class="w-full">{{ item?.userId
                    }}</span></ion-col>
                <ion-col size="3" v-if="item?.gameType">{{ $t(`sort.${item?.gameType}`) }}</ion-col>
                <ion-col size="3" v-else>{{ $t(`sort.all`) }}</ion-col>
                <ion-col size="3"><span class="w-full">{{ convertMoneyToShow(item?.totalFlow ?? 0) }}</span></ion-col>
                <ion-col size="3" class="spread-commission-amount">
                  <span class="w-full">{{ convertMoneyToShow(item?.commission ?? 0) }}</span>
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
import { t } from '@/i18n';
import Empty from '@/components/Empty/index.vue'
import { computed } from 'vue';
import { searchOutline, chevronBack } from 'ionicons/icons';
import { useCommissionLogic } from '@/views/spread/hooks/commissionLogic'
import { convertMoneyToShow } from '@/utils/custom'
import { IonPopover, IonIcon, IonDatetime, IonItem, IonRow, IonCol, IonGrid, IonContent, IonSelect, IonSelectOption, IonModal, IonSegment, IonSegmentButton, IonButton, IonSpinner } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
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
@import '@/views/spread/first/styles/Commission/base-index.less';

.new-skin-symbol {
  @import '@/views/spread/first/styles/Commission/theme-style.less';
}
</style>
