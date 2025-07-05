// 批量优惠相关逻辑
import { getActivityDetail } from "@/api/activity";
import { PopupParams } from '@/components/Popup/data';
import BonusModal from "@/views/tabbar/MainPage/components/depositAndFirstWithdrawalRebate/index.vue"
import router from "@/router";
import { useActivityStore } from '@/store/activity';
import { ZTActivityTypes } from '@/enums/types/activity.type'
// 首充首提活动奖励弹窗相关逻辑
export function firstRechargeAndFirstWithdrawRebate() {
  const route = router.currentRoute
  const userStore = useUserStore(); // 用户信息
  const activityStore = useActivityStore(); // 活动store

  const baseOptions: PopupParams = {
    component: BonusModal,
    id: 'firstRechargeAndFirstWithdrawRebateModal',
  }
 
  // 活动类型映射
  const activityTypeMap = {
    'FirstRechargeRebate': ZTActivityTypes.enum.FirstRechargeRebate,
    'FirstWithdrawRebate': ZTActivityTypes.enum.FirstWithdrawRebate,
  } as const

  const showActivityPopup = async (item: any) => {
    const activityType = activityTypeMap[item.type as keyof typeof activityTypeMap]
    if (!activityType) return

    const res = await getActivityDetail(item.id, item.type)
    baseOptions.data = {
      ...item,
      amount: res?.giveAmount,
      popUpRemark: res?.popUpRemark,
      type: activityType,
    }
    baseOptions.checkIntercept = () => userStore.checkBatchDiscountList(item.id+''+userStore.user?.userId)
    if(res?.giveAmount > 0 ){
      showPopup(baseOptions)
    }
  }

  const handleActivityItems = async (redPointList: any[]) => {
    const targetTypes = ['FirstRechargeRebate', 'FirstWithdrawRebate']
    
    for (const item of redPointList) {
      if (targetTypes.includes(item.type) && item.redPoint === true) {
        await showActivityPopup(item)
      }
    }
  }

  handleActivityItems(activityStore.redPointList)

}
