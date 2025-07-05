<!-- 多级分销 下级数据 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('mlmAgent.nextLevelData')" />
    <ion-content>
      <div class="subordinateInfo w-full px-[0.75rem] pt-[0.9375rem]">
        <div class="subordinate-info-time w-full">
          <!-- 下属等级选择 -->
          <div 
            class="level"
            @click="dateSelectHandle" 
            id="statement-trigger-level"
          >
            <div class="type">{{ getSubordinateLevel(level) }}</div>
            <ion-icon src="/first/svg/select-icon.svg"  :class="levelPopoverVisible ? 'on' : ''" />
            <!-- 下属等级选择弹出层 -->
            <ion-popover mode="md" class="level-popover" trigger="statement-trigger-level" :isOpen="levelPopoverVisible"
              @didDismiss="levelPopoverVisible = false" size="cover" :showBackdrop="false">
              <ion-row>
                <ion-col size="12" v-for="i in 7" :key="i" @click="selectedLevel(i - 1)">
                  <p 
                    :class="level == i - 1 ? 'selected' : 'unSelected'"
                  >
                    {{ getSubordinateLevel(i-1) }}
                  </p>
                </ion-col>
              </ion-row>
            </ion-popover>
          </div>
          <!-- 日期筛选 -->
          <div class="date px-[0.4375rem]">
            <span>{{ $t('activity.selectDate') }}:</span>
            <div class="timeChoose" id="popover-trigger-left">
              <div>{{ timeStart }} </div>
              <ion-icon icon="/svg/spread/calendar.svg" />
            </div>
          </div>
        </div>
        <!-- 下级总数据信息 -->
        <div class="subordinate-info">
          <div
            v-for="(item,index) in subordinateInfo" 
            :key="index" 
            class="subordinate-item text-center" 
            :class="{ 'subordinate-item-bottom': index >= 3 }"
          >
            <div class="sub-item-value" v-if="index <= 2">{{ item.value }}</div>
            <div class="sub-item-value" v-else>{{ formatMoneyToShow(item.value) }}</div>
            <div class="icon">
              <ion-icon v-if="item.icon"  :src="item.icon" />
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 根据ID查询下级数据 -->
        <div class="filter">
          <ion-searchbar 
             v-model="searchValue" id="search-agency"
            :placeholder="$t('mlmAgent.searchPlaceholder')" show-clear-button="never" mod="ios" @input="searchInput">
          </ion-searchbar>
          <ion-icon  icon="/svg/spread/find.svg" @click="searchHandle" />
        </div>
        <!-- 下级数据信息 -->
        <div class="perMes">
          <div 
            v-for='item in subordinateList' 
            :key='item.id'
            class="perCard"
          >
            <div
              class="line">
            </div>
            <div class="perImg">
              <img :src="item.avatar" class=" mx-auto w-[2.625rem] h-[2.625rem] mb-[0.625rem]" />
              <div class="idMes">
                <div class="idNum">
                  ID:{{ item.userId }}
                </div>
                <ion-icon src="/svg/spread/copyRight.svg" @click="copy(item.userId)" />
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
                <div class="left">
                  {{ formatMoneyToShow(item.betAmount) }}
                </div>
                <div class="right">
                  {{ formatToDateTime(item.registerTime) }}
                </div>
              </div>
              <div class="bottom">
                <div class="left">
                  {{ $t('activity.vip38') }}
                </div>
                <div class="right">
                  {{ $t('main.register') }} {{ $t('activity.time') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div class="empty" v-if="showEmpty">
          <div class="img">
            <Empty :text="$t('mlmAgent.noMoreDeta')" />
          </div>
        </div>
         <!-- 触底加载模块 -->
         <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite" v-else>
           <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
         </ion-infinite-scroll>
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
        @ionChange="dateChange" 
        color="rose" 
      />
    </ion-popover>
  </ion-page>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy';
import NavigationBar from '@/components/NavigationBar/index.vue'
import { formatToDateTime } from '@/utils/date.ts'
import { formatMoneyToShow } from '@/utils/custom'
import { useCommissionDetailSpread } from '@/views/mlmAgent/hooks/subordinateInfoSpread'
import { IonPopover, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonDatetime, IonHeader, IonPage, IonRow, IonCol, IonGrid, IonContent, IonSearchbar, IonImg, IonTitle, IonToolbar, IonSelect, IonSelectOption } from '@ionic/vue';
import BackButton from '@/components/BackButton.vue';
import Empty from '@/components/Empty/index.vue'

const {
  timeStart,
  level,
  dateValueTime,
  minDate,
  maxDate,
  searchValue,
  levelPopoverVisible,
  showPopover,
  infiniteRef,
  loadMore,
  subordinateInfo,
  subordinateList,
  showEmpty,
  locale,
  popoverDismiss,
  dateChange,
  searchHandle,
  dateSelectHandle,
  getSubordinateLevel,
  selectedLevel,
  ionInfinite,
  searchInput
} = useCommissionDetailSpread();
</script>

<style scoped lang="less">
@import '@/views/mlmAgent/styles/SubordinateInfo/base-index.less';
@import '@/views/mlmAgent/styles/SubordinateInfo/theme-style.less';

#mlmAgent-components-subordinateInfo-index.style();

.yellow-dark,
.green-dark,
.purple-light,
.amber-purple,
.blue-default,
.forest-green,
.green-default,
.auroral-yellow {
  #mlmAgent-components-subordinateInfo-index.style(
    --mlm-color-text-basic,
    --mlm-agent-date-bg-color,
    --mlm-selected-text-color,
    --mlm-select-icon-text-color,
    --mlm-agent-date-bg-color,
    --mlm-subdetail-item-name-color,
    --mlm-select-icon-text-color,
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
    --color-bg-commission-third,
    --color-primary-800,
    --agent-btn-color,
    --mlm-searchbar-placeholder-color,
    --activity-record-selected-item-bg,
    --mlm-selected-text-color,
    --activity-record-select-item-bg,
    --activity-record-select-item-color,
    --color-bg-commission-second,
    --color-bg-commission-third,
    --mlm-subdetail-item-name-color,
    --color-text-basic,
    --mlm-subordinate-money-text-color,
    --color-text-40
  );
}

.auroral-yellow {
  #mlmAgent-components-subordinateInfo-index.style(
    @mlmAgent-components-subordinateInfo-index-26: --theme-color-800;
    @mlmAgent-components-subordinateInfo-index-27: --color-text-black-100;
    @mlmAgent-components-subordinateInfo-index-29: --color-text-gray-200;
    @mlmAgent-components-subordinateInfo-index-23: --theme-color-800;
    @mlmAgent-components-subordinateInfo-index-06: --color-text-gray-200;
    @mlmAgent-components-subordinateInfo-index-34: --color-text-gray-200;
    @mlmAgent-components-subordinateInfo-index-08: --color-bg-400;
    @mlmAgent-components-subordinateInfo-index-11: --color-bg-400;
    @mlmAgent-components-subordinateInfo-index-13: --theme-color-800
  )
}

.new-skin-symbol {
  #mlmAgent-components-subordinateInfo-index.style(
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-default,
    --ep-color-icon-weaker,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-weaker,
    --ep-color-icon-weaker,
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
    --ep-color-text-weaker,
    --ep-color-background-fill-surface-raised-L2,
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-weaker,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-background-fill-body-default,
    --ep-color-text-weaker,
    --ep-color-text-highlight-white,
    --ep-color-icon-warning,
    --ep-color-text-weaker,
    --ep-color-text-default
  );
}

.new-skin-symbol {
  @import '@/views/mlmAgent/styles/SubordinateInfo/index-phantom.less';
}
</style>
