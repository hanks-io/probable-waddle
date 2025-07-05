import { useAppStore } from "@/store/app";
import { modalController } from "@ionic/vue";

export async function showShareWheelModal() {
  if (useAppStore().modalVisible) return; // 如果已经弹出了登录框，则不再弹出
  useAppStore().modalVisible = true;
  const { default: ShareWheel } = await import('@/components/ShareWheel.vue');
  const modal = await modalController.create({
    component: ShareWheel,
    cssClass: 'share-wheel-modal',
  });
  modal.present();
}
