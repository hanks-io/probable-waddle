<template>
  <ion-page>
    <!-- 左侧抽屉 -->
    <component :is="drawerLeftComponent" />
    <ion-content id="main-content">
      <ion-tabs class="relative">
        <ion-router-outlet :animated="!isIOS" />
        <component :is="tabsComponent" />
      </ion-tabs>
    </ion-content>
    <!-- 语言选择弹窗 -->
    <LanguageModal />
    <!-- 安装弹窗 -->
    <InstallModal :visible="installModalVisible" />
    <!-- PWA底部弹窗 -->
    <PwaFooterModal v-if="pwaFooterVisible" />
   
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabs, IonPage, IonRouterOutlet, IonContent } from "@ionic/vue";
import LanguageModal from "../../components/LanguageModal.vue";

import PwaFooterModal from "@/pwa/footerModal/Default.vue";
import InstallModal from "@/pwa/installModal/HomeModal.vue";
import useMainPageLogic from "../logic";
import useComponents from "../useComponents";

const {
  tabsComponent,
  drawerLeftComponent
} = useComponents();

const { isIOS, installModalVisible, pwaFooterVisible, useReDomainModal } =
  useMainPageLogic();
useReDomainModal();
</script>

<style lang="less" scoped></style>
