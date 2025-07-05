import { useAppStore } from '@/store/app';
import { modalController } from '@ionic/vue'
import Modal from '@/components/permissionModal.vue'
import { emitter } from '@/utils/event';
export let permissionModal: HTMLIonModalElement | null = null;

/**
 * @description 弹出授权提示框
 */
export async function showPermissionModal() {
  const appStore = useAppStore();
  if (appStore.modalVisible) return;     // 如果已存在弹窗，则不再弹出
    appStore.modalVisible = true;
  permissionModal = await modalController.create({
    component: Modal,
    id: 'permission-modal',
  });
  permissionModal.onDidDismiss().then(() => {
    appStore.modalVisible = false;
    emitter.emit('user/permissionMT', {})
    
  });
  permissionModal.present();
}
