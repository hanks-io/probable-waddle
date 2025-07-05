// 批量优惠相关逻辑
import { emitter } from "@/utils/event";
import { batchDiscountListApi } from "@/api/activity";
import { PopupParams } from '@/components/Popup/data';
import BonusModal from "@/views/tabbar/MainPage/components/bonusModal/index.vue"
import router from "@/router";

export function useBatchReward() {

  const route = router.currentRoute
  const userStore = useUserStore(); // 用户信息

  watch(() => route.value.path, async (newPath) => {
    const eventName = 'reward/manual-user-reward'
    const baseOptions: PopupParams = {
      component: BonusModal,
      id: 'bonusModal',
    }
    if (newPath === '/main/inicio') {
      emitter.on(eventName, (data) => {
        baseOptions.data = data
        baseOptions.checkIntercept = () => {
          return userStore.checkBatchDiscountList(data.orderNo)
        }
        showPopup(baseOptions)
      });
      
      if (await useAppStore().checkUserHasLogin()) {
        const res = await batchDiscountListApi()
        res && res.forEach((item) => {
          baseOptions.data = item
          baseOptions.checkIntercept = () => {
            return userStore.checkBatchDiscountList(item.orderNo)
          }
          showPopup(baseOptions)
        })
      }
    }
    else {
      if (emitter.listeners(eventName).length) {
        emitter.removeAllListeners(eventName)
      }
    }
  }, { immediate: true })
}
