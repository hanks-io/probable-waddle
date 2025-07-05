<!-- CPF 邀请活动 跟随皮肤 邀请记录 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="`${$t('label.invite') + $t('main.record')}`" :bgColor="useHeaderBgColor" />
    <ion-content :scroll-y="unShowEmpty ? true : false">
      <!-- 时间筛选 -->
      <div class="default-cpf-record-select-date flex">
        <div class="date-box p-[0.4375rem] flex items-center" @click="timeSelectHandle">
          <span class="select-tips mr-[0.3125rem]">{{ $t('activity.selectDate') }}:</span>
          <div class="current-date">
            {{ changeTime == 'all' ? $t(`main.${changeTime}`) : $t(`date.${changeTime}`) }}
          </div>
          <ion-icon 
            src="/first/svg/select-icon.svg" 
            class="w-[0.875rem] h-[0.875rem] ml-[0.3125rem] default-select-icon" 
            :class="timePopoverVisible ? 'on' : ''"  
          />
        </div>
        <ion-popover mode="md" trigger="invite-pf-record-trigger" :isOpen="timePopoverVisible" @didDismiss="dismissHandle" size="cover">
          <ion-row class="popover-select-box w-full">
            <ion-col
              size="4"
              class="popover-select-item"
              v-for="item in currentTimeList"
              :key="item.value"
              @click="selectedTime(item.value)"
            >
              <p class="p-select-item flex-center" :class="changeTime == item.value ? 'p-selected-col' : ''">
                {{ item.name }}
              </p>
            </ion-col>
          </ion-row>
        </ion-popover>
      </div>
      <!-- 时间筛选显示位置 -->
      <div class="popover-box">
        <div id="invite-pf-record-trigger" />
      </div>
      <!-- 提示内容 -->
      <div class="pr-[0.625rem] pl-[0.8125rem] default-record-select-time-tips">
        *{{ $t('activity.cpfSelectTips') }}
      </div>
      <!-- 邀请记录 表格 -->
      <div class="default-table">
        <!-- 表头 -->
        <ion-item class="default-table-title" lines="none">
          <ion-grid class="min-h-[2.75rem] p-0">
            <ion-row class="min-h-[2.75rem]">
              <ion-col v-for="(item,index) in tableTitleList" :key="index" :size="item.size" class="flex-center text-center">
                {{ item.name }}
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
        <!-- 表数据 -->
        <div class="flex-1" v-if="unShowEmpty">
          <ion-item class="default-table-list" lines="none" v-for="(item,index) in recordList" :key="index">
            <ion-grid class="min-h-[2.75rem] p-0">
              <ion-row class="min-h-[2.75rem]">
                <ion-col size="3" class="flex-center">{{ item.userId }}</ion-col>
                <ion-col size="3" class="flex-center">{{ item.registerTime }}</ion-col>
                <ion-col size="3" class="flex-center default-list-item-money">{{ formatMoneyToShow(item.recharge) }}</ion-col>
                <ion-col size="3" class="flex-center default-list-item-money">{{ formatMoneyToShow(item.validBet) }}</ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
        </div>
      </div>
      <!-- 暂无数据 -->
      <Empty class="mt-[5rem]" v-if="!unShowEmpty" />
      <!-- 触底加载更多 --> 
      <ion-infinite-scroll ref="infiniteRef"  @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content
          class="default-infinite-content"
          v-if="unShowEmpty"
          :loading-text="loadMore == 'noMore' ? $t('label.noMore') : ''"
          :loading-spinner="loadMore == 'more' ? null : null"
        />
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getTheme } from '@/theme/hooks'
import Empty from '@/components/Empty/index.vue'
import { formatMoneyToShow } from '@/utils/custom'
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useInviteCpfRecord } from '@/views/activity/inviteCpf/hooks/inviteCpfRecord'
import { IonPage, IonContent, IonPopover, IonRow, IonCol, IonItem, IonGrid, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon } from '@ionic/vue'

  
  /**
  * @description 跟随皮肤-邀请记录-NavigationBar 
  * 背景色
  */
  const useHeaderBgColor = computed(() => {
    const { theme } = getTheme();
    switch(theme) {
      case 'yellow-dark':
      case 'green-dark':
      case 'forest-green':
      case 'amber-purple': 
      case 'green-default':
        return '--color-bg-200'
      case 'purple-light': 
        return '--theme-color-800'
      case 'blue-default':
        return '--invite-cpf-footer-bg-color'
    }
  })  

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
  ionInfinite,
} = useInviteCpfRecord();

</script>

<style scoped lang="less">
@import '@/views/activity/inviteCpf/components/record/default/styles/base-index.less';
@import '@/views/activity/inviteCpf/components/record/default/styles/theme-index.less';

#activity-inviteCpf-components-record-default-index.style();

.yellow-dark {
  #activity-inviteCpf-components-record-default-index.style(
    --color-bg-300,
    --color-bg-200,
    --text-color-white-40,
    --text-color-white-100,
    --color-bg-200,
    --text-color-white-80,
    --line-color,
    --color-bg-100,
    --theme-color-800,
    --accent-color-red,
    --text-color-white-40,
    --color-bg-100,
    --text-color-white-80,
    --color-bg-300,
    --accent-color-orange,
    --color-bg-300,
    --color-bg-400,
    --text-color-white-100
  );
}

.green-dark {
  #activity-inviteCpf-components-record-default-index.style(
    --color-bg-300,
    --color-bg-200,
    --text-color-white-40,
    --text-color-white-100,
    --color-bg-200,
    --color-text-80,
    --color-line,
    --color-card-bg--100,
    --theme-color-800,
    --color-svg-popular,
    --text-color-white-40,
    --color-bg-100,
    --color-text-80,
    --color-bg-300,
    --accent-color-orange,
    --color-bg-300,
    --color-bg-400,
    --text-color-white-100
  )
}

.purple-light {
  #activity-inviteCpf-components-record-default-index.style(
    --color-bg-300,
    --color-bg-400,
    --text-color-black-80,
    --text-color-black-100,
    --color-bg-500,
    --text-color-black-80,
    --line-color,
    --line-color,
    --theme-color-800,
    --accent-color-red,
    --text-color-black-40,
    --color-bg-200,
    --text-color-black-100,
    --color-bg-300,
    --accent-color-orange,
    --color-bg-300,
    --color-bg-400,
    --text-color-black-20
  )
}

.amber-purple {
  #activity-inviteCpf-components-record-default-index.style(
    --color-bg-300,
    --color-bg-200,
    --text-color-white-40,
    --text-color-white-100,
    --color-bg-200,
    --text-color-white-80,
    --line-color,
    --color-bg-100,
    --theme-color-800,
    --accent-color-red,
    --text-color-light-purple-2-100,
    --color-bg-100,
    --text-color-light-purple-1-100,
    --color-bg-300,
    --accent-color-yellow,
    --color-bg-300,
    --color-bg-400,
    --text-color-white-100
  )
}

.blue-default {
  #activity-inviteCpf-components-record-default-index.style(
    --color-bg-400,
    --invite-cpf-footer-bg-color,
    --text-color-white-40,
    --color-text-white-100,
    --invite-cpf-footer-bg-color,
    --text-color-white-80,
    --color-border-600,
    --color-border-600,
    --theme-color-800,
    --color-danger,
    --text-color-white-40,
    --invite-cpf-record-title-bg,
    --text-color-white-80,
    --color-bg-400,
    --accent-color-orange,
    --color-bg-400,
    --invite-cpf-record-item-even-bg,
    --color-text-white-100
  )
}

.forest-green {
  #activity-inviteCpf-components-record-default-index.style(
    --color-bg-300,
    --color-bg-200,
    --color-text-white-40,
    --color-text-white-100,
    --color-bg-200,
    --color-text-80,
    --color-line,
    --color-bg-100,
    --theme-color-800,
    --color-danger,
    --text-color2,
    --color-bg-200,
    --text-color1,
    --color-bg-300,
    --color-warning,
    --color-bg-300,
    --color-bg-400,
    --color-text-white-100
  )
}

.green-default {
  #activity-inviteCpf-components-record-default-index.style(
    --color-bg-300,
    --color-bg-200,
    --color-text-white-40,
    --color-text-gray-100,
    --color-bg-200,
    --color-text-80,
    --color-line,
    --color-bg-100,
    --theme-color-800,
    --color-danger,
    --color-text-gray-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-bg-300,
    --color-warning,
    --color-bg-300,
    --color-bg-400,
    --color-text-white-100
  )
}

.new-skin-symbol {
  #activity-inviteCpf-components-record-default-index.style(
    --ep-color-background-fill-body-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-weaker,
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-weaker,
    --ep-color-border-default,
    --ep-color-background-fill-surface-raised-L2,
    --ep-color-text-selected,
    --ep-color-text-danger,
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L2,
    --ep-color-text-default,
    --ep-color-background-fill-body-default,
    --ep-color-text-warning,
    --ep-color-background-fill-body-default,
    --ep-color-background-fill-surface-lowered,
    --ep-color-icon-default
  )
}
</style>

