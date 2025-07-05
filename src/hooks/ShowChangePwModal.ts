import { modalController } from '@ionic/vue'
import ChangePwModalComponet from '@/components/changePwModal/index.vue'

/**
 * @description 显示修改密码弹窗
 */
export async function showChangePwModal() {
  let changePwModal = await modalController.create({
    id: "change-pw-modal",
    component: ChangePwModalComponet,
  });
  changePwModal.present();
}
