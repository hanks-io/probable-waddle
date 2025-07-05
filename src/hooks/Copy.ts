import * as clipboard from "clipboard-polyfill";
import { showToast } from '@/utils'

export async function copy(text: any, isShowSuccessToast = true) {
  const textStr = text.value ? text.value.toString() : text.toString()
  clipboard.writeText(textStr).then(
    () => { isShowSuccessToast && showToast('toast.copySuccess') },
    () => { showToast('toast.copyFail') }
  )
}
