<script setup lang="ts">
import { getTheme } from '@/theme/hooks'
import { IonProgressBar } from '@ionic/vue';
import { formatRatioToShow } from '@/utils/custom';
const { theme, skin } = getTheme()

const props = defineProps<{
  value: number,
  color?: string
  type?: string
}
>()
const progressBarColor = computed(() => {
  if (props.color) return props.color
  if (!skin) return 'success'
  skin === 'default' ? 'success' : undefined
});
</script>
<template>
  <!-- 安装进度条 -->
  <div class="flex-1 relative w-60" :class="[theme, 'pwa-progress-bar', type]">
    <ion-progress-bar class="h-[2.8125rem] rounded-full" :value="value" :color="progressBarColor" />
    <p class="absolute w-full h-full text-center leading-[2.8125rem] top-0 left-0 progress-text">{{
      `${formatRatioToShow(value * 100, 0)}%` }}</p>
  </div>
</template>

<style scoped lang="less">
/* 安装pwa进度条根据主题色样式 */
.pwa-progress-bar ion-progress-bar {
  --background: var(--color-bg-200);
  --progress-background: var(--theme-color-900);
}

.pwa-progress-bar.amber-purple ion-progress-bar {
  --background: var(--color-bg-100);

}


.pwa-progress-bar .progress-text {
  color: var(--color-text-100) !important;
}

.pwa-progress-bar.purple-light .progress-text {
  color: var(--text-color-white-100) !important;
}

.pwa-progress-bar.force-modal ion-progress-bar {
  --background: var(--ep-neutral-white-white-20, rgba(255, 255, 255, 0.2));
  --progress-background: var(--ep-color-icon-brand-secondary, #CF3F5B);
  border-radius: .3125rem;
  width: 18.125rem;
  .progress-text {
    color: var(--ep-color-icon-inverse, #fff) !important;
  }
}
</style>
