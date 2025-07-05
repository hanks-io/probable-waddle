<!-- 投注记录 -->
<template>
  <div class="bet">
    <!-- 顶部筛选模块 -->
    <div class="top">
      <div ref="scrollSelectionRef" class="select-scroll">
        <!-- 时间选择 -->
        <div 
          v-if="currentTimeList.length"
          class="filter"
          :class="timePopoverVisible ? 'selected' : 'betting-select-default'"
          @click="timeSelectHandle"
        >
          <div class="typeName">{{ $t(`date.${changeTime}`) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="timePopoverVisible ? 'on' : ''" />
          <ion-popover mode="md" trigger="betting-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
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
        <!-- 游戏类型选择 -->
        <div
          class="filter"
          :class="typePopoverVisible ? 'selected' : 'betting-select-default'"
          @click="typeSelectHandle"
        >
          <div class="typeName">{{ getTypeName(gameType) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="typePopoverVisible ? 'on' : ''" />
          <!-- 游戏类型选择弹出层 -->
          <ion-popover mode="md" trigger="betting-trigger" :isOpen="typePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="report-select-row">
              <ion-col size="3" class="select-col" @click="selectedType('all')">
                <p
                  :class="gameType == 'all' ? 'on' : 'off'"
                >
                  {{ $t(`option.all`) }}
                </p>
              </ion-col>
              <ion-col size="3" class="select-col" v-for="item in gameTypes" :key="item" @click="selectedType(item)">
                <p
                  :class="gameType == item ? 'on' : 'off'"
                >
                  {{ $t(`sort.${item}`) }}
                </p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 游戏平台选择器 -->
        <div
          class="filter"
          :class="platformPopoverVisible ? 'selected' : 'betting-select-default'"
          @click="platformSelectHandle"
        >
          <div class="typeName">{{ getPlatformName(platformId) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="platformPopoverVisible ? 'on' : ''" />
          <!-- 平台选择弹出层 -->
          <ion-popover mode="md" trigger="betting-trigger" :isOpen="platformPopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="report-select-row">
              <ion-col size="3" class="select-col" @click="selectedPlatform(0)">
                <p
                  :class="platformId == 0 ? 'on' : 'off'"
                >
                  {{ $t(`option.allPlatform`) }}
                </p>
              </ion-col>
              <ion-col
                size="3"
                class="select-col"
                :class="item.isTrue ? 'lang-col' : ''"
                v-for="item in gamePlatforms"
                :key="item.platformId"
                @click="selectedPlatform(item.platformId)"
              >
                <p
                  :class="platformId == item.platformId ? 'on' : 'off'"
                >
                  {{ item.platformName }}
                </p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
        <!-- 游戏选择器 -->
        <div
          class="filter"
          :class="gamePopoverVisible ? 'selected' : 'betting-select-default'"
          @click="gameSelectHandle"
        >
          <div class="typeName">
            <ion-spinner name="circles" slot="start" v-if="loading" />
            <p>{{ getGameName(gameId) }}</p>
          </div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="gamePopoverVisible ? 'on' : ''" />
          <!-- 游戏选择弹出层 -->
          <ion-popover mode="md" trigger="betting-trigger" :isOpen="gamePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="report-select-row">
              <ion-col size="3" class="select-col" @click="selectedGame(0)">
                <p  :class="gameId == 0 ? 'on' : 'off'">
                  {{ $t(`option.allGame`) }}
                </p>
              </ion-col>
              <ion-col size="3" class="select-col" :class="item.isTrue ? 'lang-col' : ''" v-for="item in games" :key="item.id" @click="selectedGame(item.id)">
                <p
                  :class="gameId == item.id ? 'on' : 'off'"
                >
                  {{ item.name }}
                </p>
              </ion-col>
            </ion-row>
          </ion-popover>
        </div>
      </div>
      <!-- 弹出层参照 -->
      <div id="betting-trigger" class="w-full" />
    </div>
    <!-- 列表内容 -->
    <ion-content class="list">
      <div class="item default-report-recond-item" v-for="item in gameRecordList" :key="item.id">
        <div class="num">
          <p class="recond-white-color">{{ item.platformName }} {{ $t(`sort.${item.gameType}`) }}</p>
          <p :class="item.profitAmount ? (item.profitAmount < 0 ? 'red' : 'green') : 'recond-white-color'">
            {{ item.profitAmount && item.profitAmount > 0 ? "+" : "" }}{{ item.profitAmount && convertMoneyToShow(item.profitAmount) }}
          </p>
        </div>
        <div class="num">
          <p class="recond-white-color">{{ item.gameName }}</p>
          <p :class="item.status == 'SETTLED' ? 'green' : item.status == 'UNSETTLED' ? '' : 'red'">{{ $t(`status.${item.status}`) }}</p>
        </div>
        <div class="recond-minor-color">
          <p>{{ formatToDateTime(item.createTime) }}</p>
          <div class="copy">
            <p>{{ item.roundNo }}</p>
            <ion-icon src="/svg/report-copy.svg" @click="copy(item.roundNo!)" />
          </div>
        </div>
      </div>
      <!-- 空列表提示 -->
      <div class="empty empty-box" v-if="showEmpty">
        <div class="empty-bg-img"></div>
        <ion-label>{{ $t("label.noRecord") }}</ion-label>
      </div>
      <!-- 触底加载模块 -->
      <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite" threshold="0px">
        <ion-infinite-scroll-content
          v-if="gameRecordList.length"
          :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
          :loading-spinner="loadMore == 'more' ? 'bubbles' : null"
        />
      </ion-infinite-scroll>
    </ion-content>
  </div>
</template>

<script setup lang="ts">
import { copy } from "@/hooks/Copy";
import { caretDown } from "ionicons/icons";
import { formatToDateTime } from "@/utils/date";
import { convertMoneyToShow } from "@/utils/custom";
import { useBettingLogic } from "@/views/user/report/hooks/bettingLogic";
import { IonContent, IonPopover, IonIcon, IonRow, IonCol, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner } from "@ionic/vue";

const {
  gameId,
  platformId,
  infiniteRef,
  loading,
  gameType,
  loadMore,
  typePopoverVisible,
  gamePopoverVisible,
  platformPopoverVisible,
  games,
  scrollSelectionRef,
  gameRecordList,
  gameTypes,
  gamePlatforms,
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
  ionInfinite,
} = useBettingLogic();
</script>

<style scoped lang="less">
@import '@/views/user/report/default/styles/Betting/index-base.less' ;
@import '@/views/user/report/default/styles/Betting/theme-style.less' ;
#tabbar-user-report-default-betting.style();
.blue-default {
  #tabbar-user-report-default-betting.style();
}
.green-default {
  #tabbar-user-report-default-betting.style(
    --color-text-gray-100,
    --color-line,
    --color-line,
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
  #tabbar-user-report-default-betting.style(
    --color-text-gray-100,
    --color-line,
    --color-line,
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

.forest-green {
  #tabbar-user-report-default-betting.style(
    --color-text-gray-100,
    --color-line,
    --color-bg-100,
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
  #tabbar-user-report-default-betting.style(
    @Betting06: --theme-color-800, 
    @Betting07: --color-text-black-100, 
  );
}
</style>
