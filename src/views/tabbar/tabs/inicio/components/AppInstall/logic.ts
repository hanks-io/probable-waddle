import { useI18n } from 'vue-i18n';
import { SD_MODEL } from '@/enums/device'
import { useTenantStore } from '@/store/tenant';
import { handleInstallAction, iosInstallAction } from "@/pwa/hooks/useInstallPWAOrAPK"
import type { InstallPWAOrAPKParams } from "@/pwa/hooks/useInstallPWAOrAPK"

export default function useAppInstallLogic(props?: any) {
  const { t } = useI18n();

  const statusStore = useStatusStore()    // 状态
  const systemStore = useSystemStore()    // 系统
  const channelStore = useChannelStore()  // 渠道
  const tenantStore = useTenantStore(); // 租户信息
  const appLogo = computed(() => tenantStore.tenantInfo?.logo);
  const isApp = computed(() => systemStore.isApp); // 是否是APP

  const iosTitleList = computed(() => {
    const { iosTitleKeys } = props || {};
    if (!iosTitleKeys) return '';
    return iosTitleKeys.map(str => t(str))
  })

  const androidTitleList = computed(() => {
    const { androidTitleKeys } = props || {};
    if (!androidTitleKeys) return '';
    return androidTitleKeys.map(str => t(str))
  })

  const iosTitle = computed(() => {
    const { iosTitleKeys } = props || {};
    if (!iosTitleKeys) return '';
    return iosTitleKeys.reduce((acc, cur) => {
      acc = acc + ' ' + t(cur);
      return acc
    }, '')
  })

  const androidTitle = computed(() => {
    const { androidTitleKeys } = props || {};
    if (!androidTitleKeys) return '';
    return androidTitleKeys.reduce((acc, cur) => {
      acc = acc + ' ' + t(cur);
      return acc
    }, '')
  })

  // 生命周期-页面挂载前
  onBeforeMount(() => {
    channelStore.requestMainChannelInstallInfo()
  })

  /**
   * @description 苹果安装操作
   */
  function appleHandle() {
    if (systemStore.app?.build !== SD_MODEL.IOS_H5) return;
    iosInstallAction()
  }

  /**
   * @description 安卓安装操作
   */
  async function androidHandle() {

    if (systemStore.app?.build === SD_MODEL.IOS_H5) return;
    const params: InstallPWAOrAPKParams = {
      PWACb: () => {
        statusStore.setHomeInstallModalVisible(true);
      }
    }
    handleInstallAction(params)

  }

  return {
    isApp,
    appLogo,
    iosTitle,
    androidTitle,
    iosTitleList,
    androidTitleList,
    appleHandle,
    androidHandle,
  }
}
