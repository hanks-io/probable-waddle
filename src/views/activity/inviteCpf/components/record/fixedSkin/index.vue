<!--  CPF 邀请记录 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="`${$t('label.invite') + $t('main.record')}`" />
    <ion-content :scroll-y="unShowEmpty ? true : false" :class="isStyle2 ? 'content-style2' : 'content-style1'">
      <!-- 日期筛选 -->
      <div class="cpf-select-date">
        <div class="w-full flex">
          <div 
            class="px-[0.25rem] pr-[0.25rem] pl-[0.5rem] flex-center"
            @click="timeSelectHandle"
            :class="{ 
              'selected-box': timePopoverVisible && !isStyle2, 
              'selected-box2': timePopoverVisible && isStyle2, 
              'select-box': !isStyle2, 
              'select-box-style2': isStyle2 
            }"
          >
            <div class="mr-[.5rem]">{{ changeTime == 'all' ? $t(`main.${changeTime}`) : $t(`date.${changeTime}`) }}</div>
            <ion-icon :icon="caretDown" class="report-select-icon" :class="timePopoverVisible ? 'on' : ''" />
           <ion-popover mode="md" trigger="invite-pf-record-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
            <ion-row class="report-select-row text-center" :class="{ 'report-select-row-style2': isStyle2 }">
              <ion-col
                size="3"
                class="select-col"
                v-for="item in currentTimeList"
                :key="item.value"
                @click="selectedTime(item.value)"
              >
                <p
                  class="flex-center px-[0.25rem]"
                  :class="changeTime == item.value ? 'selected-col' : ''"
                >
                  {{ item.name }}
                </p>
              </ion-col>
            </ion-row>
           </ion-popover>
          </div>
        </div>
        <div id="invite-pf-record-trigger" />
        <div class="mt-[0.75rem] select-time-tips" :class="{ 'select-time-tips-style2': isStyle2 }">*{{ $t('activity.cpfSelectTips') }}</div>
      </div>
      <!-- 邀请记录表格数据 -->
      <div class="invite-cpf-table" :class="{ 'invite-cpf-table-style2': isStyle2 }" v-if="unShowEmpty">
        <!-- 表头 -->
        <ion-item class="table-title text-[0.75rem]" lines="none">
          <ion-grid class="min-h-[2.75rem] p-0">
            <ion-row class="min-h-[2.75rem]">
              <ion-col v-for="(item,index) in tableTitleList" :key="index" :size="item.size" class="flex-center font-semibold">
                {{ item.name }}
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
        <!-- 表数据 -->
        <div class="flex-1">
          <ion-item class="table-list text-[0.75rem]" lines="none" v-for="(item,index) in recordList" :key="index">
            <ion-grid class="min-h-[2.75rem] p-0">
              <ion-row class="min-h-[2.75rem]">
                <ion-col size="3" class="flex-center">{{ item.userId }}</ion-col>
                <ion-col size="3" class="flex-center list-item-money">{{ formatMoneyToShow(item.recharge) }}</ion-col>
                <ion-col size="3" class="flex-center list-item-money">{{ formatMoneyToShow(item.validBet) }}</ion-col>
                <ion-col size="3" class="flex-center">{{ item.registerTime }}</ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
        </div>
      </div>
      <!-- 暂无数据 -->
      <div class="h-full flex flex-col items-center mt-[8.625rem]" v-if="!unShowEmpty">
        <img class="invite-cpf-empty" :src="`/images/inviteCpf/${isStyle2 ? 'empty-style2' : 'empty-style1' }.png`" alt="" />
        <div class="text-center empty-tips font-medium mt-[1.5rem]" :class="{ 'empty-tips-style2': isStyle2 }">{{ $t('activity.cpfEmptyTips') }}</div>
      </div>
      <ion-infinite-scroll ref="infiniteRef" @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content
          :class="isStyle2 ? 'infinite-content-style2' : 'infinite-content-style1'"
          v-if="unShowEmpty"
          :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
          :loading-spinner="loadMore == 'more' ? null : null"
        />
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { caretDown } from "ionicons/icons";
import { formatMoneyToShow } from '@/utils/custom'
import { IonPage, IonContent, IonPopover, IonRow, IonCol, IonItem, IonGrid, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useInviteCpfRecord } from '@/views/activity/inviteCpf/hooks/inviteCpfRecord'

const {
  recordList,
  changeTime,
  timePopoverVisible,
  currentTimeList,
  tableTitleList,
  unShowEmpty,
  isStyle2,
  loadMore,
  infiniteRef,
  timeSelectHandle,
  selectedTime,
  dismissHandle,
  ionInfinite
} = useInviteCpfRecord();

</script>

<style scoped lang="less">
  @import '@/views/activity/inviteCpf/components/record/fixedSkin/styles/base-index.less';
</style>
