import { emitter } from '../event';
import { checkBrowser } from './browser';
import { SD_MODEL } from '@/enums/device';
import { useUserStore } from '@/store/user';
import { useChannelStore } from '@/store/channel';
import openAPK from '@/utils/pwa/openAPK';
/**
 * @description 下载检测
 */
export function downLoadCheck() {
  const userStore = useUserStore();

  if (userStore.user?.id) {
    emitter.emit('user/download', {
      userId: userStore.user.id,
    })
  }

  const channelStore = useChannelStore();
  const installType = channelStore.promotionInfo?.installType;

  if (['desk', SD_MODEL.PWA].includes(installType)) {                             // 判断是否安装到桌面<desk>(ios)<pwa>(android)或者上架包
    checkBrowser();
  } else if (installType.includes(SD_MODEL.APK) || installType === 'APPSTORE') {  // 判断是否可以安装apk或者AppStore下载
    openAPK()
  }
}
