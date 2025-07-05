import { emitter } from '../event';
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";

export function registerStoreEvents() {
  const appStore = useAppStore();
  const userStore = useUserStore();

  emitter.on('user/withdraw-success', () => {
    initPwaFooterVisible();
  });

  emitter.on('user/pay-success', () => {
    userStore.setUser();
    userStore.setAssets();
    initPwaFooterVisible();
  })

  function initPwaFooterVisible() {
    appStore.setPwaFooterVisible(true); // 设置PWA底部栏显
    appStore.isShowPwaFooter = false;; // 设置PWA底部栏显
    appStore.alreadyPwaFooter = false;
    
  }
}
