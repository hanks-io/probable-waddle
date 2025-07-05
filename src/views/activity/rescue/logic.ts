// 救援金 逻辑层
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { delay } from '@/utils/delay'
import { getUtcTime } from '@/utils/date'
import { useUserStore } from '@/store/user'
import { useTenantStore } from '@/store/tenant'
import { onBeforeRouteLeave } from 'vue-router'
import { countdownFormat } from '@/hooks/CountdownFormat'
import { ActivityApplyParams } from '@/api/activity/model'
import { useAppStore } from '@/store/app'
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { throttleActivity } from '@/utils';

import {
  ZTActivityTypes,
  ZTLossType,
  TActivityResetType,
  ZActivityResetType,
  ZAwardType,
  ZAssistancerewardType,
  ZActivityRuleType,
} from '@/enums/types/activity.type'
import { onBeforeMount, ref, watch, reactive, computed } from 'vue'
import { isActivityForever,  getCustomerActivityId, moneyConvertToClient } from '@/utils/custom'
import { activityApplyApi, assistanceDetailApi } from '@/api/activity'
import dayjs from 'dayjs'
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { useActivityStore } from '@/store/activity';
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { Time }from '@/utils/date'

export default function useLogic() {
  const { t } = useI18n() // 导入多语言
  const userStore = useUserStore() // 用户store
  const appStore = useAppStore() // App状态管理
  const tenantStore = useTenantStore() // 租户store
  const route = useRoute(); // 获取当前路由对象
  const { id: activityId } = getCustomerActivityId()
  const overTime = ref(0) // 活动结束时间
  const timing = ref(false) // 倒计时执行状态
  const applyAmount = ref('') // 申请亏损金额
  const calcStatus = ref(false) // 计算活动状态
  const btnLoading = ref(false) // 申请按钮加载状态
  const overCountdown = ref('') // 活动倒计时
  const modalVisible = ref(false) // 申请弹窗显示状态
  const activityStatus = ref(false) // 活动开启状态
  const showEndCountdown = ref(false) // 显示活动结束倒计时
  const activityName = ref<string>('') // 活动名称
  const showReceiveBtn = ref(false) // 显示领取按钮
  const btnReceiveIsEnable = ref(false) // 领取按钮是否可点击
  const profitTitle = ref('') // 今日损益标题
  const showCouponAmount = ref(false) // 显示优惠金额
  const activityStore = useActivityStore(); // 活动store

  const country = computed(() => tenantStore.tenantInfo?.code);
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const issueEndTime = ref<Time | null>(null)
  const banner = computed(() => {
    if (!rescueInfo.resetType) return {}
    const countryStr = country.value === 'PH' ? '_PH' : '';
    return {
      backgroundImage: `url('/images/activity/rescue_${rescueInfo.resetType.toLocaleLowerCase()}_banner${countryStr}.png')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }
  })
  const bannerFollow = computed(() => {
    if (!rescueInfo.resetType) return {}
    return {
      bgImg : {
        backgroundImage: `url('/images/activity/follow${rescueInfo.resetType}.png')`,
      },
      circleImg :{
        backgroundImage: `url('/images/activity/follow${rescueInfo.resetType}Circle.png')`,
      },
      haloImg :{
        backgroundImage: `url('/images/activity/halo${rescueInfo.resetType}.png')`,
      }
    }
  })

  const rescueInfo = reactive({
    // 救援金活动详情
    endTime: '',
    profit: 0,
    reward: 0,
    rewardType: ZAssistancerewardType.enum.FIXED,
    rewardAmount: 0,
    rule: '',
    rewardLevels: [{ uuid: '', conditionAmount: 0, rewardAmount: 0 }],
    resetType: '',
    ruleType: 'DEFAULT',
  })

  const activityApplyParams = reactive<ActivityApplyParams>({
    id: activityId,
    applyInfo: {
      type: ZTActivityTypes.enum.Assistance,
      info: {
        userActivityAwardId: 0,
        userId: userStore.user?.userId || 0,
      },
    },
  })

  watch(() => overTime.value, updateCountdown, { flush: "post" })

  /**
   * @description: 更新活动倒计时
   */
  async function updateCountdown() {
    // 监听活动结束时间
    if (overTime.value === 0) calcStatus.value = false // 计算活动时间状态
    if (timing.value) return
    timing.value = true
    overCountdown.value = countdownFormat(overTime.value)
    await delay(1000)
    timing.value = false
    if (overTime.value > 0) {
      overTime.value--
    } else {
      getAssistanceDetail()
    }
  }

  /**
   * @description: 奖品弹窗关闭事件
   */
  function modalCloseHandle() {
    applyAmount.value = ''
    modalVisible.value = false
  }

  /**
   * @description: 申请按钮点击事件
   */
  function applyHandle() {
    if (!showEndCountdown.value || activityStatus.value) modalVisible.value = true
  }
  /**
   * @description: 确认申请提交事件
   */
  async function submitForm(event: Event) {
    event.preventDefault() // 阻止表单默认提交事件
    if ('applyAmount' in activityApplyParams.applyInfo.info) {
      activityApplyParams.applyInfo.info.applyAmount = Number(applyAmount.value) * 100
    }
    await onActivityApply()
    modalVisible.value = false
  }

  /**
   * @description 初始化活动相关数据
   */
  async function init() {
    if (await useAppStore().checkUserHasLogin()) {
      await userStore.getUser() // 获取用户信息
      if ('userId' in activityApplyParams.applyInfo.info)
        activityApplyParams.applyInfo.info.userId = userStore.user?.userId || 0
    }
  }

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    getAssistanceDetail()
    init()
  })

  /**
   * 生命周期: 路由离开前
   */
  onBeforeRouteLeave(() => {
    modalCloseHandle()
  })

  // 获取标题
  function getProfitTitle(type: TActivityResetType) {
    switch (type) {
      case ZActivityResetType.enum.DAILY:
        return t('viewsActivity.todayProfitLoss')
      case ZActivityResetType.enum.WEEKLY:
        return t('viewsActivity.weekProfitLoss')
      default:
        return ''
    }
  }

  /**
   * 接口调用-获取救援金活动详情
   */
  async function getAssistanceDetail() {
    activityStatus.value = false // 活动开启状态-未开启
    const res = await assistanceDetailApi(activityApplyParams.id)
    const language = (await appStore.getLocale()) as Language

    if('issueEndTime' in res){ 
    
    issueEndTime.value = res.issueEndTime
      
    }

    if ('multilingual' in res && res.multilingual) {
      const multilingual = res.multilingual as Record<string, string>
      activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.Assistance)
    }
    if ('endTime' in res && 'rewardLevels' in res) {
      showEndCountdown.value = !isActivityForever(res.endTime) // 是否显示活动结束倒计时(2035年为永久活动)
      const currentTimestamp = dayjs().unix()
      const startTimestamp = (getUtcTime(res.startTime) as dayjs.Dayjs).unix() // 活动开始时间戳
      const endTimestamp = (getUtcTime(res.endTime) as dayjs.Dayjs).unix() // 活动结束时间戳
      if (startTimestamp > currentTimestamp) {
        overTime.value = startTimestamp - currentTimestamp // 计算活动开启倒计时(秒)
      } else if (endTimestamp > currentTimestamp) {
        overTime.value = endTimestamp - currentTimestamp // 计算活动结束倒计时(秒)
        activityStatus.value = true // 活动开启状态-已开启
      }
      Object.assign(rescueInfo, res) // 救援金活动详情
      let profit = ZTLossType.enum.NORMAL === res.type ? res.profit : res.profit + res.reward// 亏损金额
      profit = profit > 0 ? 0 : profit
      rescueInfo.profit = Math.abs(profit) // 今日损益
      profitTitle.value = getProfitTitle(res.resetType)
      showReceiveBtn.value = ZAwardType.enum.ACTIVITY === res.awardType // 显示领取按钮
      btnReceiveIsEnable.value = !!res.receiveActivityId // 领取按钮是否可点击
      activityApplyParams.applyInfo.info.userActivityAwardId = res.receiveActivityId

      if (rescueInfo.ruleType === ZActivityRuleType.enum.DEFAULT) {
        const ruleParams = JSON.parse(rescueInfo.rule)
          rescueInfo.rule = generateDefultRules(language, ZTActivityTypes.enum.Assistance, ruleParams.variablesValue)
        if (route.path.includes('@style_0')) {
          rescueInfo.rule = generateDefultRules(language, ZTActivityTypes.enum.Assistance, ruleParams.variablesValue)
        }
        if(route.path.includes('@style_1')){
          rescueInfo.rule = generateDefultRules(language, ZTActivityTypes.enum.Assistance+"Follow", ruleParams.variablesValue)
        }
      }
    }
    calcStatus.value = true // 计算活动时间状态
  }

  /**
   * 接口调用: 活动申请
   */
  const onActivityApply = throttleActivity(async () => {
    if (btnLoading.value) return

    if ((!showEndCountdown.value || activityStatus.value) && btnReceiveIsEnable.value) {
      btnLoading.value = true
      try {
        activityStore.setRedPointList()
        const data: any = await activityApplyApi(activityApplyParams)
        if (data?.result && !data?.allMark) {
          return validationActivityClaimLimits(data, PopupType.BONUS, activityName.value);
        }
        const amount = rescueInfo.rewardAmount
        if (amount) {
          showPopup({
            type: PopupType.BONUS,
            msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(amount) }),
          })
        }
        getAssistanceDetail()
      } finally {
        btnLoading.value = false
      }
    }
  })

  const errorEvent = new CustomEvent('error', {
    detail: {
        message: 'An error occurred',
        timestamp: new Date(),
    }
});

window.dispatchEvent(errorEvent);
const useComponents = () => {
  const { defStyle } = getCustomerActivityId();
  const templList: Record<string, () => Promise<typeof import('*.vue')>> = {
    'style_0': () => import('@/views/activity/rescue/style_0/index.vue'),
    'style_1': () => import('@/views/activity/rescue/style_1/index.vue'),
  };
  const computedTemplate = templList[defStyle];
  return markRaw(defineAsyncComponent(computedTemplate)) as unknown as ComponentPublicInstance;
}
  return {
    overTime,
    applyAmount,
    calcStatus,
    btnLoading,
    overCountdown,
    modalVisible,
    activityStatus,
    showEndCountdown,
    activityName,
    showReceiveBtn,
    btnReceiveIsEnable,
    profitTitle,
    showCouponAmount,
    rescueInfo,
    banner,
    issueEndTime,
    merchantCy,
    modalCloseHandle,
    submitForm,
    getAssistanceDetail,
    onActivityApply,
    useComponents,
    bannerFollow
  }
}
