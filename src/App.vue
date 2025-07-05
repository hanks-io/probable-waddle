<script setup lang="ts">
import { useLogic, MTpushInterfaceHandler } from "./logic";
import { jsBridgeInit } from "./utils/app";
import { onBeforeMount, onMounted, watch, onBeforeUnmount, computed } from "vue";
import { IonApp, IonRouterOutlet, IonContent, IonSpinner, IonImg, modalController } from "@ionic/vue";
import CopyUrlModal from "@/components/CopyUrlModal.vue";
import TenantModal from "@/components/TenantsModal.vue";
import { checkDevToolsIsOpen } from "@/hooks/useCheckDevTools";
import { getVersion, createScript } from "@/utils";
import { useCheckPixelReport } from "@/hooks/useCheckPixelReport";
import { checkIsSwModal } from '@/utils';
import { useModalBackHandler } from "@/hooks/useModalBackHandler";
import { useRoute } from "vue-router";

const route = useRoute(); // 当前路由
const appStore = useAppStore(); // 用户信息
const systemStore = useSystemStore(); // 系统信息
const tenantStore = useTenantStore(); // 租户信息
const channelStore = useChannelStore(); // 渠道信息
const elementStore = useElementStore(); // 元素信息
const statusStore = useStatusStore(); // 状态信息

const isIOS = computed(() => systemStore.isIOS); // 是否是IOS
const maxWidth = computed(() => elementStore.screenWidth); // 最大宽度
const copyUrlModalVisible = computed(() => channelStore.copyUrlModalVisible); // 拷贝URL模态框是否显示
const { isLoaded, tenants, tenantsModalVisible, webAppInit, selectTenantHandle, appInit, removeListener } = useLogic(route); // 逻辑处理

checkDevToolsIsOpen(); // 检测开发者工具是否打开
useCheckPixelReport(); // 检测像素回传

// 监听商户信息变化
watch(
  [() => tenantStore.tenantId, () => appStore.token],
  async ([id, _token]) => {
    if (id) {
      webAppInit();
    }
  },
  { immediate: true },
);
watch(
  () => route.path,
  (val) => {
    const floatBtn = document.querySelector(".xuanfu") as HTMLElement;
    if (floatBtn) {
      if (/^\/game/.test(val)) {
        floatBtn.style.display = "none";
      } else {
        floatBtn.style.display = "block";
      }
    }
  },
);
/**
 * 生命周期-页面加载前
 */
onBeforeMount(() => {
  jsBridgeInit(); // 初始化原生交互方法
  tenantStore.loadTenantInfo(); // 加载商户信息
});

/**
 * 生命周期-页面加载前
 */
onMounted(async () => {
  // 不顶层窗口不初始化推送
  appInit();
  if (!checkIsSwModal()) {
    await MTpushInterfaceHandler(); // 初始化推送(极光推送)
  }

  if (typeof (window as any).isSamsungBrowser === 'function' && (window as any).isSamsungBrowser()) {
    setTimeout(() => {
      const version = getVersion();
      createScript("/versionControl/webPushSdk.produce.min.2.1.6.js", version);
    }, 3000);
  }
});

/**
 * @description 拷贝URL模态框关闭事件
 */
function copyUrlModalDismiss() {
  channelStore.copyUrlModalVisible = false;
}

/**
 * 生命周期-页面卸载前
 */
onBeforeUnmount(() => {
  removeListener();
});
</script>

<template>
  <!-- 是否是不顶层窗口 或者 是防封域名 -->
  <ion-app>
    <ion-content id="app-content" :scroll-y="false">
      <ion-router-outlet v-if="isLoaded" class="mx-auto overflow-hidden" :style="`max-width:${maxWidth}px`"
       :animated="!isIOS"
       :class="{ 'fade-in-loading-main-tree': statusStore.isMainTreeLoading }" />
      <div v-if="!statusStore.isMainTreeLoading" class="flex flex-col items-center justify-center full-screen-loading-main-tree">
        <ion-spinner class="w-10 h-10" name="crescent" data-main-tree-loading />
      </div>
    </ion-content>
    <!-- 选择商户弹窗 -->
    <TenantModal :tenants="tenants" :visible="tenantsModalVisible" @tenantChange="selectTenantHandle" />
    <!-- 拷贝URL弹窗 -->
    <CopyUrlModal :visible="copyUrlModalVisible" @modalDismiss="copyUrlModalDismiss" />
  </ion-app>
</template>

<style>
@import "swiper/css";
/* 轮播图样式 */
@import "tailwindcss/base";
/* tailwindcss样式库 */
@import "@/common/global.less";
/* 全局样式 */
@import "@/common/record.css";
/* 全局样式 */
@import "swiper/css/pagination";
/* 轮播图指示器样式 */
@import "tailwindcss/utilities";
/* tailwindcss样式库 */
@import "tailwindcss/components";
/* tailwindcss样式库 */

ion-app {
  background: var(--color-screen-bg);
}

.new-skin-symbol {
  body {
    background: var(--ep-color-background-fill-surface-raised-L2);
  }

}

#app-content {
  --background: transparent;
  background-image: var(--color-screen-bg-img);
  background-size: 5rem;
  /* 设置背景图像块的大小为100px x 100px */
  background-repeat: repeat;
  /* 设置背景图像平铺 */
}

@media all and (display-mode: standalone),
all and (display-mode: fullscreen),
all and (display-mode: minimal-ui),
all and (display-mode: widows-controls-overlay) {

  #pwa-bar,
  #pwa-footer-modal,
  #app-install-bar {
    display: none;
  }
}

.full-screen-loading-main-tree {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--color-screen-bg, #000);
  z-index: 1000;
  opacity: 1;
}

.fade-in-loading-main-tree {
  animation: fade-in-main-tree 0.3s ease-in-out;
}
@keyframes fade-in-main-tree {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
