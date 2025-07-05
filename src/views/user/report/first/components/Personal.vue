<!-- 个人报表 -->
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
          <ion-popover mode="md" trigger="personal-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
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
          <ion-popover mode="md" trigger="personal-trigger" :isOpen="typePopoverVisible" @didDismiss="dismissHandle" size="cover">
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
          <ion-popover mode="md" trigger="personal-trigger" :isOpen="platformPopoverVisible" @didDismiss="dismissHandle" size="cover">
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
          <ion-popover mode="md" trigger="personal-trigger" :isOpen="gamePopoverVisible" @didDismiss="dismissHandle" size="cover">
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
      <div id="personal-trigger" class="w-full bg-white"/>
    </div>
    <!-- 列表内容 -->
    <ion-content class="flex-1">
      <div class="item mb-2.5 report-recoed-item" v-for="item in userDayProfitList" :key="item.id">
        <div class="mb-[0.5rem] report-skin-record-item-top">
          {{ item.platformName }} {{ $t(`sort.${item.gameType}`) }}
          <span style="opacity:0.2;" class="mx-[0.125rem]">|</span>
          {{ item.gameName }}
        </div>
        <div class="flex-between mb-1.5 record-item-bottom">
          <p>
            {{ $t('label.bettingcounts') }}:
            <span class="report-personal-skin-height-text">{{ item.gameRounds }}</span>
          </p>
          <p>{{ item.dayDate }}</p>
        </div>
        <div class="flex-between small-text-white">
          <p class="record-item-bottom">
            {{ $t('label.bettings') }}:
            <span class="report-personal-skin-height-text">{{ convertMoneyToShow(item.validBetAmount) }} </span>
          </p>
          <p :class="item.profitAmount ? (item.profitAmount < 0 ? 'report-skin-text-danger' : 'report-skin-text-success') : 'report-skin-text-waring'">
            <span class="record-item-bottom">{{ $t('label.totalwinorloss') }}: </span>
            <span class="font-weight-bold"> {{ (item.profitAmount && item.profitAmount > 0) ? '+' : '' }}{{ item.profitAmount && convertMoneyToShow(item.profitAmount) }}</span>
          </p>
        </div>
      </div>
      <!-- 空列表提示 -->
      <div class="flex-center h-full" v-if="showEmpty">
        <Empty />
      </div>
      <!-- 触底加载模块 -->
      <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content v-if="userDayProfitList.length" :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''" :loading-spinner="loadMore == 'more' ? 'bubbles' : null"/>
      </ion-infinite-scroll>
    </ion-content>
    <!-- 底部统计模块 -->
    <ion-row class="px-[1rem] py-[0.53125rem] footer-count">
      <ion-col size="12" style="padding:0;">
        <div class="content-flex">
          <span class="report-skin-footer-tips">{{ $t('label.accumulatedbets') }}：</span>
          <span class="font-weight-medium">{{ userProfitInfo?.totalGameRounds }}</span>
        </div>
        <div class="content-flex">
          <span class="report-skin-footer-tips">{{ $t('activity.cumulativeValidBet') }}：</span>
          <span class="font-weight-medium">{{ formatMoneyToShow(userProfitInfo?.totalValidBetAmount) }}</span>
        </div>
        <div class="content-flex">
          <span class="report-skin-footer-tips">{{ $t('label.cumulativewinLoss') }}：</span>
          <span class="font-weight-medium" :class="{'report-skin-text-danger': userProfitInfo?.totalProfitAmount < 0,'report-skin-text-success': userProfitInfo?.totalProfitAmount > 0,'report-skin-text-waring': userProfitInfo?.totalProfitAmount == 0 }">
            {{ `${userProfitInfo?.totalProfitAmount > 0 ? '+' : ''}${formatMoneyToShow(userProfitInfo?.totalProfitAmount)}` }}
          </span>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { caretDown } from 'ionicons/icons';
import { formatMoneyToShow, convertMoneyToShow } from '@/utils/custom'
import { usePersonalLogic } from '@/views/user/report/hooks/personalLogic'
import { IonContent, IonRow, IonCol, IonImg, IonIcon, IonLabel, IonButton, IonInfiniteScroll, IonPopover, IonSpinner, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/vue';
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
  userProfitInfo,
  games,
  scrollSelectionRef,
  userDayProfitList,
  userProfitParams,
  gameParams,
  gameTypes,
  gamePlatforms,
  isToken,
  showEmpty,
  changeTime,
  timePopoverVisible,
  currentTimeList,
  timeSelectHandle,
  selectedTime,
  typeSelectHandle,
  getTypeName,
  selectedType,
  platformSelectHandle,
  getPlatformName,
  selectedPlatform,
  gameSelectHandle,
  getGameName,
  selectedGame,
  dismissHandle,
  ionInfinite,
} = usePersonalLogic();

</script>

<style scoped lang="less">
ion-content {
  --padding-start: 1rem;
  --padding-end: 1rem;
  --background: var(--color-bg-300);
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

ion-row.footer-count {
  border-top: 1px solid var(--report-select-item-border-color);
  background: var(--report-select-bg);
  font-size: 0.875rem;
  line-height: 1.3125rem;
  color: var(--color-text-100);
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

.content-flex {
  display: flex;
  justify-content: space-between;
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
  font-size: var(--font-size-12);
  line-height: 1.125rem;
  color: var(--my-card-detail-color);
}

.report-personal-skin-height-text {
  color: var(--color-text-100);
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

.report-skin-footer-tips {
  color: var(--color-text-80)
}


.new-skin-symbol {
  @import '@/views/user/report/first/styles/Personal/theme-style.less';
}
</style>
