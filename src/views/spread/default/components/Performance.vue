<!-- 我的业绩 -->
<template>
  <div style="margin:0;" class="h-full flex flex-col text-xs pt-[0.625rem] agent-performance mr-0 px-[.625rem]">
    <div class="flex select-item justify-between p-[.625rem] text-[#566488]" size="small" fill="clear">
      <div class="min-w-[6.125rem] flex items-center justify-center select-date px-1 py-0.5 rounded-[.375rem]" id="popover-trigger">
        <p :class="showPopover?'on':''">{{ achievementParams.time }}</p>
        <ion-icon class="text-base my-0.5 ml-1" src="/svg/date.svg"/>
      </div>
      <ion-searchbar id="search-agency" class="flex-1" v-model="searchValue" @ionInput="searchInput" show-clear-button="never" placeholder="ID" @click.stop="">
        <ion-spinner class="z-10 absolute right-1 w-5 h-5" name="bubbles" v-if="loading"/>
        <ion-icon class="z-10 absolute right-1 text-sm search-icon"  :icon="searchOutline" @click="searchHandle" v-else/>
      </ion-searchbar>
    </div>
    <ion-item class="text-[.6875rem] performance-item-title" lines="none">
      <ion-grid>
        <ion-row>
          <ion-col size="2">ID</ion-col>
          <ion-col size="2.5">{{ $t('toggle.subordinatenumber') }}</ion-col>
          <ion-col size="2.5">{{ $t('activity.agent34') }}</ion-col>
          <ion-col size="2.5">{{ $t('toggle.performance') }}</ion-col>
          <ion-col size="2.5">{{ $t('activity.agent32') }}</ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
    <div class="flex-1">
      <ion-content>
        <ion-item lines="none" class="commission-list relative text-[.625rem]" :class="i%2 ? 'odd' :''" v-for="(item, i) in list" :key="i" @click="detailHandle(item.userId)">
          <ion-grid>
            <ion-row class="table-content-text-color">
              <ion-col size="2"><span class="w-full">{{ item.userId }}</span></ion-col>
              <ion-col size="2.5">{{ item.subAccount }}</ion-col>
              <ion-col size="2.5"><span class="w-full">{{ convertMoneyToShow(item.totalFlow) }}</span></ion-col>
              <ion-col size="2.5"><span class="w-full">{{ convertMoneyToShow(item.achievement) }}</span></ion-col>
              <ion-col class="money-text" size="2.5">
                <span class="w-full">{{ convertMoneyToShow(item.recharge) }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-icon class="absolute right-[0.25rem] top-[0.375rem] text-xs table-content-text-color" :icon="searchOutline"/>
        </ion-item>
        <!-- 暂无数据 -->
        <div class="flex flex-col items-center justify-center" v-if="!loading && !list.length">
          <div class="w-[7.5rem] h-[7.5rem] mt-36 empty-bg-img"></div>
          <ion-label color="medium" class="text-[0.875rem] leading-[1.375rem] mb-[0.3125rem]">{{ $t('label.noRecord') }}</ion-label>
        </div>
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
      <ion-toolbar mode="ios" class="detail-toolbar">
        <ion-title>{{ $t('viewsSpread.directDetails') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="detailModalDismiss"><ion-icon class="text-xl" :icon="close"/></ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-list>
          <ion-item v-for="(value, key) of achievementDetail" :key="key" :lines="key=='directAgentAdd'?'none':'inset'">
            <ion-label class="ml-[.625rem]" style="font-size:.75rem">
              <span>{{ $t(`key.${key}`) }}: </span><span class="money-text">{{ ['achievement', 'totalFlow'].includes(key) ? convertMoneyToShow(value) :value }}</span>
            </ion-label>
          </ion-item>
        </ion-list>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { searchOutline, close } from 'ionicons/icons';
import { usePerformanceLogic } from '@/views/spread/hooks/performanceLogic'
import { IonPopover, IonIcon, IonDatetime, IonItem, IonRow, IonCol, IonGrid, IonContent, IonInfiniteScroll, IonInfiniteScrollContent,
  IonSearchbar, IonSpinner, IonImg, IonModal, IonTitle, IonButton, IonButtons, IonList, IonLabel, IonToolbar } from '@ionic/vue';
import { convertMoneyToShow } from '@/utils/custom'
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
  @import "@/views/spread/default/styles/Performance/base.less";
  @import "@/views/spread/default/styles/Performance/theme-style.less";

  #spread-default-components-performance.style();

  .blue-default {
    #spread-default-components-performance.style(
      --color-bg-800,
      --color-bg-1100,
      --agent-performance-detail-item-bgc,
      --color-bg-300,
      --color-bg-100,
      --theme-color-600,
      --color-bg-300,
      --agent-performance-detail-toolbar-bgc,
      --color-border-600,
      --color-bg-200,
      --color-text-white-100,
      --agent-datetime-select-text-color,
      --agent-ion-datetime-calendar-day-bgc,
      --agent-ion-color-primary,
      --color-bg-300,
      --color-text-gray-300,
      --color-text-gray-300,
      --color-text-white-100,
      --color-bg-300,
      --color-text-gray-300,
      --color-text-gray-300,
      --color-bg-1200,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-white-100
    );
  }

  .green-default {
    #spread-default-components-performance.style(
      --color-bg-300,
      --color-bg-200,
      --color-bg-200,
      --color-bg-300,
      --color-bg-100,
      --theme-color-500,
      --color-bg-300,
      --color-bg-100,
      --color-line,
      --color-bg-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-bg-50,
      --color-text-gray-100,
      --color-bg-300,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-bg-300,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-bg-100,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100
    );
  }

  .amber-purple {
    #spread-default-components-performance.style(
      --color-bg-300,
      --color-bg-200,
      --color-bg-200,
      --color-bg-300,
      --color-bg-100,
      --theme-color-400,
      --color-bg-300,
      --color-bg-100,
      --line-color,
      --color-bg-200,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --theme-color-800,
      --text-color-light-purple-1-100,
      --color-bg-300,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --color-bg-300,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --color-bg-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100
    );
  }

  .forest-green {
    #spread-default-components-performance.style(
      --color-bg-300,
      --color-bg-200,
      --color-bg-200,
      --color-bg-300,
      --color-bg-100,
      --theme-color-500,
      --color-bg-300,
      --color-bg-100,
      --color-line,
      --color-bg-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-bg-100,
      --color-text-gray-100,
      --color-bg-300,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-bg-300,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-bg-100,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100
    );
  }

  .auroral-yellow {
    #spread-default-components-performance.style(
      @default-components-performance-13:--theme-color-800,
      @default-components-performance-14: --theme-color-800,
      @default-components-performance-26: --theme-color-800
    );
  }
</style>
