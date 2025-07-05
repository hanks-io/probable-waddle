// 站点维护弹窗
import { debounce } from '@/utils'
import { modalController } from '@ionic/vue'
import Maintenance from '@/components/Maintenance/index.vue'

// 是否正在维护中
let isMaintenance = false;

export async function maintenance(endTime: string) {
  if (isMaintenance) return;
  isMaintenance = true;
  const popup = await modalController.create({
    component: Maintenance,
    id: 'maintenance',
    componentProps: { endTime },
    backdropDismiss: false,
    animated: true,
  });
  popup.present();
}

export const showMaintenance = debounce(maintenance, 1000, { leading: true, trailing: false });
