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
import DatetimeInput from '@/components/DatetimeInput/index.vue'
import SelectList from '@/components/first/selectlist/index.vue'
import { useLogicDetail } from '@/views/activity/referralRewardsNew/useLogicDetail'
import Empty from '@/components/Empty/index.vue'
import Input from "@/components/first/Input/index.vue";
const {
  selectList,
  dateIndex,
  startTime,
  endTime,
  headerList,
  merchantCy,
  handleRefresh,
  ionInfinite,
  loading,
  contributionList,
  loadMore,
  handleChange,
  searchValue,
  datetimeChange,
  t,
  handleInputSearch,
  infiniteRef,
} = useLogicDetail()

</script>
<template>
  <ion-page>
    <NavigationBar :title="$t('referralRewardsNew.000024')" :bgColor="useHeaderBgColor()" />
    <ion-content class="referral-rewards-new-detail" :scrollY="false">
      <div class="query-area">
        <div class="query-date">
          <div class="query-date-item">
            <DatetimeInput v-model:datetime="startTime" datetimeId="startTime" @datetimeChange="datetimeChange" />
          </div>
          <div class="query-date-item">
            <DatetimeInput v-model:datetime="endTime" datetimeId="endTime" @datetimeChange="datetimeChange" />
          </div>

          <SelectList :selectList="selectList" v-model="dateIndex" @handleChange="handleChange" width="7.5rem" />

        </div>

        <div class="query-date margin-d">

          <div class="query-date-input">
            <Input v-model="searchValue" type="search" :placeholder="$t('referralRewardsNew.000020')"
              bgColor="--color-bg-400" @input="handleInputSearch" />
          </div>
          <div class="query-btn" @click="handleRefresh">
            {{ $t('referralRewardsNew.000019') }}
          </div>
        </div>
      </div>
      <div>

      </div>
      <ul class="header-table">
        <li v-for="item in headerList" :key="item" class="item">
          <div>{{ item }}</div>

        </li>
      </ul>

      <!-- 列表 -->
      <ion-content class="record-content">
        <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
          @ionRefresh="handleRefresh($event)">
          <ion-refresher-content />
        </ion-refresher>
        <!-- 暂无数据   <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>-->
        <div class="flex flex-col items-center justify-center" v-if="!loading && !contributionList.length">
          <div class="w-[7.5rem] h-[7.5rem] mt-10 ">
            <Empty />
          </div>
        </div>
        <ul class="record-list">
          <li v-for="(item, index) in contributionList" :key="item.id">
            <div class="item">{{ item.userId }}</div>
            <div class="register-time item">
              <div>{{ item.registerTime }}</div>
            </div>
            <div class="amount item"><span class="mr-[0.1563rem]"></span>{{ item.rechargeAmount }}
            </div>
            <div class="amount item"><span class="mr-[0.1563rem]"></span>{{
              item.contributionAmount }}</div>

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
      width: 7.0625rem;
    }

    &:nth-child(3) {
      width: 5.125rem;
    }

    &:nth-child(4) {
      width: 5.125rem;
    }

  }


}

#activity-referral-rewards-new-style_0-detail {

  .style(@btnBg: --ep-color-background-fill-active-primary,
    @btnColor: --ep-color-text-inverse,
    @headerBg: --ep-color-background-fill-surface-raised-L2,
    @headerColor: --ep-color-text-default,
    @listColor: --ep-color-text-default,
    @amountColor: --ep-color-text-warning,
    @bgListItemColor: --ep-color-background-fill-surface-lowered,
  

  ) {
    .query-area {


      .margin-d {
        margin: 12px 0 17px;
      }

      .query-date {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .query-date-item {
          width: 7.3125rem;
          height: 2.25rem;
        }

        .query-date-input {
          width: 15rem;


        }

        .query-btn {
          width: 7.5rem;
          height: 2.75rem;
          line-height: 2.75rem;
          text-align: center;
          color: var(@btnColor);
          background: var(@btnBg);
          border-radius: var(--ep-border-radius-m, .375rem);
        }
      }

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
  #activity-referral-rewards-new-style_0-detail.style(@btnBg: --color-primary-800,
    @btnColor: --color-text-100,
    @headerBg: --color-bg-200,
    @headerColor: --color-text-100,
    @listColor: --color-text-100,
    @amountColor: --accent-color-orange,
    @bgListItemColor: --color-bg-400,
  
  )
}

.purple-light {
  #activity-referral-rewards-new-style_0-detail.style(@btnBg: --color-primary-800,
    @btnColor: --text-color-white-100,
    @headerBg: --color-bg-200,
    @headerColor: --color-text-100,
    @listColor: --color-text-100,
    @amountColor: --accent-color-orange,
    @bgListItemColor: --color-bg-400,
  
  )
}

.auroral-yellow {
  #activity-referral-rewards-new-style_0-detail.style(@btnBg: --theme-color-800-2,
    @btnColor: --color-text-black-100,
    @headerBg: --color-bg-200,
    @headerColor: --color-text-80,
    @listColor: --color-text-80,
    @amountColor: --theme-color-800,
    @bgListItemColor: --color-bg-400,
  
  )
}

.forest-green {
  #activity-referral-rewards-new-style_0-detail.style(@btnBg: --theme-color-800-2,
    @btnColor: --color-text-80,
    @headerBg: --color-bg-200,
    @headerColor: --text-color-white-40,
    @listColor: --color-text-80,
    @amountColor: --theme-color-800,
    @bgListItemColor: --color-bg-400,
   
  )
}

.amber-purple {
  #activity-referral-rewards-new-style_0-detail.style(@btnBg: --gradients-purple-1,
    @btnColor: --color-text-100,
    @headerBg: --color-bg-100,
    @headerColor: --text-color-light-purple-2-100,
    @listColor: --text-color-light-purple-2-100,
    @amountColor: --accent-color-orange,
    @bgListItemColor: --color-bg-400,
   
  )
}

.blue-default, .green-default {
  #activity-referral-rewards-new-style_0-detail.style(@btnBg: --theme-color-gradient-100,
    @btnColor: --text-color-white-100,
    @headerBg: --color-bg-200,
    @headerColor: --color-text-40,
    @listColor: --color-text-80,
    @amountColor: --accent-color-orange,
    @bgListItemColor: --color-bg-400,
  )
}
</style>
