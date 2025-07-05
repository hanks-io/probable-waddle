import { PLATFORM } from '@/enums/device';
import router from "@/router";
import { checkIsSwModal } from '@/utils';
import { ForceModalKeyType } from './useShow';
const popupTimeList = ['RECHARGE', 'HOME', 'FIRST_WITHDRAWAL'] as const
const installTypeList = ['PWA', 'APK', 'PWA+APK'] as const
export type PopupTimeType = typeof popupTimeList[number]
export type InstallType = typeof installTypeList[number]
export interface ForceModalData {
  popupTime: PopupTimeType,
  installType: InstallType,
  guideInstall: boolean
  popupInterval: number
  expireDate: number
  isNotOpen: boolean
}
export const useNotData = (key: ForceModalKeyType) => {
  const userStore = useUserStore();
  const systemStore = useSystemStore();   // 系统信息
  const channelStore = useChannelStore(); // 渠道信息 
  const route = router.currentRoute
  const { platform, isApkFinal, isIOSApp, isIOS, isPwa, isApk, isApkShelfPackage } = toRefs(systemStore)
  const { isPwaUser, isAPKUser, isIOSAppUser } = toRefs(userStore)
  

  return new Map([
    ['app', () => isApkFinal.value || isIOSApp.value],
    ['platform', () => platform.value !== PLATFORM.WEB],
    ['ios', () => isIOS.value ? (isPwa.value || isPwaUser.value) : false],
    ['isAPKUser', () => isAPKUser.value ? !(isApkShelfPackage.value && isApk.value) : false],
    ['isIOSAppUser', () => isIOSAppUser.value],
    ['isNotInHome', () => route.value.path !== '/main/inicio'],
    ['isInSw', () => !!checkIsSwModal()]
  ]);

}


export const useData = (params: ForceModalData) => {
  const userStore = useUserStore();       // 用户信息
  const systemStore = useSystemStore();   // 系统信息
  const { isPwa } = toRefs(systemStore)
  const { isPwaUser } = toRefs(userStore)
  const route = router.currentRoute

  const popupTimeInfo: ReadonlyMap<PopupTimeType, boolean> = new Map([
    ['RECHARGE', !!userStore.user?.firstRechargeAmount],
    ['HOME', true],
    ['FIRST_WITHDRAWAL', userStore.user?.withdrawCount === 1]
  ]);

  return new Map([
    ['isNotShow', () => !params.guideInstall || params.isNotOpen],
    ['isNotInHome', () => route.value.path !== '/main/inicio'],
    ['pwa', () => (isPwa.value || isPwaUser.value) ? params.installType !== 'APK' : false],
    ['expireDate', () => params.popupInterval !== 0 && params.expireDate > Date.now()],
    ['popupTime', () => !popupTimeInfo.get(params.popupTime)]
  ]);
}
