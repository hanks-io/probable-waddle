<!-- 投注记录 -->
<template>
  <div class="h-full flex flex-col">
    <!-- 顶部筛选模块 -->
    <div class="py-[0.625rem] px-[0.75rem] mt-[0.375rem]">
      <div ref="scrollSelectionRef" class="flex select-scroll overflow-x-auto">
        <!-- 时间选择器 -->
        <div v-if="currentTimeList.length" class="mr-2.5 select-box h-[2rem] px-[0.625rem]" @click="timeSelectHandle">
          <div class="report-selected mr-[0.5rem]">{{ $t(`date.${changeTime}`) }}</div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="timePopoverVisible ? 'on' : ''"/>
          <!-- 时间下拉选择弹窗层 -->
          <ion-popover mode="md" trigger="betting-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] report-skin-select-row mt-[0.625rem]">
              <ion-col size="4" class="select-col" :class="item.isTrue ? 'lang-col' : ''" v-for="item in currentTimeList" :key="item.value" @click="selectedTime(item.name)">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="changeTime == item.name ? 'report-selected-item' : 'report-select-item'">{{ $t(`date.${item.name}`) }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 游戏类型选择 -->
        <div class="mr-2.5 select-box h-[2rem] px-[0.625rem]" @click="typeSelectHandle">
          <div class="report-selected mr-[0.5rem]">{{ getTypeName(gameType) }}</div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="typePopoverVisible ? 'on' : ''"/>
          <!-- 游戏类型选择弹出层 -->
          <ion-popover mode="md" trigger="betting-trigger" :isOpen="typePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] report-skin-select-row mt-[0.625rem]">
              <ion-col size="4" class="select-col" @click="selectedType('all')">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="gameType == 'all' ? 'report-selected-item' : 'report-select-item'">{{ $t(`option.all`) }}</p>
              </ion-col>
              <ion-col size="4" class="select-col" v-for="item in gameTypes" :key="item" @click="selectedType(item)">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="gameType == item ? 'report-selected-item' : 'report-select-item'">{{ $t(`sort.${item}`) }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 游戏平台选择器 -->
        <div class="mr-2.5 select-box h-[2rem] px-[0.625rem]" @click="platformSelectHandle">
          <div class="report-selected mr-[0.5rem]">{{ getPlatformName(platformId) }}</div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="platformPopoverVisible ? 'on' : ''"/>
          <!-- 平台选择弹出层 -->
          <ion-popover mode="md" trigger="betting-trigger" :isOpen="platformPopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] report-skin-select-row mt-[0.625rem]">
              <ion-col size="4" class="select-col" @click="selectedPlatform(0)">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="platformId == 0 ? 'report-selected-item' : 'report-select-item'">{{ $t(`option.allPlatform`) }}</p>
              </ion-col>
              <ion-col 
                size="4" 
                class="select-col" 
                :class="item.isTrue ? 'lang-col' : ''" 
                v-for="item in gamePlatforms" 
                :key="item.platformId" 
                @click="selectedPlatform(item.platformId)"
              >
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="platformId == item.platformId ? 'report-selected-item' : 'report-select-item'">{{ item.platformName }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 游戏选择器 -->
        <div class="mr-2.5 select-box h-[2rem] px-[0.625rem]" @click="gameSelectHandle">
          <div class="report-selected mr-[0.5rem] flexBox">
            <ion-spinner class="w-4 h-4" style="margin-inline-end: .125rem" name="circles" slot="start" v-if="loading"/>
            <p>{{ getGameName(gameId) }}</p>
          </div>
          <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]" :class="gamePopoverVisible ? 'on' : ''"/>
          <!-- 游戏选择弹出层 -->
          <ion-popover mode="md" trigger="betting-trigger" :isOpen="gamePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="p-[0.75rem] report-skin-select-row mt-[0.625rem]">
              <ion-col size="4" class="select-col" @click="selectedGame(0)">
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="gameId == 0 ? 'report-selected-item' : 'report-select-item'">{{ $t(`option.allGame`) }}</p>
              </ion-col>
              <ion-col 
                size="4" 
                class="select-col"  
                :class="item.isTrue ? 'lang-col' : ''"
                v-for="item in games" 
                :key="item.id" 
                @click="selectedGame(item.id)"
              >
                <p class="flex-center h-[2.5rem] px-1 rounded-md" :class="gameId == item.id ? 'report-selected-item' : 'report-select-item'">{{ item.name }}</p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
      </div>
      <!-- 弹出层参照 -->
      <div id="betting-trigger" class="w-full"/>
    </div>
    <!-- 列表内容 -->
    <ion-content class="flex-1">
      <div class="item mb-[0.875rem] report-recoed-item" v-for="item in gameRecordList" :key="item.id">
        <div class="flex-between mb-1.5 report-skin-record-item-top">
          <p>
            {{ item.platformName }} {{ $t(`sort.${item.gameType}`) }}
            <span style="opacity:0.2;" class="mx-[0.125rem]">|</span>
            {{ item.gameName }}
          </p>
          <p class="font-weight-bold" :class="item.profitAmount ?  (item.profitAmount < 0 ? 'report-skin-text-danger' : 'report-skin-text-success') : ''">
            {{ item.profitAmount && item.profitAmount > 0 ? '+' : '' }}{{ item.profitAmount && convertMoneyToShow(item.profitAmount) }}
          </p>
        </div>
        <div class="mb-[0.25rem] record-item-bottom">
          {{formatToDateTime(item.createTime) }}
        </div>
        <div class="flex-between">
          <div class="flexBox record-item-bottom">
            <p>{{ item.roundNo }}</p>
            <ion-icon class="ml-[0.3125rem]" src="/first/svg/record-copy.svg" @click="copy(item.roundNo!)"/>
          </div>
          <p class="font-weight-medium" :class="item.status == 'SETTLED' ? 'report-skin-text-success' : item.status == 'UNSETTLED' ? '' : 'report-skin-text-danger'">
            {{ $t(`status.${item.status}`) }}
          </p>
        </div>
      </div>
      <!-- 空列表提示 -->
      <div class="flex-center empty-box" v-if="showEmpty">
        <Empty />
      </div>
      <!-- 触底加载模块 -->
      <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite" threshold="0px">
        <ion-infinite-scroll-content v-if="gameRecordList.length" :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
      </ion-infinite-scroll>
    </ion-content>
  </div>
</template>

<script setup lang="ts">
import { copy } from '@/hooks/Copy';
import { caretDown } from 'ionicons/icons';
import { formatToDateTime } from '@/utils/date';
import { convertMoneyToShow } from '@/utils/custom';
import { useBettingLogic } from '@/views/user/report/hooks/bettingLogic'
import { IonContent, IonPopover, IonIcon, IonButton, IonRow, IonCol, IonImg, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner } from '@ionic/vue';
import Empty from '@/components/Empty/index.vue'

const {
  gameId,
  dateIndex,
  platformId,
  infiniteRef,
  loading,
  gameType,
  loadMore,
  gameTypeChange,
  gamePlatformChange,
  typePopoverVisible,
  gamePopoverVisible,
  platformPopoverVisible,
  games,
  scrollSelectionRef,
  gameRecordList,
  gameRecordParams,
  gameParams,
  gameTypes,
  gamePlatforms,
  isToken,
  showEmpty,
  changeTime,
  currentTimeList,
  timePopoverVisible,
  timeSelectHandle,
  selectedTime,
  dismissHandle,
  typeSelectHandle,
  getTypeName,
  selectedType,
  platformSelectHandle,
  getPlatformName,
  selectedPlatform,
  gameSelectHandle,
  getGameName,
  selectedGame,
  ionInfinite
} = useBettingLogic();

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
  font-size: var(--font-size-12);
  color: var(--color-text-40);
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

.empty-box {
  height: calc(100% - 4.875rem);
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

.record-item-bottom {
  font-size: .75rem;
  line-height: 1.125rem;
  color: var(--my-card-detail-color);
  ion-icon {
    font-size: 1.125rem;
    color: var(--my-card-detail-color);
  }
}

.report-skin-record-item-top{
  color: var(--color-text-100);
  font-size: 0.875rem;
  line-height: 1.3125rem;
  font-weight: 500;
}

.report-skin-text-success {
  color: var(--color-success);
}

.report-skin-text-danger {
  color: var(--color-danger);
}

.new-skin-symbol {
  @import '@/views/user/report/first/styles/Betting/theme-style.less';
}
</style>
