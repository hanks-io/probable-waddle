import { BROWSER } from '@/enums/device'
import openAPK from '@/utils/pwa/openAPK'
import { getDeferredPrompt } from '@/utils/pwa/deferredPrompt'
import { PopupType } from '@/components/Popup/data'
import { openWindow } from '@/utils'
import { emitter } from '@/utils/event'
import { urlCheck } from '@/hooks/UrlCheck'
import { visibleGuideClose } from '@/pwa/hooks/usePwaLogic'
import { launchCheck } from '@/utils/pwa/launch'
import { openGoogleUrl, addUrlParam, getJumpUrl, showToast, getUserAccountInfo, encryptData, decryptData } from '@/utils'
import openSafariBrowser from '@/utils/pwa/openSafariBrowser'
import { getOneLinkUrlApi } from '@/api/normal'


const installBlockList = [
  'notConfigured',
  'isPwa',
  'browserNotSupported',
  'isShelfPackage',
  'isWebview',
  'pwaInstalled',
] as const

export interface IosInstallExtraParams {
  installUrl?: string
  iosAddressType?: string
  iosPackageId?: number
}
type installBlockType = (typeof installBlockList)[number]

const androidInstallTypeList = ['APK', 'PWA', 'PWA+APK'] as const
const iosInstallTypeList = ['DESK', 'APPSTORE'] as const

type androidInstallType = (typeof androidInstallTypeList)[number]
type iosInstallType = (typeof iosInstallTypeList)[number]

const installStatusList = ['NotInstall', 'Installing', 'Installed'] as const
export const installAction = ref<'PWA' | 'APK'>('PWA')

type installStatusType = (typeof installStatusList)[number]
export const installStatus = ref<installStatusType>('NotInstall')


export interface InstallPWAOrAPKParams {
  PWACb?: () => void
  APKCb?: () => void
  pullUpSamsungPWACb?: () => void //拉起三星浏览器的pwa
}

const isPWAInstalled = () => {
  const appStore = useAppStore() // 用户store
  return (installAction.value === 'PWA' && installStatus.value === 'Installed') || appStore.pwaLaunchAllow
}

const getSupportedInstallPWA = () => {
  const appStore = useAppStore() // 用户store
  const systemStore = useSystemStore() // 系统store
  const channelStore = useChannelStore() // 渠道store
  const { isPwaVisible, isIOS } = toRefs(systemStore)
  const { unStandalone } = toRefs(appStore)
  console.log(unStandalone.value, 'unStandalone')
  return {
    isBrowserSupported: () => isIOS.value || isPwaVisible.value && unStandalone.value && installStatus.value === 'NotInstall',
    isConfigSupported: () => isIOS.value || (channelStore.promotionInfo?.installType as string).includes('PWA'),
  }
}

const getInstallBlockMap = () => {
  const systemStore = useSystemStore() // 系统store
  const channelStore = useChannelStore() // 渠道store
  const { isPwaVisible, isApk, isInAppBrowser, isPwa, isAndroidH5 } = toRefs(systemStore)
  const { isShelfPackage: isPackage, } = toRefs(channelStore)
  const { isBrowserSupported, isConfigSupported } = getSupportedInstallPWA()
  return new Map([
    ['notConfigured', () => isAndroidH5.value && !isPwa.value && isBrowserSupported() && !isConfigSupported()],
    ['isPwa', () => isPwa.value],
    ['browserNotSupported', () => !isPwa.value && !isApk.value && !isPwaVisible.value && !isInAppBrowser.value],
    ['isShelfPackage', () => isPackage.value && isApk.value],
    ['isWebview', () => isInAppBrowser.value],
    ['pwaInstalled', () => !isPwa.value && isPwaVisible.value && isPWAInstalled()],
  ]) as ReadonlyMap<installBlockType, () => boolean>
}

const openIosAppStore = (url: string) => {
  const systemStore = useSystemStore() // 系统store
  const { browser } = toRefs(systemStore)
  const appStoreUrl = browser.value === BROWSER.MOBILE_SAFARI ? url : `itms-apps://${url.split('apps.')[1]}`
  location.href = appStoreUrl
}

export const getIosInstallTypeMap = (IosInstallExtraParams?: IosInstallExtraParams) => {
  return new Map([
    ['DESK', openSafariBrowser],
    ['APPSTORE', async () => {
      console.warn('APPSTORE')
      const channelStore = useChannelStore()
      const tenantStore = useTenantStore()
      const isOneLink = (IosInstallExtraParams?.iosAddressType || channelStore.promotionInfo?.iosAddressType) === 'onelink'
      const systemStore = useSystemStore() // 系统store
      const iosPackageId = IosInstallExtraParams?.iosPackageId || channelStore.promotionInfo?.iosPackageId

      if (!isOneLink) {
        return openIosAppStore(urlCheck(IosInstallExtraParams?.installUrl || channelStore.promotionInfo?.installUrl))
      }
      if (systemStore?.browser !== BROWSER.MOBILE_SAFARI && isOneLink) {
        return openSafariBrowser()
      }
      const { loginInfo } = await getUserAccountInfo(4)
    
      const params = {
        tenantId: Number(tenantStore.tenantId),
        params: '?ios_encrypt_data=' + encryptData(loginInfo),
        ...(iosPackageId && { iosPackageId: Number(iosPackageId) }),
       
      }
      const { url: oneLinkUrl, error } = await getOneLinkUrlApi(params)
      if (error) {
        showToast(error?.toString())
        return;
      }
      openIosAppStore(oneLinkUrl)
    }],
  ]) as ReadonlyMap<iosInstallType, () => Promise<void>>
}

export const iosInstallAction = async (installType?: iosInstallType, IosInstallExtraParams?: IosInstallExtraParams) => {
  const channelStore = useChannelStore() // 渠道store
  if(!useSystemStore().isIOS) return
  const iosInstallType = getIosInstallTypeMap(IosInstallExtraParams)
  iosInstallType.get(installType || channelStore.promotionInfo?.installType as iosInstallType)?.()
}

export const getBtnText = (): string => {
  const { isConfigSupported, isBrowserSupported } = getSupportedInstallPWA()
  const isInstallPWASupported = isBrowserSupported() && isConfigSupported()
  const channelStore = useChannelStore() // 渠道store
  const systemStore = useSystemStore() // 系统store
  const { isPwaVisible } = toRefs(systemStore)
  const { t } = useI18n()
  const updateText = t('components.progressierOperation4')
  const getPwaInstalledText = () => {
    const isPWAInstalled = installAction.value === 'PWA' && installStatus.value === 'Installed'
    const isPWAInstallType = channelStore.promotionInfo?.installType === 'PWA'
    return isPWAInstalled || isPWAInstallType ? t('label.launchApp') : t('viewsSystem.install')
  }
  const installBlockTextMap = new Map<installBlockType, string>([
    ['notConfigured', t('viewsSystem.install')],
    ['isPwa', t('viewsSystem.install')],
    ['browserNotSupported', updateText],
    ['isShelfPackage', updateText],
    ['isWebview', updateText],
    ['pwaInstalled', getPwaInstalledText()],
  ])
  console.log(
    channelStore.promotionInfo?.installType,
    isPwaVisible.value && isPWAInstalled(),
    'channelStore.promotionInfo?.installType',
  )
  if (!isInstallPWASupported) {
    const reason = [...getInstallBlockMap().entries()].find(([_, value]) => value())?.[0] || 'pwaInstalled'
    console.log(reason, installBlockTextMap.get(reason) || updateText, 'text-reason')
    return installBlockTextMap.get(reason) || updateText
  }
  return t('viewsSystem.install')
}

export const pullUpPWA = (params?: InstallPWAOrAPKParams) => {
  const appStore = useAppStore()
  const systemStore = useSystemStore()
  const statusStore = useStatusStore()
  const { browser } = toRefs(systemStore)

  const pullUpSamsungPWA = () => {
    statusStore.setHomeInstallModalVisible(true)
    appStore.isShowGuidePwa = true
    appStore.isShowInstallModalContent = false
    visibleGuideClose.value = false
  }
  const browserHandlers = new Map([
    [BROWSER.SAMSUNG_INTERNET, params?.pullUpSamsungPWACb || pullUpSamsungPWA],
    ['default', launchCheck],
  ])
    ; (browserHandlers.get(browser.value) || browserHandlers.get('default'))?.()
}

export const handleInstallAction = (params?: InstallPWAOrAPKParams, isInstallPwaOnly = false) => {
  const appStore = useAppStore()
  const systemStore = useSystemStore()
  const channelStore = useChannelStore()
  const { isIOSH5, isIOS } = toRefs(systemStore)
  const { promotionInfo } = toRefs(channelStore)
  const { t } = useI18n()

  // Handle PWA installation acceptance
  const handleAccepted = () => {
    params?.PWACb?.()
    sessionStorage.setItem('isInitPush', 'false')
    localStorage.setItem('webAppInstalled', 'true')
    installStatus.value = 'Installing'
    installAction.value = 'PWA'
    emitter.emit('user/installPWA', {})
  }

  // Handle APK installation
  const handleOpenAPK = (isPublicPopup = false) => {
    installStatus.value = 'Installing'
    installAction.value = 'APK'
    params?.APKCb?.()
    isPublicPopup && (copyTextAppendEL.value = 'public-popup-wrap')
    openAPK()
  }

  // Initialize PWA installation prompt
  const installPWAInit = async (): Promise<'accepted' | 'dismissed'> => {
    const deferredPrompt = getDeferredPrompt()
    deferredPrompt.prompt()
    return (await deferredPrompt.userChoice).outcome
  }

  // Handle PWA installation outcome
  const handleInstallOutcome = async (skipDismissed = false) => {
    const outcome = await installPWAInit()
    if (skipDismissed && outcome === 'dismissed') return
    const outcomeHandlers: Record<'accepted' | 'dismissed', () => void> = {
      accepted: handleAccepted,
      dismissed: () => {
        showPopup({
          type: PopupType.TIPS,
          msg: t('components.progressierOperation17'),
          showRightBtn: true,
          leftBtnCallback: () => handleOpenAPK(true),
          reverseBtn: true,
        })
      },
    }
    await outcomeHandlers[outcome]?.()
  }

  const installPwa = () => handleInstallOutcome(true)
  const installPWAOrAPK = () => handleInstallOutcome(false)

  // Installation type handlers for Android
  const androidInstallType = new Map([
    ['APK', () => handleOpenAPK()],
    ['PWA', installPwa],
    ['PWA+APK', installPWAOrAPK],
  ]) as ReadonlyMap<androidInstallType, () => void>

  // Installation type handlers for iOS
  const iosInstallType = getIosInstallTypeMap()



  // Handle browser specific actions
  const handleBrowserAction = () => {
    const isPWAInstalled = installAction.value === 'PWA' && installStatus.value === 'Installed'
    const isPWAInstallType = channelStore.promotionInfo?.installType === 'PWA'

    if (isPWAInstalled || isPWAInstallType) {
      pullUpPWA(params)
      return
    }
    handleOpenAPK()
  }

  // Open Chrome with intent URL
  const openChromeWithIntent = async () => {
    const protocol = location.protocol.replace(':', '')
    const jumpGoogleUrl = await getJumpUrl('google')
    let intentURL = (jumpGoogleUrl || location.href).replace(`${location.protocol}//`, '')

    if (appStore.token) {
      const hasToken = intentURL.includes('token=')
      if (!hasToken) {
        const separator = intentURL.includes('?') ? '&' : '?'
        intentURL += `${separator}token=${appStore.token}`
      }
    }
    console.log(intentURL, 'intentURL')
    location.href = `intent://${intentURL}#Intent;scheme=${protocol};package=com.android.chrome;end`
  }

  // Open Chrome with credentials
  const openChrome = async () => {
    const jumpGoogleUrl = await getJumpUrl('google')
    openWindow((jumpGoogleUrl || await addUrlParam(location.origin)) as string)
  }

  // Map of installation block actions
  const installBlockActionsMap = new Map([
    ['notConfigured', () => androidInstallType.get('APK')?.()],
    [
      'isPwa',
      () => {
        if (channelStore.promotionInfo?.installType === 'APK') {
          androidInstallType.get('APK')?.()
        }
      },
    ],
    ['browserNotSupported', () => !isIOSH5.value && openChromeWithIntent()],
    ['isShelfPackage', openChrome],
    ['isWebview', openChromeWithIntent],
    ['pwaInstalled', handleBrowserAction],
  ]) as ReadonlyMap<installBlockType, () => void>

  // Main installation handler
  const handleInstallPWAOrAPK = async (isInstallPwaOnly = false) => {

    const { isConfigSupported, isBrowserSupported } = getSupportedInstallPWA()
    const isInstallPWASupported = isBrowserSupported() && isConfigSupported()
    console.log(isInstallPWASupported, 'isInstallPWASupported')
    const handlePWAInstall = async (installType?: androidInstallType | iosInstallType) => {
      if (useSystemStore().isAndroidH5 && await openGoogleUrl()) return

      if (installType) {
        const mergeInstallType = new Map([...androidInstallType, ...iosInstallType])
        mergeInstallType.get(installType)?.()
      } else {
        androidInstallType.get('PWA')?.()
      }
    }

    if (isInstallPwaOnly) {
      await handlePWAInstall()
      return
    }

    if (isInstallPWASupported) {
      await handlePWAInstall(promotionInfo.value?.installType as androidInstallType | iosInstallType)
      return
    }
    // // 2:ios  和  isInstallPwaOnly 不做任何处理
    if (isInstallPwaOnly || isIOS.value) return

    const blockKey = [...getInstallBlockMap().entries()].find(([_, value]) => value())?.[0] || 'pwaInstalled'

    console.log(promotionInfo.value?.installType, blockKey, 'blockKey')
    installBlockActionsMap.get(blockKey)?.()
  }

  handleInstallPWAOrAPK(isInstallPwaOnly)
}
