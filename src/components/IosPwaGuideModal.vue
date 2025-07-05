<!-- pwa安装强制弹窗 -->
<template>
  <div class="h-full w-full flex justify-center items-end">
    <div class="pwa-tip bg-white text-black w-[24.375rem] rounded-t-[1.25rem] px-5 pt-7 pb-8" @click.stop>
      <!-- 标题 -->
      <div class="flex items-center">
        <p class="title flex-1 font-semibold">{{ $t('guide.installTheApp') }}</p>
        <ion-icon class="text-2xl" :icon="close" @click="closeModal"/>
      </div>
      <!-- 应用信息 -->
      <div class="accent-box flex items-center my-8 p-5 rounded-lg border border-gray-200">
        <ion-img class="w-[2.75rem] h-[2.75rem] mr-2 rounded-[.625rem] overflow-hidden" :src="icon"/>
        <div class="ml-2.5">
          <p class="font-bold text-sm mb-1.5">{{ name }}</p>
          <p class="text-xs">{{ url }}</p>
        </div>
      </div>
      <!-- 操作步骤 -->
      <div class="flex text-sm">
        <p class="font-bold mr-3.5">1.</p>
        <div class="flex flex-wrap items-center text-sm">
          <p>{{ $t('guide.tapOn') }}</p>
          <ion-icon class="-rotate-90 text-xl mx-2" :icon="exitOutline"/>
          <p>{{ $t('guide.inTheBrowserMenu') }}</p>
        </div>
      </div>
      <div class="flex my-8">
        <p class="font-bold mr-3.5">2.</p>
        <div class="flex flex-wrap items-center text-sm">
          <p>{{ $t('guide.scrollDownAndAelect') }}</p>
          <p class="accent-box border border-gray-200 rounded px-1 ml-2">{{ $t('guide.addToHomeScreen') }}</p>
        </div>
      </div>
      <div class="flex">
        <p class="font-bold mr-3.5">3.</p>
        <div class="flex flex-wrap items-center text-sm">
          <p>{{ $t('guide.scrollDownAndAelect') }}</p>
          <ion-img class="w-[1.5rem] h-[1.5rem] mx-2 rounded-[.375rem] overflow-hidden" :src="icon"/>
          <p>{{ $t('guide.iconOnYourHomeScreen') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { IonIcon, IonImg } from '@ionic/vue';
import { close, exitOutline } from 'ionicons/icons';
import { useAppStore } from '@/store/app';
import { useTenantStore } from '@/store/tenant';
import { iosPwaGuideModal } from '@/utils/pwa/showIosGuide';

const appStore = useAppStore(); // 应用状态
const tenantStore = useTenantStore(); // 租户状态

const icon = computed(() => tenantStore.tenantInfo?.icon);
const name = computed(() => tenantStore.tenantInfo?.name);
const url = computed(() => location.host);

/**
 * @description 关闭模态框
 */
 function closeModal() {
  appStore.modalVisible = false;
  iosPwaGuideModal?.dismiss();
}
</script>

<style lang="less" scoped>
.-rotate-90.text-xl {
  color: #007AFF;
}

.amber-purple {
  .title {
    color: var(--text-color-light-purple-1-100);
  }
  .pwa-tip {
    background-color: var(--color-bg-300);
    color: var(--text-color-light-purple-2-100);
  }
  .accent-box {
    border: none;
    background-color: var(--color-bg-100);
    color: var(--text-color-light-purple-1-100);
  }
}

</style>
