<template>
  <div class="count-down">
    <div class="count-down-item" v-for="(item, index) in countDown" :key="item.name">
      <div class="count-down-item--content">
        <div class="count-down-item-time">
          <div class="count-down-item-time-value">
            <div>
              <p v-for="(value, index) in item.value" :key="index + '-' + value" class="count-down--value">
                <span class="count-down--value-text">{{ value }}</span>
              </p>
            </div>
            <p class="count-down-item-name">{{ item.name }}</p>
          </div>
          <div class="count-down-item-time-split" v-if="index !== countDown.length - 1">:</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useI18n } from "@/hooks/useI18n"

const props = withDefaults(defineProps<{
  expireTime: number
}>(), {
  expireTime: 0
})


const { t } = useI18n()

const countDown = computed(() => formatTime(props.expireTime))

/**
 * 格式化时间
 * @param time 时间
 * @returns 时间数组
 */
const formatTime = (time: number) => {
  const Days = Math.floor(time / 86400)
  const Hours = Math.floor(time % 86400 / 3600)
  const Min = Math.floor(time % 3600 / 60)
  const Sec = time % 60
  return [Days, Hours, Min, Sec].map((item, index) => {
    return {
      name: [t('date.days'), t('date.hour'), t('date.minute'), t('date.second')][index],
      value: item.toString().padStart(2, '0').split('')
    }
  })
}


</script>

<style lang="less" scoped>
.count-down {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.375rem;

  .count-down-item {
    display: flex;
    align-items: self-start;
    justify-content: center;

    .count-down-item-time {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      font-size: var(--ep-font-size-s);
      color: var(--ep-color-text-inverse);
      font-weight: var(--ep-font-weight-medium);

      .count-down--value {
        display: inline-block;
        padding: 0.125rem 0.25rem;
        border-radius: var(--ep-border-radius-xs);
        background-color: rgba(10, 119, 218, .2);

        .count-down--value-text {
          // 为了保证数字宽度一致，避免位移
          display: inline-block;
          width: .625rem;
          text-align: center;
        }

        &:not(:last-child) {
          margin-right: var(--ep-values-2);
        }
      }
    }

    .count-down-item-time-split {
      font-size: var(--ep-font-size-s);
      color: var(--ep-color-text-inverse);
      font-weight: var(--ep-font-weight-bold);
      margin: 0 0.625rem;
    }

    .count-down-item-name {
      margin-top: 0.25rem;
      font-size: var(--ep-font-size-xs);
      color: var(--ep-color-text-weakest);
      font-weight: var(--ep-font-weight-regular);
      line-height: 1;
      text-align: center;
    }
  }
}
</style>
