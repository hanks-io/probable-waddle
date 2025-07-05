import { emitter } from '@/utils/event';
import { useActivityStore } from '@/store/activity'
import { rechargePromotionApi } from '@/api/activity';

// 首页充值酬宾
export const getRechargeBonusDetail = async () => {
  const activityStore = useActivityStore();
  emitter.on('/activity/list', async () => {
    if (activityStore?.activityList.length) {
      const rechargeBonus = activityStore.activityList.find(item => item.type == 'RechargePromotion');
      if (rechargeBonus?.id) {
        try {
          const res = await rechargePromotionApi(Number(rechargeBonus.id));
          emitter.emit('recharge/bonus/detail', { ...res });
        } catch (error) {
          console.error('获取活动列表失败:', error);
          emitter.emit('recharge/bonus/detail', { homeEntry: false });
        }
      }
    }
    else {
      emitter.emit('recharge/bonus/detail', { homeEntry: false });
    }
  })
}
