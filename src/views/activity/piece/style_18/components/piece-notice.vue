<template>
  <div class="piece-notice">
    <div class="piece-notice__header">
      <img :src="noticeBanner" class="piece-notice__icon">
      <p class="piece-notice__text">{{ headerText }}</p>
      <img :src="noticeBanner" class="piece-notice__icon" style="transform: rotateY(180deg);">
    </div>
    <div class="piece-notice__content">
      <p v-for="item in contentText" :key="item" class="piece-notice__text">{{ item }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import noticeBanner from '@/assets/img/activity/AssistanceCash/style18/notice-banner.svg'

const { hasBanner = true, rule } = defineProps<{
  hasBanner?: boolean
  rule: string
}>()

const ruleText = computed(() =>
  rule.split('\n')
    .filter(item => !!item.trim())
    .map(item => item.replace(/^\d+\./, "•"))
)

const headerText = computed(() => {
  if (hasBanner) {
    return ruleText.value.length > 0 ? ruleText.value[0].replace(/:.*$/, "") : ''
  }
  return ruleText.value.length > 0 ? ruleText.value[0] : ''
})

const contentText = computed(() =>
  ruleText.value.length > 1 ? ruleText.value.slice(1) : []
)

</script>


<style lang="less" scoped>
.piece-notice {
  margin: 2.625rem 1rem 1.5rem 1rem;

  .piece-notice__header {
    display: flex;
    margin-bottom: 2rem;
    align-items: center;
    justify-content: center;
    color: var(--ep-color-text-default);
    font-size: var(--ep-font-size-l);
    line-height: 1;
    font-weight: 500;

    .piece-notice__text {
      margin: 0 0.5rem;
    }

    .piece-notice__icon {
      width: 1.875rem;
      height: 0.625rem;
    }
  }

  .piece-notice__content {
    background: var(--ep-color-background-fill-surface-lowered);
    padding: 1.5rem 1rem;
    color: var(--ep-color-text-weak);
    font-weight: var(--ep-font-weight-regular);
    font-size: var(--ep-font-size-s);
    border-radius: var(--ep-border-radius-m);

    .piece-notice__text:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
}
</style>
