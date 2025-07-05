<!-- 返水活动记录 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton :backRebate="backRebate" size="1.25rem" />
        <ion-title>{{ $t('viewsActivity.rebateRatio') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding text-sm">
      <!-- 头部选项 -->
        <!-- 顶部筛选模块 -->
        <div class="my-2.5">
          <div ref="scrollSelectionRef" class="flex items-center select-scroll text-xs">
            <!-- 游戏类型选择 -->
            <div class="flex-1 mr-2.5 flexBox selector-bg  rounded-md h-[2rem] px-[0.625rem] border-[0.0625rem] border-[--report-select-item-border-color]" @click="gameTypeSelectHandle">
                <div class="report-selected mr-[0.5rem]">{{ $t(`sort.${gameType}`) }}</div>
                  <ion-icon :icon="'/first/svg/select-icon.svg'" class="w-[0.875rem] h-[0.875rem] text-[--color-text-second]" :class="gameVisible ? 'on' : ''"/>
                  <ion-popover mode="md" trigger="statement-trigger" :isOpen="gameVisible" @didDismiss="dismissHandle" size="cover">
                    <ion-row class="p-[0.75rem] text-xs board-bg rounded-middle text-center">
                      <ion-col size="3" class="select-col" v-for="(item, index) in gameTypes" :key="index" :value="item" @click="selectedType(item)">
                        <p class="flex-center h-[2.25rem] rounded  " :class="item == gameType ? 'report-selected-item' : 'report-select-item'" >{{  $t(`sort.${item}`) }}</p>
                      </ion-col>
                    </ion-row>
                  </ion-popover>
              </div>
              <!-- 游戏平台选择 -->
            <div class="flex-1 mr-2.5 flexBox selector-bg rounded-md h-[2rem] px-[0.625rem] border-[0.0625rem] border-[--report-select-item-border-color]" @click="platformSelectHandle">
            <div class="report-selected mr-[0.5rem]">{{ platformName }}</div>
              <ion-icon :icon="'/first/svg/select-icon.svg'" class="w-[0.875rem] h-[0.875rem] color-text-80" :class="platformVisible ? 'on' : ''"/>
                <ion-popover mode="md" trigger="statement-trigger" :isOpen="platformVisible" @didDismiss="dismissHandle" size="cover">
                  <ion-row class="p-[0.75rem] text-xs board-bg rounded-middle text-center">
                    <ion-col size="3" :class="item.isTrue ? 'lang-col' : ''"  class="select-col" v-for="(item, index) in platformList" :key="index"  :value="item.name" @click="selectedPlatformType(item.name)">
                      <p 
                        class="flex-center h-[2.25rem] rounded" 
                        :class="item.name == platformName ? 'report-selected-item' : 'report-select-item'" 
                      >{{ item.name }}</p>
                    </ion-col>
                  </ion-row>
                </ion-popover>
            </div>
            <!-- 右侧显示 -->
            <ion-label class="flex-1 w-[4.5rem] text-center text-[--color-text-first] font-weight-bold">{{ $t('activity.agent34') }}</ion-label>
            <ion-label class="flex-1 w-[4.5rem] ml-3 text-center text-[--color-text-first] font-weight-bold">{{ $t('viewsActivity.rebateRatio') }}</ion-label>
          </div>
        </div>
        <!-- 弹出层参照 -->
        <div id="statement-trigger" class="w-full"/>
      <!-- 空列表状态提示 -->
      <div class="flex-center empty-box" v-if="!loading && !rebateList.length">
        <Empty />
      </div>
      <!-- 列表 -->
      <div v-for="(item, i) in rebateList" :key="item.platformId">
        <ion-item class="text-[.75rem] rounded-small" lines="none">
          <ion-row class="w-full text-center text-[--color-text-first]">
            <p class="flex-1">{{ $t(`sort.${gameType}`) }}</p>
            <p class="flex-1 mx-3">{{ platformName }}</p>
            <p class="w-[4.5rem] text-[--color-currency] font-bold">{{ convertMoneyToShow(item.conditionAmount) }}</p>
            <p class="w-[4.5rem] ml-3">{{ convertRatioToShow(item.rewardAmount) }}%</p>
          </ion-row>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonPopover, IonCol, IonRow, IonItem, IonLabel } from '@ionic/vue';
import BackButton from '@/components/BackButton.vue';
import Empty from '@/components/Empty/index.vue'
import { convertMoneyToShow, convertRatioToShow } from '@/utils/custom'
import useRecordLogic from '../recordLogic';

const {
  loading,
  rebateList,
  gameTypes,
  platformList,
  scrollSelectionRef,
  gameVisible,
  gameType,
  platformName,
  platformVisible,
  backRebate,
  dismissHandle,
  gameTypeSelectHandle,
  platformSelectHandle,
  selectedType,
  selectedPlatformType,
} = useRecordLogic();

</script>

<style scoped>
ion-item::part(native) {
  /* 插槽slot内容样式 */
  padding-inline-start: 0;
  padding-inline-end: 0;
  --ion-safe-area-right: 0;
  min-height: 2.625rem;
}

ion-item {
  --background: var(--color-bg-second);
}

ion-popover {
  --backdrop-opacity: 0;
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

ion-col.select-col:nth-child(4),
ion-col.select-col:nth-child(4n) {
  padding: 0 0 0.3125rem 0;
}

/* .platform-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
} */

ion-col.lang-col {
  font-size: 0.5rem;
}

.board-bg {
  background: var(--color-agent-board-bg);
}
.selector-bg {
  background: var(--color-agent-select-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.report-selected{
  color: var(--color-text-first);
}
.report-select-item{
  color:var(--color-text-second);
  font-weight: 600;
  background-color: var(--color-bg-second);
}
.report-selected-item{
  color:var(--color-text-first);
  font-weight: 700;
  border:  1px solid var(--report-select-item-border-color);
  background-color: var(--color-bg-third);
}
</style>
