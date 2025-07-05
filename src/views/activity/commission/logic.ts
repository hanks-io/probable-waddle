import { getCustomerActivityId, getTemplateType, formatMoneyToShow, convertMoneyToShow, type TemplateType } from '@/utils';
import { activityApplyApi, getActivityDetail } from '@/api/activity';
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { ZTActivityTypes, ZActivityRuleType } from '@/enums/types/activity.type'
import { getTheme } from '@/theme/hooks'
import { PopupType } from '@/components/Popup/data';
import { showPopup } from '@/hooks/ShowPopup'
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { ActivityNames } from '@/router/modules/activity';
import { throttleActivity } from '@/utils';

/**
 * 返奖类型
 * 领取佣金，结算佣金，直属会员累计充值
 */
export const CommissionRewardList = ['RECEIVE', 'SETTLE', 'RECHARGE'] as const
type CommissionRewardType = typeof CommissionRewardList[number]
/**
 * 奖励类型
 * 固定金额，比例
 */
export const CommissionRewardAwardType = ['BALANCE', 'RATE'] as const

export const CommissionRewardResetList = ['MONTHLY_DAY', 'WEEKLY_DAY', 'DAILY'] as const
type CommissionRewardResettype = typeof CommissionRewardResetList[number]
export const useCommissionLogic = () => {
  const tenantStore = useTenantStore();
  const appStore = useAppStore()
  const userStore = useUserStore()
  const router = useRouter();
  const { t } = useI18n() // 国际化

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 当前商户货币
  const { id } = getCustomerActivityId();

  const commissionReceivedTitleMap: Record<CommissionRewardResettype, Record<CommissionRewardType, string>> = {
    'DAILY': {
      'RECEIVE': 'activity.commission15',
      'SETTLE': 'activity.commission18',
      'RECHARGE': 'activity.commission02'
    },
    'WEEKLY_DAY': {
      'RECEIVE': 'activity.commission16',
      'SETTLE': 'activity.commission19',
      'RECHARGE': 'activity.commission03'
    },
    'MONTHLY_DAY': {
      'RECEIVE': 'activity.commission17',
      'SETTLE': 'activity.commission20',
      'RECHARGE': 'activity.commission04'
    },
  }

  const rewardAvailableTitleMap: Record<CommissionRewardResettype, string> = {
    'DAILY': 'activity.commission11',
    'WEEKLY_DAY': 'activity.commission12',
    'MONTHLY_DAY': 'activity.commission13',
  }
  const tableTitleMap: Record<CommissionRewardType, string> = {
    'RECEIVE': 'activity.commission06',
    'SETTLE': 'activity.commission07',
    'RECHARGE': 'activity.commission08',
  }
  const loading = ref(false)
  const rewardAmountTitle = ref("")
  const currentRewardAmount = ref("")
  const commissionReceivedTitle = ref("")
  const commissionReceived = ref("")
  const tableTitle = ref("")
  const isShowDetail = ref(false)
  const commissionList = ref([])
  const btnDisabled = ref(false)
  const currentLastRewardAmount = ref('')
  const activityRule = ref('')
  const activityName = ref('')
  let activityDetailSelect = ''

  const getActivityConfig = async () => {
    const res = await getActivityDetail(id, 'CommissionReward')
    console.log(res, 'data')
    const { multilingual, rewardConfig, rewardType, resetType, currentAmount, rewardAmount, awardType, lastRewardAmount } = res
    activityDetailSelect = multilingual?.activityDetailSelect
    rewardAmountTitle.value = rewardAvailableTitleMap[resetType as CommissionRewardResettype]
    commissionReceivedTitle.value = commissionReceivedTitleMap[resetType as CommissionRewardResettype]?.[rewardType as CommissionRewardType]
    tableTitle.value = tableTitleMap[rewardType as CommissionRewardType]
    isShowDetail.value = rewardType === 'RECHARGE'
    currentRewardAmount.value = convertMoneyToShow(currentAmount)
    commissionReceived.value = convertMoneyToShow(rewardAmount)
    currentLastRewardAmount.value = convertMoneyToShow(lastRewardAmount)
    btnDisabled.value = lastRewardAmount <= 0
    const language = (await appStore.getLocale()) as Language


    activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.CommissionReward || 'CommissionReward');
    // 处理活动规则
    if (ZActivityRuleType.enum.DEFAULT === multilingual.ruleType) {
      const ruleParam = JSON.parse(multilingual.rule)
      activityRule.value = generateDefultRules(language, ZTActivityTypes.enum.CommissionReward || 'CommissionReward', ruleParam.variablesValue)
    } else {
      activityRule.value = multilingual.rule;
    }

    const isShowMerchantCy = awardType === 'BALANCE'
    commissionList.value = rewardConfig.map((item: any) => {
      const { conditionAmount, rewardAmount } = item
      const amount = isShowMerchantCy ? convertMoneyToShow(rewardAmount) : `${formatMoneyToShow(rewardAmount)}%`
      return {
        conditionAmount: conditionAmount / 100,
        rewardAmount: formatMoneyToShow(amount),
        isShowMerchantCy

      }
    })
  }
  const pathToDetail = () => {
    const path = `/activity/CommissionReward/details/${activityDetailSelect ? id + '@' + activityDetailSelect : id}`;
    router.push({ path })
  }

  const receiveCommission = throttleActivity(async () => {
    if (btnDisabled.value || loading.value) return
    loading.value = true
    try {
      const data = await activityApplyApi({
        id,
        applyInfo: {
          type: ZTActivityTypes.enum.CommissionReward || 'CommissionReward',
          info: {
            userId: userStore.user?.userId!,
          },
        },
      })
      if (data?.result && !data?.allMark) {
        return validationActivityClaimLimits(data, PopupType.BONUS, activityName.value);
      }
      if (data) {
        showPopup({
          type: PopupType.BONUS,
          msg: t('popup.tips05', { amount: merchantCy.value + convertMoneyToShow(data.awardCount) }),
        })
        currentLastRewardAmount.value = convertMoneyToShow(0)
        btnDisabled.value = true
      }
    } finally {
      loading.value = false
    }
  })




  getActivityConfig()

  return {
    isShowDetail,
    commissionList,
    merchantCy,
    rewardAmountTitle,
    commissionReceivedTitle,
    tableTitle,
    currentRewardAmount,
    commissionReceived,
    btnDisabled,
    currentLastRewardAmount,
    activityRule,
    activityName,
    pathToDetail,
    receiveCommission,
    formatMoneyToShow
  };
}



export const useComponents = (isDetails?: boolean) => {
  const { activityConfig } = getTheme()
  const template = activityConfig?.[ActivityNames.CommissionReward]?.template
  const { defStyle } = getCustomerActivityId(template);
  const templList: Record<string, () => Promise<any>> = {
    'style_0': () => import('@/views/activity/commission/style_0/index.vue'),
    'style_1': () => import('@/views/activity/commission/style_1/index.vue'),
    'style_0_detail': () => import('@/views/activity/commission/style_0/detail.vue'),
    'style_1_detail': () => import('@/views/activity/commission/style_1/detail.vue'),
  };
  const computedTemplate = templList[isDetails ? `${defStyle}_detail` : defStyle];
  return markRaw(defineAsyncComponent(computedTemplate)) as unknown as ComponentPublicInstance;
}



export const useBtnComponents = () => {
  const { theme, skin } = getTheme()
  const key = `${theme}-${skin}`
  const templList: Record<string, () => Promise<typeof import('*.vue')>> = {
    'amber-purple-default': () => import('@/components/button/AmberPurpleBtn.vue'),
    'amber-purple-second': () => import('@/components/second/Button/index.vue'),
    'public': () => import('@/components/first/Button/index.vue'),

  };
  const computedTemplate = key in templList ? templList[key] : templList['public'];
  return markRaw(defineAsyncComponent(computedTemplate)) as unknown as ComponentPublicInstance;
}


