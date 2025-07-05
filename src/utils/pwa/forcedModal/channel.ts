import { useNotData, useData } from "./useNotShowPublicLogic";
import  type { ForceModalData } from "./useNotShowPublicLogic";
import { getWebDomain } from '@/utils/app'
import router from "@/router";
import {uesShowForceModal} from "./useShow"
export const channelForceModal = async() => {
const forceModalKey = 'compulsoryInstallTime'
  const checkNotShowSystemConditions = () => {
   return [...useNotData(forceModalKey).values()].some(fn => fn())
  }
  const checkNotShowChannelConditions = async () => {
    const channelStore = useChannelStore(); // 渠道信息
    const tenantStore = useTenantStore();

    const getChannelId = () => {
      const route = router.currentRoute;
      return (route.value.query.ch || 0) as number;
    }

    const requestChannelInfo = async () => {
      await channelStore.reqChannelInfo({
        id: getChannelId(),
        tenantId: tenantStore.tenantId || 0,
        domain: getWebDomain(),
      });
    }

    const getForceModalParams = async (): Promise<ForceModalData> => {
      const expireDate = await channelStore.getCompulsoryInstallTime();
      return {
        popupTime: channelStore.promotionInfo?.popupTime,
        installType: channelStore.promotionInfo?.installType,
        guideInstall: channelStore.promotionInfo?.guideInstall,
        popupInterval: Number(channelStore.promotionInfo?.popupInterval) || 0,
        expireDate,
        isNotOpen: false
      };
    }


    await requestChannelInfo();
    const params = await getForceModalParams();
    return [...useData(params).values()].some(fn => fn());
  
  }

  const validateModalConditions = async (): Promise<boolean> => {
    const conditionChecksMap = new Map<string, () => Promise<boolean> | boolean>([
      ['system', checkNotShowSystemConditions],
      ['task', checkNotShowChannelConditions]
    ])

    for (const fn of conditionChecksMap.values()) {
      const isNotShow = await fn()
      if (isNotShow) return false
    }
    await uesShowForceModal(forceModalKey)
    return true
  }

  return await validateModalConditions()
}
