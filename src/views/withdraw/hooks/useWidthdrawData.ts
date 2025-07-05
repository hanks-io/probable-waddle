import {
  getWithdrawTypeAndSubApi,
} from '@/api/assets'
import { TabInfo} from '../type'
export default async (cb?: (item: any) => void) => {
  const withdrawStore = useWithdrawStore() // 提现信息
  const { tabId: activeId } = toRefs(withdrawStore)
  let activeTabId = activeId.value
  let mainTabList: TabInfo[] = []
  const subTabList: any[] = []
  let result = await getWithdrawTypeAndSubApi()
  result.sort((a: any, b: any) => b.sort - a.sort)
  if (activeId.value >= 0) {
    activeTabId = activeId.value
  } else {
    activeTabId = result[0].id
  }
  result.forEach((it: any) => {
    it.tenantPayWithdrawTypeSub.sort((a:any, b:any) => b.sort - a.sort)
    if(it.id === activeTabId) {
      subTabList.push(...it.tenantPayWithdrawTypeSub)
    }
    mainTabList.push({ id: it.id, name: it.name })
    if (cb) {
      cb(it)
    }

  })
  return {
    activeTabId,
    subTabList,
    mainTabList
  }
}
