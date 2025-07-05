// 会员答谢活动逻辑层
import { reactive, onBeforeMount } from 'vue'
import { hideLoading, showLoading } from '@/utils/loading'
import { moneyConvertToClient, formatMoneyToShow, getCustomerActivityId, isActivityForever } from '@/utils/custom'
import { appreciationDetailApi, activityApplyApi } from '@/api/activity';
import { formatToDateTime, getLocalTime } from '@/utils/date'
import type { Time, Dayjs } from '@/utils'
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import type { TActivityResetType } from '@/enums/types/activity.type'
import { ZTActivityTypes, ZActivityResetType, ZActivityRuleType } from '@/enums/types/activity.type'
import { useI18n } from '@/hooks/useI18n'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { throttleActivity } from '@/utils';

export default function useLogic() {
  const { t } = useI18n()
  const appStore = useAppStore()
  const tenantStore = useTenantStore()
  const userStore = useUserStore()

  const { id: activityId ,defStyle} = getCustomerActivityId()

  const activityInfo = reactive({
    name: '',
    endTime: '',
    cycle: '',
    maxReward: '0.00',
    description: '',
    canReceive: false,
  })

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币

  // 格式化日子
  function formatDay(locale: string, day: number): string {
    if (locale === 'en-US' || locale.startsWith('en')) {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
      }
    }
    return day.toString();
  }

  // 获取活动周期
  function getActivityCycle(resetType: TActivityResetType, index: number, locale: string): string {
    if (resetType === ZActivityResetType.enum.WEEKLY_DAY) {
      return t(`activity.appreciation0${3 + index - 1}`)
    }
    else if (resetType === ZActivityResetType.enum.MONTHLY_DAY) {
      return t(`activity.appreciation11`, { number: formatDay(locale, index) })
    }
    else if (resetType === ZActivityResetType.enum.DAILY) {
      return index.toString().length === 1 ? `0${index}:00:00` : `${index}:00:00`;
    }
    return 'unknown';
  }

  // 当天是否为会员日
  function isMemberDay(currentTime: Time, resetType: TActivityResetType, index: number,): boolean {
    const today = getLocalTime(currentTime) as Dayjs;
    if (resetType === ZActivityResetType.enum.WEEKLY_DAY) {
      const day = today.day();
      return day === index % 7
    }
    else if (resetType === ZActivityResetType.enum.MONTHLY_DAY) {
      const date = today.date();
      return date === index
    }
    else if (resetType === ZActivityResetType.enum.DAILY) {
      const hour = today.hour();
      return hour + 1 > index
    }
    return false
  }

  // 获取活动详情
  async function getActivityDetail() {
    showLoading()
    const {
      canReceive,
      endTime,
      maxAmount,
      memberDay,
      multilingual,
      resetType,
      rewardCount,
      rule,
      ruleType,
      currentTime,
    } = await appreciationDetailApi(Number(activityId))

    const language = (await appStore.getLocale()) as Language

    activityInfo.endTime = isActivityForever(endTime) ? t('activity.appreciation14') : formatToDateTime(endTime)
    activityInfo.maxReward = formatMoneyToShow(moneyConvertToClient(maxAmount))
    activityInfo.cycle = getActivityCycle(resetType, memberDay, language)
    activityInfo.canReceive = canReceive && isMemberDay(currentTime, resetType, memberDay)
    activityInfo.name = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.MemberReward)

    if (ZActivityRuleType.enum.DEFAULT === ruleType) {
      const ruleParam = JSON.parse(rule)

      activityInfo.description = generateDefultRules(language, ZTActivityTypes.enum.MemberReward , ruleParam.variablesValue)
    }
    else {
      activityInfo.description = rule;
    }
  }

  // 活动奖励申请
  const onActivityApply = throttleActivity(async () => {
    if (!activityInfo.canReceive) return
    showLoading()
    const data = await activityApplyApi({
      id: activityId as number,
      applyInfo: {
        type: ZTActivityTypes.enum.MemberReward,
        info: {
          userId: userStore.user?.userId!,
        },
      },
    })
    if (data?.result && !data?.allMark) {
      return validationActivityClaimLimits(data, PopupType.BONUS, activityInfo.name)
    }
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data.amount) }),
      })
    }
    await getActivityDetail()
    hideLoading()
  })

  onBeforeMount(() => {
    getActivityDetail()
  })
  /**
 * @description 停止按钮 按下弹出右键菜单
 */
  const forbidContextmenu = (e: any) => {
    e.preventDefault();
  }

  const useComponents = () => {
    const templList: Record<string, () => Promise<typeof import('*.vue')>> = {
      'style_0': () => import('@/views/activity/appreciation/style_0/index.vue'),
      'style_1': () => import('@/views/activity/appreciation/style_1/index.vue'),
    };
    const computedTemplate = templList[defStyle];
    return markRaw(defineAsyncComponent(computedTemplate)) as unknown as ComponentPublicInstance;
  }
  return {
    activityInfo,
    merchantCy,
    onActivityApply,
    forbidContextmenu,
    useComponents
  }
}
