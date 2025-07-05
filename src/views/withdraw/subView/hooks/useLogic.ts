
import { WithdrawPageType } from '@/hooks/useWithdraw'
import { isEmpty } from "@/utils"
export default () => {
  const { t } = useI18n() // 国际化
  const withdrawStore = useWithdrawStore() // 提现信息
  const tabValue = ref(withdrawStore.tabPageIndex || WithdrawPageType.WITHDRAW_RECORD) // 导航标签动态值
  const { isHideAuditRecords, userWithdrawInfo } = storeToRefs(withdrawStore)
  const tabList = [
    { value: WithdrawPageType.WITHDRAW_RECORD, text: t('viewsAssets.withdrawalRecord') },
    { value: WithdrawPageType.WITHDRAW_AUDIT, text: t('viewsAssets.auditRecord') },
  ]
  onMounted(() => {
    if (isEmpty(userWithdrawInfo.value)) {
      withdrawStore.setUserWithdrawInfo()
    }
  }
  )

  return { tabValue, tabList, isHideAuditRecords }

}



