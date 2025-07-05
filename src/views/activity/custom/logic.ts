// 自定义活动 逻辑层
import axios from 'axios'
import { onBeforeMount, ref } from 'vue'
import { showToast } from '@/utils'
import { activityApplyApi, activityCustomDetailApi } from '@/api/activity'
import { hideLoading, showLoading } from '@/utils/loading'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import { ZTActivityTypes } from '@/enums/types/activity.type'
import { getCustomerActivityId } from '@/utils/custom'
import { CustomDetailModel } from '@/api/activity/model'
import { useAppStore } from '@/store/app'
import { Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { useActivityStore } from '@/store/activity';
import { throttleActivity } from '@/utils';

export default function useLogic() {
  const { t } = useI18n()
  const userStore = useUserStore()

  const { id: activityId } = getCustomerActivityId()
  const activityName = ref<string>()
  const content = ref('')
  const appStore = useAppStore() // App状态管理
  const activityStore = useActivityStore(); // 活动store
  const showApplyBtn = ref(false) // 是否显示申请按钮

  // 申请按钮
  const applyHandle = throttleActivity(async () => {
    showLoading()
    const data = await activityApplyApi({
      id: activityId,
      applyInfo: {
        type: ZTActivityTypes.enum.Custom,
        info: {
          userId: userStore.user?.userId!,
          amount: 100,
        },
      },
    })
    console.error(data)
    if (data !== null) {
      showToast('toast.applicationSuccessful')
    }
    hideLoading()
  })

  // 获取自定义活动详情
  async function getActivityDetail() {
    showLoading()
    const data = (await activityCustomDetailApi(Number(activityId))) as CustomDetailModel
    const response = await axios.get(data.content, { responseType: 'blob' })
    const language = (await appStore.getLocale()) as Language
    if ('multilingual' in data && data.multilingual) {
      const multilingual = data.multilingual as Record<string, string>
      activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.Custom)
      showApplyBtn.value = data.isShowApply;
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
    applyHandle,
    showApplyBtn,
  }
}
