// 代理活动 逻辑层
import { useRouter } from 'vue-router'
import { computed, onBeforeMount, ref, reactive } from 'vue'
import { shareAgentUrl } from '@/utils/agentShare'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { useAgentStore } from '@/store/agent'
import { formatToDateTime } from '@/utils/date'
import { useTenantStore } from '@/store/tenant'
import { useActivityStore } from '@/store/activity'
import { hideLoading, showLoading } from '@/utils/loading'
import { activityAgentDetailApi, activityApplyApi } from '@/api/activity'
import type { TValidCondition, DisplayMode, RewardType } from '@/enums/types/activity.type'
import type { ActivityAgentDetailModel, ActivityAgentRewardItem } from '@/api/activity/model'
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { moneyConvertToClient, formatMoneyToShow, isActivityForever, getCustomerActivityId } from '@/utils/custom'
import { ZTActivityTypes, ZDisplayMode, ZJoinType, ZRewardType, ZActivityRuleType } from '@/enums/types/activity.type'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { throttleActivity } from '@/utils';

let isDown: boolean;
let startX: number;
let scrollLeft: number;

export default function useLogic() {
  const router = useRouter()
  const userStore = useUserStore()
  const agentStore = useAgentStore()
  const appStore = useAppStore()
  const tenantStore = useTenantStore()
  const activityStore = useActivityStore()
  const { t } = useI18n()

  const { id: activityId } = getCustomerActivityId();

  const disableTab = ref(false);          // 定义导航标签禁用状态
  const activeRedPacketUuid = ref<string | null>(null)

  const segmentRef = ref() // 分享平台按钮列表
  const shareValue = ref(0) // 分享平台按钮列表动态值
  const segmentList = computed(() => agentStore.shareConfig?.filter((v) => v.isOpen) ?? []) // 分享平台按钮列表
  const isToken = computed(() => appStore.token ? true : false)                             // 是否未登录
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币

  const { shareUrl } = useShareUrl();

  const showRewardAmount = ref(false) // 是否显示奖励金额
  const rewardShowMode = ref<DisplayMode | null>(null) // 奖励领取模式
  const rewardList = ref<ActivityAgentRewardItem[]>([]) // 奖励列表
  const canClaimRewards = ref<ActivityAgentRewardItem[]>([]) // 可领取奖励列表
  const conditionType = ref<TValidCondition | null>(null) // 有效推广人数条件类型
  const bonusType = ref<RewardType>(ZRewardType.enum.FIXED) // 奖励类型
  const activityName = ref("") // 活动名称
  const validCondition = ref<null | any>(null) // 有效推广人数条件

  const showValidCondition = computed(() => {
    const { firstRecharge, rechargeAmount, validBet, rechargeDay, rechargeTimes } = activityInfo
    return (
      isRewardOpen(firstRecharge.status) ||
      isRewardOpen(rechargeAmount.status) ||
      isRewardOpen(validBet.status) ||
      isRewardOpen(rechargeDay.status) ||
      isRewardOpen(rechargeTimes.status)
    )
  })

  const receiveBtnIsDisabled = computed(() => {
    const { min, max } = getRewardCount(canClaimRewards.value)
    return !(min || max)
  })
  const shareTitle = computed(() => tenantStore.tenantInfo.name)  // 商户名称

  const activityInfo = reactive({
    subordinate: 0,
    validCount: 0,
    rewardAmount: '0',
    firstRecharge: { amount: 0, status: 'OFF' },
    rechargeAmount: { amount: 0, status: 'OFF' },
    validBet: { amount: 0, status: 'OFF' },
    rechargeDay: { days: 0, status: 'OFF' },
    rechargeTimes: { count: 0, status: 'OFF' },
    time: '',
    condition: '',
    description: '',
  })

  // 记录
  function claimHistoryHandle() {
    activityStore.pageType = 5
    router.replace({ path: '/main/promo' })
  }

  // 详情
  function detailsHandle() {
    router.push({ path: `/activity/agency/details/${activityId}` })
  }

  // 领取按钮
  const claimHandle = throttleActivity(async () => {
    showLoading()
    const data = await activityApplyApi({
      id: activityId,
      applyInfo: {
        type: ZTActivityTypes.enum.Agency,
        info: {
          userId: userStore.user?.userId!,
        },
      },
    })
    // 未满足申领限制条件
    if (data?.result && !data?.allMark) {
      return validationActivityClaimLimits(data, PopupType.BONUS, activityName.value)
    }
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data.rewardAmount) }),
      })
    }
    await getActivityConfig()
    hideLoading()
  })

  // 开宝箱/红包
  const openBoxHandle = throttleActivity(async (rewardInfo: ActivityAgentRewardItem) => {
    if (rewardInfo.isOpen || !rewardInfo.isMeet) return
    const rewardId = rewardInfo.uuid

    showLoading()
    const data = await activityApplyApi({
      id: activityId,
      applyInfo: {
        type: ZTActivityTypes.enum.Agency,
        info: {
          userId: userStore.user?.userId!,
          rewardId,
        },
      },
    })
    // 未满足申领限制条件
    if (data?.result && !data?.allMark) {
      return validationActivityClaimLimits(data, PopupType.BONUS, activityName.value)
    }
    await getActivityConfig()
    const rewardItem = rewardList.value.find((item) => item.uuid === rewardId)
    if (rewardItem) {
      rewardItem.isOpen = true
      rewardItem.showOpenAni = true
      setTimeout(() => {
        rewardItem.showOpenAni = false
        if (data) {
          showPopup({
            type: PopupType.BONUS,
            msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data.rewardAmount) }),
          })
        }
      }, 1000)
    }
    hideLoading()
  })

  // 分享图标切换事件
  function shareHandle(value: string) {
    shareAgentUrl(value, shareUrl.value, shareTitle.value)
  }

  // 获取宝箱/红包图标名称
  function getBoxIconPath(isOpen: boolean) {
    let imgName = ''
    const status = isOpen ? 'Open' : 'Close'
    if (rewardShowMode.value === ZDisplayMode.enum.BOX) {
      imgName = 'treasureBox'
    } else if (rewardShowMode.value === ZDisplayMode.enum.RED_PACKET) {
      imgName = 'redPacket'
    }
    return `/images/activity/${imgName}${status}.png`
  }

  // 获取宝箱/红包图标动画名称
  function getBoxIconAniPath() {
    let imgName = ''
    if (rewardShowMode.value === ZDisplayMode.enum.BOX) {
      imgName = 'treasureBoxOpen'
    } else if (rewardShowMode.value === ZDisplayMode.enum.RED_PACKET) {
      imgName = 'redPacket_open'
    }
    return `/gif/${imgName}.png`
  }

  // 获取宝箱/红包金额
  function getBoxAmount(item: ActivityAgentRewardItem) {
    if (item.isOpen) {
      return formatMoneyToShow(item.rewardAmount)
    }
    return bonusType.value === ZRewardType.enum.FIXED ? formatMoneyToShow(item.max) : `${formatMoneyToShow(item.min)}~${formatMoneyToShow(item.max)}`
  }

  // 计算当前用户可领取奖励
  function getRewardCount(canClaimRewards: ActivityAgentRewardItem[]) {
    let min = 0
    let max = 0
    canClaimRewards.reduce((pre, cur) => {
      min += cur.min
      max += cur.max
      return pre
    }, 0)
    return { min, max }
  }

  // 奖励是否开启
  function isRewardOpen(status: string): boolean {
    return status === 'ON'
  }

  async function getActivityConfig() {
    showLoading()
    const data = (await activityAgentDetailApi(Number(activityId))) as ActivityAgentDetailModel
    const {
      rule,
      ruleType,
      startTime,
      endTime,
      allCount,
      rewardType,
      validCount,
      validUsers,
      displayMode,
      isShow,
      rewardConfig,
      rewardList: receivedList,
    } = data

    const { bet, firstRechargeAmount, recharge, rechargeCount, rechargeDays, type, userLimit } = validUsers

    validCondition.value = validUsers
    bonusType.value = rewardType
    showRewardAmount.value = isShow
    rewardShowMode.value = displayMode
    conditionType.value = type

    activityInfo.subordinate = allCount
    activityInfo.validCount = validCount
    activityInfo.firstRecharge = { ...firstRechargeAmount, amount: moneyConvertToClient(firstRechargeAmount.amount) }
    activityInfo.rechargeAmount = { ...recharge, amount: moneyConvertToClient(recharge.amount) }
    activityInfo.validBet = { ...bet, amount: moneyConvertToClient(bet.amount) }
    activityInfo.rechargeDay = rechargeDays
    activityInfo.rechargeTimes = rechargeCount
    activityInfo.time = isActivityForever(endTime)
      ? t('activity.agent25')
      : `${formatToDateTime(startTime)} - ${formatToDateTime(endTime)}`
    activityInfo.condition = userLimit === ZJoinType.enum.ALL ? t('activity.agent26') : t('activity.agent27')
    const language = (await appStore.getLocale()) as Language
    if ('multilingual' in data && data.multilingual) {
      const multilingual = data.multilingual as Record<string, string>
      activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.Agency)
    }
    if (ZActivityRuleType.enum.DEFAULT === ruleType) {
      const ruleParam = JSON.parse(rule)

      activityInfo.description = generateDefultRules(language, ZTActivityTypes.enum.Agency, ruleParam.variablesValue)
    }
    else {
      activityInfo.description = rule;
    }
    rewardList.value = rewardConfig.map((item, index) => {
      const receivedItem = receivedList.find((v) => v.levelId === item.uuid)
      let isTrue = false  // 4 和 4的倍数 不能显示 最后以为不显示
      if ((index + 1 == 4) || (index + 1) % 4 == 0) {
        isTrue = true
      }
      if ((index + 1) == rewardConfig.length) {
        isTrue = true
      }
      return {
        uuid: item.uuid,
        userCount: item.userCount,
        min: moneyConvertToClient(item.min),
        max: moneyConvertToClient(item.max),
        rewardAmount: moneyConvertToClient(receivedItem?.awardCount ?? 0),
        isOpen: !!receivedItem,
        isMeet: validCount >= item.userCount && !receivedItem,
        showOpenAni: false,
        isTrue
      }
    })

    // 计算可领取奖励
    canClaimRewards.value = rewardList.value
      .filter((item) => validCount >= item.userCount && !item.isOpen)
      .map((v) => v)
    const { min, max } = getRewardCount(canClaimRewards.value)
    if (rewardType === ZRewardType.enum.RANDOM && (min || max)) {
      activityInfo.rewardAmount = `${formatMoneyToShow(min)}~${formatMoneyToShow(max)}`
    } else {
      activityInfo.rewardAmount = formatMoneyToShow(max)
    }
    hideLoading()
  }

  // 初始化
  onBeforeMount(async () => {
    if (await useAppStore().checkUserHasLogin()) {
      agentStore.resetAgencyInfo() // 重置代理信息
      tenantStore.resetTenantInfo() // 重置租户信息
      await userStore.getUser() // 获取用户信息
    }
    await agentStore.getConfig() // 获取代理配置
    await agentStore.getShareConfig() // 获取分享配置
    getActivityConfig()
  })

  /**
   * @description 鼠标按下事件
   * @param e 事件
   */
  function handleMouseDown(e: any) {
    isDown = true;
    startX = e.pageX - e.currentTarget.offsetLeft;
    scrollLeft = e.currentTarget.scrollLeft;
  }
  function handleMouseUp(e: any) {
    isDown = false;
    disableTab.value = false;
  }
  function handleMouseLeave() {
    isDown = false;
    disableTab.value = false;
  }
  function handleMouseMove(e: any) {
    if (!isDown) return;
    e.preventDefault();
    disableTab.value = true;
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX);
    e.currentTarget.scrollLeft = scrollLeft - walk;
  }

  return {
    segmentRef,
    shareValue,
    segmentList,
    shareUrl,
    showRewardAmount,
    rewardShowMode,
    rewardList,
    conditionType,
    bonusType,
    activityName,
    showValidCondition,
    receiveBtnIsDisabled,
    activityInfo,
    activeRedPacketUuid,
    claimHistoryHandle,
    detailsHandle,
    claimHandle,
    openBoxHandle,
    shareHandle,
    getBoxIconPath,
    getBoxIconAniPath,
    getBoxAmount,
    isRewardOpen,
    merchantCy,
    disableTab,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
  }
}
