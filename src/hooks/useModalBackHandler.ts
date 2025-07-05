// 处理使用浏览器的后退按钮时的模态框行为

import { modalController } from '@ionic/vue';
import { onMounted, onUnmounted } from 'vue';

interface ModalBackHandlerOptions {
  closeAllModals?: boolean;
}

export function useModalBackHandler(options: ModalBackHandlerOptions = {}) {
  const {
    closeAllModals = true,
  } = options;

  const dismissModals = async () => {
    let topModal = await modalController.getTop();
    if (closeAllModals) {
      while (topModal) {
        await topModal.dismiss();
        topModal = await modalController.getTop();
      }
    } else if (topModal) {
      await topModal.dismiss();
    }
  };

  const handlePopState = async () => {
    const topModal = await modalController.getTop();
    if (!topModal) return;

    await dismissModals();
  };

  const isModalOpen = async () => !!(await modalController.getTop());

  onMounted(() => {
    window.addEventListener('popstate', handlePopState);
  });

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState);
  });

  return {
    isModalOpen,
    closeAllModals: dismissModals,
  };
}
