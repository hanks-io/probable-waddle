import { emitter } from "../event";
import { downLoadCheck } from "./downLoad";
import { useUserStore } from "@/store/user";
import { urlCheck } from "@/hooks/UrlCheck";
import { useStatusStore } from "@/store/status";
import { useSystemStore } from "@/store/system";
import { useChannelStore } from "@/store/channel";
import { BROWSER, SD_MODEL } from "@/enums/device";
import { showIosPwaGuideModal } from "./showIosGuide";
import { getDeferredPrompt } from "@/utils/pwa/deferredPrompt";
import openAPK from '@/utils/pwa/openAPK';
import { PopupType } from '@/components/Popup/data';

const installPwa = async (showHomeInstallModal?: boolean) => {
  const channelStore = useChannelStore(); // 渠道信息
  const statusStore = useStatusStore(); // 状态信息
  const systemStore = useSystemStore(); // 系统信息
  const { t } = useI18n() // 国际化
  const deferredPrompt = getDeferredPrompt();
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    localStorage.setItem("webAppInstalled", "true");
    channelStore.setInstallStatus('Installing'); // 无论是否弹窗安装，都设置正在安装状态(强制弹窗无需弹窗安装，但也需要设置状态)
    if (showHomeInstallModal) {
      statusStore.setHomeInstallModalVisible(true);
    }
  } else {
    if (!(channelStore.promotionInfo?.installType === "PWA+APK" && systemStore.app?.build === SD_MODEL.ANDROID_H5)) return
    showPopup({
      type: PopupType.TIPS,
      msg: t('components.progressierOperation17'),
      showRightBtn: true,
      leftBtnCallback: openAPK,
      reverseBtn: true,
    })


  }

}

/**
 * @description 安装检测
 * @param showHomeInstallModal 是否弹窗安装
 */
export async function installCheck(showHomeInstallModal?: boolean) {
  const userStore = useUserStore(); // 用户信息
  const systemStore = useSystemStore(); // 系统信息
  const channelStore = useChannelStore(); // 渠道信息

  if (userStore.user?.id) {
    emitter.emit("user/download", {
      userId: userStore.user.id,
    });
  }
  //1: 对无法安装pwad的情况进行处理
  channelStore.setInstallStatus('NotInstall'); // 设置未安装状态
  const installType = channelStore.promotionInfo?.installType
  if (systemStore.browser === BROWSER.MOBILE_SAFARI) {
    if (installType === "DESK") {
      showIosPwaGuideModal();
    } else {
      location.href = urlCheck(channelStore.promotionInfo?.installUrl);
    }

    return
  }
  if (installType === "APK") {
    openAPK()

    return
  }
  if (systemStore.app?.build !== SD_MODEL.ANDROID_H5) return

  // //2: 安装pwa前 先跳转防封谷歌页面
  // if (await openGoogleUrl()) return
  //3: 不需要跳转防封谷歌页面， 对可以安装pwa的情况进行处理
  installPwa(showHomeInstallModal);

}

