<!-- 其他账变 -->
<template>
  <div class="h-full flex flex-col">
    <!-- 顶部筛选模块 -->
    <div class="py-[0.625rem] px-[0.75rem] mt-[0.375rem]">
      <div ref="scrollSelectionRef" class="flex select-scroll overflow-x-auto">
        <!-- 时间选择 -->
        <div v-if="currentTimeList.length" class="mr-2.5 flexBox select-box rounded-small h-[2rem] px-[0.625rem]" @click="timeSelectHandle">
          <div class="report-selected mr-[0.5rem]">{{ $t(`date.${changeTime}`) }}</div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="timePopoverVisible ? 'on' : ''"/>
          <!-- 时间下拉选择弹出层 -->
          <ion-popover mode="md" trigger="statement-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] text-xs rounded-middle mt-[0.625rem] text-center">
              <ion-col size="4" class="select-col" :class="item.isTrue ? 'lang-col' : ''" v-for="item in currentTimeList" :key="item.value" @click="selectedTime(item.name)">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="changeTime == item.name ? 'report-selected-item' : 'report-select-item'">{{ $t(`date.${item.name}`) }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 帐变类型子类选择 -->
        <div class="mr-2.5 flexBox select-box rounded-small h-[2rem] px-[0.625rem]" @click="subSelectHandle">
          <div class="report-selected mr-[0.5rem]">{{ getSubName(changeTwoType) }}</div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="subPopoverVisible ? 'on' : ''"/>
          <!-- 游戏类型选择弹出层 -->
          <ion-popover mode="md" trigger="statement-trigger" :isOpen="subPopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] text-xs rounded-middle mt-[0.625rem] text-center">
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
        <div class="flex-between mb-[0.5rem] middle-text-white font-weight-medium">
          <p class="change-two-type">{{ $t(`option.${item.changeTwoType}`) }}</p>
          <p 
            class="font-weight-bold"
            :class="item.amountChange ? ((['withdraw:complete', 'withdraw:confiscation'].includes(item.changeTwoType) || item.amountChange < 0) ? 'color-danger' : 'primary-800') : 'color-text-currency'"
          >
            {{ (item.amountChange > 0 ? '+' : '') }}{{ convertMoneyToShow(item.amountChange) }}
          </p>
        </div>
        <div class="flex-between small-text-white record-item-bottom">
          <p>{{ formatToDateTime(item.createTime) }}</p>
          <div class="flex items-center">
            <p class="w-40 line-clamp-1 text-right">{{ item.externalRelated }}</p>
            <ion-icon v-if="item.externalRelated" class="ml-[0.3125rem] text-[1.125rem]" src="/first/svg/record-copy.svg" @click="copy(item.externalRelated)"/>
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
  </div>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy';
import { caretDown } from 'ionicons/icons';
import { formatToDateTime } from '@/utils/date';
import { formatMoneyToShow, convertMoneyToShow } from '@/utils/custom'
import { useOtherLogic } from '@/views/user/report/hooks/otherLogic'
import { IonContent, IonRow, IonCol, IonIcon, IonImg, IonPopover, IonButton, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/vue';
import Empty from '@/components/Empty/index.vue'

const {
  dateIndex,
  infiniteRef,
  loadMore,
  changeTwoType,
  subPopoverVisible,
  scrollSelectionRef,
  assetsChangeList,
  assetsChangeParams,
  changeSubTypes,
  isToken,
  showEmpty,
  changeTime,
  currentTimeList,
  timePopoverVisible,
  timeSelectHandle,
  selectedTime,
  subSelectHandle,
  getSubName,
  selectedSub,
  dismissHandle,
  ionInfinite,
} = useOtherLogic();

</script>

<style scoped lang="less">
ion-content {
  --background: var(--color-bg-300);
  --padding-start: 1rem;
  --padding-end: 1rem;
}

ion-select {
  --padding-start: 14px;
  --padding-end: 10px;
  --border-color: white;
  --border-radius: 10px;
  --border-width: 1px;
  min-height: 26px;
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
  font-size: var(--font-size-12);
  color: #686299;
}

ion-row.footer-count {
  border-top: 1px solid var(--report-select-item-border-color);
  background: var(--color-bg-100);
  .footer-count-title {
    color: #BDB8E1;
  }
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

.primary-800 {
  color: var(--color-success);
}

.select-box {
  background: var(--report-select-bg);
  border: 1px solid #5F588C;
  ion-icon {
    color: var(--color-report-select-icon);
  }
}

.record-item-bottom {
  color: var(--my-card-detail-color);
  ion-icon {
    color: var(--my-card-detail-color);
  }
}

.report-selected-item {
  border: 1px solid var(--report-select-item-border-color);
}

.change-two-type {
  color: #BDB8E1;
}
</style>
