import { copy } from "@/hooks/Copy";
import { getBase64AccountInfo } from "@/utils";
export const copyTextAppendEL = ref("body")

export const copyTextToClipboard = (text: string = '', {
  execCommandCallbackSuccess = () => { },
  execCommandCallbackFail = () => { },
}: {
  execCommandCallbackSuccess?: () => void,
  execCommandCallbackFail?: () => void
} = {}) => {
  // 首先尝试使用 document.execCommand
  let isPermissionRequired = false
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';  // 避免页面滚动
  // textArea.style.left = '-9999px';    // 隐藏文本框
  console.log(copyTextAppendEL.value, 'copyTextAppendEL.value');
  let appendEL = copyTextAppendEL.value === 'body' ? document.body : document.querySelector(`.${copyTextAppendEL.value}`);
  appendEL?.append(textArea)

  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length); // 兼容移动端
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      console.log(`复制成功==${text}`);
      execCommandCallbackSuccess?.()
    } else {
      console.error('execCommand 复制失败，使用 clipboard-polyfill 作为后备');
      execCommandCallbackFail?.()
    }
  } catch (err) {
    isPermissionRequired = true
    copy(text)
  }

  appendEL?.removeChild(textArea);
  return isPermissionRequired
}

export default async () => {
  const accountInfo = await getBase64AccountInfo();
  return copyTextToClipboard(accountInfo);
}
