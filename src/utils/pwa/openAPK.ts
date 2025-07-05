import useCopyAccountInfo from '@/hooks/useCopyAccountInfo'
import { delay } from '@/utils/delay'
import { urlCheck } from '@/hooks/UrlCheck';
import { emitter } from "@/utils/event";
import { usePermission } from '@vueuse/core'
import { getBase64AccountInfo } from '@/utils';

export default async (isDowloandAPk = true, installUrl?: string) => {

  const channelStore = useChannelStore();
  const apkUrl = installUrl || channelStore.promotionInfo?.installUrl;
  const reg = /.+_(\d+)\.apk$/
  const id = apkUrl?.match(reg)?.[1]
  let isWindowBlur = false
  const isPermissionRequired = await useCopyAccountInfo()
  const permissionWrite = usePermission('clipboard-write');
  const initPermissionWrite = permissionWrite.value
  const accountInfo = await getBase64AccountInfo();
  const url = `intent://open#Intent;scheme=panda_${id};S.accountInfo=${accountInfo};end`
  location.href = url
  console.log("openAPK URL:", url);
  // 失去焦点有两种情况，1: 可以拉起pwa失去焦点，2: 复制粘贴情况需要授权失去焦点
  window.onblur = function () {
    isWindowBlur = true
  };
  emitter.emit('pwa/updateAPKProgress', {})
  await delay(3000)
  // 失去焦点有两种情况，1: 可以拉起apk失去焦点，2: 复制粘贴情况需要授权失去焦点
  if (isWindowBlur) {
    //  不需要用户授权 或  initPermissionWrite !== 'prompt' 代表用户已经授权过， 是拉起apk出现的弹框导致失去焦点的
    if (!isPermissionRequired || initPermissionWrite !== 'prompt') return true
    // 剩下的就是需要授权复制粘贴情况失去的焦点
    console.log(initPermissionWrite, permissionWrite.value, 'permissionWrite.value');
    if (initPermissionWrite === permissionWrite.value) {
      // 如果用户没有修改权限再等待用户三秒，  三秒后就强制弹框下载apk的下载了
      await delay(3000)
    }
  }

  if (isDowloandAPk) {
    location.href = urlCheck(apkUrl);
  }

  return false
}

