import { toastController } from "@ionic/vue";
import { ToastOptions } from "@ionic/core/components";
import { alertCircle, checkmarkCircle } from 'ionicons/icons';
import i18n from '@/i18n';

const { t, te } = i18n.global

let toast: HTMLIonToastElement | null = null;

/**
 * 消息提示框
 * @param message 提示信息
 * @param interval 延迟打开时间
 * @param position 显示位置
 */
export const showToast = async (message: string, color: string = '', position: ToastOptions["position"] = 'middle', duration: number = 2000) => {
  if (toast) {
    await toast.dismiss();
    toast = null;
  }

  toast = await toastController.create({
    message: te(message) ? t(message) : message,
    position,
    mode: 'ios',
    icon: color ? (color == 'success' ? checkmarkCircle : alertCircle) : undefined,
    duration,
    cssClass: color
  });
  toast.present();
  return  toast
};

