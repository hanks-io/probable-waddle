import { apkTaskForceModal } from "./apkTask"
import { registerRewardForceModal } from "./registerReward"
import { channelForceModal } from "./channel"
import { announcementModal } from "./announcement"
import { newUserExclusiveModal } from "./newUserExclusive"

 const useForcedModal = async () => {
  const channelStore = useChannelStore(); // 渠道信息
  const token = await useAppStore().getToken(); 
  const activityStore = useActivityStore();
  token && await activityStore.getUserHomeTop(token); // 查询首页活动状态
  const forceModalMap = new Map<string, () => Promise<boolean>>([
    ['registerReward', registerRewardForceModal], 
    ['apkTask', apkTaskForceModal],
    ['channel', channelForceModal],
    ['announcement', announcementModal],
    ['newUserExclusive', newUserExclusiveModal]
  ])
  for (const [key, fn] of forceModalMap) {
    const isShowForceModal = await fn()
    channelStore.isShowForceModal = isShowForceModal
    if (isShowForceModal) {
      return true
    }
  }
  return false
}

export {
  apkTaskForceModal,
  registerRewardForceModal, 
  channelForceModal,
  announcementModal,
  useForcedModal
}
