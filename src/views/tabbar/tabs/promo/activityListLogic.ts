// 活动列表 逻辑层
import { computed, toRefs } from 'vue';
import { useActivityStore } from '@/store/activity';
import { ActivityListModel } from '@/api/activity/model';
import { isActivityForever } from '@/utils/custom'
import { TActivityStatus, ZActivityStatus } from '@/enums/types/activity.type'
import { useI18n } from '@/hooks/useI18n';
import { ZTActivityTypes } from '@/enums/types/activity.type'
export default function useActivityListLogic({props, emit}: {props: any, emit: any}) {
  const activityStore = useActivityStore(); // 活动store
  const { redPointList } = toRefs(activityStore)
	const { t } = useI18n();
  const activityList = computed(() => {
    return activityStore.activityList.filter((item: any) => item.type !== ZTActivityTypes.enum.FirstRechargeRebate && item.type !== ZTActivityTypes.enum.FirstWithdrawRebate)
  })

  const navigation = (item: any) => {
      emit('navigation', item)
  }
  // 是否显示空列表提示
  const isShowEmpty = computed(() => {
      let list: ActivityListModel['activityList'] = [];
      activityList.value.forEach(item => {
          if (props.sideValue === item.category)
              list.push(item);
      });
      return list.length === 0;
  });

  // 获取活动状态
  function getActivityStatus(status: TActivityStatus): string {
      if (status === ZActivityStatus.enum.PENDING) {
          return t('viewsActivity.activityList03');
      } else if (status === ZActivityStatus.enum.PROCESSING) {
          return t('viewsActivity.activityList02');
      } else if (status === ZActivityStatus.enum.FINISHED) {
          return t('viewsActivity.activityList04');
      }
      return 'unknown';
  }

    // 获取活动状态颜色
    function getActivityStatusColor(status: TActivityStatus): string {
        if (status === ZActivityStatus.enum.PENDING) {
            return 'color-warning';
        } else if (status === ZActivityStatus.enum.PROCESSING) {
            return 'color-primary-800';
        } else if (status === ZActivityStatus.enum.FINISHED) {
            return 'color-text-40';
        }
        return 'unknown';
    }

  return {
    isShowEmpty,
    navigation,
    activityList,
    redPointList,
    isActivityForever,
    getActivityStatus,
    getActivityStatusColor
  }
}
