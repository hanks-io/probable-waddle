import { useNotData, useData } from "./useNotShowPublicLogic";
import { isEmpty } from "@/utils";
import type { ForceModalData } from "./useNotShowPublicLogic";
import router from "@/router";
import { uesShowForceModal } from "./useShow"
const popupTimeList = ['Recharge', 'Home', 'Withdrawal'] as const
export type APKTaskPopupTimeType = typeof popupTimeList[number]
export const apkTaskForceModal = async () => {
  const userStore = useUserStore();
  const systemStore = useSystemStore();   // 系统信息
  const forceModalKey = 'taskAPK'

  const checkNotShowSystemConditions = () => {
    const notUseDataShowMap = useNotData(forceModalKey)
    const { isAPKUser } = toRefs(userStore)
    const { isIOS } = toRefs(systemStore)

    const systemConditionsMap = new Map([
  
      ['isAPKUser', () => isAPKUser.value]
    ])

    for (const [key, fn] of systemConditionsMap) {
      notUseDataShowMap.set(key, fn)
    }

    return [...notUseDataShowMap.values()].some(fn => fn())
  }

  const checkUserLogin = async () => {
    return !(await useAppStore().checkUserHasLogin());
  }

  const checkNotShowTaskConditions = async () => {
    const channelStore = useChannelStore(); // 渠道信息 
    const taskStore = useTaskStore()
    const route = router.currentRoute
    const ch = (route.value.query.ch || 0) as number

    const getTaskData = async () => {
      if(!taskStore.taskMap.size){
        await taskStore.updateTaskList('NewbieTask')
      }     
      const taskData = await taskStore.getInstallApkTaskDetail()
      if (isEmpty(taskData)) return null
      return taskData
    }

    const taskData = await getTaskData()
    if (!taskData) return true

    const { rewardMax, rewardMin, popupSwitch } = taskData
    const { popupInterval, range, apkUrl, popupType, iosUrl, isApk: isOpenApk, isIos: isOpenIos, domainRange, iosAddressType, iosPackageId } = taskData.otherConfig

    if(popupSwitch === 'OFF'){
      return true
    }

    const getForceModalParams = async (): Promise<ForceModalData> => {
      const expireDate = await channelStore.getCompulsoryInstallTime('taskAPK')
      return {
        popupTime: 'HOME',
        installType: "APK",
        guideInstall: true,
        popupInterval: Number(popupInterval) || 0,
        expireDate,
        isNotOpen: popupSwitch !== 'ON'
      }
    }

    const getPopupTimeInfo = (): ReadonlyMap<APKTaskPopupTimeType, boolean> => {
      return new Map([
        ['Recharge', !!userStore.user?.firstRechargeAmount],
        ['Withdrawal', userStore.user?.withdrawCount >= 1],
        ['Home', true],
      ])
    }

    const handleInRange = () => {
      let isInRange = domainRange.length ? domainRange.some((it: any) => it.name.includes(window.location.hostname)) : false
      if (!isInRange) {
        const channelIdList: number[] = range.reduce((acc: number[], cur: any) => {
          if (cur.channelIdList.length) {
            acc.push(...cur.channelIdList)
          }
          return acc;
        }, [])
        isInRange = channelIdList.includes(Number(ch))
      }
      return !isInRange
    }
    const handleOpen = () => {
      const { isIOSH5, isAndroidH5 } = toRefs(systemStore)
      const conditionsMap = new Map([
        ['IOSH5', () => isIOSH5.value ? !isOpenIos : false],
        ['androidH5', () => isAndroidH5.value ? !isOpenApk : false]
      ])
     return [...conditionsMap.values()].some(fn => fn())
    }

    const configureDataShowMap = (useDataShowMap: Map<string, () => boolean>, popupTimeInfo: ReadonlyMap<APKTaskPopupTimeType, boolean>) => {
      const configMap = new Map([
        ['popupTime', () => !(popupType as APKTaskPopupTimeType[]).some(it => popupTimeInfo.get(it))],
        ['isInRange', handleInRange],
        ['isOpen', handleOpen]
      ])

      useDataShowMap.delete('pwa')
      for (const [key, fn] of configMap) {
        useDataShowMap.set(key, fn)
      }

      return useDataShowMap
    }

    const getPopupTime = (popupTimeInfo: ReadonlyMap<APKTaskPopupTimeType, boolean>) => {
      let popupTime = ""
      for (const [key, value] of popupTimeInfo) {
        if (value && popupType?.includes(key)) {
          popupTime = key
          break
        }
      }

      const popupTimeMap: Record<APKTaskPopupTimeType, string> = {
        Recharge: 'RECHARGE',
        Home: 'HOME',
        Withdrawal: 'FIRST_WITHDRAWAL'
      }
      return popupTime ? popupTimeMap[popupTime as APKTaskPopupTimeType] : popupTimeMap.Home
    }
  
    const updatePromotionInfo = (popupTime: string) => {
      const { isIOS } = toRefs(systemStore)
      channelStore.promotionInfo = {
        ...(channelStore?.promotionInfo || {}),
        installType: isIOS.value ?  (isOpenIos ? "APPSTORE" : "DESK" ): "APK",
        installUrl: isIOS.value? iosUrl : apkUrl,
        popupInterval: `${popupInterval}`,
        popupTime,
        popupType: "REWARD",
        showGiftAmount: [`${rewardMin}`, `${rewardMax}`],
        iosAddressType,
        iosPackageId,
      }
    }

    const params = await getForceModalParams()
    const useDataShowMap = useData(params)
    const popupTimeInfo = getPopupTimeInfo()
    const popupTime = getPopupTime(popupTimeInfo)
    updatePromotionInfo(popupTime)
    const configuredDataShowMap = configureDataShowMap(useDataShowMap, popupTimeInfo)
    return [...configuredDataShowMap.values()].some(fn => fn())
  }

  const validateModalConditions = async (): Promise<boolean> => {
    const conditionChecksMap = new Map<string, () => Promise<boolean> | boolean>([
      ['system', checkNotShowSystemConditions],
      ['login', checkUserLogin],
      ['task', checkNotShowTaskConditions]
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
