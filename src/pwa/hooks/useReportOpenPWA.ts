// 用于上报用户是否打开了 PWA
import  { emitter } from '@/utils/event'

export async function useReportOpenPWA() {
  const store = useStatusStore()
  const systemStore = useSystemStore()

  if (!await store.getAdReported() && systemStore.isPwa) {
    emitter.emit('user/openPWA', {})
    store.setAdReported(true)
  }
}
