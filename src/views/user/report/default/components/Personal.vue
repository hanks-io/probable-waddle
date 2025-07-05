<!-- 个人报表 -->
<template>
  <div class="person">
    <!-- 顶部筛选模块 -->
    <div class="top">
      <div ref="scrollSelectionRef" class="select-scroll">
        <!-- 时间选择 -->
        <div 
          v-if="currentTimeList.length"
          class="filter"
          :class="timePopoverVisible ? 'selected' : 'personal-select-default'"
          @click="timeSelectHandle"
        >
          <div class="typeName">{{ $t(`date.${changeTime}`) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="timePopoverVisible ? 'on' : ''" />
          <ion-popover mode="md" trigger="personal-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
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
          :class="typePopoverVisible ? 'selected' : 'personal-select-default'"
          @click="typeSelectHandle"
        >
          <div class="typeName">{{ getTypeName(gameType) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="typePopoverVisible ? 'on' : ''" />
          <!-- 游戏类型选择弹出层 -->
          <ion-popover mode="md" trigger="personal-trigger" :isOpen="typePopoverVisible" @didDismiss="dismissHandle" size="cover">
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
          :class="platformPopoverVisible ? 'selected' : 'personal-select-default'"
          @click="platformSelectHandle"
        >
          <div class="typeName">{{ getPlatformName(platformId) }}</div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="platformPopoverVisible ? 'on' : ''" />
          <!-- 平台选择弹出层 -->
          <ion-popover mode="md" trigger="personal-trigger" :isOpen="platformPopoverVisible" @didDismiss="dismissHandle" size="cover">
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
          :class="gamePopoverVisible ? 'selected' : 'personal-select-default'"
          @click="gameSelectHandle"
        >
          <div class="typeName">
            <ion-spinner  name="circles" slot="start" v-if="loading" />
            <p>{{ getGameName(gameId) }}</p>
          </div>
          <ion-icon :icon="caretDown" class="report-select-icon" :class="gamePopoverVisible ? 'on' : ''" />
          <!-- 游戏选择弹出层 -->
          <ion-popover mode="md" trigger="personal-trigger" :isOpen="gamePopoverVisible" @didDismiss="dismissHandle" size="cover">
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
      <div id="personal-trigger" />
    </div>
    <!-- 列表内容 -->
    <ion-content class="list">
      <div class="item" v-for="item in userDayProfitList" :key="item.id">
        <div class="num recond-white-color">
          <p>{{ item.platformName }} {{ $t(`sort.${item.gameType}`) }}</p>
          <p>
            <span class="recond-minor-color">{{ $t("label.bettingcounts") }}：</span>{{ item.gameRounds }}
          </p>
        </div>
        <div class="num recond-white-color">
          <p>{{ item.gameName }}</p>
          <p>
            <span class="recond-minor-color">{{ $t("label.bettings") }}：</span>{{ convertMoneyToShow(item.validBetAmount) }}
          </p>
        </div>
        <div class="num last">
          <p class="recond-minor-color">{{ item.dayDate }}</p>
          <p :class="item.profitAmount ? (item.profitAmount < 0 ? 'red' : 'green') : 'money-text'">
            <span class="recond-minor-color">{{ $t("label.totalwinorloss") }}：</span>
            {{ item.profitAmount && item.profitAmount > 0 ? "+" : "" }}{{ item.profitAmount && convertMoneyToShow(item.profitAmount) }}
          </p>
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
          v-if="userDayProfitList.length"
          :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
          :loading-spinner="loadMore == 'more' ? 'bubbles' : null"
        />
      </ion-infinite-scroll>
    </ion-content>
    <!-- 底部统计模块 -->
    <ion-row class="footer-count">
      <ion-col size="12">
        <div class="content-flex">
          <span class="recond-white-color">{{ $t("label.accumulatedbets") }}：</span>
          <span>{{ userProfitInfo?.totalGameRounds }}</span>
        </div>
        <div class="content-flex">
          <span class="recond-white-color">{{ $t("activity.cumulativeValidBet") }}：</span>
          <span>{{ formatMoneyToShow(userProfitInfo?.totalValidBetAmount) }}</span>
        </div>
        <div class="content-flex">
          <span class="recond-white-color">{{ $t("label.cumulativewinLoss") }}：</span>
          <span
            :class="{
              'red': userProfitInfo?.totalProfitAmount < 0,
              'green': userProfitInfo?.totalProfitAmount > 0,
              'money-text': userProfitInfo?.totalProfitAmount == 0,
            }"
          >
            {{ `${userProfitInfo?.totalProfitAmount > 0 ? "+" : ""}${formatMoneyToShow(userProfitInfo?.totalProfitAmount)}` }}
          </span>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { caretDown } from "ionicons/icons";
import { formatMoneyToShow, convertMoneyToShow } from "@/utils/custom";
import { usePersonalLogic } from "@/views/user/report/hooks/personalLogic";
import { IonContent, IonRow, IonCol, IonIcon, IonLabel, IonInfiniteScroll, IonPopover, IonSpinner, IonInfiniteScrollContent } from "@ionic/vue";

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
  userProfitInfo,
  games,
  scrollSelectionRef,
  userDayProfitList,
  gameTypes,
  gamePlatforms,
  showEmpty,
  changeTime,
  currentTimeList,
  timePopoverVisible,
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
@import '@/views/user/report/default/styles/Personal/index-base.less' ;
@import '@/views/user/report/default/styles/Personal/theme-style.less' ;
#tabbar-user-report-default-personal.style();
.blue-default {
  #tabbar-user-report-default-personal.style();
}
.green-default {
  #tabbar-user-report-default-personal.style(
    --color-line,
    --color-line,
    --color-bg-200,
    --accent-color-yellow,
    --color-bg-50,
    --color-line,
    --accent-color-yellow,
    --color-text-gray-200,
    --color-line,
    --theme-color-gradient-100,
    --color-text-white-100,
    --color-text-gray-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-text-gray-100,
  );
}
.amber-purple {
  #tabbar-user-report-default-personal.style(
    --color-line,
    --color-line,
    --color-bg-200,
    --accent-color-yellow,
    --color-bg-50,
    --color-line,
    --accent-color-yellow,
    --color-text-gray-200,
    --color-line,
    --theme-color-gradient-100,
    --color-text-white-100,
    --color-text-gray-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-text-gray-100,
  );
}

.forest-green {
  #tabbar-user-report-default-personal.style(
    --color-line,
    --color-bg-100,
    --color-bg-200,
    --accent-color-yellow,
    --color-bg-100,
    --color-line,
    --accent-color-yellow,
    --color-text-gray-200,
    --color-line,
    --theme-color-gradient-100,
    --color-text-white-100,
    --color-text-gray-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-text-gray-100,
  );
}
.auroral-yellow {
  #tabbar-user-report-default-personal.style(
    @Personal05: --color-bg-200, 
    @Personal10: --theme-color-800, 
    @Personal11: --color-text-black-100, 
  );
}
</style>
