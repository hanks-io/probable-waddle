<script setup lang="ts">
import FooterModal from '../comp/FooterModal.vue';
import Button from '@/components/first/Button/index.vue';

</script>
<template>
  <FooterModal>
    <template #actionBtn="{ homeInstallAction, btnText }">
      <Button class="install" width="fit-content" height="2rem"  @click="homeInstallAction">{{
        btnText }}</Button>

    </template>

  </FooterModal>
</template>

<style scoped lang="less">
:deep(.mask) {
  background: var(--color-bg-mask);
}

:deep(.content_footer_pwa) {
  backdrop-filter: blur(4px);
  background: url('/images/bg-pwa-footer.svg'), var(--pwa-dialog-bg);
  background-size: cover;
  color: var(--color-text-80);
  ion-button.solid {
    --color: #fff;
  }

  .install {
    --button-font-size: .875rem;
    --button-font-weight: 500;
  }

  .cancel {
    --color: var(--color-text-40);
  }
}
</style>
