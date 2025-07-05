<script setup lang="ts" name="sharePlatformBlock">
import SharePlatform from "@/views/activity/comp/share/sharePlatform.vue";
</script>

<template>
  <div class="share">
    <span class="title">{{ $t('activity.inviteBlockTitle') }}</span>
    <!-- 分享平台列表 -->
    <SharePlatform class="share-content" />
  </div>
</template>

<style scoped lang="less">
.share {
  border-radius: 0.625rem;
  padding: 0.75rem;
  background: url('@/assets/img/promotion/share-url-bg.png') no-repeat center / 100% 100%;
  backdrop-filter: blur(4px);
  background-color: var(--ep-color-background-fill-surface-raised-L1);
  background-size: 100% auto !important; /* 宽度100%，高度自动 */
  background-position: top center !important; /* 可选，让图片居中或顶部对齐 */

  .title {
    color: var(--color-text-default, #FFF);
    font-size: 0.75rem;
    font-weight: var(--ep-font-weight-medium);
  }

  .share-content {
    margin-top: 0.75rem;
  }
}
</style>
