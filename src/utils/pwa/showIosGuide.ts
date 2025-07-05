import { useAppStore } from '@/store/app'
import { modalController } from '@ionic/vue'
import Modal from '@/pwa/comp/IosPwaGuideModal.vue'

export let iosPwaGuideModal: HTMLIonModalElement | null = null;

/**
 * @description 显示强制安装弹窗
 */
export async function showIosPwaGuideModal() {
  const appStore = useAppStore();
  appStore.modalVisible = true;
  iosPwaGuideModal = await modalController.create({
    component: Modal,
    id: 'ios-pwa-guide',
  });
  iosPwaGuideModal.onDidDismiss().then(() => {
    appStore.modalVisible = false; // 关闭弹窗后，将弹窗状态设置为false
  });
  iosPwaGuideModal.present();
}
