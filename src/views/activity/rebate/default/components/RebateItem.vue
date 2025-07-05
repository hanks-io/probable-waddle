<template>
  <ion-item lines="none" class="rebate mb-2.5 text-[.625rem]" :key="item.platformId" button detail v-if="maxRebateRate">
    <div class="main-rebate">
      <div class="top-rebate">
        <div class="flex items-center top-rebate-left">
          <div class="flex items-center"> 
            <ion-icon class="text-2xl logo" :src="item.logo"/>
            <p class="text-[--color-text-second] mx-1">{{ $t('activity.agent34') }}</p>
          </div>
          <div class=" text-[--color-text-basic]">
            {{ formatMoneyToShow(validBet) }}
          </div>
        </div>
        <div class="rebate-right">
          <span class="mx-1 rebate-ratio" style="color:var(--color-text-second);text-shadow:none;font-size:.625rem">{{ $t('viewsActivity.rebateRatio') }}</span>
          <span style="color:var(--color-text-basic);text-shadow:none;font-size:.625rem">{{ rebateRate }}%</span>
        </div>
      </div>
      <div class="bottom-rebate">
        <div class="bottom-rebate-left">
          <ion-progress-bar class="h-2.5" :value="upgrade ? validBet / upgrade : 1"/>
          <p class="absolute top-0 left-0 right-0 bottom-0 text-center leading-none overflow-content text-[--color-text-basic]">
            {{ upgrade
              ? $t('viewsActivity.betTips', { betMoney: formatMoneyToShow(upgrade - validBet),rate: nextRebateRate })
              : $t('viewsActivity.maxLevel') + ' 100%'
            }}
          </p>
        </div>
        <div class="rebate-right">
          <span class="mx-1 rebate-ratio" style="color:var(--color-text-second);text-shadow:none;font-size:.625rem">{{ $t('label.collectable') }}</span>
          <span style="color:var(--color-text-emphasis);text-shadow:none;font-size:.625rem">{{ formatMoneyToShow(availableRebate) }}</span>
        </div>
      </div>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import { IonItem, IonIcon, IonProgressBar } from '@ionic/vue';
import useRebateItemLogic from '../../rebateItemLogic';

const props = defineProps({
  item: { type: Object, required: true },
  gameType: { type: String, required: true }
})

const {
  validBet,
  rebateRate,
  upgrade,
  nextRebateRate,
  availableRebate,
  maxRebateRate
} = useRebateItemLogic({ props });

</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/rebate/default/style/RebateItem/base.less";
  @import "@/views/activity/rebate/default/style/RebateItem/theme-style.less";

  #activity-rebate-default-components-RebateItem.style();

  .blue-default {
    #activity-rebate-default-components-RebateItem.style(
      --color-bg-200,
      --color-text-white-100,
      --color-bg-100,
      --theme-color-gradient-400,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-white-100,
      --accent-color-yellow,
      --color-text-white-100
    );
  }

  .green-default {
    #activity-rebate-default-components-RebateItem.style(
      --color-bg-200,
      --color-text-gray-100,
      --color-bg-100,
      --theme-color-gradient-200,
      --color-text-white-40,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-text-gray-100
    );
  }

  .amber-purple {
    #activity-rebate-default-components-RebateItem.style(
      --color-bg-200,
      --text-color-light-purple-1-100,
      --color-bg-100,
      --theme-color-gradient-200,
      --text-color-white-40,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --text-color-light-purple-1-100
    );
  }
</style>
