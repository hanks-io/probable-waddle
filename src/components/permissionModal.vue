<!-- 通知授权提示弹窗 -->
<template>
  <div id="permission-modal" class="w-full p-2 h-f ull">
    <div class="flex flex-col p-4 rounded-lg permission-content">
      <div class="flex mb-4">
        <ion-img class="w-12 h-12 cover" slot="start" :src="tenantInfo?.icon" />
        <p class="flex-1 px-4">{{ openNoticeText }}</p>
        <ion-icon class="text-xl close-icon" :icon="close" @click="closeModal" />
      </div>
      <ion-button mode="ios" :color="!newSkin ? 'tertiary' : ''" @click="requestPermission"> {{ $t("popup.premissionBtn") }}</ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { initMTpush } from "@/logic";
import { close } from "ionicons/icons";
import { BROWSER } from "@/enums/device";
import { useAppStore } from "@/store/app";
import { useSystemStore } from "@/store/system";
import { useTenantStore } from "@/store/tenant";
import { IonImg, IonIcon, IonButton } from "@ionic/vue";
import { permissionModal } from "@/utils/pwa/showPermission";
import { ZConfigType } from "@/enums/types/config.type";
import { useI18n } from "@/hooks/useI18n"
import { getTheme } from '@/theme/hooks'
const { t } = useI18n();

const appStore = useAppStore(); // 用户store
const tenantStore = useTenantStore(); // 商户户store
const systemStore = useSystemStore(); // 系统store
const { newSkin } = getTheme()
const tenantInfo = computed(() => tenantStore.tenantInfo); // 商户信息
const openNoticeText = computed(() => {
  if (tenantInfo.value?.openNoticeTextType === ZConfigType.Enum.Custom) {
    return tenantInfo.value?.openNoticeText ?? "";
  }
  return t("popup.premissionTip");
})


/**
 * @description 关闭模态框
 */
function closeModal() {
  appStore.modalVisible = false;
  permissionModal?.dismiss();
}

onMounted(() => {
  sessionStorage.isInitPush = true;
  if (appStore.MTTimeId) {
    clearInterval(appStore.MTTimeId)
  }

})
/**
 * @description 请求通知权限
 */
function requestPermission() {
  Notification.requestPermission().then((permission) => {
    console.log("click the permission: ", permission);
    if (permission === "granted") {
      console.log('requestPermission:', permission);
      if (systemStore.browser === BROWSER.MOBILE_SAFARI) {
        localStorage.setItem("iosPermission", "false");
      }
      initMTpush();
    } else if (permission === "denied") {
      if (systemStore.browser === BROWSER.SAMSUNG_INTERNET) {
        localStorage.setItem("samsungPermission", "false");
      } else if (systemStore.browser === BROWSER.MOBILE_SAFARI) {
        localStorage.setItem("iosPermission", "false");
      }
    }
  });
  setTimeout(() => {
    closeModal();
  }, 100);
}
</script>

<style scoped>
.permission-content {
  background: var(--ion-color-dark);
  color: var(--ion-color-light);
}

ion-button {
  --color: var(--ion-color-dark);
  --border-radius: var(--rounded-button-tab);
}

:global(ion-modal#permission-modal) {
  /* 全局设置内容样式 */
  --backdrop-opacity: 0;
}

.new-skin-symbol {
  .permission-content {
    background: var(--ep-color-background-fill-surface-raised-L1);
    color: var(--ep-color-text-default);
    .close-icon {
      color: var(--ep-color-icon-default);
    }
  }

  ion-button {
    --color: var(--ep-color-text-inverse);
    --border-radius: 4px;
    --background: var(--ep-dynamic-primary);
  }
}
</style>
