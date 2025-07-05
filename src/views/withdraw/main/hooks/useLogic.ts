import router from '@/router'
import { useI18n } from '@/hooks/useI18n'
import { ZUserType } from '@/enums/types'
import { useUserStore } from '@/store/user'
import { showLoading } from '@/utils/loading'
import { useTenantStore } from '@/store/tenant'
import { useWithdrawStore } from '@/store/withdraw'
import { formatMoneyToShow } from '@/utils/custom'
import { moneyConvertToClient, moneyConvertToServer } from '@/utils/custom'
import {
  withdrawCreateApi,
  getWithdrawTypeAndSubApi,
} from '@/api/assets'
import { showToast } from '@/utils'
import { WithdrawPageType, checkCanWithdraw } from '@/hooks/useWithdraw'
import { emitter } from '@/utils/event';
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import useWithdrawAccount from '@/hooks/useWithdrawAccount'
import { AssetsTabInfo, TabTagInfo } from '../../type';
import { pick } from '@/utils'
import { queryWalletBalance, } from '@/views/recharge/main/hooks/usePayBet'
import { useUserInputData, confirmModalVisible, accountList, subTabCode, withdrawCreateParams } from '@/views/withdraw/main/hooks/useUserInputData'
import { usePaybet, isNeedRegisterAccount } from '@/views/withdraw/main/hooks/usePaybet'
import { useBetAmount } from '@/views/withdraw/main/hooks/useBetAmount'
const { getUserInputData } = useUserInputData()
export default () => {
  const route = router.currentRoute
  const userStore = useUserStore() // 用户信息
  const tenantStore = useTenantStore() // 商户信息
  const withdrawStore = useWithdrawStore() // 提现信息
  const channelStore = useChannelStore(); // 渠道信息 
  const { t } = useI18n() // 国际化
  const amountList = ref<number[]>([]) // 提现金额列表
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const rateValue = ref(0) // 费率
  const maxAmount = ref(0) // 最大金额
  const minAmount = ref(0) // 最小金额
  const betAmount = ref(0) // 用户提现还需打码量
  const amountInput = ref('') // 金额(输入框)
  const rateType = ref('fixed') // 费率类型
  const demoWithdraw = ref(false) // 是否显示体验金无法提现弹窗
  const remind = ref('')
  const passwordRef = ref() // 密码element



  const bindAccountMax = ref(1)// 绑定账号最大数量
  let isFinish = true


  const tabTagInfo = ref<TabTagInfo>()
  // 
  const tabList = ref<AssetsTabInfo[]>([])  //大类
  const tabId = ref<number>(0)  //大类id
  const subTabList = ref<AssetsTabInfo[]>([])  //小类
  const subTabId = ref<number>(0)  //小类id
  const tabMap = new Map()
  const readonly = ref(false)
  const hintIndex = ref('') // 弹窗提示文字索引
  const isHasBottomTab = computed(() => route.value.meta.hasBottomTab)
  const { accountItems, tabId: activeTabId, isHideAuditRecords } = toRefs(withdrawStore)
  const { rechargeRatio, isVirtualCurrency, withdrawalConfig } = toRefs(tenantStore)
  const showCloseBtn = computed(() => {
    return route.value.meta.hasBottomTab === undefined ? false : !route.value.meta.hasBottomTab
  })
  const receiveAmount = computed(() => Number(amountInput.value) - Number(rateValue.value) > 0 ? Number(amountInput.value) - Number(rateValue.value) : 0)
  let feeType = '' // 费率取整方式
  let isFreeWaived = false // 是否免手续费
  let rates: any[] = []
  const { user: storeUser, assets } = toRefs(userStore)
  const isDemo = computed(() => storeUser.value?.type === ZUserType.enum.demo) // 是否为试玩账户
  const placeholder = computed(() => `${formatMoneyToShow(minAmount.value)} - ${formatMoneyToShow(maxAmount.value)}`)
  const balance = computed(() => {
    // 账户余额
    let balance = 0
    balance = assets.value?.balance ?? 0
    return balance ? balance / 100 : 0.0
  })
  const prompt = computed(() => {
    let text = ''
    const user = storeUser.value
    if (isDemo.value) {
      if (user?.trialPlayWithdrawHint === '1') {
        text = t('viewsAssets.demoUnWithdraw')
      } else if (user?.trialPlayWithdrawHint === '2') {
        text = t('viewsAssets.singleDepositWithdrawal')
      }
    }
    return text
  })

  const btnText = computed(() => {
    return !isNeedRegisterAccount.value ? t('label.withdrawNow') : t('viewsAssets.000004')
  })

  const isBindFirst = computed(() => withdrawalConfig.value === 'BindFirst')

  /**
 * @description 提现费率计算
 */
  const getWithdrawRate = () => {
    if (isFreeWaived || !rates.length) {
      rateType.value = 'fixed'
      rateValue.value = 0
      return
    }

    const matchedRates = rates.filter((item: any) =>
      Number(amountInput.value) >= item.min / 100 && Number(amountInput.value) <= item.max / 100
    )

    if (!matchedRates.length) {
      rateType.value = 'fixed'
      rateValue.value = 0
      return
    }

    const rate = matchedRates[0]
    rateType.value = rate.type

    const calculateRate = {
      'UP': {
        'fixed': () => Math.ceil(rate.value / 100),
        'percentage': () => Math.ceil((Number(amountInput.value) * rate.value) / 10000)
      },
      'DOWN': {
        'fixed': () => Math.floor(rate.value / 100),
        'percentage': () => Math.floor((Number(amountInput.value) * rate.value) / 10000)
      }
    }

    rateValue.value = calculateRate[feeType][rateType.value === 'fixed' ? 'fixed' : 'percentage']()
  }
  const setSubTabValue = (params?: AssetsTabInfo) => {
    const target = params || subTabList.value[0]
    subTabId.value = target.id
    subTabCode.value = target.name
    usePaybet(subTabCode.value, tabId.value)
  }

  const initial = (activeId: number, isSetSubTab: boolean = true) => {
    const current = tabMap.get(activeId)
    const { isInputAmount, id, tenantPayWithdrawTypeSub, ratesJson, withdrawalAccountMax, amountButton } = current
    tabId.value = id
    withdrawStore.tabId = id
    if (tenantPayWithdrawTypeSub.length) {
      tenantPayWithdrawTypeSub.sort((a: any, b: any) => b.sort - a.sort)
    }
    subTabList.value = tenantPayWithdrawTypeSub.map((it: any) => ({ name: it.code, id: it.id }))
    if (isSetSubTab) {
      setSubTabValue()
    }

    readonly.value = !isInputAmount
    if (ratesJson) {
      rates = JSON.parse(ratesJson) as any[]

    } else {
      rates = []
    }
    if (amountButton) {
      amountList.value = amountButton?.split(',')?.map((item: string) => {
        return Number(item)
      })
    }
    maxAmount.value = current.maxAmount / 100
    minAmount.value = current.minAmount / 100
    bindAccountMax.value = withdrawalAccountMax
    remind.value = current.remind?.replace(/\n/g, '<br/>')
    // 先帮后提 获取帐户列表

    return { tenantPayWithdrawTypeSub }

  }
  const mainTabChange = async (activeId: number) => {

    let { tenantPayWithdrawTypeSub } = initial(activeId)
    // 先帮后提 获取帐户列表
    if (withdrawalConfig.value === 'BindFirst') {
      accountList.value = useWithdrawAccount(accountItems.value, tenantPayWithdrawTypeSub)
    }

    if (Number(amountInput.value) > 0) {
      getWithdrawRate()
    }
  }

  /**
   * @description 获取当前玩家打码量
   */
  const getBetAmount = (userFlow: any[]) => {
    const unfinished = useBetAmount(userFlow)
    betAmount.value = unfinished > 0 ? moneyConvertToClient(unfinished) : 0.0
  }

  /**
  * 调用接口: 查询是否免手续费
  */
  const getFreeWaivedState = (waiveFee: any) => {
    isFreeWaived = waiveFee.isFee
    feeType = waiveFee.feeType
  }

  const getWithdrawData = async () => {
    tenantStore.getTenantInfo() // 获取商户信息
    userStore.getUser() // 获取用户信息
    const result = await getWithdrawTypeAndSubApi()
    const { userFlow, shouldWaiveFee, withdrawalAccount } = await withdrawStore.setUserWithdrawInfo()
    getFreeWaivedState(shouldWaiveFee)
    result.sort((a: any, b: any) => b.sort - a.sort)
    const list: AssetsTabInfo[] = []
    tabMap.clear()
    result.forEach((it: any) => {
      const { name, id } = it
      tabMap.set(it.id, it)
      list.push({ id, name })
    })
    tabList.value = list
    const activeId = activeTabId.value >= 0 && tabMap.has(activeTabId.value) ? activeTabId.value : result[0].id
    const { tenantPayWithdrawTypeSub } = initial(activeId, false)
    const accountArr = await withdrawStore.setAccount({ tenantWithdrawTypeId: undefined })
    if (withdrawalConfig.value === 'BindFirst') {
      accountList.value = useWithdrawAccount(accountArr, tenantPayWithdrawTypeSub)
    }
    getBetAmount(userFlow)

    if (withdrawalAccount) {
      const handleWithdrawalAccount = {
        findTarget: () => accountArr.find((it: any) => it.tenantWithdrawTypeId == activeId && it.value == withdrawalAccount),
        setSubTab: (code: string) => {
          const cur = subTabList.value.find(it => it.name === code)
          setSubTabValue(cur)
        },
        setTagInfo: (code: string) => {
          tabTagInfo.value = {
            name: code,
            value: `${t('viewsAssets.last')}`
          }
        }
      }

      const target = handleWithdrawalAccount.findTarget()
      if (!target) {
        setSubTabValue()
        return
      }

      const { code } = target
      handleWithdrawalAccount.setSubTab(code)
      handleWithdrawalAccount.setTagInfo(code)
    } else {
      setSubTabValue()
    }

  }
  const withdrawSuccessCb = () => {
    getWithdrawData();
    channelStore.APKTaskPopupTime = 'Withdrawal'

  }

  onMounted(() => {
    emitter.on('user/withdraw-success', withdrawSuccessCb)
  })

  onUnmounted(() => {
    emitter.off('user/withdraw-success', withdrawSuccessCb);
  });
  // 离开页面清空数据
  onBeforeRouteLeave(() => {
    subTabId.value = 0
    subTabCode.value = ''

  })

  // tab页面来的强制重新刷新 获取最新数据
  watch(() => route.value.path, (newPath) => {
    if (newPath == '/main/withdraw' || newPath === '/withdraw/apply') {
      amountInput.value = ''
      getWithdrawData()

    }
    //  解决 /withdraw/apply 刷新页面丢失账号
    if (newPath === '/withdraw/apply') {
      userStore.getAssets() // 获取用户资产
    }

  }, { immediate: true })




  const recordHandle = (index: WithdrawPageType) => {
    withdrawStore.setTabPageIndex(index)
    router.push('/withdrawSubView')
  }

  /**
   * @description 充值金额输入事件
   * @param event 事件对象
   */
  const amountInputChange = (event: CustomEvent) => {

    const value = event.detail.value

    if (Number(value) >= balance.value) {

      setTimeout(() => {
        amountInput.value = Math.floor(Number(balance.value)).toString() // 设置输入框金额为最大金额
      }, 0);

      // 判断输入金额是否大于最大金额

    }

    if (Number(value) < 0) {

      setTimeout(() => {
        amountInput.value = '' // 设置输入框金额为最大金额 // 设置输入框金额为小数点后两位
      }, 0);

      // 判断输入金额是否大于最大金额

    }
    getWithdrawRate()
  }
  /**
   * @description 提现金额选择事件
   * @param amount 金额
   */
  const amountHandle = async (amount: number) => {
    if (amount > balance.value) return showToast('toast.insufficientAccountBalance')
    amountInput.value = amount.toString()
    getWithdrawRate()
  }


  /**
   * @description 弹窗关闭回调事件
   */
  const modalDismiss = () => {

    confirmModalVisible.value = false

  }

  /**
 * 调用接口: 创建提现订单 todo
 */
  const onWithdrawCreate = async () => {
    if (!isFinish) return
    isFinish = false
    try {
      showLoading()
      await withdrawCreateApi(withdrawCreateParams)
      confirmModalVisible.value = false // 关闭确认提现弹窗
      isFinish = true
      showToast('toast.withdrawalOrderSuccess')
      amountInput.value = '' // 清空金额(输入框)
      recordHandle(WithdrawPageType.WITHDRAW_RECORD) // 跳转到提现记录
    } finally {
      confirmModalVisible.value = false // 关闭确认提现弹窗
      isFinish = true
    }
  }

  /**
    * @description 密码输入事件
    */
  const passwordHandle = async (event: string) => {
    withdrawCreateParams.password = event
    if (withdrawCreateParams.password.length == 6) {
      passwordRef.value?.clear() // 清空密码输入框	
      await onWithdrawCreate() // 创建提现订单
    }
  }
  const subTabChange = (tabId: number) => {
    subTabId.value = tabId
    let target = subTabList.value.find(it => it.id === tabId)
    subTabCode.value = target?.name!
  }



  /**
 * @description 立即提现按钮事件
 */
  const submitHandle = async () => {
    const user = storeUser.value // 判断是否为试玩账户
    if (user && user.type === ZUserType.enum.demo) {
      demoWithdraw.value = true
      hintIndex.value = user.trialPlayWithdrawHint
      return
    }

    if (!amountInput.value || Number(amountInput.value) <= 0) return showToast('toast.amountCannotBeEmpty') // 判断是否输入金额

    let target = pick(tabMap.get(tabId.value), ['maxAmount', 'minAmount'])
    if (!(await checkCanWithdraw(amountInput.value, target))) return

    if (betAmount.value > 0) {
      // 判断是否还需打码
      showPopup({
        type: PopupType.FLOW,
        msg: t('popup.tips07', { amount: merchantCy.value + formatMoneyToShow(betAmount.value) }),
        showRightBtn: true,
        showLeftBtn: !isHideAuditRecords.value,
        leftBtnText: t('viewsAssets.viewDetail'),
        rightBtnText: t('activity.redPacket10'),
        leftBtnCallback: () => recordHandle(WithdrawPageType.WITHDRAW_AUDIT),
      })
      return
    }

    const isNotValidate = getUserInputData(tabId.value, subTabId.value, moneyConvertToServer(amountInput.value))
    if (isNotValidate) return
    isFinish = true
    confirmModalVisible.value = true // 打开确认提现弹窗
  }

  const handleBtnClick = () => {
    const clickEventMap = {
      'register': () => {
        queryWalletBalance(subTabCode.value)
      },
      'withdrawNow': submitHandle
    }
    const action = isNeedRegisterAccount.value ? 'register' : 'withdrawNow'
    clickEventMap[action]()
  }
  return {
    rateValue,
    amountInput,
    isHasBottomTab,
    showCloseBtn,
    tabList,
    tabId,
    merchantCy,
    balance,
    isDemo,
    prompt,
    betAmount,
    readonly,
    placeholder,
    amountList,
    withdrawalConfig,
    isBindFirst,
    remind,
    assets,
    confirmModalVisible,
    demoWithdraw,
    rateType,
    passwordRef,
    hintIndex,
    subTabList,
    subTabId,
    maxAmount,
    minAmount,
    tabTagInfo,
    isHideAuditRecords,
    accountList,
    withdrawCreateParams,
    receiveAmount,
    bindAccountMax,
    btnText,
    rechargeRatio,
    isVirtualCurrency,
    recordHandle,
    mainTabChange,
    amountInputChange,
    amountHandle,
    modalDismiss,
    passwordHandle,
    onWithdrawCreate,
    subTabChange,
    handleBtnClick,
    t
  }
}
