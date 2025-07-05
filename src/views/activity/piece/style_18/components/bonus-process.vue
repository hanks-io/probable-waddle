<template>
  <div class="bonus-process">
    <div class="bonus-process--amount">
      {{ merchantCy }} {{ formatMoneyToShow(rangeAmount) }}
    </div>
    <div class="bonus-process--bar">
      <div class="bonus-process--bar__item" :style="{ width: `${(rangeAmount * 100 / roundAmount) || 0}%` }"></div>
    </div>
    <div class="bonus-process--text">
      {{ $t('activity.youStillNeed') }}
      <span class="bonus-process--text-amount">{{ formatMoneyToShow(roundAmount - rangeAmount) }}</span>
      {{ $t('activity.toWithdraw') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom';

const { merchantCy, roundAmount, rangeAmount } = defineProps<{
  merchantCy: string
  roundAmount: number
  rangeAmount: number
}>()

</script>

<style lang="less" scoped>
.bonus-process {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Smooch Sans;
  margin: 0 0.75rem 0.625rem 0.75rem;
  padding-bottom: 1.5rem;
  border-radius: var(--ep-border-radius-xl);
  background: radial-gradient(60.99% 70.99% at 48.63% -35%, var(--ep-color-background-fill-glow-primary-opacity-40) 0%, rgba(0, 0, 0, 0) 90%);
  backdrop-filter: blur(0.25rem);

  .bonus-process--amount {
    text-align: center;
    padding-top: 0.625rem;
    margin-bottom: 1rem;
    color: var(--ep-accent-green);
    font-size: var(--ep-font-size-xxl);
    font-weight: var(--ep-font-weight-bold);
  }

  .bonus-process--bar {
    width: 13.75rem;
    height: .625rem;
    background: var(--ep-color-background-fill-surface-raised-L2);
    border-radius: var(--ep-border-radius-xl);
    overflow: hidden;

    .bonus-process--bar__item {
      height: 100%;
      border-radius: var(--ep-border-radius-xl);
      background: linear-gradient(90deg, var(--ep-color-background-fill-gradients-tertiary-a) -27.5%, var(--ep-color-background-fill-gradients-tertiary-b) 127.5%)
    }
  }

  .bonus-process--text {
    margin-top: 0.625rem;
    font-size: var(--ep-font-size-s);
    color: var(--ep-color-text-weaker);

    .bonus-process--text-amount {
      color: var(--ep-color-text-warning);
      font-weight: var(--ep-font-weight-medium);
      font-size: var(--ep-font-size-s);
    }
  }
}
</style>
