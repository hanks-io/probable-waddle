import { modalController } from "@ionic/vue";
import { announcementModal } from "./announcement"
import { emitter } from "@/utils"
export const closeForceModal = async (isSetExpirationTime: boolean = true, options?: {type: 1 | 2}) => {
  const appStore = useAppStore(); // 用户store
  const channelStore = useChannelStore(); // 渠道store
  isSetExpirationTime && channelStore.setCompulsoryInstallTime(channelStore.promotionInfo?.popupInterval);
  appStore.modalVisible = false;
  channelStore.isShowForceModal = false;
  channelStore.forceModalCloseType = options?.type || 2; 
  try {
    const topModal = await modalController.getTop();
    if (topModal) {
      modalController.dismiss();
    }
  } catch (error) {
    console.warn('Modal dismiss error:', error);
  } finally {
    if (!isSetExpirationTime) return
    const result = await announcementModal()
    if (result === 0){ // 强制弹出可以手动关闭且没有公告时发出事件 告诉活动组件需要显示新人专享活动
      emitter.emit('forcedModal/dismiss', { type: 'newUserExclusive' });
    }
  }
}


