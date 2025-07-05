// 神秘彩金活动逻辑层
import { reactive, onBeforeMount, computed, defineAsyncComponent } from 'vue'
import { hideLoading, showLoading } from '@/utils/loading'
import { getCustomerActivityId, type TemplateType } from '@/utils/custom'
import { mysteriousDetailApi, activityApplyApi } from '@/api/activity';
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { ZTActivityTypes, ZActivityRuleType, ZAwardType } from '@/enums/types/activity.type'
import { formatToDateTime, getLocalTime, getCurrentLocalTime, type Dayjs } from '@/utils/date';
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { useI18n } from '@/hooks/useI18n'
import { getTheme } from '@/theme/hooks'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { throttleActivity } from '@/utils';

export default function useLogic() {
  const { t } = useI18n()
  const appStore = useAppStore()
  const userStore = useUserStore()
  const router = useRouter()
  const tenantStore = useTenantStore()
  const activityInfo = reactive({
    name: '',
    joinTimeStr: '',
    joinTime: 0,
    receiveTime: 0,
    description: '',
    rewardConfigs: [],
    styleType: <TemplateType>('style_0'), // 活动样式
  })
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const checkLevel = ref(0); // 当前选中等级
  const curRewardConfig = computed<{ // 当前等级奖励配置
    day: number;
    receiveTime: number;
    dayRecharge: number;
    isCanReceive: boolean;
    btnIsDisabled: boolean;
    config: { recharge: number; minAmount: number; maxAmount: number }[];
  }>(() => activityInfo.rewardConfigs[checkLevel.value] ?? {
    day: 2,
    receiveTime: 0,
    dayRecharge: 0,
    isCanReceive: false,
    btnIsDisabled: false,
    config: [],
  })
  const receiveTime = computed(() => { // 可领取奖励时间
    const time = (getLocalTime(activityInfo.joinTime) as Dayjs).
      add(curRewardConfig.value.day - 1, 'day').startOf('day').
      add(activityInfo.receiveTime, 'hour')
    return time.format('YYYY-MM-DD HH:mm:ss')
  })
  const dayMaxReward = computed(() => { // 当前等级最大奖励
    const config = curRewardConfig.value.config
    return config[config.length - 1]?.maxAmount ?? 0;
  })
  const isLogin = computed(() => !!useAppStore().token) // 是否登录
  const showReceiveBtn = ref(false) // 是否显示领取按钮

  const { id, defStyle } = getCustomerActivityId();

  function onLevelCheck(index: number) {
    checkLevel.value = index;
  }

  const checkBgMap: Record<string, { check: string; uncheck: string }> = {
    'mystlight-blue': {
      check: '/first/images/mysterious-style3-bg-check.png',
      uncheck: '/first/images/mysterious-style0-bg-uncheck.png',
    }
  }
  const { theme } = getTheme();
  const getLevelBg = (checkLevel: number, curLevel: number) => {
    if (checkBgMap[theme]) {
      return checkBgMap[theme][checkLevel === curLevel ? 'check' : 'uncheck']
    }
    return `/first/images/mysterious-${(defStyle)?.replace('_', '')}-bg-${checkLevel === curLevel ? 'check' : 'uncheck'}.png`
  }

  // 跳转登录页
  function loginHandle() {
    useStatusStore().setRedirectRoute('login')
    router.replace('/main/inicio');
  }

  // 获取活动详情
  async function getActivityDetail() {

    showLoading()
    const { dayList, multilingual, joinTime, receiveTime, receiveType } = await mysteriousDetailApi(Number(id))
    const language = (await appStore.getLocale()) as Language
    activityInfo.rewardConfigs = dayList.map((item, index: number) => {
      const canReceiveTime = (getLocalTime(joinTime) as Dayjs).add(item.day - 1, 'day').startOf('day').add(receiveTime, 'hour');
      const currentTime = getCurrentLocalTime() as Dayjs
      return {
        ...item,
        isCanReceive: currentTime.isAfter(canReceiveTime) && item.isCanReceive,
        icon: `/first/svg/mysterious-${defStyle?.replace('_', '')}-level${index + 1}.svg`,
      }
    })
    activityInfo.joinTimeStr = formatToDateTime(joinTime) || t('activity.mysterious08');
    activityInfo.joinTime = joinTime;
    activityInfo.receiveTime = receiveTime;
    showReceiveBtn.value = receiveType === ZAwardType.enum.ACTIVITY;

    const curDate = (getCurrentLocalTime() as Dayjs);
    const joinDate = (getLocalTime(joinTime) as Dayjs);
    const diff = curDate.diff(joinDate, 'days');
    const index = dayList.findLastIndex(v => v.day <= diff);
    checkLevel.value = index != -1 ? index : 0;
    // 活动名称解析
    activityInfo.name = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.MysteryReward)

    // 活动规则解析
    if (ZActivityRuleType.enum.DEFAULT === multilingual.ruleType) {
      const ruleParam = JSON.parse(multilingual.rule)
      activityInfo.description = generateDefultRules(language, ZTActivityTypes.enum.MysteryReward, ruleParam.variablesValue)
    }
    else {
      activityInfo.description = multilingual.rule;
    }
  }

  // 活动奖励申请
  const onActivityApply = throttleActivity(async () => {
    if (!curRewardConfig.value.isCanReceive) return
    showLoading()
    const data: any= await activityApplyApi({
      id: Number(id),
      applyInfo: {
        type: ZTActivityTypes.enum.MysteryReward,
        info: {
          userId: userStore.user?.userId!,
          applyDay: curRewardConfig.value.day,
        },
      },
    })
    if (data?.result && !data?.allMark) {
      return validationActivityClaimLimits(data, PopupType.BONUS, activityInfo?.name);
    }  
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data.rewardAmount) }),
      })
    }
    await getActivityDetail()
    hideLoading()
  })

  onBeforeMount(async () => {
    await getActivityDetail()
  })

  return {
    activityInfo,
    merchantCy,
    checkLevel,
    curRewardConfig,
    receiveTime,
    onActivityApply,
    onLevelCheck,
    getLevelBg,
    loginHandle,
    isLogin,
    dayMaxReward,
    showReceiveBtn,
    useComponents,
    getActivityDetail
  }
}

export const useComponents = () => {
  const { defStyle } = getCustomerActivityId();
  const templList = {
    'style_0': () => import(`@/views/activity/mysterious/first/index.vue`),
    'style_1': () => import(`@/views/activity/mysterious/customTempl/style_1.vue`),
  }
  return markRaw(defineAsyncComponent(templList[defStyle])) as unknown as ComponentPublicInstance;
}
