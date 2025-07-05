// 助力领现金 逻辑层
import {
  activityApplyApi,
  assistanceCashAwardsApi,
  assistanceCashDetailApi,
  assistanceCashHelpsApi,
  sharePhoneApi,
} from '@/api/activity'
import { ActivityApplyParams, AssistanceCashDetailModel } from '@/api/activity/model'
import piece_bonus1 from '@/assets/img/activity/piece_bonus1.png'
import piece_rangeAmount1 from '@/assets/img/activity/piece_rangeAmount1.png'
import { ZActivityRuleType, ZTActivityTypes } from '@/enums/types/activity.type'
import { countdownFormat } from '@/hooks/CountdownFormat'
import { showLogin } from '@/hooks/ShowLogin'
import i18n from '@/i18n'
import { generateDefultRules } from '@/i18n/ruleHelper/activityRule'
import { ActivityNames } from '@/router/modules/activity'
import { useActivityStore } from '@/store/activity'
import { useAgentStore } from '@/store/agent'
import { useAppStore } from '@/store/app'
import { useSystemStore } from "@/store/system"
import { useTenantStore } from '@/store/tenant'
import { useUserStore } from '@/store/user'
import { getTheme } from '@/theme/hooks'
import { httpCompletion, showToast, throttleActivity } from '@/utils'
import { shareAgentUrl, ShareConfigType } from '@/utils/agentShare'
import { addZeroWidthSpace, isProxyUrl, openUrl } from '@/utils/app'
import { getCustomerActivityId, moneyConvertToClient } from '@/utils/custom'
import { getCurrentLocalTime, getLocalTimeByString } from '@/utils/date'
import { delay } from '@/utils/delay'
import { showLoading } from '@/utils/loading'
import dayjs from 'dayjs'
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { PopupType } from '@/components/Popup/data';

let isDown: boolean;
let startX: number;
let scrollLeft: number;

export default function useLogic() {
  const { id: activityId } = getCustomerActivityId() // 获取路由参数
  const { t } = i18n.global

  const appStore = useAppStore() // App状态管理
  const userStore = useUserStore() // 用户Store
  const agentStore = useAgentStore() // 代理store
  const tenantStore = useTenantStore() // 租户Store
  const activityStore = useActivityStore() // 活动Store
  const systemStore = useSystemStore()
  let timeoutId: number | null = null
  let timeId: number | null = null

  const apertureIsLoaded = ref(false) // 光圈是否加载
  const disableTab = ref(false);// 定义导航标签禁用状态
  const rule = ref('') // 活动规则
  const luckyRef = ref() // 抽奖组件实例
  const tempo = ref(3000) // 抽奖灯闪烁节奏
  const shareUrl = ref('') // 分享链接
  const prizeType = ref('') // 中奖类型
  const prizeCount = ref(0) // 中奖金额
  const recordTabs = ref(9) // 记录tab
  const expireTime = ref(0) // 活动过期时间
  const timing = ref(false) // 活动倒计时状态
  const roundCount = ref(0) // 可开启转盘次数
  const awardCount = ref(0) // 奖励助力金额
  const winning = ref(false) // 获奖状态
  const rangeAmount = ref(0) // 已助力金额
  const roundAmount = ref(0) // 助力总金额
  const startClick = ref(false) // 开始抽奖按钮点击状态
  const btnLoading = ref(false) // 按钮加载状态
  const currentRangeAmount = ref(0) // 当前助力金额<接口获取>(用于计算显示)
  const animationKey = ref(0) // 助力金额动画key
  const usePhones = ref<string[]>([]) // 已使用的分享号码
  const modalHelpVisible = ref(false) // 帮助弹窗显示状态
  const modalPieceVisible = ref(false) // 助力状态弹窗显示状态
  const modalShareVisible = ref(false) // 分享弹窗显示状态
  const modalPrizeVisible = ref(false) // 奖励弹窗显示状态
  const sharePhones = ref([]) // 分享号码
  const expireCountdown = ref('') // 活动过期倒计时
  const assistanceCashHelps = ref<Record<string, any>[]>([]) // 我的助力记录
  const assistanceCashAwards = ref<Record<string, any>[]>([]) // 全平台助力领取记录
  const awardList = ref<AssistanceCashDetailModel['awardList']>([]) // 奖励列表
  const segmentList = computed(() => agentStore.shareConfig?.filter(v => v.isOpen) ?? []); // 分享平台按钮列表
  const blocks = [{ imgs: [{ src: '/images/activity/share_spin.webp', width: '100%', top: '0%', rotate: true }] }]
  const animationPlayState = ref("paused")  // 动画运行
  const isShowAnimationEl = computed(() => animationPlayState.value === 'running')
  const isAddAnimation = computed(() => roundCount.value > 0 || (!!roundAmount.value && !rangeAmount.value && !expireTime.value))
  const buttons = [
    {
      radius: '50%',
    },
  ]
  const isFull = computed(() => rangeAmount.value === roundAmount.value)
  const userId = computed(() => userStore.user?.userId) // 用户ID
  const prizes = computed(() => activityStore.piecePrizes) // 转盘奖品列表
  const tenantInfo = computed(() => tenantStore.tenantInfo) // 租户信息
  const shareTitle = computed(() => tenantStore.tenantInfo?.name) // 商户名称
  const phoneCode = computed(() => tenantStore.tenantInfo?.phoneCode.replace('+', ''))  // 商户手机号编码
  // 滚动动画时长
  const scrollDuration = computed(() => {
    return assistanceCashAwards.value.length * 0.3
  })
  // 转盘背景图
  const wheelBoxStyle = computed(() => {
    const imageNameMap: { [key:string]: string } = {
      'PH': 'share_bg_PH',
      'BR': 'share_bg_BR',
    }
    const imageName = imageNameMap[tenantInfo.value?.code] ?? 'share_bg'
    return {
      background: `url('/images/activity/${imageName}.webp') no-repeat`,
      backgroundSize: "100%",
      backgroundPosition: "0 .75rem",
    }
  })

  // 助力领现活动参数
  const activityApplyParams = reactive<ActivityApplyParams>({
    // 抽奖参数
    id: Number(activityId),
    applyInfo: {
      type: 'AssistanceCash',
      info: {
        isRound: true, // 是否是转盘抽奖(否则领取奖励)
      },
    },
  })
  const sharePhoneParams = reactive({
    // 分享号码参数
    phones: [] as string[],
  })

  // 监听活动结束时间
  watch(
    () => expireTime.value,
    async () => {
      if (expireTime.value == 0) {
        getAssistanceCashDetail()
        return getAssistanceCashHelps()
      }
      if (timing.value) return
      timing.value = true
      expireCountdown.value = countdownFormat(expireTime.value)
      await delay(1000)
      timing.value = false
      if (expireTime.value) expireTime.value--
      else expireTime.value = 0
    },
  )
  // 监听记录tab
  watch(
    () => recordTabs.value,
    (value) => {
      if (value == 1) getAssistanceCashHelps()
    },
  )

  // 生命周期: 组件挂载前
  onBeforeMount(async () => {
    agentStore.getShareConfig();   // 获取分享配置
    document.addEventListener('visibilitychange', visibilityHandle)
    if (await useAppStore().checkUserHasLogin()) {
      await userStore.getUser() // 获取用户信息
      getAssistanceCashHelps() // 获取我的助力列表
      onSharePhone() // 获取/设置分享号码
      await tenantStore.getTenantInfo() // 获取租户信息
    }
    activityStore.setPiecePrizes() // 设置转盘奖品列表
    getAssistanceCashAwards() // 获取全平台助力领现活动奖励列表
    await getAssistanceCashDetail() // 获取助力领现活动信息
  })

  // 生命周期: 组件销毁前
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', visibilityHandle)
  })

  // 生命周期: 路由离开前
  onBeforeRouteLeave(() => {
    modalHelpVisible.value = false
    modalPieceVisible.value = false
    modalPrizeVisible.value = false
    modalShareVisible.value = false
    if (timeoutId) clearTimeout(timeoutId)
    if (timeId) clearInterval(timeId)
  })

  /**
   * @description 计算助力金额
   */
  async function calcRangeAmount() {
    cancelAnimationFrame(animationKey.value)
    rangeAmount.value = 0
    let changeTimes = 2 * 30
    const randomNumber = currentRangeAmount.value / changeTimes
    const step = () => {
      changeTimes -= 1
      rangeAmount.value = Math.min(rangeAmount.value + randomNumber, currentRangeAmount.value)
      if (changeTimes <= 0) {
        rangeAmount.value = currentRangeAmount.value
        cancelAnimationFrame(animationKey.value)
      } else {
        animationKey.value = requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step);
  }

  /**
   * @description 终止助力金额动画
   */
  function stopAmountAnimation() {
    cancelAnimationFrame(animationKey.value)
    rangeAmount.value = currentRangeAmount.value
  }

  function apertureLoaded() {
    apertureIsLoaded.value = true
  }

  /**
   * @description 抽奖闪烁灯加速
   */
  function acceleration() {
    let multiplier = 1
    function decreaseTempo() {
      if (tempo.value > 100) {
        tempo.value -= 10 * multiplier
        multiplier += 0.5
        setTimeout(decreaseTempo, 80)
      } else {
        tempo.value = 100
      }
    }
    decreaseTempo()
  }

  /**
   * @description 抽奖闪烁灯减速
   */
  function deceleration() {
    let multiplier = 1
    function increaseTempo() {
      if (tempo.value < 3000) {
        tempo.value += 10 * multiplier
        multiplier += 0.5
        setTimeout(increaseTempo, 100)
      } else {
        tempo.value = 3000
      }
    }
    increaseTempo()
  }

  /**
   * @description 点击抽奖按钮会触发star回调
   */
  async function startCallback() {
    if (!appStore.token) return showLogin()
    if (!expireTime.value && rangeAmount.value) return // 活动结束时不允许抽奖
    if (roundAmount.value == rangeAmount.value) {
      // 助力金额等于总金额时直接领取奖励
      modalPieceVisible.value = true
      return true
    }
    if (!roundCount.value && expireTime.value) {
      // 没有可用次数且开启了活动<有活动倒计时>时弹窗提示分享
      modalShareVisible.value = true
      return true
    }
    playAnimation() // 播放抽奖动画
  }

  /**
   * @description 播放抽奖动画
   */
  async function playAnimation() {
    if (timeId) clearInterval(timeId)
    stopAmountAnimation()
    animationPlayState.value = 'paused'
    startClick.value = true // 开始按钮点击状态
    luckyRef.value.play() // 调用抽奖组件的play方法开始游戏
    roundCount.value = Math.max(roundCount.value - 1, 0) // 可用次数减一
    if ('isRound' in activityApplyParams.applyInfo.info) activityApplyParams.applyInfo.info.isRound = true // 设置抽奖参数为转盘抽奖
    const index = await onActivityApply() // 调用接口开始抽奖
    luckyRef.value.stop(index) // 调用stop停止旋转并传递中奖索引
    startClick.value = false
  }

  // 用户10s没有点击之后 提示动画开始
  const setAnimationPlayState = () => {

  let i = 0
  if (timeId) clearInterval(timeId)

  timeId = window.setInterval(() => {
    ++i
    if (i >= 10) {
      animationPlayState.value = 'running'
      if (timeId) clearInterval(timeId)
    }
  }, 1000)
  }

  /**
   * @description 抽奖结束会触发end回调
   * @param prize 中奖信息
   */
  async function endCallback(_prize: any) {
    winning.value = true
    await delay(2000)
    try {
      await getAssistanceCashDetail() // 获取助力领现活动信息
      if (prizeType.value === 'rangeAmount' && !roundCount.value) {
        modalPieceVisible.value = true // 没有可用次数时弹窗提示分享
      } else if (['fixedAmount', 'bonus'].includes(prizeType.value)) {
        modalPrizeVisible.value = true
      }

    } finally {

      winning.value = false
      if(isAddAnimation.value){
        setAnimationPlayState()
      } else {
      if(timeId) clearInterval(timeId)
      }
    }
  }

  /**
   * @description: 弹窗关闭事件
   * @param type 弹窗类型
   */
  function modalCloseHandle(type?: string) {
    if (type === 'share')
      return modalShareVisible.value = false
    modalHelpVisible.value = false
    modalPieceVisible.value = false
    modalPrizeVisible.value = false
  }

  /**
   * @description 帮助按钮点击事件
   */
  function helpHandle() {
    modalHelpVisible.value = true
  }

  /**
   * @description: 提取按钮点击事件
   */
  function pieceHandle() {
    if (expireTime.value) {
      modalPieceVisible.value = true

    }
  }

  /**
   * @description 邀请好有助力按钮点击事件
   */
  function inviteHandle() {
    modalPieceVisible.value = true
  }

  /**
   * @description 分享按钮点击事件
   */
  function shareHandle() {
    modalShareVisible.value = true
  }

  /**
   * @description 分享按钮点击事件
   */
  function launchHandle(item: ShareConfigType) {
    const url = httpCompletion(shareUrl.value)
    shareAgentUrl(item, url, shareTitle.value, false)
  }

/**
 * @description whatsapp分享
 */
function whatsappHandle() {
  const data:any = sharePhones.value.find((item:any) => !item.isUsed);
  const url = httpCompletion(shareUrl.value)
  const name = isProxyUrl(url) ? addZeroWidthSpace(shareTitle.value) : shareTitle.value
  if (data && data.phone) {
    sharePhoneParams.phones = [data.phone]
    onSharePhone()
    const message = `${t('viewsSpread.agentShareUrl',{ name })}${url}`
    // @ts-ignore
    const sharedUrl = window.jsBridge ? `https://api.whatsapp.com/send?phone=${data.phone}&text=${encodeURIComponent(message)}` : `whatsapp://send?phone=${data.phone}&text=${encodeURIComponent(message)}`;
    openUrl(sharedUrl,'WhatsApp')
  } else {
    return showToast('hint.invalidPhone')
  }
}

/**
 * @description 发送短信
 */
function sendSMSHandle() {
  const list:any = []
  const url = httpCompletion(shareUrl.value)
  const name = isProxyUrl(url) ? addZeroWidthSpace(shareTitle.value) : shareTitle.value
  const message = `${t('viewsSpread.agentShareUrl',{ name })}${url}`
  sharePhones.value.filter((item:any) => !item.isUsed).forEach((item:any) => {
    list.push(item.phone)
  })
  sharePhoneParams.phones = list
  onSharePhone()
  if (systemStore.isIOS ) {
    
    if (systemStore.browser == 'Chrome') {
      openUrl(`sms:/open?addresses=${list.join(',%20')}&body=${encodeURIComponent(message)}`)
    } else {
      openUrl(`sms:/open?addresses=${list.join(',%20')}&body=${encodeURIComponent(message)}`, 'OPEN_URL')
    }
  } else {
    openUrl(`sms:${list.join(',')}?body=${encodeURIComponent(message)}`)
  }
}

  /**
   * @description 页面显示隐藏事件回调
   */
  async function visibilityHandle() {
    if (document.visibilityState === 'visible') {
      await showLoading()
      getAssistanceCashDetail()
    }
  }

  /**
   * @description
   */
  function inviteFriendsHandle() {
    if (appStore.token) {
      modalShareVisible.value = true
    } else {
      modalPieceVisible.value = false
      showLogin()
    }
  }

  /**
   * 接口调用: 获取助力领现活动信息
   */
  async function getAssistanceCashDetail() {
    const res = (await assistanceCashDetailApi(
      activityId
    )) as AssistanceCashDetailModel
    roundCount.value = Math.max(res.allRoundCount - res.drawCount, 0)
    roundAmount.value = moneyConvertToClient(res.roundAmount)

    if (ZActivityRuleType.enum.DEFAULT === res.multilingual.ruleType) {
      const language = await appStore.getLocale()
      const ruleParam = JSON.parse(res.rule)
      const ruleStr = generateDefultRules(language, ZTActivityTypes.enum.AssistanceCash, ruleParam.variablesValue)
      rule.value = ruleStr
    } else {
      rule.value = res.rule
    }
    shareUrl.value = `https://${res.shareDomain}/?pid=${userId.value}`
    if (res.endTime) {
      const currentTimestamp = (getCurrentLocalTime() as dayjs.Dayjs).unix()
      const endTimestamp = getLocalTimeByString(res.endTime).unix()
      if (endTimestamp > currentTimestamp) expireTime.value = endTimestamp - currentTimestamp // 计算活动倒计时(秒)
      else {
        window.setTimeout(() => {
          getAssistanceCashDetail()
        }, 3000)
        return
      }
    } else expireTime.value = 0
    const rangeItem = JSON.parse(JSON.stringify(res.awardList[0]))
    const nothingItem = JSON.parse(JSON.stringify(res.awardList[0]))
    rangeItem.uuid = 'fa90f039396a4ad6a4iba7ezf3a5f211'
    nothingItem.uuid = 'fa90f039396b4ad6a4ibb7ezfsa5f211'
    nothingItem.type = 'nothing'
    res.awardList.splice(4, 0, rangeItem, nothingItem)
    awardList.value = res.awardList
    const { defStyle } = getCustomerActivityId();
    const isStyle = !!defStyle && defStyle == "style_1"
    const prizes = res.awardList.map((item, index) => {
      // 定义奖品类型映射
      const prizeTypeMap = {
        rangeAmount: {
          style_1: {
            imgs: [{ src: piece_rangeAmount1, width: '30%', top: '30%' }]
          },
          default: {
            imgs: [{ src: '/images/activity/piece_rangeAmount.png', width: '50%', top: '0%' }]
          }
        },
        fixedAmount: {
          style_1: {
            fonts: [{
              text: convertMoneyToShow(item.amount),
              top: '50%',
              fontSize: '1rem',
              fontWeight: 900,
              fontColor: index % 2 ? '#4D019E' : '#4D019E' //转盘金额
            }]
          },
          default: {
            fonts: [{
              text: convertMoneyToShow(item.amount),
              top: '20%',
              fontSize: '1rem',
              fontWeight: 900,
              fontColor: index % 2 ? '#FCD760' : '#B90615'
            }]
          }
        },
        bonus: {
          style_1: {
            imgs: [{ src: piece_bonus1, width: '40%', top: '30%' }]
          },
          default: {
            imgs: [{ src: '/images/activity/piece_bonus.png', width: '50%', top: '0%' }]
          }
        },
        default: {
          style_1: {
            fonts: [{
              text: '🙁',
              width: '50%',
              top: '30%',
              fontSize: '1.5rem',
              fontWeight: 900,
              fontColor: '#FCD760'
            }]
          },
          default: {
            fonts: [{
              text: '🙁',
              width: '50%',
              top: '40%',
              fontSize: '1.5rem',
              fontWeight: 900,
              fontColor: '#FCD760'
            }]
          }
        }
      }

      // 获取对应样式的配置
      const style = isStyle ? 'style_1' : 'default'
      const typeConfig = prizeTypeMap[item.type] || prizeTypeMap.default
      return typeConfig[style]
    })
    activityStore.setPiecePrizes(prizes)
    if (res.startTime && res.endTime && res.rangeAmount <= res.roundAmount) {
      currentRangeAmount.value = moneyConvertToClient(res.rangeAmount)
    } else {
      currentRangeAmount.value = 0
    }
    if (res.rangeAmount > res.roundAmount) {
       showPopup({
        type: PopupType.TIPS,
        msg: t('activity.hasBeenReset'),
        leftBtnCallback: () => {
          playAnimation()
        }
      })
    }
    calcRangeAmount()
  }

  /**
   * 接口调用: 启动抽奖
   */
  async function onActivityApply() {
    try {
      let index = 5
      const res: any = await activityApplyApi(activityApplyParams)
      awardList.value.forEach((item: any, i: number) => {
        if (item.uuid == res.uuid) index = i
      })
      prizeCount.value = res.amount
      prizeType.value = res.type
      awardCount.value = res.awardCount
      if (res.type === 'rangeAmount' && res.awardCount === 0) {
        prizeType.value = 'nothing'
        index = 5
      }
      return index
    } catch (error) {
      prizeType.value = 'nothing'
      return 5
    }
  }

  /**
   * 接口调用: 获取/设置分享号码
   */
  async function onSharePhone() {
    if (!(await useAppStore().checkUserHasLogin())) return
    const { usePhones, allPhones } = await sharePhoneApi(sharePhoneParams)
    handleDate(usePhones, allPhones)
    // 把已经乱码的手机号标记为已使用
    handlePattenDate(allPhones)
  }

  // 乱码验证方法
  function isGarbledCharacter(char) {
    const patten = /[^\x20-\x7E\x0A\x0D\x09]/;
    return patten.test(char)
  }

  // 处理乱码后的手机号
  async function handlePattenDate(allPhones: any){
    const phones = allPhones.filter(item => isGarbledCharacter(item))
    if (phones.length) {
      const { usePhones,allPhones } = await sharePhoneApi({ phones: phones as string[], })
      handleDate(usePhones,allPhones)
    }
  }

  // 处理获取数据显示
  function handleDate(usePhones,allPhones) {
    usePhones.value = []
    sharePhones.value = []
    if (usePhones && usePhones.length > 0) {
      usePhones.value  = usePhones.filter(item => !isGarbledCharacter(item))
    }
    if (allPhones && allPhones.length > 0) {
      const newArr = []
      allPhones.filter(item => !isGarbledCharacter(item)).forEach(phoneItem => {
          let newObj: any = { phone: phoneItem, isUsed : false  }   
          if (usePhones.value?.includes(phoneItem)) {
            newObj.isUsed = true
          }
          newArr.push(newObj)
      })
      sharePhones.value = newArr
    }
  }

  /**
   * 接口调用: 获取全平台助力领现金兑现玩家列表
   */
  async function getAssistanceCashAwards() {
    const res = await assistanceCashAwardsApi(activityId)
    assistanceCashAwards.value = res.concat(res)
    await delay(500)
    recordTabs.value = 0
  }

  /**
   * 接口调用: 获取助力领现金我的助力列表
   */
  async function getAssistanceCashHelps() {
    const res = await assistanceCashHelpsApi(activityId)
    assistanceCashHelps.value = res
  }

  /**
   * 接口调用: 领取奖励
   */
  const awardReceiveHandle = throttleActivity(async () => {
    if (btnLoading.value) return
    btnLoading.value = true
    if ('isRound' in activityApplyParams.applyInfo.info) activityApplyParams.applyInfo.info.isRound = false // 设置抽奖参数为领取奖励
    try {
      await activityApplyApi(activityApplyParams)
      expireTime.value = 0
      showToast(t('toast.receiveSuccessfully'))
      modalPieceVisible.value = false
    } finally {
      btnLoading.value = false
    }
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
    rule,
    luckyRef,
    tempo,
    shareUrl,
    prizeType,
    recordTabs,
    expireTime,
    roundCount,
    awardCount,
    winning,
    rangeAmount,
    roundAmount,
    startClick,
    btnLoading,
    modalHelpVisible,
    modalPieceVisible,
    modalShareVisible,
    modalPrizeVisible,
    sharePhones,
    expireCountdown,
    assistanceCashHelps,
    assistanceCashAwards,
    segmentList,
    blocks,
    animationPlayState,
    isShowAnimationEl,
    isAddAnimation,
    buttons,
    isFull,
    prizes,
    tenantInfo,
    scrollDuration,
    startCallback,
    endCallback,
    modalCloseHandle,
    pieceHandle,
    shareHandle,
    launchHandle,
    whatsappHandle,
    sendSMSHandle,
    inviteFriendsHandle,
    awardReceiveHandle,
    disableTab,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
    apertureIsLoaded,
    apertureLoaded,
    wheelBoxStyle,
  }
}


export const useComponents = () => {
  const { skin, activityConfig } = getTheme();
  const template = activityConfig?.[ActivityNames.AssistanceCash]?.template as keyof typeof templateList
  const templateList = {
    'default': () => import(`@/views/activity/piece/default/index.vue`),
    'first': () => import(`@/views/activity/piece/first/index.vue`),
    'second': () => import(`@/views/activity/piece/second/index.vue`),
    'style_1': () => import(`@/views/activity/piece/style_1/index.vue`),
    'style_18': () => import(`@/views/activity/piece/style_18/index.vue`)
  }
 
  const component = templateList[template] ?? templateList[skin as keyof typeof templateList]
  return markRaw(defineAsyncComponent(component)) as unknown as ComponentPublicInstance;
}
