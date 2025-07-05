// 充值赠送 逻辑层
import axions from 'axios'
import { onBeforeMount, ref } from 'vue'
import { rechargeGiveDetailApi } from '@/api/activity'
import { hideLoading, showLoading } from '@/utils/loading'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import { getCustomerActivityId } from '@/utils/custom'
import { RechargeRewardModel } from '@/api/activity/model'
import { useAppStore } from '@/store/app'
import { ZTActivityTypes } from '@/enums/types/activity.type'
import { Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'

export default function useLogic() {
  const { t } = useI18n()
  const userStore = useUserStore()

  const { id: activityId } = getCustomerActivityId()
  const activityName = ref<string>()
  const content = ref('')
  const appStore = useAppStore() // App状态管理

  // 获取自定义活动详情
  async function getActivityDetail() {
    showLoading()
    const data = (await rechargeGiveDetailApi(Number(activityId))) as RechargeRewardModel
    const response = await axions.get(data.content, { responseType: 'blob' })
    const language = (await appStore.getLocale()) as Language
    if ('multilingual' in data && data.multilingual) {
      const multilingual = data.multilingual as Record<string, string>
      activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.RechargeReward)
    }
    const reader = new FileReader()
    reader.onload = () => {
      content.value = reader.result as string
    }
    reader.readAsText(response.data)
    hideLoading()
  }

  // 页面挂载前
  onBeforeMount(async () => {
    getActivityDetail()
  })

  return {
    activityName,
    content,
  }
}
