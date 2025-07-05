import { useAgentStore } from '@/store/agent'

export const useShareModal = () => {
  const agentStore = useAgentStore()
  /**
   * 分享平台列表
   */
  const sharePlatformList = computed(() => agentStore.shareConfig?.filter(v => v.isOpen) ?? []);
  return {
    sharePlatformList
  }
}
