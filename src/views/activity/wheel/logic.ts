// 幸运转盘 逻辑层
import { delay } from '@/utils/delay'
import { getUtcTime } from '@/utils/date'
import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { useTenantStore } from '@/store/tenant'
import { ActivityNames } from '@/router/modules/activity'
import { useActivityStore } from '@/store/activity'
import { countdownFormat, countdownFormat1 } from '@/hooks/CountdownFormat'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { ActivityApplyParams, LuckWheelDetailModel } from '@/api/activity/model'
import { hideLoading, showLoading } from '@/utils/loading'
import { ZActivityRuleType, ZTActivityTypes } from '@/enums/types/activity.type'
import { isActivityForever, getCustomerActivityId } from '@/utils/custom'
import { activityApplyApi, luckWheelDetailApi } from '@/api/activity'
import router from '@/router'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import useStartSportGame from "@/hooks/useStartSportGame";
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import useWheel from '@/views/activity/wheel/style_1/useWheel'
import { getTheme } from '@/theme/hooks'

export default function useLogic() {
  const { id: activityId } = getCustomerActivityId() // 获取路由参数


  const gameStore = useGameStore() // 游戏store
  const userStore = useUserStore() // 用户store
  const appStore = useAppStore() // App状态管理
  const tenantStore = useTenantStore() // 租户store
  const activityStore = useActivityStore() // 活动store
  const { t } = useI18n()

  const speed = ref(0) // 转盘转动速度
  const rule = ref('') // 游戏规则
  const prizes = ref() // 转盘奖品
  const luckyRef = ref() // 抽奖组件实例
  const overTime = ref(0) // 活动结束时间(秒)
  const tempo = ref(2000) // 抽奖灯闪烁节奏
  const stopAngle = ref(0) // 转盘停止角度
  const countdown = ref('') // 活动倒计时(字符串)
  const timing = ref(false) // 倒计时执行状态
  const currentAngle = ref(0) // 大转盘当前角度
  const calcStatus = ref(false) // 计算活动状态
  const startClick = ref(false) // 开始按钮点击状态
  const modalDuration = ref(1000) // 奖品弹窗显示/隐藏动画过渡时间
  const activityStatus = ref(false) // 活动开启状态
  const showEndCountdown = ref(false) // 显示活动结束倒计时
  const rewardModalVisible = ref(false) // 奖品弹窗显示状态
  const activityName = ref<string>('') // 活动名称
  const exchangeModalVisible = ref(false) // 兑换弹窗显示状态
  const animationPlayState = ref("running")  // 动画运行
  const isShowAnimationEl = computed(() => animationPlayState.value === 'running')
  let timeId: null | number = null
  const wheelInfo = ref({
    // 转盘信息
    endTime: '',
    exchangeReward: 0,
    lotteryTicketGetCount: 0,
    awardList: [] as any[],
    lotteryTicketGet: [] as any[],
    propHCount: 0,
    propACount: 0,
    propPCount: 0,
    propYCount: 0,
  })
  const rewardCards = ref([
    // 奖品卡片
    { name: 'H', amount: 0 },
    { name: 'A', amount: 0 },
    { name: 'P', amount: 0 },
    { name: 'P2', amount: 0 },
    { name: 'Y', amount: 0 },
  ])

  const isRedeemable = computed(() => rewardCards.value.every(it => it.amount))
  const tenantInfo = computed(() => tenantStore.tenantInfo) // 租户信息
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币

  const activityApplyParams = reactive<ActivityApplyParams>({
    // 抽奖和兑换抽奖次数参数
    id: activityId,
    applyInfo: {
      type: ZTActivityTypes.enum.LuckyWheel,
      info: {
        exchangeCount: 0, // 等于0为抽奖，大于零为兑换抽奖次数
        userId: userStore.user?.userId || 0,
      },
    },
  })

  const currentPrize = reactive({
    // 当前抽中奖品信息
    uuid: '',
    type: '',
    amount: 0,
  })

  const { 
    endAfter,
    initPrizes,
    startBefore,
    showMask,
    wheelPrizes1,
    prizesDataList,
    countdownTime,
    activePrizeStyle,
    allPrizesDefaultStyle,
    displayCountdownTime,
  } = useWheel({ onActivityApply, endCallback, activityApplyParams, showEndCountdown })

  watch(
    () => overTime.value,
    async () => {
      // 监听活动结束时间
      if (overTime.value === 0) calcStatus.value = false // 计算活动时间状态
      if (timing.value) return
      timing.value = true
      countdown.value = countdownFormat(overTime.value)
      countdownTime.value = countdownFormat1(overTime.value)
      await delay(1000)
      timing.value = false
      if (overTime.value > 0) {
        overTime.value--
      } else {
        getLuckWheelDetail() // 获取活动详情
      }
    },
  )
  watch(
    () => router.currentRoute.value.path,
    (newRoute) => {
      // 监听路由变化
      if (newRoute == `/activity/LuckyWheel/${Number(router.currentRoute.value.params.id)}`) getLuckWheelDetail() // 获取活动详情
    },
  )

  const blocks = [{ background: '#F7AE71' }] // 转盘背景色
  const buttons = [
    {
      // 抽奖按钮大小
      radius: '50%',
    },
  ]

  /**
   * @description: 跳转活动记录页
   */
  function toRecordHandle() {
    activityStore.pageType = 5
    router.push('/main/promo')
  }

  /**
   * @description 点击抽奖按钮会触发star回调
   */
  async function startCallback() {

    if (speed.value) return
    if (wheelInfo.value.lotteryTicketGetCount <= 0) return
    animationPlayState.value = 'paused'
    rotateAnimation()
    startClick.value = true // 开始按钮点击状态
    if ('exchangeCount' in activityApplyParams.applyInfo.info) {
      activityApplyParams.applyInfo.info.exchangeCount = 0
    }
    const index = Number(await onActivityApply()) // 调用抽奖接口
    await delay(2000)
    stopAngle.value = 1440 - (360 / prizes.value.length) * index - 360 / prizes.value.length / 2
    startClick.value = false // 开始按钮点击状态
  }

  /**
   * @description 点击兑换按钮
   */
  function exchangeHandle() {
    exchangeModalVisible.value = true
  }

  /**
   * @description 确认兑换按钮
   */
  async function confirmExchangeHandle(value: number) {
    showLoading()
    if ('exchangeCount' in activityApplyParams.applyInfo.info) {
      activityApplyParams.applyInfo.info.exchangeCount = value
    }
    await onActivityApply() // 调用兑换奖励接口
    await getLuckWheelDetail() // 获取活动详情
    exchangeVisibleChange()
    hideLoading()
  }

  // 用户8s没有点击之后 提示动画开始
  const setAnimationPlayState = () => {

    let i = 0
    if (timeId) clearInterval(timeId)

    timeId = window.setInterval(() => {
      ++i
      if (i >= 8) {
        animationPlayState.value = 'running'
        if (timeId) clearInterval(timeId)
      }
    }, 1000)

  }

  /**
   * @description 抽奖结束会触发end回调
   * @param prize 中奖信息
   */
  function endCallback(_prize?: any) {
    if (currentPrize.type == 'nothing') return
    modalDuration.value = 1000 // 奖品弹窗显示/隐藏动画过渡时间
    rewardModalVisible.value = true // 显示奖品弹窗
  }

  /**
   * @description: 奖品弹窗关闭事件
   */
  function rewardVisibleChange(value: boolean = false) {
    rewardModalVisible.value = value
    if (!value) {
      getLuckWheelDetail()
      initPrizes()
    }
    // 有卷6s开始下一次动画
    if(wheelInfo.value.lotteryTicketGetCount > 0){
      setAnimationPlayState()
    } else {
      if (timeId) clearInterval(timeId)
    }
    
  }

  const exchangeVisibleChange = (value: boolean = false) => {
    exchangeModalVisible.value = value
  }

  /**
   * @description 旋转动画
   */
  function rotateAnimation() {
    if (stopAngle.value) {
      // 如果有停止角度(已获取奖品信息)
      speed.value = ((stopAngle.value - currentAngle.value) / stopAngle.value) * 9 + 1 // 计算速度
      if (currentAngle.value >= stopAngle.value) {
        // 当前角度大于等于停止角度时停止动画(设置最终角度,不再执行下一帧)
        luckyRef.value.$el.style.transform = `rotate(${stopAngle.value}deg)`
        endCallback() // 触发抽奖结束回调
        stopAngle.value = 0 // 清空停止角度
        speed.value = 0 // 清空速度
      } else {
        currentAngle.value = currentAngle.value + speed.value
        luckyRef.value.$el.style.transform = `rotate(${currentAngle.value}deg)`
        requestAnimationFrame(rotateAnimation) // 进入下一帧动画(递归调用)
      }
    } else {
      // 如果没有停止角度(未获取奖品信息)
      if (speed.value < 10)
        // 速度递增
        speed.value += 0.1
      currentAngle.value = (currentAngle.value + speed.value) % 360 // 当前角度递增
      luckyRef.value.$el.style.transform = `rotate(${currentAngle.value}deg)` // 设置转盘旋转角度
      requestAnimationFrame(rotateAnimation) // 进入下一帧动画(递归调用)
    }
  }

  /**
   * @description: 跳转游戏
   */
  async function gameHandle() {
    let games = await gameStore.getRecentGames()
    if (games.length) {
      const gameInfo = games[0]
      if (gameInfo.target === 'hall') {
        return useStartSportGame(gameInfo)
      }
      return gameStore.enterGame(gameInfo)
    }
    games = await gameStore.getPopularGames()
    if (games.length) gameStore.enterGame(games[0])
  }

  /**
   * @description 初始化活动相关数据
   */
  async function init() {
    prizes.value = await activityStore.setWheelPrizes()
    if (await appStore.getToken()) {
      await userStore.getUser() // 获取用户信息
    }
    if ('userId' in activityApplyParams.applyInfo.info)
      activityApplyParams.applyInfo.info.userId = userStore.user?.userId || 0
  }

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(async () => {
    await tenantStore.getTenantInfo() // 获取租户信息
    getLuckWheelDetail() // 获取活动详情
    init()
  })


  /**
   * 接口调用: 获取活动详情
   */
  async function getLuckWheelDetail() {
    const res = (await luckWheelDetailApi(activityId)) as LuckWheelDetailModel
    const language = (await appStore.getLocale()) as Language
    if ('multilingual' in res && res.multilingual) {
      const multilingual = res.multilingual as Record<string, string>
      activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.LuckyWheel)
    }
    if (res.ruleType === ZActivityRuleType.enum.DEFAULT) {
      const ruleParams = JSON.parse(res.rule)
      rule.value = generateDefultRules(language, ZTActivityTypes.enum.LuckyWheel, ruleParams.variablesValue)
    } else {
      rule.value = res.rule
    }
    if ('awardList' in res) {
      prizesDataList.value = res.awardList;
      prizes.value = res.awardList.map((item, index) => {
        return {
          fonts:
            item.type == 'goldCoins'
              ? [
                {
                  text: convertMoneyToShow(item.amount),
                  top: '10%',
                  fontColor: '#D434CD',
                  fontSize: '.75rem',
                  fontWeight: 900,
                },
              ]
              : '',
          imgs:
            item.type == 'nothing'
              ? [{ src: `/svg/activity/wheel_${item.type}.svg`, width: '20%', top: '15%' }]
              : item.type == 'goldCoins'
                ? [{ src: `/svg/activity/wheel_${item.type}.svg`, width: '50%', top: '50%' }]
                : [
                  { src: `/svg/activity/wheel_${item.type}_count.svg`, width: '30%', top: '15%' },
                  { src: `/svg/activity/wheel_${item.type}.svg`, width: '30%', top: '60%' },
                ],
          background: index % 2 ? '#FFF' : '#FCCC02',
        }
      })
      activityStore.setWheelPrizes(prizes.value)
      Object.assign(wheelInfo.value, res)
      rewardCards.value[0].amount = wheelInfo.value.propHCount
      rewardCards.value[1].amount = wheelInfo.value.propACount
      rewardCards.value[2].amount = Math.floor(wheelInfo.value.propPCount / 2) + (wheelInfo.value.propPCount % 2)
      rewardCards.value[3].amount = Math.floor(wheelInfo.value.propPCount / 2)
      rewardCards.value[4].amount = wheelInfo.value.propYCount
      showEndCountdown.value = !isActivityForever(res.endTime) // 是否显示活动结束倒计时(2035年为永久活动)
      const currentTimestamp = dayjs().unix()
      const startTimestamp = (getUtcTime(res.startTime) as dayjs.Dayjs).unix()
      const endTimestamp = (getUtcTime(res.endTime) as dayjs.Dayjs).unix()
      if (startTimestamp > currentTimestamp) {
        overTime.value = startTimestamp - currentTimestamp // 计算活动开启倒计时(秒)
        activityStatus.value = false // 活动开启状态-未开启
      } else if (endTimestamp > currentTimestamp) {
        overTime.value = endTimestamp - currentTimestamp // 计算活动结束倒计时(秒)
        activityStatus.value = true // 活动开启状态-已开启
      } else {
        overTime.value = 0 // 活动结束
        activityStatus.value = false // 活动开启状态-未开启
      }
    }
    calcStatus.value = true // 计算活动时间状态
  }

  /**
   * 接口调用: 抽奖或兑换抽奖次数
   */
  async function onActivityApply() {
    let index = 0
    try {
      const res = await activityApplyApi(activityApplyParams)
      if (
        'exchangeCount' in activityApplyParams.applyInfo.info &&
        activityApplyParams.applyInfo.info.exchangeCount > 0
      ) {
        showPopup({
          type: PopupType.BONUS,
          msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(res as number) }),
        })
        return
      }
      if (typeof res === 'string') {
        const prize = JSON.parse(res)
        wheelInfo.value.awardList.forEach((item, i) => {
          if (item.type == prize.type && item.amount == prize.amount) {
            Object.assign(currentPrize, item)
            index = i
          }
        })
      }
      return index
    } catch (error) {
      wheelInfo.value.awardList.forEach((item, i) => {
        if (item.type === 'nothing') {
          Object.assign(currentPrize, item)
          index = i
        }
      })
      return index
    }
  }

  return {
    endAfter,
    initPrizes,
    startBefore,
    showMask,
    wheelPrizes1,
    prizesDataList,
    countdownTime,
    activePrizeStyle,
    allPrizesDefaultStyle,
    displayCountdownTime,
    blocks,
    buttons,
    rule,
    prizes,
    luckyRef,
    countdown,
    tempo,
    calcStatus,
    startClick,
    activityStatus,
    showEndCountdown,
    rewardModalVisible,
    rewardCards,
    exchangeModalVisible,
    activityName,
    isRedeemable,
    wheelInfo,
    isShowAnimationEl,
    animationPlayState,
    currentPrize,
    merchantCy,
    overTime,
    rewardVisibleChange,
    exchangeVisibleChange,
    toRecordHandle,
    startCallback,
    exchangeHandle,
    confirmExchangeHandle,
    endCallback,
    gameHandle,
  }
}

export const useComponents = () => {
  const { defStyle } = getCustomerActivityId();
  const { skin, activityConfig } = getTheme();
  const template = activityConfig?.[ActivityNames.LuckyWheel]?.template as keyof typeof templateList
  const templateList: Record<string, () => Promise<typeof import('*.vue')>> = {
    'default': () => import(`@/views/activity/wheel/default/index.vue`),
    'first': () => import(`@/views/activity/wheel/first/index.vue`),
    'second': () => import(`@/views/activity/wheel/second/index.vue`),
    'style_1': () => import(`@/views/activity/wheel/style_1/index.vue`),
  };
  const component = templateList[template] ?? templateList[defStyle] ?? templateList[skin as keyof typeof templateList] ;
  return markRaw(defineAsyncComponent(component)) as unknown as ComponentPublicInstance;
}
