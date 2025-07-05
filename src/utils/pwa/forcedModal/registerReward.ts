import { useNotData, useData } from "./useNotShowPublicLogic";
import type { ForceModalData } from "./useNotShowPublicLogic";
import router from "@/router";
import { uesShowForceModal } from "./useShow"
import { registerRewardInfoApi } from "@/api/normal"
import { isEmpty } from "@/utils";
import { SD_MODEL } from '@/enums/device'

const genChanelInfo = async () => {
  const channelStore = useChannelStore()
  await channelStore.reqChannelInfo()
  return channelStore.promotionInfo
}

const isUserChannelConfig = async () => {
  /* 
   注册弹框走渠道配置需要满足下面几个条件
   1:必须是ios系统
   2:当前用户必须是顶级会员
   3:有配置渠道配置，默认光官方渠道不算
   4:渠道ios的参数guideInstall为true
  
  */
  const agentStore = useAgentStore()
  const systemStore = useSystemStore()
  const channelInfo = await genChanelInfo()
  const dataMap = new Map([
    ['isIOS', () => systemStore.isIOS],   // 1:必须是ios系统
    ['isHasCH', () => router.currentRoute.value.query.ch],  //3:有配置渠道配置，默认光官方渠道不算`
    ['guideInstall', () => channelInfo?.guideInstall]   // 4:渠道ios的参数guideInstall为true
  ])

  const bool = [...dataMap.values()].every(fn => fn())
  if (!bool) return false
  // 2:当前用户必须是顶级会员 parentId=0或者null就是顶级
  const agencyInfo = await agentStore.getAgencyInfo()
  if (agencyInfo?.parentId) return false
  return true
}

export const registerRewardForceModal = async () => {
  const systemStore = useSystemStore()
  const userStore = useUserStore();
  const forceModalKey = 'registerReward'

  //注册赠送需要添加 注册的奖金领取没有活着没有参与不弹框  

  const checkNotShowSystemConditions = () => {
    const notUseDataShowMap = useNotData(forceModalKey)
    notUseDataShowMap.delete('isNotInHome')
    return [...notUseDataShowMap.values()].some(fn => fn())
  }
  const isNotShow = checkNotShowSystemConditions()


  if (isNotShow) return false

  const checkUserAuth = async () => {
    const checkLoginMap = new Map([
      ['isLogin', async () => !(await useAppStore().checkUserHasLogin())],
      ['canUseReward', async () => {
        const user = await userStore.user || await userStore.getUser()
        return !user?.canUseRegisterRewardInfo
      }]
    ])

    for (const [_, fn] of checkLoginMap) {
      if (await fn()) return true
    }
    return false
  }

  const checkNotShowRegisterRewardConditions = async () => {
    const getRegisterRewardInfo = async () => {
      const registerRewardInfo = await registerRewardInfoApi()
      if (isEmpty(registerRewardInfo)) return null
      return registerRewardInfo as { frontConfig: string; rewardSwitch: boolean, registerRewardAmount: number }
    }

    const parseConfig = (frontConfig: string) => {
      try {
        const parsedConfig = JSON.parse(frontConfig) as Record<string, any>
        console.log(parsedConfig, 'registerRewardInfo')
        return parsedConfig
      } catch (error) {
        console.log('解析失败', error)
        return {}
      }
    }

    const getCurrentConfig = (parsedConfig: Record<string, any>) => {
      return systemStore.app?.build === SD_MODEL.IOS_H5
        ? (parsedConfig as { ios?: any })?.ios
        : (parsedConfig as { android?: any })?.android
    }

    const getForceModalParams = async (currentConfig: any, rewardSwitch: boolean) => {
      return {
        popupTime: 'HOME',
        installType: currentConfig?.installType,
        guideInstall: currentConfig?.guideInstall,
        popupInterval: 0,
        expireDate: 0,
        isNotOpen: !rewardSwitch
      } as ForceModalData
    }

    const updatePromotionInfo = (currentConfig: any, showGiftAmount: number) => {
      const channelStore = useChannelStore()
      channelStore.promotionInfo = {
        ...(channelStore?.promotionInfo || {}),
        ...currentConfig,
        popupTime: 'HOME',
        popupInterval: '0',
        showGiftAmount
      }
    }

    const registerRewardInfo = await getRegisterRewardInfo()
    if (!registerRewardInfo) return true

    const { frontConfig, rewardSwitch, registerRewardAmount } = registerRewardInfo
    const parsedConfig = parseConfig(frontConfig)
    if (isEmpty(parsedConfig)) return true
    const currentConfig = await isUserChannelConfig() ? (await genChanelInfo()) : getCurrentConfig(parsedConfig)
    const params = await getForceModalParams(currentConfig, rewardSwitch)

    const useDataShowMap = useData(params)
    const user = await userStore.user || await userStore.getUser()
    useDataShowMap.set('unableParticipate', () => !user?.canUseRegisterRewardInfo)
    useDataShowMap.delete('isNotInHome')
    updatePromotionInfo(currentConfig, registerRewardAmount)
    return [...useDataShowMap.values()].some(fn => fn())
  }

  const validateModalConditions = async (): Promise<boolean> => {
    const conditionChecksMap = new Map<string, () => Promise<boolean> | boolean>([
      ['system', checkNotShowSystemConditions],
      ['auth', checkUserAuth],
      ['task', checkNotShowRegisterRewardConditions]
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
