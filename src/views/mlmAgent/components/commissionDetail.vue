<!-- 多级分销 佣金明细 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('main.commissionDetails')" />
    <ion-content>
      <div class="commission-detail w-full px-[0.75rem] pt-[0.9375rem]">
        <!-- 时间选择框 -->
        <div class="commission-detail-time w-full px-[0.375rem]">
          <span>{{ $t('activity.selectDate') }}:</span>
          <div class="timeChoose" id="popover-trigger-left">
            <div>{{ timeStart }}</div>
            <ion-icon icon="/svg/spread/calendar.svg" />
          </div>
        </div>
        <!-- 佣金详情信息 -->
        <div
          class="card">
          <ion-icon icon="/svg/spread/coin.svg" />
          <div class="Earn">{{ $t('activity.earn') }} {{ $t('toggle.commissions') }}</div>
          <div class="money">{{ tenantInfo?.merchantCy }} {{ formatMoneyToShow(myTotalCommission) }}</div>
          <div class="right">
            <img src="/first/agent/comm-detail.png" alt="">
          </div>
        </div>
        <!-- 下级ID搜索框 -->
        <div class="filter">
          <ion-searchbar 
            class="search"
            v-model="searchValue" 
            id="search-agency"
            :placeholder="$t('mlmAgent.searchPlaceholder')"
            show-clear-button="never" 
            @input="searchInput" 
            mod="ios"
          >
          </ion-searchbar>
          <ion-icon icon="/svg/spread/find.svg" @click="searchHandle" />
        </div>
        <div class="perMes">
          <div 
            v-for='item in commissionDetailList' 
            :key='item.userId'
            class="perCard"
          >
            <div class="line"></div>
            <div class="perImg">
              <img :src="item.avatar" class="mx-auto w-[2.625rem] h-[2.625rem] mb-[0.625rem]" />
              <div class="idMes">
                <div class="idNum">ID:{{ item.userId }}</div>
                <ion-icon  src="/svg/spread/copyRight.svg" @click="copy(item.userId)" />
              </div>
            </div>
            <div class="mes">
              <div class="top">
                <div class="left">
                  {{ item.level }}
                </div>
                <div class="right">
                  {{ formatMoneyToShow(item.rechargeAmount) }}
                </div>
              </div>
              <div class="bottom">
                <div class="left">
                  {{ $t('mlmAgent.subordLevels') }}
                </div>
                <div class="right">
                  {{ $t('activity.agent32') }}
                </div>
              </div>
              <div class="top">
                <div class="left card-left-amount">
                  {{ tenantInfo?.merchantCy }} {{ formatMoneyToShow(item.commission) }}
                </div>
                <div class="right">
                  {{ formatToDateTime(item.registerTime) }}
                </div>
              </div>
              <div class="bottom">
                <div class="left">
                  {{ $t('mlmAgent.contributionCom') }}
                </div>
                <div class="right">
                  {{ $t('main.signUp') }} {{ $t('activity.time') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div class="empty" v-if="!showEmpty">
          <div class="img">
            <Empty :text="$t('mlmAgent.noMoreDeta')" />
          </div>
        </div>
      </div>
    </ion-content>
    <!-- 时间选择器 -->
    <ion-popover mode="md" trigger="popover-trigger-left" trigger-action="click" :isOpen="showPopover"
      :showBackdrop="false" @didDismiss="popoverDismiss">
      <ion-datetime 
        presentation="date" 
        mode="ios" 
        :value="dateValueTime" 
        :min="minDate" 
        :max="maxDate" 
        :locale="locale"
        :show-default-buttons="true"
        :cancel-text="$t('main.cancel')"
        :done-text="$t('mlmAgent.btnDone')" 
        @ionChange="dateChange" color="rose" 
      />
    </ion-popover>
  </ion-page>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy';
import { formatToDateTime } from '@/utils/date.ts'
import { formatMoneyToShow } from '@/utils/custom'
import { IonPopover, IonIcon, IonDatetime, IonPage, IonContent, IonSearchbar } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useCommissionDetailSpread } from '@/views/mlmAgent/hooks/commissionDetailSpread'
import Empty from '@/components/Empty/index.vue'
const {
  minDate,
  maxDate,
  timeStart,
  showPopover,
  searchValue,
  dateValueTime,
  commissionDetailList,
  myTotalCommission,
  locale,
  tenantInfo,
  showEmpty,
  popoverDismiss,
  dateChange,
  searchHandle,
  searchInput
} = useCommissionDetailSpread();
</script>

<style scoped lang="less">
@import '@/views/mlmAgent/styles/CommissionDetail/base-index.less';
@import '@/views/mlmAgent/styles/CommissionDetail/theme-style.less';

#mlmAgent-components-commissionDetail-index.style();

.yellow-dark,
.green-dark,
.purple-light,
.amber-purple,
.blue-default,
.forest-green,
.green-default,
.auroral-yellow {
  #mlmAgent-components-commissionDetail-index.style(
    --mlm-agent-date-bg-color,
    --mlm-subdetail-item-name-color,
    --mlm-selected-text-color,
    --mlm-commission-detail-bgc,
    --mlm-commission-detail-tips-tc,
    --mlm-commission-detail-money-tc,
    --mlm-subdetail-item-name-color,
    --color-bg-commission-fourth,
    --color-line-default,
    --mlm-searchbar-icon-color,
    --mlm-subdetail-box-bgc,
    --mlm-subdetail-box-border-color,
    --mlm-subdetail-top-bgc,
    --mlm-subdetail-border-color,
    --mlm-subordinate-id-text-color,
    --mlm-subdetail-item-name-color,
    --color-text-100,
    --color-line-default,
    --mlm-subdetail-item-name-color,
    --color-line-default,
    --mlm-toolbar-bg-color,
    --color-bg-300,
    --color-primary-800,
    --agent-btn-color,
    --mlm-searchbar-enter-color,
    --mlm-searchbar-placeholder-color,
    --mlm-commission-detail-account-money-tc
  );
}

.auroral-yellow {
  #mlmAgent-components-commissionDetail-index.style(
    @mlmAgent-components-commissionDetail-index-05: --color-text-gray-200;
    @mlmAgent-components-commissionDetail-index-08: --color-bg-400;
    @mlmAgent-components-commissionDetail-index-23: --theme-color-800;
    @mlmAgent-components-commissionDetail-index-11: --color-bg-400;
    @mlmAgent-components-commissionDetail-index-13: --theme-color-800;
  )
}

.new-skin-symbol {
  #mlmAgent-components-commissionDetail-index.style(
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-weaker,
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-weaker,
    --ep-color-text-warning,
    --ep-color-text-default,
    --ep-color-background-fill-surface-lowered,
    --ep-color-border-default,
    --ep-color-icon-weaker,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-border-default,
    --ep-color-background-fill-glow-primary-opacity-40,
    --ep-color-border-default,
    --ep-color-text-default,
    --ep-color-icon-weaker,
    --ep-color-text-default,
    --ep-color-border-default,
    --ep-color-text-weaker,
    --ep-color-border-default,
    --ep-color-background-fill-top-nav-secondary,
    --ep-color-background-fill-surface-raised-L2,
    --ep-color-background-fill-active-primary,
    --ep-color-text-inverse,
    --ep-color-text-default,
    --ep-color-text-weak,
    --ep-color-text-warning
  ) 
}

.new-skin-symbol {
  @import '@/views/mlmAgent/styles/CommissionDetail/index-phantom.less';
}
</style>
