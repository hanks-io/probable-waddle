import { closeForceModal } from "./useClose";
import showCompulsoryModal from '@/pwa/hooks/useCompulsoryModal';
const forceModalKeyList = ['compulsoryInstallTime', 'taskAPK', "registerReward", "announcement"] as const
export type ForceModalKeyType = typeof forceModalKeyList[number]
export const uesShowForceModal = async (key: ForceModalKeyType) => {
  const channelStore = useChannelStore(); // 渠道信息 
  if(channelStore.isShowForceModal ){
    closeForceModal(false)
    channelStore.isShowForceModal = false
  }
  channelStore.forceModalKey = key
  await showCompulsoryModal()
}
