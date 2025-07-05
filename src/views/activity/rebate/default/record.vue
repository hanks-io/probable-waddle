<!-- 返水活动记录 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton :backRebate="backRebate" />
        <ion-title>{{ $t('viewsActivity.rebateRatio') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding text-sm">
      <!-- 头部选项 -->
        <!-- 顶部筛选模块 -->
        <div class="my-2.5">
          <div ref="scrollSelectionRef" class="flex items-center select-scroll overflow-x-auto text-xs">
            <!-- 游戏类型选择 -->
            <div class="flex-1 mr-2.5 border max-h-[1.5rem] rounded-[10px] flex items-center justify-between py-1 pl-2 pr-1 text-[--color-text-basic]" :class="gameVisible ? 'border-[--color-text-basic]' : 'border-[--color-text-second]'" @click="gameTypeSelectHandle">
                <div class="w-[3.2rem] flex items-center mr-2">{{ $t(`sort.${gameType}`) }}</div>
                  <ion-icon :icon="caretDown" class="w-4 h-4 text-[--color-text-second]" :class="gameVisible ? 'on' : ''"/>
                  <ion-popover mode="md" trigger="statement-trigger" :isOpen="gameVisible" @didDismiss="dismissHandle" size="cover">
                    <ion-row class="px-[.625rem] py-1.5 text-xs text-center">
                      <ion-col size="3" class="select-col" v-for="(item, index) in gameTypes" :key="index" :value="item" @click="selectedType(item)">
                        <p class="flex items-center justify-center h-[2.5rem] px-1 rounded-md" :class="item == gameType ? 'on' : 'border border-[var(--color-border-input-basic)] text-[--color-text-second]'" >{{  $t(`sort.${item}`) }}</p>
                      </ion-col>
                    </ion-row>
                  </ion-popover>
              </div>
              <!-- 游戏平台选择 -->
            <div class="flex-1 mr-2.5 border max-h-[1.5rem] rounded-[10px] flex items-center justify-between py-1 pl-2 pr-1 text-[--color-text-basic]" :class="platformVisible ? 'border-[--color-text-basic]' : 'border-[--color-text-second]'" @click="platformSelectHandle">
            <div class="w-[4.75rem] platform-name mr-2">{{ platformName }}</div>
              <ion-icon :icon="caretDown" class="w-4 h-4 text-[--color-text-second]" :class="platformVisible ? 'on' : ''"/>
                <ion-popover mode="md" trigger="statement-trigger" :isOpen="platformVisible" @didDismiss="dismissHandle" size="cover">
                  <ion-row class="px-[.625rem] py-1.5 text-xs text-center">
                    <ion-col size="3" :class="item.isTrue ? 'lang-col' : ''"  class="select-col" v-for="(item, index) in platformList" :key="index"  :value="item.name" @click="selectedPlatformType(item.name)">
                      <p 
                        class="flex items-center justify-center h-[2.5rem] px-1 rounded-md" 
                        :class="item.name == platformName ? 'on' : 'border border-[--color-border-input-basic] text-[--color-text-second] '" 
                      >{{ item.name }}</p>
                    </ion-col>
                  </ion-row>
                </ion-popover>
            </div>
            <!-- 右侧显示 -->
            <ion-label class="flex-1 w-[4.5rem] text-center text-[--color-text-basic]">{{ $t('activity.agent34') }}</ion-label>
            <ion-label class="flex-1 w-[4.5rem] ml-3 text-center text-[--color-text-basic]">{{ $t('viewsActivity.rebateRatio') }}</ion-label>
          </div>
        </div>
        <!-- 弹出层参照 -->
        <div id="statement-trigger" class="w-full bg-white"/>
      <!-- 空列表状态提示 -->
      <div class="flex flex-col items-center justify-center text-[--color-text-second]" v-if="!loading && !rebateList.length">
        <ion-img class="w-[7.5rem] mt-36" src="/icons/No_record.png" />
        <ion-label>{{ $t('label.noRecord') }}</ion-label>
      </div>
      <!-- 列表 -->
      <div v-for="(item, i) in rebateList" :key="item.platformId">
        <ion-item class="text-[.625rem] " :class="i % 2 ? '' : 'odd'" lines="none">
          <ion-row class="w-full text-center text-[--color-text-basic]">
            <p class="flex-1">{{ $t(`sort.${gameType}`) }}</p>
            <p class="flex-1 mx-3">{{ platformName }}</p>
            <p class="w-[4.5rem]">{{ convertMoneyToShow(item.conditionAmount) }}</p>
            <p class="w-[4.5rem] ml-3">{{ convertRatioToShow(item.rewardAmount) }}%</p>
          </ion-row>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { caretDown } from 'ionicons/icons';
import { convertMoneyToShow, convertRatioToShow } from '@/utils/custom'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonPopover, IonCol, IonRow, IonImg, IonItem, IonLabel } from '@ionic/vue';
import BackButton from '@/components/BackButton.vue';
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

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/rebate/default/style/record/base-record.less";
  @import "@/views/activity/rebate/default/style/record/theme-style.less";

  #activity-rebate-default-record.style();

  .blue-default {
    #activity-rebate-default-record.style(
      --color-bg-300,
      --color-bg-200,
      --color-bg-200,
      --theme-color-gradient-100,
      --color-text-white-100,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-white-100,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-border-600,
      --color-text-white-100,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-white-100
    );
  }

  .green-default {
    #activity-rebate-default-record.style(
      --color-bg-300,
      --color-bg-200,
      --color-bg-200,
      --theme-color-gradient-100,
      --color-text-white-100,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-200,
      --color-line,
      --color-text-gray-100,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100
    );
  }

  .amber-purple {
    #activity-rebate-default-record.style(
      --color-bg-300,
      --color-bg-200,
      --color-bg-200,
      --theme-color-800,
      --text-color-white-100,
      --text-color-light-purple-1-100,
      --line-color,
      --text-color-light-purple-1-100,
      --line-color,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --line-color,
      --text-color-light-purple-1-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100
    );
  }

  .auroral-yellow {
    #activity-rebate-default-record.style(
      @rebate-default-record-04: --theme-color-800;
      @rebate-default-record-05: --agent-btn-color;
    );
  }
</style>
