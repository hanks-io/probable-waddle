<!-- 代理活动-详情 -->


<script setup lang="ts">
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage
} from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import useHeaderBgColor from '@/views/withdraw/hooks/useHeaderBgColor'
import Empty from '@/components/Empty/index.vue'
import Input from "@/components/first/Input/index.vue";
import useLogic from '../detailsLogic';
import SearchInput from '@/components/searchInput/index.vue'
const {
  titleList,
  pageData,
  queryUserId,
  queryUserDetails,
  handleRefresh,
  ionInfinite,
  handleInputSearch,
  infiniteRef,
  loadMore,
  loading,
  t
} = useLogic();

</script>
<template>
  <ion-page>
    <NavigationBar :title="$t('activity.agent28')" :bgColor="useHeaderBgColor()" />
    <ion-content class="referral-rewards-new-detail" :scrollY="false">
      <div class="query-area">
        <div class="query-date-input">
          <SearchInput v-model="queryUserId" :placeholder="t('activity.agent29')" :loading="loading"
            @searchHandle="queryUserDetails" @ionInput="handleInputSearch" />
        </div>
      </div>
      <div>

      </div>
      <ul class="header-table">
        <li v-for="item in titleList" :key="item" class="item">
          <div class="title">{{ item }}</div>

        </li>
      </ul>

      <!-- 列表 -->
      <ion-content class="record-content">
        <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
          @ionRefresh="handleRefresh($event)">
          <ion-refresher-content />
        </ion-refresher>
        <!-- 暂无数据   <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>-->
        <div class="flex flex-col items-center justify-center" v-if="!loading && !pageData.length">
          <div class="w-[7.5rem] h-[7.5rem] mt-10 ">
            <Empty />
          </div>
        </div>
        <ul class="record-list">
          <li v-for="(item, index) in pageData" :key="item.id">
            <div class="register-time item">
              <div>{{ item.registerTime }}</div>
            </div>
            <div class="item">{{ item.userId }}</div>
            <div class="item  amount-item">
              <p>{{ item.firstRechargeAmount }}</p>
              <p>{{ item.historicalPay }}</p>
            </div>
            <div class="item text-item">
              <p>{{ `${item.rechargeCount}${$t('activity.agent35')}` }}</p>
              <p>{{ `${item.rechargeDays}${$t('activity.agent36')}` }}</p>
            </div>
            <div class="amount item">{{ item.historicalBetting }}</div>

          </li>
        </ul>

        <ion-infinite-scroll ref="infiniteRef" threshold="20px" @ionInfinite="ionInfinite">
          <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? `${t('label.noMore')}` : ''"
            :loading-spinner="loadMore == 'more' ? 'bubbles' : null" color="primary" />
        </ion-infinite-scroll>

      </ion-content>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="less">
.referral-rewards-new-detail {
  --padding-top: .75rem;
  --padding-start: .75rem;
  --padding-end: .75rem;
  --padding-bottom: calc(8rem + env(safe-area-inset-bottom));
}



.itemWidth() {
  .item {
    &:nth-child(1) {
      width: 5.6875rem;
    }

    &:nth-child(2) {
      width: 4.375rem;
    }

    &:nth-child(3) {
      width: 4.25rem;
    }

    &:nth-child(4) {
      width: 4.6875rem;
    }

    &:nth-child(5) {
      width: 4.375rem;
    }

  }


}

#activity-referral-rewards-new-style_0-detail {

  .style(@headerBg: --ep-color-background-fill-surface-raised-L2,
    @headerColor: --ep-color-text-default,
    @listColor: --ep-color-text-default,
    @amountColor: --ep-color-text-warning,
    @bgListItemColor: --ep-color-background-fill-surface-lowered,


  ) {

    .query-date-input {
      width: 22.875rem;
      height: 3.75rem;
      margin: 0 auto;
    }

    .header-table {
      width: 100%;
      height: 2.375rem;
      line-height: 2.375rem;
      text-align: center;
      background: var(@headerBg);
      color: var(@headerColor);
      font-size: var(--ep-font-size-s, 12px);
      font-weight: var(--ep-font-weight-bold, 700);
      border-radius: var(--ep-border-radius-m, .375rem) var(--ep-border-radius-m, .375rem) 0 0;
      padding: 0 .75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      li {
        .title {
          display: inline-block;
          width: 100%;
          line-height: 1.2;
          vertical-align: middle;
        }
      }


      .itemWidth()
    }

    .record-list {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .itemWidth();
        text-align: center;
        font-size: var(--ep-font-size-s, .75rem);
        color: var(@listColor);
        line-height: 2.875rem;
        height: 2.875rem;

        .amount {
          color: var(@amountColor);
          font-weight: var(--ep-font-weight-bold, 700);
        }

        .amount-item {
          p {
            line-height: 1.25rem;
            color: var(@amountColor);
            font-weight: var(--ep-font-weight-bold, 700);
          }
        }

        .text-item {
          p {
            line-height: 1.25rem;
          }
        }

        &:nth-child(even) {
          background: var(@bgListItemColor);
        }

        .register-time {
          display: inline-block;
          width: 100%;
          line-height: 1.2;
          vertical-align: middle;
        }


      }

    }
  }

}

.new-skin-symbol {
  #activity-referral-rewards-new-style_0-detail.style()
}

.yellow-dark,
.green-dark {
  #activity-referral-rewards-new-style_0-detail.style(@headerBg: --color-bg-200,
    @headerColor: --color-text-100,
    @listColor: --color-text-100,
    @amountColor: --accent-color-orange,
    @bgListItemColor: --color-bg-400,

  )
}

.purple-light {
  #activity-referral-rewards-new-style_0-detail.style(@headerBg: --color-bg-200,
    @headerColor: --color-text-100,
    @listColor: --color-text-100,
    @amountColor: --accent-color-orange,
    @bgListItemColor: --color-bg-400,

  )
}

.auroral-yellow {
  #activity-referral-rewards-new-style_0-detail.style(@headerBg: --color-bg-200,
    @headerColor: --color-text-80,
    @listColor: --color-text-80,
    @amountColor: --theme-color-800,
    @bgListItemColor: --color-bg-400,

  )
}

.forest-green {
  #activity-referral-rewards-new-style_0-detail.style(@headerBg: --color-bg-200,
    @headerColor: --text-color-white-40,
    @listColor: --color-text-80,
    @amountColor: --theme-color-800,
    @bgListItemColor: --color-bg-400,

  )
}

.amber-purple {
  #activity-referral-rewards-new-style_0-detail.style(@headerBg: --color-bg-100,
    @headerColor: --text-color-light-purple-2-100,
    @listColor: --text-color-light-purple-2-100,
    @amountColor: --accent-color-orange,
    @bgListItemColor: --color-bg-400,

  )
}

.blue-default,
.green-default {
  #activity-referral-rewards-new-style_0-detail.style(@headerBg: --color-bg-200,
    @headerColor: --color-text-40,
    @listColor: --color-text-80,
    @amountColor: --accent-color-orange,
    @bgListItemColor: --color-bg-400,
  )
}
</style>
