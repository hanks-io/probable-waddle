import { goMain } from '@/hooks/navigate'
import router from '@/router'

export default () => {
  const goToWithdrawPage = () => {
    const isTab = getPageParam(PageParam.IS_TAB_WITHDRAW)
    setPageParam(PageParam.WITHDRAW_MAIN, WithdrawPageType.WITHDRAW)
    if (isTab)
      return goMain('/main/withdraw')
    router.replace('/withdraw/apply');
  }

  return {
    goToWithdrawPage
  }
}