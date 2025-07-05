import { openUrl, encryptData, getInstallInfo, showToast } from "@/utils";
import openAPK from '@/utils/pwa/openAPK';

export const useRedomain = () => {
  //openAPK 拉起apk
  copyTextAppendEL.value = 'compulsory-warp';
  const appStore = useAppStore();
  const urlParams = encryptData(getInstallInfo(appStore));
  const installRePwa = async (domain?: string | null | boolean, install: { installType: string, apkName: string, apkUrl: string }) => {
    console.log('domain', domain);
    const url = `?info=` + urlParams;
    if (install.installType !== 'pwa') return openAPK(true, install.apkUrl);
    if (domain) {
      copyTextToClipboard(`https://${domain}/download` + url,
        {
          execCommandCallbackSuccess: () => {
            showToast('toast.copySuccess');
          },
          execCommandCallbackFail: () => {
            showToast('toast.copyFail');
          }
        }
      );
    }
  }
  return {
    installRePwa,
    getUrlParams
  }
}

