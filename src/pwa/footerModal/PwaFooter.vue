<script setup lang="ts">
import FooterModal from '../comp/FooterModal.vue';
import Button from '@/components/first/Button/index.vue';
const appStore = useAppStore() // 应用信息
const pwaFooterVisible = computed(() => appStore.isShowPwaFooter) // 是否显示PWA底部栏
</script>
<template>
  <FooterModal v-if="pwaFooterVisible">
    <template #cancelBtn="{ closeFooterModal }">
      <div class="cancel" @click="closeFooterModal">{{ $t('viewsTabbar.pwaFooterModal2') }}</div>
    </template>
    <template #actionBtn="{ homeInstallAction, btnText }">
      <Button class="install" classType="primary" width="6.875rem" height="2rem" @click="homeInstallAction">{{
        btnText }}</Button>

    </template>

  </FooterModal>
</template>

<style scoped lang="less">
:deep(.mask) {
  background: rgba(0, 0, 0, 0.8);
}

:deep(.new-skin-symbol .content_footer_pwa) {
  backdrop-filter: blur(4px);
  background: var(--ep-color-background-fill-surface-raised-L1);
  background-size: cover;
  color: var(--ep-color-text-default);




}

.install {
  --button-font-size: var(--ep-font-size-m);
  --button-font-weight: var(--ep-font-weight-medium);
}

.cancel {
  --color: var(--ep-color-text-default);
  line-height: 2rem;
  margin-right: 1rem;
}
</style>
