<template>
  <ion-item lines="none" class="rebate mb-2.5 text-[.625rem]" :key="item.platformId" button detail v-if="maxRebateRate">
    <div class="main-rebate">
      <div class="top-rebate mb-[0.2188rem]">
        <div class="flex items-center top-rebate-left">
          <div class="flex items-center"> 
            <ion-icon class="text-2xl logo" :src="item.logo"/>
            <p class="rebate-ratio">{{ $t('activity.agent34') }}</p>
          </div>
          <div class=" text-[--color-text-first] text-[0.75rem]">
            {{ formatMoneyToShow(validBet) }}
          </div>
        </div>
        <div class="rebate-right">
          <span class="rebate-ratio" style="text-shadow:none;font-size:.625rem">{{ $t('viewsActivity.rebateRatio') }}</span>
          <span class="text-[--color-text-first] text-[0.75rem]" style="text-shadow:none;font-size:.625rem">{{ rebateRate }}%</span>
        </div>
      </div>
      <div class="bottom-rebate">
        <div class="bottom-rebate-left w-[8.125rem]">
          <ion-progress-bar class="h-2.5" :value="upgrade ? validBet / upgrade : 1"/>
          <p class="absolute top-0 left-[0.5625rem] right-0 bottom-0 text-center  w-[6.125rem] leading-[0.5625rem] overflow-content text-[--color-text-first]">
            {{ upgrade
              ? $t('viewsActivity.betTips', { betMoney: formatMoneyToShow(upgrade - validBet),rate: nextRebateRate })
              : $t('viewsActivity.maxLevel') + ' 100%'
            }}
          </p>
        </div>
        <div class="rebate-right">
          <span class="rebate-ratio" style="text-shadow:none;font-size:.625rem">{{ $t('label.collectable') }}</span>
          <span class=" text-[--color-currency] font-[--font-weight-semibold]" style="text-shadow:none;font-size:.75rem">{{ formatMoneyToShow(availableRebate) }}</span>
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

<style scoped>


ion-item.rebate {
  --detail-icon-opacity: 1;
  --detail-icon-font-size: 1rem;
  --detail-icon-color: var(--color-icon-right);
  --background: var(--color-bg-second);
  --min-height: 3.75rem;
  --height: 3.75rem;
  --max-height: 3.75rem;
  border-radius: .625rem;
}

ion-item.rebate::part(native) { /* 插槽slot内容样式 */
  padding-inline-start: 0.625rem;
  --inner-padding-end: 0;
}

ion-item::part(detail-icon) {
  margin-inline-end: 0;
  height: 1.0625rem;
  width: 1.4375rem;
}

ion-progress-bar {
  --background: var(--color-bg-third);
  --progress-background: var(--color-bg-progress);
  border-radius: 0.3125rem;
}

ion-progress-bar::part(track) {
   /* background: var(--color-bg-third); */
}

ion-progress-bar::part(progress) {
  /* --progress-background: var(--theme-color-700); */
}
.main-rebate {
  width: 100%;
  height: 100%;
  padding-top: 0.3125rem;
  display: flex;
  flex-direction: column;
}
.top-rebate,
.bottom-rebate {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-rebate-left,
.bottom-rebate-left {
  position: relative;
}
.rebate-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
  max-width: 7.5rem;
}
.rebate-ratio {
  margin-left: 0.25rem;
  margin-right: 0.1875rem;
  text-align: left;
  color: var(--color-text-second);
}
.overflow-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.top-rebate-left {
  justify-content: start;
}

div ion-icon.logo {
  color: var(--color-icon-platform-rebate);
} 
</style>
