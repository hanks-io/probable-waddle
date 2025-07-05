<!-- 账户明细 -->
<template>
  <div class="h-full flex flex-col">
    <!-- 顶部筛选模块 -->
    <div class="py-[0.625rem] px-[0.75rem] mt-[0.375rem]">
      <div ref="scrollSelectionRef" class="flex select-scroll overflow-x-auto">
        <!-- 时间筛选 -->
        <div v-if="currentTimeList.length" class="mr-2.5 select-box h-[2rem] px-[0.625rem]" @click="timeSelectHandle">
          <div class="report-selected mr-[0.5rem]">{{ $t(`date.${changeTime}`) }}</div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="timePopoverVisible ? 'on' : ''"/>
          <!-- 时间下拉选择弹窗层 -->
          <ion-popover mode="md" trigger="statement-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] report-skin-select-row mt-[0.625rem]">
              <ion-col size="4" class="select-col" :class="item.isTrue ? 'lang-col' : ''" v-for="item in currentTimeList" :key="item.value" @click="selectedTime(item.name)">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="changeTime == item.name ? 'report-selected-item' : 'report-select-item'">{{ $t(`date.${item.name}`) }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 帐变类型选择 -->
        <div class="mr-2.5 select-box h-[2rem] px-[0.625rem]" @click="typeSelectHandle">
          <div class="report-selected mr-[0.5rem]">{{ getTypeName(changeType) }}</div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="typePopoverVisible ? 'on' : ''"/>
          <!-- 游戏类型选择弹出层 -->
          <ion-popover mode="md" trigger="statement-trigger" :isOpen="typePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] report-skin-select-row mt-[0.625rem]">
              <ion-col size="4" class="select-col" @click="selectedType('all')">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="changeType == 'all' ? 'report-selected-item' : 'report-select-item'">{{ $t(`option.all`) }}</p>
              </ion-col>
              <ion-col size="4" class="select-col" :class="item.isTrue ? 'lang-col' : ''" v-for="item in changeMainTypes" :key="item.type" @click="selectedType(item.type)">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="changeType == item.type ? 'report-selected-item' : 'report-select-item'">{{ $t(`option.${item.type}`) }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 帐变类型子类选择 -->
        <div class="select-box h-[2rem] px-[0.625rem]" @click="subSelectHandle">
          <div class="report-selected mr-[0.5rem]">{{ getSubName(changeTwoType) }}</div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="subPopoverVisible ? 'on' : ''"/>
          <!-- 游戏类型选择弹出层 -->
          <ion-popover mode="md" trigger="statement-trigger" :isOpen="subPopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] report-skin-select-row mt-[0.625rem]">
              <ion-col size="4" class="select-col" @click="selectedSub('allDetails')">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="changeTwoType == 'allDetails' ? 'report-selected-item' : 'report-select-item'">{{ $t(`option.allDetails`) }}</p>
              </ion-col>
              <ion-col size="4" class="select-col" :class="item.isTrue ? 'lang-col' : ''" v-for="item in changeSubTypes" :key="item.type" @click="selectedSub(item.type)">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="changeTwoType == item.type ? 'report-selected-item' : 'report-select-item'">{{ $t(`option.${item.type}`) }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
      </div>
      <!-- 弹出层参照 -->
      <div id="statement-trigger" class="w-full"/>
    </div>
    <!-- 列表内容 -->
    <ion-content class="flex-1">
      <div class="item mb-2.5 report-recoed-item" v-for="item in assetsChangeList" :key="item.id">
        <div class="flex-between mb-[0.5rem] report-skin-record-item-top">
          <p>{{ $t(`option.${item.changeTwoType}`) }}</p>
          <p 
            class="font-weight-bold"
            :class="item.amountChange ? ((['withdraw:complete', 'withdraw:confiscation'].includes(item.changeTwoType) || item.amountChange < 0) ? 'report-skin-text-danger' : 'report-skin-text-success') : 'report-skin-text-waring'"
          >
            {{ (item.amountChange > 0 ? '+' : '') }}{{ convertMoneyToShow(item.amountChange) }}
          </p>
        </div>
        <div class="flex-between record-item-bottom">
          <p>{{ formatToDateTime(item.createTime) }}</p>
          <div class="flex items-center">
            <p class="w-40 line-clamp-1 text-right">{{ item.externalRelated }}</p>
            <ion-icon v-if="item.externalRelated" class="ml-[0.3125rem]" src="/first/svg/record-copy.svg" @click="copy(item.externalRelated)"/>
          </div>
        </div>
      </div>
      <!-- 空列表提示 -->
      <div class="flex-center h-full" v-if="showEmpty">
        <Empty  />
      </div>
      <!-- 触底加载模块 -->
      <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content v-if="assetsChangeList.length" :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
      </ion-infinite-scroll>
    </ion-content>
    <!-- 底部统计模块 -->
    <ion-row class="px-[1rem] py-[0.53125rem] footer-count">
      <ion-col size="12" style="padding:0;">
        <div class="flex-between">
          <span class="report-skin-footer-tips">{{ $t('label.accumulatedRecharge') }}：</span>
          <span class="report-skin-text-success font-weight-medium">
            {{ formatMoneyToShow(assetsChangeInfo?.totalRechargeAmountChange)  }}
          </span>
        </div>
        <div class="flex-between">
          <span class="report-skin-footer-tips">{{ $t('label.accumulatedWithdraw') }}：</span>
          <span class="report-skin-text-danger font-weight-medium">
            {{ formatMoneyToShow(assetsChangeInfo?.totalWithdrawAmountChange) }}
          </span>
        </div>
        <div class="flex-between">
          <span class="report-skin-footer-tips">{{ $t('label.accumulateddiscountscollected') }}：</span>
          <span class="report-skin-text-waring font-weight-medium">
            {{ formatMoneyToShow(assetsChangeInfo?.totalRewardAmountChange) }}
          </span>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy';
import { caretDown } from 'ionicons/icons';
import { formatToDateTime } from '@/utils/date';
import { formatMoneyToShow, convertMoneyToShow } from '@/utils/custom'
import { useStatementLogic } from '@/views/user/report/hooks/statementLogic'
import { IonContent, IonRow, IonCol, IonIcon, IonImg, IonPopover, IonButton, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/vue';
import Empty from '@/components/Empty/index.vue'

const {
  dateIndex,
  infiniteRef,
  loadMore,
  changeType,
  changeTwoType,
  subPopoverVisible,
  typePopoverVisible,
  assetsChangeInfo,
  scrollSelectionRef,
  assetsChangeList,
  assetsChangeParams,
  changeMainTypes,
  changeSubTypes,
  isToken,
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
ion-content {
  --background: var(--color-bg-300);
  --padding-start: 1rem;
  --padding-end: 1rem;
}

div.select-scroll::-webkit-scrollbar {
  display: none;
}

:global(ion-radio::part(label)) { /* 下拉选项文本样式 */
  margin-inline: 0;
}

:global(ion-radio::part(container)) { /* 下拉选项后置内容样式 */
  width: 0;
}

ion-infinite-scroll-content {
  min-height: 10px;	/* 修改最小高度 */
  font-size: 0.75rem;
  color: var(--color-text-40);
}

ion-row.footer-count {
  border-top: 1px solid var(--report-select-item-border-color);
  background: var(--report-select-bg);
  font-size: 0.875rem;
  line-height: 1.3125rem;
  color: var(--color-text-100);
}

ion-popover {
  --backdrop-opacity: 0;
  --box-shadow: none;
  ion-row {
    background: var(--report-select-item-box-bg);
  }
}

ion-popover ion-button {
  margin-top: 0;
  margin-bottom: 0;
}

ion-popover ion-button::part(native) {
  --padding-start: .375rem;
  --padding-end: .375rem;
  --padding-top: 0;
  --padding-bottom: 0;
}

ion-icon {
  transition: transform .1s linear;
}

ion-icon.on {
  transform: rotate(180deg);
}

ion-col.select-col {
  line-height: 0.75rem;
  padding: 0 0.3125rem 0.3125rem 0;
}
ion-col.select-col:nth-child(3),
ion-col.select-col:nth-child(3n) {
  padding: 0 0 0.3125rem 0;
}
ion-col.lang-col {
  font-size: 0.5rem;
}

.select-box {
  background: var(--report-select-bg);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  ion-icon {
    color: var(--color-report-select-icon);
  }
}

ion-row.report-skin-select-row {
  border-radius: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
}

.report-skin-record-item-top{
  color: var(--color-text-100);
  font-size: 0.875rem;
  line-height: 1.3125rem;
  font-weight: 500;
}

.record-item-bottom {
  font-size: .75rem;
  line-height: 1.125rem;
  color: var(--my-card-detail-color);
  ion-icon {
    font-size: 1.125rem;
    color: var(--my-card-detail-color);
  }
}

.report-skin-footer-tips {
  color: var(--color-text-80)
}

.report-skin-text-success {
  color: var(--color-success);
}

.report-skin-text-danger {
  color: var(--color-danger);
}

.report-skin-text-waring {
  color: var(--color-currency);
}

.new-skin-symbol {
  @import '@/views/user/report/first/styles/Statement/theme-style.less';
}
</style>
