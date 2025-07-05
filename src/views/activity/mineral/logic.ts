// 红包雨 逻辑层
import { delay } from '@/utils/delay'
import { useUserStore } from '@/store/user'
import { useTenantStore } from '@/store/tenant'
import { useAppStore } from '@/store/app'
import { onBeforeRouteLeave } from 'vue-router'
import { countdownFormat } from '@/hooks/CountdownFormat'
import { ZActivityRuleType, ZTActivityTypes, ZValidCondition } from '@/enums/types/activity.type'
import { computed, nextTick, onBeforeMount, reactive, ref, watch } from 'vue'
import { activityApplyApi, redPacketDetailApi } from '@/api/activity'
import { ActivityApplyParams, RedPacketDetailModel } from '@/api/activity/model'
import { isActivityForever, moneyConvertToClient, getCustomerActivityId } from '@/utils/custom'
import { getCurrentLocalTime, getLocalTimeByString, getTomorrowLocalDate, getUtcTime } from '@/utils/date'
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs'
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { useScroll } from '@vueuse/core'
import { useActivityStore } from '@/store/activity'
import { getTheme } from '@/theme/hooks'
import { useRouter } from 'vue-router'
import { showLoading } from '@/utils/loading';
import { throttleActivity } from '@/utils';
import { ActivityNames } from '@/router/modules/activity'
export default function useLogic() {
  const { t } = useI18n();
  const router = useRouter();
  
  const scrollEl = ref<HTMLElement | null>(null)
  let { y } = useScroll(scrollEl)
  const { id: activityId } = getCustomerActivityId() // 获取路由参数(活动id, 活动名称)
  const userStore = useUserStore() // 用户store
  const appStore = useAppStore() // app store
  const tenantStore = useTenantStore() // 租户store
  const rule = ref('') // 活动规则
  const endTime = ref(0) // 挖矿结束时间
  const overTime = ref(0) // 活动结束时间
  const startTime = ref(0) // 挖矿开启时间
  const rewardCount = ref(0) // 今日收益
  const endTiming = ref(false) // 挖矿结束倒计时状态
  const overCountdown = ref('') // 活动倒计时
  const btnLoading = ref(false) // 开采按钮loading
  const startTiming = ref(false) // 挖矿开启倒计时状态
  const startCountdown = ref('') // 活动倒计时
  const activityName = ref('') // 活动名称
  const activityStatus = ref(false) // 活动开启状态
  const activityTiming = ref(false) // 活动倒计时状态
  const showEndCountdown = ref(false) // 显示挖矿活动结束倒计时
  const canReceive = ref(false) // 是否可以领取
  const rewardAmount = ref(0) // 奖励金额
  const timeConfig = ref<RedPacketDetailModel['timeConfig']>([]) // 活动时间配置
  const showTimeOut = ref(false) // 显示活动结束倒计时
  const activityStore = useActivityStore()
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  let firstActiveIndex = ref(0)
  const openStyle2AvailableModal = ref<boolean>(false);
  const openStyle1AvailableModal = ref<boolean>(false);
  const availabledRewardCount = ref<number | string>(0);
  const openRedModel = ref(false) // 红包雨详情弹窗
  const maxJoinTimes = ref<number>(0);// 最大参与次数
  const joinedTimes = ref<number>(0);// 已参与次数
  const joinType = ref<string>('');// 参与类型

  const dayLanguageName = computed(() => t('date.days'));
  const overCountDownList = computed(() => {
    if (activityStatus.value || overTime.value > 0) {
      return handleStylePageDate();
    } else {
      return [ 
        { name: 'date.days', value: '00' },
        { name: 'date.hour', value: '00' },
        { name: 'date.minute', value: '00' },
        { name: 'date.second', value: '00' }
      ];
    }
  })

  const joinBtnText = computed(() => {
    return canReceive.value ? t('activity.redPacket3') : t('viewsActivity.mined')
  })

  const showReceiveBtn = computed(() => {
    if (ZValidCondition.enum.RECHARGE === joinType.value) {
        return maxJoinTimes.value ? joinedTimes.value < maxJoinTimes.value : true;
    }
    return true;
  })

  watch(
    () => overTime.value,
    async () => {
      // 监听活动结束时间
      if (activityTiming.value) return
      activityTiming.value = true
      overCountdown.value = countdownFormat(overTime.value)
      await delay(1000)
      activityTiming.value = false
      if (overTime.value > 0) overTime.value--
      else getRedPacketDetail()
    },
  )
  watch(
    () => startTime.value,
    async () => {
      // 监听挖矿开启时间
      if (startTiming.value) return
      startTiming.value = true
      startCountdown.value = countdownFormat(startTime.value)
      await delay(1000)
      startTiming.value = false
      if (startTime.value > 0) startTime.value--
      else getRedPacketDetail() // 重新获取红包雨活动详情)
    },
  )
  watch(
    () => endTime.value,
    async () => {
      // 监听挖矿结束时间
      if (endTiming.value) return
      endTiming.value = true
      startCountdown.value = countdownFormat(endTime.value)
      await delay(1000)
      endTiming.value = false
      if (endTime.value > 0) endTime.value--
      else getRedPacketDetail() // 重新获取红包雨活动详情
    },
  )

  const activityApplyParams = reactive<ActivityApplyParams>({
    // 申请活动奖励参数
    id: activityId,
    applyInfo: {
      type: ZTActivityTypes.enum.RedPacket,
      info: {
        userId: userStore.user?.userId || 0,
      },
    },
  })

  /**
   * 计算时间区间
   */
  function calcTime(time: number, durationIn: number = 0) {
    const hour =
      Math.floor(durationIn / 60) + time < 10
        ? `0${Math.floor(durationIn / 60) + time}`
        : Math.floor(durationIn / 60) + time
    const minute = durationIn % 60 < 10 ? `0${durationIn % 60}` : durationIn % 60
    return `${hour}:${minute}`
  }

  /**
   * 计算活动开启时间
   */
  function calcStartTime() {
    const today = getCurrentLocalTime('YYYY-MM-DD') as string
    const currentTime = dayjs().unix()
    let start = 0
    let end = 0
    for (const item of timeConfig.value) {
      start = getLocalTimeByString(today + ' ' + calcTime(item.hour)).unix()
      end = getLocalTimeByString(today + ' ' + calcTime(item.hour, item.durationIn)).unix()
      if (currentTime < start) {
        startTime.value = start - currentTime
        return startTime.value
      } else if (currentTime > start && currentTime < end) {
        endTime.value = end - currentTime
        return endTime.value
      }
    }
    const tomorrow = getTomorrowLocalDate('YYYY-MM-DD') as string
    start = getLocalTimeByString(tomorrow + ' ' + calcTime(timeConfig.value[0].hour)).unix()
    startTime.value = start - currentTime
    return startTime.value
  }

  /**
   * 时间点是否大于当前时间之后
   */
  function isAfterNow(item: any): boolean {
    const today = getCurrentLocalTime('YYYY-MM-DD') as string
    const endTime = getLocalTimeByString(today + ' ' + calcTime(item.hour, item.durationIn)).unix()
    const currentTime = dayjs().unix()
    return endTime > currentTime
  }

  /**
   * 开采按钮
   */
  async function rewardModalHandle() {
    if (btnLoading.value || !canReceive.value || !activityStatus.value) return
    btnLoading.value = true
    try {

      const res: any = await activityApplyApi(activityApplyParams)
      if (res?.result && !res?.allMark) {
        return validationActivityClaimLimits(res, PopupType.BONUS, activityName.value);
      }
      rewardAmount.value = moneyConvertToClient(res.redPacketamount)
      if (res) {
        const msg = res.redPacketamount ? t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(res.redPacketamount) }) : t('activity.redPacket12')
        showPopup({
          type: PopupType.BONUS,
          msg,
        })
      }
      await getRedPacketDetail()
    } finally {
      btnLoading.value = false
    }
  }

  // 开采按钮-皮肤1
  const mineralAvailableClick = throttleActivity(async () => {
    if (btnLoading.value || !canReceive.value || !activityStatus.value) return;
    btnLoading.value = true;
    try {
      const res: any = await activityApplyApi(activityApplyParams);
      if (res?.result && !res?.allMark) {
        return validationActivityClaimLimits(res, PopupType.BONUS, activityName.value);
      }
      rewardAmount.value = moneyConvertToClient(res.redPacketamount);
      if (res) {
        availabledRewardCount.value = convertMoneyToShow(res?.redPacketamount);
        openStyle1AvailableModal.value = true
      }
      await getRedPacketDetail();
    } finally {
      btnLoading.value = false
    }
  });

  // 开采按钮-皮肤2
  const mineralStyle2AvailableClick = throttleActivity(async () => {
    if (btnLoading.value || !canReceive.value || !activityStatus.value) return;
    btnLoading.value = true;
    try {
      const res: any = await activityApplyApi(activityApplyParams);
      if (res?.result && !res?.allMark) {
        return validationActivityClaimLimits(res, PopupType.BONUS, activityName.value);
      }
      rewardAmount.value = moneyConvertToClient(res.redPacketamount);
      if (res) {
        availabledRewardCount.value = convertMoneyToShow(res?.redPacketamount);
        openStyle2AvailableModal.value = true;
      }
      await getRedPacketDetail();
    } finally {
      btnLoading.value = false
    }
  });

  // 皮肤2-领取详情弹窗
  function closeAvailableModal(type: string) {
    if (type == 'style1') 
      openStyle1AvailableModal.value =false;
    else 
      openStyle2AvailableModal.value = false;
  }

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(async () => {
    await tenantStore.getTenantInfo() // 获取租户信息
    getRedPacketDetail()
  })

  /**
   * 生命周期: 路由离开前
   */
  onBeforeRouteLeave((_to, _from, next) => {
    closeModel();
    next()
  })

  //  监听开启时间列表 ， 滚动到当前时间列表
  watch(firstActiveIndex, (i) => {
    if (i < 3) return
    nextTick(() => {
      y.value += (Math.ceil(i / 3)) * 18
    })

  })
  /**
   * 接口调用: 获取红包雨活动详情
   */
  async function getRedPacketDetail() {
    showLoading();
    activityStatus.value = false // 活动开启状态-未开启
    const res = (await redPacketDetailApi(Number(activityId))) as RedPacketDetailModel
    activityStore.redPacketDetail = res
    const language = (await appStore.getLocale()) as Language

    if ('multilingual' in res && res.multilingual) {
      const multilingual = res.multilingual as Record<string, string>
      activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.RedPacket)
    }
    if (res.ruleType === ZActivityRuleType.enum.DEFAULT) {

      const ruleParams = JSON.parse(res.rule)
      rule.value = generateDefultRules(language, ZTActivityTypes.enum.RedPacket, ruleParams.variablesValue)
    }
    else {
      rule.value = res.rule
    }
    canReceive.value = res.canReceive
    rewardCount.value = moneyConvertToClient(res.rewardCount)
    timeConfig.value = res.timeConfig.sort((a, b) => a.hour - b.hour)
    firstActiveIndex.value = timeConfig.value.findIndex(it => isAfterNow(it))
    showEndCountdown.value = !isActivityForever(res.endTime) // 是否显示活动结束倒计时(2035年为永久活动)
    maxJoinTimes.value = res.dailyMaxCount;
    joinedTimes.value = res.receiveCount;
    joinType.value = res?.JoinTypes;
    const currentTimestamp = dayjs().unix()
    const startTimestamp = (getUtcTime(res.startTime) as dayjs.Dayjs).unix()
    const endTimestamp = (getUtcTime(res.endTime) as dayjs.Dayjs).unix()
    if (startTimestamp > currentTimestamp) {
      overTime.value = startTimestamp - currentTimestamp // 计算活动开启倒计时(秒)
    } else if (endTimestamp > currentTimestamp) {
      overTime.value = endTimestamp - currentTimestamp // 计算活动结束倒计时(秒)
      activityStatus.value = true // 活动开启状态-已开启
    }
    calcStartTime()
    showTimeOut.value = true

    openRedModel.value = !judgeCondition(res)
  }

  // 处理新增皮肤显示时间
  function handleStylePageDate() {
    let days = '00';
    let hours = '00';
    let minutes = '00';
    let seconds = '00';
    if (overCountdown.value?.includes(dayLanguageName.value)) {
      const overTimes = overCountdown.value?.trim();
      const dateList = overTimes?.split(dayLanguageName.value);
      days = dateList[0];
      const timeList = dateList[1]?.split(':');
      hours = timeList[0];
      minutes = timeList[1];
      seconds = timeList[2];
    } else {
      const timesList = overCountdown.value?.split(':');
      days = '00';
      hours = timesList[0];
      minutes = timesList[1];
      seconds = timesList[2];
    }
    if (overTime.value > 0) {
      return showEndCountdown.value ? [
        { name: 'date.days', value: days },
        { name: 'date.hour', value: hours },
        { name: 'date.minute', value: minutes },
        { name: 'date.second', value: seconds }
        ] : 
      [ { name: 'date.days', value: '99' },
        { name: 'date.hour', value: '99' },
        { name: 'date.minute', value: '99' },
        { name: 'date.second', value: '99' }
      ];
    }
  }

  function closeModel() {
    openRedModel.value = false
  }

  // 判断是否满足条件
  function judgeCondition(info: RedPacketDetailModel): boolean {
    if (ZValidCondition.enum.RECHARGE == info.JoinTypes) {
      return info.rechargeAmount > 0
    }
    return true
  }

  return {
    rule,
    endTime,
    overTime,
    startTime,
    rewardCount,
    overCountdown,
    btnLoading,
    startCountdown,
    activityName,
    activityStatus,
    showEndCountdown,
    canReceive,
    timeConfig,
    showTimeOut,
    rewardModalHandle,
    isAfterNow,
    calcTime,
    merchantCy,
    scrollEl,
    overCountDownList,
    openStyle2AvailableModal,
    availabledRewardCount,
    openStyle1AvailableModal,
    mineralAvailableClick,
    mineralStyle2AvailableClick,
    closeAvailableModal,
    activityId,
    openRedModel,
    closeModel,
    joinBtnText,
    showReceiveBtn,
  }
}


export const useComponents = () => {
  let defStyle = getCustomerActivityId()?.defStyle;
  const { skin, activityConfig } = getTheme();
  const template = activityConfig?.[ActivityNames.RedPacket]?.template as keyof typeof templateList
  if (defStyle === 'style_0') {
    defStyle = template ??  `${defStyle}:${skin}`;
  }
  const templateList = {
    'style_0:default': () => import(`@/views/activity/mineral/style_0/default/index.vue`),
    'style_0:first': () => import(`@/views/activity/mineral/style_0/first/index.vue`),
    'style_0:second': () => import(`@/views/activity/mineral/style_0/first/index.vue`),
    'style_1': () => import(`@/views/activity/mineral/style_1/index.vue`),
    'style_2': () => import(`@/views/activity/mineral/style_2/index.vue`),
  }

  return markRaw(defineAsyncComponent(templateList[defStyle])) as unknown as ComponentPublicInstance;
}
