<!-- 我的业绩 -->
<template>
  <div class="h-full flex flex-col p-[.625rem] spread-performance-info">
    <div class="select-item p-[.625rem]" size="small" fill="clear">
      <div class="spread-date-select px-1 py-0.5" id="popover-trigger">
        <p :class="showPopover?'on':''">{{ achievementParams.time }}</p>
        <ion-icon class="spread-middle-text my-0.5 ml-1" src="/svg/date.svg"/>
      </div>
      <ion-searchbar id="search-agency" class="flex-1" v-model="searchValue" @ionInput="searchInput" show-clear-button="never" placeholder="ID" @click.stop="">
        <ion-spinner class="z-10 absolute right-1 w-5 h-5" name="bubbles" v-if="loading"/>
        <ion-icon class="z-10 absolute right-1 spread-search-icon spread-middle-text" :icon="searchOutline" @click="searchHandle" v-else/>
      </ion-searchbar>
    </div>
    <div class="mt-[0.75rem]">
      <ion-item class="table-title-bg" lines="none">
        <ion-grid>
          <ion-row class="sparead-table-title">
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
        <ion-item lines="none" class="table-item-bg" :class="i%2 ? 'odd' :''" v-for="(item, i) in list" :key="i" @click="detailHandle(item.userId)">
          <ion-grid>
            <ion-row class="spread-table-item">
              <ion-col size="2" class="spread-table-item-light"><span class="w-full">{{ item.userId }}</span></ion-col>
              <ion-col size="2.5">{{ item.subAccount }}</ion-col>
              <ion-col size="2.5"><span class="w-full">{{ convertMoneyToShow(item.totalFlow) }}</span></ion-col>
              <ion-col size="2.5"><span class="w-full">{{ convertMoneyToShow(item.achievement) }}</span></ion-col>
              <ion-col class="spread-performance-amount relative" size="2.5">
                <span class="w-full">{{ convertMoneyToShow(item.recharge) }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-icon class="absolute right-[0.25rem] top-[0.375rem] spread-table-item-search" :icon="searchOutline"/>
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
        :cancel-text="$t('main.cancel')"
        :done-text="$t('mlmAgent.btnDone')" 
        :locale="locale"
        @ionChange="dateChange"
      />
    </ion-popover>
    <!-- 详情弹窗 -->
    <ion-modal ref="modal" :is-open="detailModalState" :backdrop-dismiss="false">
      <ion-toolbar mode="ios">
        <ion-title>{{ $t('viewsSpread.directDetails') }}</ion-title>
        <ion-icon slot="end" @click="detailModalDismiss" class="text-[1.5rem] model-close" :src="close" />
      </ion-toolbar>
      <ion-list>
        <ion-item class="modal-item-detail" v-for="(value, key) of achievementDetail" :key="key" lines="none">
          <ion-label class="ml-[.625rem]">
            <span>{{ $t(`key.${key}`) }}: </span>
            <span class="spread-performance-amount">
              {{ ['achievement', 'totalFlow'].includes(key) ? convertMoneyToShow(value) :value }}
            </span>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import Empty from '@/components/Empty/index.vue'
import { searchOutline, close } from 'ionicons/icons';
import { usePerformanceLogic } from '@/views/spread/hooks/performanceLogic'
import { convertMoneyToShow } from '@/utils/custom'
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
@import '@/views/spread/first/styles/Performance/base-index.less';

.new-skin-symbol {
  @import '@/views/spread/first/styles/Performance/theme-style.less';
}
</style>
