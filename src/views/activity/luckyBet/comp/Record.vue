<script setup lang="ts">
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent
} from '@ionic/vue'
import Empty from '@/components/Empty/index.vue'
import useRecordLogic from '@/views/activity/luckyBet/useRecordLogic'

const {
  merchantCy,
  recordList,
  loadMore,
  loading,
  infiniteRef,
  ionInfinite,
  handleRefresh,
  headerList,
  t
} = useRecordLogic()
</script>

<template>
  <!-- 头部 -->
  <slot name="recordHeader">
    <ul class="header-list">
      <li v-for="item in headerList" :key="item">
        <div class="item">{{ item }}</div>

      </li>
    </ul>

  </slot>
  <!-- 列表 -->
  <ion-content class="record-content">
    <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
      <ion-refresher-content />
    </ion-refresher>
    <!-- 暂无数据   <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>-->
    <div class="flex flex-col items-center justify-center" v-if="!loading && !recordList.length">
      <div class="w-[7.5rem] h-[7.5rem] mt-10 ">
        <Empty />
      </div>
    </div>
    <ul class="record-list">
      <li v-for="(item, index) in recordList">
        <div class="order">{{ item.orderNoHead }}<span v-html="item.orderNoTail"></span></div>
        <div class="amount"><span class="mr-[0.1563rem]">{{ merchantCy }}</span>{{ item.awardCount }}</div>
        <div :class="[item.status, 'status']">{{ item.statusValue }}</div>
      </li>
    </ul>



    <ion-infinite-scroll ref="infiniteRef" threshold="10px" @ionInfinite="ionInfinite">
      <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? `${t('label.noMore')}` : ''"
        :loading-spinner="loadMore == 'more' ? 'bubbles' : null" color="primary" />

    </ion-infinite-scroll>


  </ion-content>


</template>


<style scoped lang="less">
ion-content.record-content {
  --padding-bottom: calc(8rem + env(safe-area-inset-bottom));
  height: 23.625rem;

}

:deep(.winning-numbers) {
  color: var(--ep-color-text-danger, --accent-color-red)
}

#activity-luckyBet-record-comp-style_0 {

  .style(@headerColor: --color-text-80,
    @orderColor: --color-text-80,
    @amountColor: --accent-color-orange,
    @RECEIVED: --accent-color-green,
    @DISTRIBUTED: --accent-color-blue,
    @EXPIRED: --color-text-40,
    @headerBgColor: --color-bg-200,
    @bgListItemColor: --color-bg-400) {
    .header-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      height: 2.25rem;
      width: 22.875rem;
      margin: 1.8125rem auto 0;
      background: var(@headerBgColor);
      border-radius: var(--ep-border-radius-s, .25rem) var(--ep-border-radius-s, .25rem) 0 0;

      li {
        color: var(@headerColor);
        font-size: var(--ep-font-size-s, .75rem);
        font-weight: var(--ep-font-weight-bold, 700);

        .item {
          display: inline-block;
          width: 100%;
          line-height: 1.2;
          vertical-align: middle;
        }

        &:nth-child(1) {
          width: 10.125rem;
        }

        &:nth-child(2) {
          width: 6.25rem;
        }

        &:nth-child(3) {
          width: 6.4375rem;
        }
      }

    }

    .record-list {
      margin: 0 auto;
      width: 22.875rem;


      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        line-height: 2.625rem;
        font-size: var(--ep-font-size-s, .75rem);
        width: 22.875rem;

        &:nth-child(even) {
          background: var(@bgListItemColor);
        }

        .order {
          width: 10.125rem;
          font-size: var(--ep-font-size-xs, .625rem);
          color: var(@orderColor);
         
        }

        .amount {
          width: 6.25rem;
          font-weight: var(--ep-font-weight-bold, 700);
          color: var(@amountColor);
        }

        .status {
          width: 6.4375rem;
          font-weight:var(--ep-font-weight-medium, 600);
        }

        .RECEIVED {
          color: var(@RECEIVED);
        }

        .DISTRIBUTED {
          color: var(@DISTRIBUTED);
        }

        .EXPIRED {
          color: var(@EXPIRED);
        }
      }

    }


  }

}

.yellow-dark,
.green-dark {
  #activity-luckyBet-record-comp-style_0.style();
}

.purple-light {
  #activity-luckyBet-record-comp-style_0.style(@headerColor: --text-color-black-40, @orderColor: --text-color-black-80);
}

.amber-purple {
  #activity-luckyBet-record-comp-style_0.style(@headerColor: --text-color-light-purple-2-100);
}

.blue-default {
  #activity-luckyBet-record-comp-style_0.style(@headerColor: --color-text-40);
}

.green-default {
  #activity-luckyBet-record-comp-style_0.style(@headerColor: --color-text-40, @orderColor: --color-text-gray-200);
}

.forest-green {
  #activity-luckyBet-record-comp-style_0.style(@headerColor: --text-color-white-40, @amountColor: --color-warning, @orderColor: --color-text-white-80);
}

.auroral-yellow {
  #activity-luckyBet-record-comp-style_0.style(@headerColor: --text-color-white-40, @amountColor: --theme-color-800);
}

.new-skin-symbol {
  #activity-luckyBet-record-comp-style_0.style(@headerColor: --ep-color-text-weaker,
    @headerBgColor: --ep-color-background-fill-surface-raised-L2,
    @bgListItemColor: --ep-color-background-fill-surface-lowered,
    @orderColor: --ep-color-text-default,
    @amountColor: --ep-color-text-warning,
    @RECEIVED: --ep-color-text-success,
    @DISTRIBUTED: --ep-color-text-info,
    @EXPIRED: --ep-color-text-weaker,
   );
}
</style>
