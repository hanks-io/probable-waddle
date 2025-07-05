import { useAppStore } from '@/store/app';
import { modalController } from '@ionic/vue'
import LoginModalComponet from '@/components/loginModal/index.vue'
import { emitter } from '@/utils/event';

export let loginModal: HTMLIonModalElement | null = null;


/**
 * @description 弹出登录框
 */
export async function showLogin(operation: 'login' | 'register' = 'login') {
  if (useAppStore().modalVisible) return;     // 如果已经弹出了登录框，则不再弹出
  useAppStore().modalVisible = true;
  if (await useAppStore().getToken())         // 如果已经登录，则不再弹出
    return useAppStore().modalVisible = false;
  useAppStore().operation = operation;
  loginModal = await modalController.create({
    id: "login-modal",
    component: LoginModalComponet,
  });
  loginModal.onDidDismiss().then(() => {
    useAppStore().modalVisible = false;
    emitter.emit('user/registerModalClose', {})
  });
  loginModal.present();
}
