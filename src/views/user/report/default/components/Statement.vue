<!-- 账户明细 -->
<template>
  <div class="statement">
    <!-- 顶部筛选模块 -->
    <div class="top">
      <div ref="scrollSelectionRef" class="select-scroll">
        <!-- 时间筛选 -->
        <div 
          v-if="currentTimeList.length"
          class="filter"
          :class="timePopoverVisible ? 'selected' : 'statement-select-default'"
          @click="timeSelectHandle"
        >
          <div class="typeName">{{ $t(`date.${changeTime}`) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="timePopoverVisible ? 'on' : ''" />
          <ion-popover mode="md" trigger="statement-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="report-select-row">
              <ion-col
                size="3"
                class="select-col"
                :class="item.isTrue ? 'lang-col' : ''"
                v-for="item in currentTimeList"
                :key="item.value"
                @click="selectedTime(item.name)"
              >
                <p
                  :class="changeTime == item.name ? 'on' : 'off'"
                >
                  {{ $t(`date.${item.name}`) }}
                </p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 帐变类型选择 -->
        <div
          class="filter"
          :class="typePopoverVisible ? 'selected' : 'statement-select-default'"
          @click="typeSelectHandle"
        >
          <div class="typeName">{{ getTypeName(changeType) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="typePopoverVisible ? 'on' : ''" />
          <!-- 游戏类型选择弹出层 -->
          <ion-popover mode="md" trigger="statement-trigger" :isOpen="typePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="report-select-row">
              <ion-col size="3" class="select-col" @click="selectedType('all')">
                <p
                  :class="changeType == 'all' ? 'on' : 'off'"
                >
                  {{ $t(`option.all`) }}
                </p>
              </ion-col>
              <ion-col
                size="3"
                class="select-col"
                :class="item.isTrue ? 'lang-col' : ''"
                v-for="item in changeMainTypes"
                :key="item.type"
                @click="selectedType(item.type)"
              >
                <p
                  :class="changeType == item.type ? 'on' : 'off'"
                >
                  {{ $t(`option.${item.type}`) }}
                </p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 帐变类型子类选择 -->
        <div
          class="filter"
          :class="subPopoverVisible ? 'selected' : 'statement-select-default'"
          @click="subSelectHandle"
        >
          <div class="typeName">{{ getSubName(changeTwoType) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="subPopoverVisible ? 'on' : ''" />
          <!-- 游戏类型选择弹出层 -->
          <ion-popover mode="md" trigger="statement-trigger" :isOpen="subPopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="report-select-row">
              <ion-col size="3" class="select-col" @click="selectedSub('allDetails')">
                <p
                  :class="changeTwoType == 'allDetails' ? 'on' : 'off'"
                >
                  {{ $t(`option.allDetails`) }}
                </p>
              </ion-col>
              <ion-col
                size="3"
                class="select-col"
                :class="item.isTrue ? 'lang-col' : ''"
                v-for="item in changeSubTypes"
                :key="item.type"
                @click="selectedSub(item.type)"
              >
                <p
                  :class="changeTwoType == item.type ? 'on' : 'off'"
                >
                  {{ $t(`option.${item.type}`) }}
                </p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
      </div>
      <!-- 弹出层参照 -->
      <div id="statement-trigger" />
    </div>
    <!-- 列表内容 -->
    <ion-content class="list">
      <div class="item" v-for="item in assetsChangeList" :key="item.id">
        <div class="num">
          <p class="recond-white-color">{{ $t(`option.${item.changeTwoType}`) }}</p>
          <p
            :class="
              item.amountChange
                ? ['withdraw:complete', 'withdraw:confiscation'].includes(item.changeTwoType) || item.amountChange < 0
                  ? 'red'
                  : 'green'
                : 'money-text'
            "
          >
            {{ item.amountChange > 0 ? "+" : "" }}{{ convertMoneyToShow(item.amountChange) }}
          </p>
        </div>
        <div class="recond-minor-color">
          <p>{{ formatToDateTime(item.createTime) }}</p>
          <div class="copy">
            <p>{{ item.externalRelated }}</p>
            <ion-icon v-if="item.externalRelated"  src="/svg/report-copy.svg" @click="copy(item.externalRelated)" />
          </div>
        </div>
      </div>
      <!-- 空列表提示 -->
      <div class="empty" v-if="showEmpty">
        <div class="empty-bg-img"></div>
        <ion-label>{{ $t("label.noRecord") }}</ion-label>
      </div>
      <!-- 触底加载模块 -->
      <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content
          v-if="assetsChangeList.length"
          :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
          :loading-spinner="loadMore == 'more' ? 'bubbles' : null"
        />
      </ion-infinite-scroll>
    </ion-content>
    <!-- 底部统计模块 -->
    <ion-row class="footer-count">
      <ion-col size="12">
        <div class="content-flex">
          <span>{{ $t("label.accumulatedRecharge") }}：</span>
          <span>
            {{ formatMoneyToShow(assetsChangeInfo?.totalRechargeAmountChange) }}
          </span>
        </div>
        <div class="content-flex">
          <span>{{ $t("label.accumulatedWithdraw") }}：</span>
          <span>
            {{ formatMoneyToShow(assetsChangeInfo?.totalWithdrawAmountChange) }}
          </span>
        </div>
        <div class="content-flex">
          <span>{{ $t("label.accumulateddiscountscollected") }}：</span>
          <span class="money-text">
            {{ formatMoneyToShow(assetsChangeInfo?.totalRewardAmountChange) }}
          </span>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { copy } from "@/hooks/Copy";
import { caretDown } from "ionicons/icons";
import { formatToDateTime } from "@/utils/date";
import { formatMoneyToShow, convertMoneyToShow } from "@/utils/custom";
import { useStatementLogic } from "@/views/user/report/hooks/statementLogic";
import { IonContent, IonRow, IonCol, IonIcon, IonPopover, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/vue";

const {
  infiniteRef,
  loadMore,
  changeType,
  changeTwoType,
  subPopoverVisible,
  typePopoverVisible,
  assetsChangeInfo,
  scrollSelectionRef,
  assetsChangeList,
  changeMainTypes,
  changeSubTypes,
  showEmpty,
  changeTime,
  currentTimeList,
  timePopoverVisible,
  timeSelectHandle,
  selectedTime,
  typeSelectHandle,
  getTypeName,
  selectedType,
  subSelectHandle,
  getSubName,
  selectedSub,
  dismissHandle,
  ionInfinite,
} = useStatementLogic();
</script>

<style scoped lang="less">
@import '@/views/user/report/default/styles/Statement/index-base.less' ;
@import '@/views/user/report/default/styles/Statement/theme-style.less' ;
#tabbar-user-report-default-statement.style();
.blue-default {
  #tabbar-user-report-default-statement.style();
}
.green-default {
  #tabbar-user-report-default-statement.style(
    --color-line,
    --color-text-gray-100,
    --color-line,
    --color-text-gray-100,
    --color-bg-200,
    --accent-color-yellow,
    --color-bg-50,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-line,
    --theme-color-gradient-100,
    --color-text-white-100,
    --color-text-gray-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200
  );
}
.amber-purple {
  #tabbar-user-report-default-statement.style(
    --color-text-gray-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-bg-200,
    --accent-color-orange-3,
    --color-bg-50,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --theme-color-gradient-100,
    --color-text-white-100,
    --color-text-gray-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200
  );
}
.forest-green {
  #tabbar-user-report-default-statement.style(
    --color-line,
    --color-text-gray-100,
    --color-bg-100,
    --color-text-gray-100,
    --color-bg-200,
    --accent-color-yellow,
    --color-bg-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-line,
    --theme-color-gradient-100,
    --color-text-white-100,
    --color-text-gray-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200
  );
}
.auroral-yellow {
  #tabbar-user-report-default-statement.style(
    @Statement07: --color-bg-200, 
    @Statement11: --theme-color-800, 
    @Statement12: --color-text-black-100, 
  );
}
</style>
