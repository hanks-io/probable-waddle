<!-- 我的业绩 -->
<template>
  <div class="h-full flex flex-col p-[.625rem] bg-300">
    <div class="flex-between select-item p-[.625rem] bg-200" size="small" fill="clear">
      <div class="flexBox date-select px-1 py-0.5 rounded-small" id="popover-trigger">
        <p :class="showPopover?'on':''">{{ achievementParams.time }}</p>
        <ion-icon class="text-sm my-0.5 ml-1" src="/svg/date.svg"/>
      </div>
      <ion-searchbar id="search-agency" class="flex-1" v-model="searchValue" @ionInput="searchInput" show-clear-button="never" placeholder="ID" @click.stop="">
        <ion-spinner class="z-10 absolute right-1 w-5 h-5" name="bubbles" v-if="loading"/>
        <ion-icon class="z-10 absolute right-1 table-item-color text-sm" :icon="searchOutline" @click="searchHandle" v-else/>
      </ion-searchbar>
    </div>
    <div class="mt-[0.75rem]">
      <ion-item class="table-title-bg" lines="none">
        <ion-grid>
          <ion-row class="small-text-white table-item-color font-weight-bold">
            <ion-col size="">ID</ion-col>
            <ion-col size="2.5">{{ $t('toggle.subordinatenumber') }}</ion-col>
            <ion-col size="2.5">{{ $t('activity.agent34') }}</ion-col>
            <ion-col size="2.5">{{ $t('toggle.performance') }}</ion-col>
            <ion-col size="2.5">{{ $t('activity.agent32') }}</ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </div>
    <!-- 暂无数据 -->
    <div class="flex-center h-full" v-if="!loading && !list.length">
      <Empty />
    </div>
    <div class="flex-1">
      <ion-content>
        <ion-item lines="none" class="table-item-bg relative" :class="i%2 ? 'odd' :''" v-for="(item, i) in list" :key="i" @click="detailHandle(item.userId)">
          <ion-grid>
            <ion-row class="small-text-white table-item">
              <ion-col size="2"><span class="w-full">{{ item.userId }}</span></ion-col>
              <ion-col size="2.5">{{ item.subAccount }}</ion-col>
              <ion-col size="2.5"><span class="w-full">{{ convertMoneyToShow(item.totalFlow) }}</span></ion-col>
              <ion-col size="2.5"><span class="w-full">{{ convertMoneyToShow(item.achievement) }}</span></ion-col>
              <ion-col class="color-text-currency" size="2.5">
                <span class="w-full">{{ convertMoneyToShow(item.recharge) }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-icon class="absolute right-[0.25rem] top-[0.325rem] text-xs color-text-100" :icon="searchOutline"/>
        </ion-item>
        <!-- 下拉加载更多 -->
        <ion-infinite-scroll @ionInfinite="ionInfinite" v-if="!loading && list.length">
          <ion-infinite-scroll-content v-if="list.length" :loading-text="loadMore ? '' : $t('label.noMore')" :loading-spinner="loadMore ? 'bubbles' : null"/>
        </ion-infinite-scroll>
      </ion-content>
    </div>
    <!-- 时间选择器 -->
    <ion-popover mode="md" trigger="popover-trigger" trigger-action="click"
      :isOpen="showPopover" :showBackdrop="false"
      @didDismiss="popoverDismiss"
    >
      <ion-datetime 
        presentation="date" 
        mode="ios"
        :value="achievementParams.time" 
        :min="minDate" 
        :max="maxDate" 
        :show-default-buttons="true" 
        :locale="locale"
        :cancel-text="$t('main.cancel')"
        :done-text="$t('mlmAgent.btnDone')" 
        @ionChange="dateChange"
      />
    </ion-popover>
    <!-- 详情弹窗 -->
    <ion-modal ref="modal" :is-open="detailModalState" :backdrop-dismiss="false">
      <ion-toolbar mode="ios">
        <ion-title>{{ $t('viewsSpread.directDetails') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="detailModalDismiss"><ion-icon class="w-[1.5rem] h-[1.5rem] color-text-100" :icon="close"/></ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-list class="m-0 p-0">
          <ion-item class="item-detail small-text-white" v-for="(value, key) of achievementDetail" :key="key" lines="none">
            <ion-label class="ml-[.625rem]">
              <span>{{ $t(`key.${key}`) }}: </span><span class="color-text-currency">{{ ['achievement', 'totalFlow'].includes(key) ? convertMoneyToShow(value) :value }}</span>
            </ion-label>
          </ion-item>
        </ion-list>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { convertMoneyToShow } from '@/utils/custom'
import Empty from '@/components/Empty/index.vue'
import { searchOutline, close } from 'ionicons/icons'
import { usePerformanceLogic } from '@/views/spread/hooks/performanceLogic'
import { IonPopover, IonIcon, IonDatetime, IonItem, IonRow, IonCol, IonGrid, IonInfiniteScroll, IonInfiniteScrollContent,
  IonContent, IonSearchbar, IonSpinner, IonImg, IonModal, IonTitle, IonButton, IonButtons, IonList, IonLabel, IonToolbar } from '@ionic/vue';

const {
  minDate,
  maxDate,
  showPopover,
  loading,
  searchValue,
  detailModalState,
  achievementDetail,
  list,
  achievementParams,
  userId,
  locale,
  isToken,
  popoverDismiss,
  dateChange,
  searchHandle,
  detailHandle,
  detailModalDismiss,
  loadMore,
  ionInfinite,
  searchInput
} = usePerformanceLogic();

</script>

<style scoped lang="less">
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

ion-searchbar#search-agency {
  height: 1.758rem;
  padding: 0;
  margin-left: .75rem;
  --color: var(--color-text-100);
  border-radius: var(--rounded-small);
  --background: var(--spread-commission-select-bg);
  --placeholder-color: var(--color-text-100);
  --box-shadow: none;
  overflow: hidden;
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

ion-button#popover-trigger {
  --padding-start: 0;
  --padding-end: 0;
}

#popover-trigger p.on {
  border-bottom: 1px solid #38A8FA;
}

ion-content { /* 滚动内容 */
  --background: transperent;
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

ion-modal {
  --height: auto;
  --border-radius: var(--rounded-large);
  --background: var(--color-bg-300);
  padding: 0 1.5625rem;
  height: auto;
}

ion-modal ion-toolbar {
  --background: var(--color-bg-200);
  border-bottom: 1px solid var(--color-line);
}

ion-list ion-item.item-detail {
  --background: var(--color-bg-300);
}

ion-list ion-item.item-detail ion-label {
  color: var(--color-text-100);
  margin: .625rem 0;
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
  --ion-color-base: var(--color-primary-800) !important;
}

.table-item-color {
  color: var(--text-color-light-purple-2-100) !important;
}
</style>
