<!-- PWA安装弹窗 -->
<template>
  <ion-modal mode="md" :is-open="visible" id="modal-download-loading" :backdrop-dismiss="false">
    <div class="w-56 flex flex-col items-center bg-white py-5 px-[.625rem] mx-auto rounded-lg">
      <ion-spinner class="w-10 h-10 text-gray-400" name="lines-sharp" />
      <p class="text-black mt-4">{{ $t('main.loading') }}...</p>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonSpinner } from '@ionic/vue';
import i18n from '@/i18n';
const { t } = i18n.global // 国际化

defineProps<{
  visible: boolean;
}>();

</script>

<style scoped>
ion-modal#modal-download-loading::part(content) {
  --height: fit-content;
  box-shadow: none !important;
  /* 去除弹窗默认阴影 */
}
</style>
