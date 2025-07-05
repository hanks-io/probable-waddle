// 处理任务系统相关的hooks
import { emitter } from "@/utils/event";
import { taskReceiveApi } from "@/api/task";
import RookieTaskModal from "@/components/rookieTaskModal/index.vue"
import { useUserStore } from "@/store/user";
import { useSystemStore } from "@/store/system";
import { PopupType } from "@/components/Popup/data";
import { TaskRewardItem } from "@/api/task/model";
import { useI18n } from "@/hooks/useI18n";
import { useTaskStore } from "@/store/task";
import { ZTaskTypeEnumType } from '@/enums/types'


const eventName = 'task/newbie_task'

/**
 * @description 显示新人任务奖励弹窗
 */
function showRookieTaskReward(item: TaskRewardItem) {
  const { t } = useI18n()
  const msg = item.canReceive ? t('task.000003') : t('task.000005')
  item.canReceive && receiveRookieTaskReward(item.id)
  showPopup({
    uniqueId: item.id,
    type: PopupType.BONUS,
    msg,
    leftBtnText: t('main.confirm'),
  })
}

/**
 * @description 领取新人任务奖励
 */
async function receiveRookieTaskReward(rewardId: number) {
  await taskReceiveApi({
    rewardId,
    appType: useSystemStore().app?.build,
  })
  await useUserStore().setAssets()
  useTaskStore().updateTaskList(ZTaskTypeEnumType.Enum.NewbieTask);
}

/**
 * @description 检查当前是否有可领取奖励
 */
export async function checkTaskReward() {
  const rewardList = await useTaskStore().getRookieTaskReward()
  rewardList?.forEach((item) => showRookieTaskReward(item))
}

/**
 * @description 注册新人任务奖励推送事件
 */
export function registerTaskEvents() {
  emitter.on(eventName, (data) => showRookieTaskReward(data));
}

/**
 * @description 注销新人任务奖励推送事件
 */
export function unregisterTaskEvents() {
  if (emitter.listeners(eventName).length) {
    emitter.removeAllListeners(eventName)
  }
}
