import { handleInstallAction, installStatus, pullUpPWA, getBtnText, installAction, iosInstallAction } from "@/pwa/hooks/useInstallPWAOrAPK"
import type { InstallPWAOrAPKParams } from "@/pwa/hooks/useInstallPWAOrAPK"
import { showLoading } from "@/utils/loading";
import { openUrl } from "@/utils";
import { closeForceModal } from '@/utils/pwa/forcedModal/useClose'
import { httpCompletion } from "@/utils";
import { getTheme } from '@/theme/hooks'
import { BROWSER } from '@/enums/device';
import { random } from '@/utils'
import { emitter } from "@/utils/event";
import { hasBottomToolbar } from "@/utils"
import { copyTextAppendEL } from '@/hooks/useCopyAccountInfo'
import { useMatchType } from "@/pwa/hooks/useMatchType";
export const visibleGuideClose = ref(true)
export const usePwaLogic = () => {

  const appStore = useAppStore(); // 用户store
  const userStore = useUserStore(); // 用户store
  const tenantStore = useTenantStore(); // 租户store
  const systemStore = useSystemStore(); // 系统store
  const channelStore = useChannelStore(); // 渠道store
  const statusStore = useStatusStore(); // 状态信息
  const { user, isAppUser } = toRefs(userStore) // 用户信息
  const tenantInfo = computed(() => tenantStore.tenantInfo); // 租户信息
  const os = computed(() => systemStore.app?.build || ""); // 系统类型
  const { promotionInfo, isShelfPackage: isPackage, forceModalKey } = toRefs(channelStore)
  const { browser, isPwaVisible, isApk, isApp, isInAppBrowser, isPwa, isIOSApp, isAndroid, isIOS } = toRefs(systemStore)
  const { pwaLaunchAllow, unStandalone, isShowGuidePwa, pwaFooterVisible, modalVisible, pwaBarVisible } = toRefs(appStore)
  const isSamsung = computed(() => browser.value === BROWSER.SAMSUNG_INTERNET); // 是否是三星浏览器
  const installProgress = ref(0); // 安装进度
  const isHasBottomToolbar = ref<boolean>(false);
  const { theme, skin } = getTheme()
  let initProgress = 0.01
  let initTime = 240


  const isShowPwaInfo = computed(() => (!isPwa.value && !isApp.value && promotionInfo.value?.downloadBtn && !isAppUser.value && !isIOSApp.value)); // 是否显示PWA信息
  // 是否显示PWA顶部安装栏
  const isShowPwaBar = computed(
    () => {
      if (!isShowPwaInfo.value) {
        appStore.isShowPwaBar = false
        return false
      }


      return appStore.isShowPwaBar = pwaBarVisible.value

    }
  );
  // 是否显示PWA底部栏
  const isShowPwaFooter = computed(() => {
    if (!isShowPwaInfo.value) {
      appStore.isShowPwaFooter = false
      return false
    }
    return appStore.isShowPwaFooter = pwaFooterVisible.value && !pwaLaunchAllow.value && !modalVisible.value
  }

  );

  const btnText = computed(getBtnText);
  /**
   * @description 联系客服
   */
  const onlineServiceHandle = async () => {
    showLoading();
    const res = await tenantStore.getCustomerService();
    if (res.onlineServices.length) {
      const index = random(0, res.onlineServices.length - 1);
      const link = res.onlineServices[index].link;
      openUrl(httpCompletion(link));
    }
  }
  const computedAmonut = (isArrayAmount: boolean, showGiftAmount: number | number[]) => {
    const cy = tenantInfo.value?.merchantCy;
    if (Array.isArray(showGiftAmount)) {
      const [min, max] = showGiftAmount;
      if (showGiftAmount.length > 1 && min === max) {
        return `${cy}${convertMoneyToShow(min)}`;
      }
      if (isArrayAmount) {
        return ` ${cy}${convertMoneyToShow(min)}-${cy}${convertMoneyToShow(max)}`;
      }
    }
    return ` ${cy}${convertMoneyToShow(showGiftAmount as number)}`;
  }

  /**
* @description 关闭模态框
*/
  const closeFooterModal = () => {
    appStore.setPwaFooterVisible(false);
  }

  /**
  * @description 关闭PWA栏
  */
  async function closeHeaderBar() {
    appStore.isShowPwaBar = false
  }
  const handleAppinstalled = () => {
    if (!isSamsung.value) return
    if (installProgress.value < 0.82) {
      installProgress.value = 0.82
    }
    initProgress = 0.1
    initTime = 20
  }
  const HandlePwaInstalled = () => {
    if (installAction.value === 'APK') return
    appStore.setPwaFooterVisible(false);
    appStore.setPwaLaunchAllow(true);
    if (isSamsung.value) {
      appStore.isShowGuidePwa = true;
    }

  }
  // 安装进度
  watch(
    () => installStatus.value,

    (val) => {
      if (val === 'Installing') {
        const timer = setInterval(() => {
          const progressHandlers = {
            complete: () => {
              installProgress.value = 1;
              installStatus.value = 'Installed'
              HandlePwaInstalled()
              clearInterval(timer);

            },
            inProgress: () => {
              installProgress.value = Math.min(1, installProgress.value + initProgress);
            }
          };

          const status = installProgress.value >= 1 ? 'complete' : 'inProgress';
          progressHandlers[status]();
        }, initTime);
      }
    },
  );


  const handleForcedInstallAction = () => {
    const params: InstallPWAOrAPKParams = {
      APKCb: () => {
        copyTextAppendEL.value = 'compulsory-warp'
      }
    }
    handleInstallAction(params)

  }

  const handleHomeInstallAction = () => {
    const params: InstallPWAOrAPKParams = {
      PWACb: () => {
        statusStore.setHomeInstallModalVisible(true);
      }
    }
    handleInstallAction(params)

  }

  const handleDownloadInstallAction = () => {
    const params: InstallPWAOrAPKParams = {
      APKCb: () => {
        copyTextAppendEL.value = 'download-pwa'
      },
      pullUpSamsungPWACb: () => {
        appStore.isShowGuidePwa = true;
      }
    }
    const deviceMap = new Map<string, () => void | false>([
      ['android', () => useMatchType('google') && handleInstallAction(params)],
      ['ios', () => useMatchType('ios') && iosInstallAction()]
    ])

    deviceMap.get(isIOS.value ? 'ios' : 'android')?.()

  }
  const getRandomNumber = () => {
    const randomNumber = Math.random() * (0.4 - 0.3) + 0.3;
    return parseFloat(randomNumber.toFixed(2));
  }
  const updateAPKInstallProgress = () => {
    initProgress = getRandomNumber()
    initTime = 1000
  }

  onMounted(() => {

    isHasBottomToolbar.value = hasBottomToolbar();
    window.dispatchEvent(new Event('resize')); // 手动触发resize事件一次
    window.addEventListener('appinstalled', handleAppinstalled);
    emitter.on('pwa/updateAPKProgress', updateAPKInstallProgress);

  })
  onUnmounted(() => {
    window.removeEventListener('appinstalled', handleAppinstalled);
    emitter.off('pwa/updateAPKProgress', updateAPKInstallProgress);
  })

  return {
    handleForcedInstallAction,
    handleHomeInstallAction,
    onlineServiceHandle,
    computedAmonut,
    closeForceModal,
    closeFooterModal,
    closeHeaderBar,
    handleDownloadInstallAction,
    pullUpPWA,
    isHasBottomToolbar,
    installStatus,
    btnText,
    tenantInfo,
    isShowPwaInfo,
    pwaBarVisible,
    promotionInfo,
    user,
    os,
    isSamsung,
    installProgress,
    theme,
    skin,
    isIOS,
    forceModalKey,
    isShowPwaFooter,
    isShowPwaBar,

  }

}
