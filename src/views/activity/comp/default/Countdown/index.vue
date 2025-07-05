<script setup lang="ts">
import { Time } from '@/utils/date'
import useCountDownLogic from '../../countdownLogic';

const emit = defineEmits(["updateTime"])
const props = withDefaults(defineProps<{
  issueEndTime: Time | null,
  hasSecond: boolean | null,
}
>(), {});

const { timeRef } = useCountDownLogic({props, emit})
</script>

<template>
  <div class="countdown-wrap" :class="  hasSecond == true  ? 'hasSecond' :''">
    <div class="item text-[--color-text-unThemeWhite] relative" v-for="it in timeRef" >
      <p class="digit">{{ it.digit }}</p>
      <p class="unit">{{ hasSecond == true  ? it.unit : $t(`date.${it.unit}`) }}</p>
      <div class="line"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.countdown-wrap {
  display: flex;
  text-align: center;
  position: absolute;
  top: 1.25rem;
  left: .625rem;
  font-size: .75rem;
  .item {
    width: 2.1875rem;
    height: 1.875rem;
    padding-top: .25rem;
    border-radius: 0.3125rem;
    background: var(--ep-color-text-weaker, rgba(255, 255, 255, 0.40));
    backdrop-filter: blur(2px);

    .digit {
      box-sizing: border-box;
      font-weight: 700;
      line-height: .875rem;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.30);
    }

    .unit {
      line-height: .5rem;
      font-size: .625rem;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.30);
    }

    &:nth-child(2) {
      margin: 0 .375rem;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 0.0625rem;
      height: 0.25rem;
      background: var(--ep-color-text-default, #FFF);
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }
}
.countdown-wrap.hasSecond {

    .item {
        width: 2.25rem;
        height: 2.75rem;
        padding-top: 0.5313rem;
        .digit {
            font-weight: 700;
            font-size: 0.875rem;
            margin-bottom: 0.375rem;
        }

        .unit {
            font-size: 0.5rem;
        }
        .line {
            width: 0.25rem;
            height: 0.0625rem;
            background: #23DB8C;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }
        &:nth-child(2) {
            margin: 0 0.625rem;
        }
        &:nth-child(3) {
            margin-right: 0.625rem;
        }
    }
}
.new-skin-symbol {
    .countdown-wrap .item{
        backdrop-filter: blur(0.25rem);
        color: var(--ep-color-text-default);
    }

}
</style>
