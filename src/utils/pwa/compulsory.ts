import { PLATFORM } from '@/enums/device';
import { useUserStore } from '@/store/user';
import { useSystemStore } from '@/store/system';
import { useChannelStore } from '@/store/channel';
import showCompulsoryModal from '@/pwa/hooks/useCompulsoryModal';
import { getWebDomain } from '@/utils/app'
import router from "@/router";
import {closeForceModal} from '@/utils/pwa/forcedModal/useClose'
import { getUrlParam } from '@/utils';
const popupTimeList = ['RECHARGE', 'HOME', 'FIRST_WITHDRAWAL'] as const
export type PopupTimeType = typeof popupTimeList[number]

const isNotShowCompulsoryModal = () => {
  const systemStore = useSystemStore();   // 系统信息
  const { platform, isPwa, isApk, isIOS, isApkShelfPackage, isApkFinal, isIOSApp } = toRefs(systemStore)
  if (isApkFinal.value || isIOSApp.value) return true
  if (platform.value !== PLATFORM.WEB) return true
  const userStore = useUserStore();       // 用户信息
  const channelStore = useChannelStore(); // 渠道信息 
  const { promotionInfo } = toRefs(channelStore)
  const { isPwaUser, isAPKUser } = toRefs(userStore)
  if (isPwa.value || isPwaUser.value) {
    if (isIOS.value) return true
  }
  const pwaIsShowModal = (isPwa.value || isPwaUser.value) ? promotionInfo.value?.installType !== 'APK' : false
  if (pwaIsShowModal) return true
  if (isAPKUser.value || isApk.value) {
    return !isApkShelfPackage.value
  } else {
    return false
  }
}
/**
 * 强制安装检测
 */
export default async () => {

  const userStore = useUserStore();       // 用户信息
  const tenantStore = useTenantStore()
  const domain = getWebDomain()
  const route = router.currentRoute
  const ch = (route.value.query.ch || 0) as number
  const channelStore = useChannelStore(); // 渠道信息 
  if (route.value.path !== '/main/inicio') return false
  await channelStore.reqChannelInfo({
    id: ch,
    tenantId: tenantStore.tenantId || 0,
    domain: domain,
  })
  const { promotionInfo } = toRefs(channelStore)
  if (!promotionInfo.value || !promotionInfo.value?.guideInstall || !promotionInfo.value?.popupTime) return false      // 判断是否有引导安装
  if (isNotShowCompulsoryModal())  // 判断pwa环境或pwa用户或非上架包环境不弹窗
    return false;

  if (promotionInfo.value?.popupInterval != 0) {
    // 判断是否有强制安装过期时间
    const expire = await channelStore.getCompulsoryInstallTime();

    if (expire > Date.now()) return false;
  }
  const popupTime: PopupTimeType = promotionInfo.value.popupTime

  const popupTimeInfo: Record<PopupTimeType, boolean> = {
    RECHARGE: !!userStore.user?.firstRechargeAmount,
    HOME: true,
    'FIRST_WITHDRAWAL': userStore.user?.withdrawCount === 1
  }
  if (!(popupTime in popupTimeInfo) || !popupTimeInfo[popupTime]) return false
  if (route.value.path !== '/main/inicio') return false
  if (channelStore.isShowCompulsoryModal && channelStore.compulsoryInstallKey === 'compulsoryInstallTime') {
    closeForceModal(false)
    channelStore.compulsoryInstallKey = 'compulsoryInstallTime'
    channelStore.isShowCompulsoryModal = false
  }
  await showCompulsoryModal();

  return true

}

