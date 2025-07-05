import router from '@/router'
import { AssetsTabInfo } from '@/views/withdraw/type'
import { moneyConvertToClient, moneyConvertToServer, ratioConvertToClient, formatMoneyToShow } from '@/utils/custom'
import { getTheme } from '@/theme/hooks'
import { AmountBtnItem } from '../comp/AmountBtnList.vue'
import { LimitGameItem, LimitGamePlatformItem } from '@/api/assets/model'
import { getGameTypeName } from '@/utils/custom'
import { emitter } from '@/utils/event'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data'
import { showToast } from '@/utils'
import { isEmpty } from '@/utils'
import { payCreateParams, btnLoading } from '@/views/recharge/hooks/usePayCreate'
import {
	isHasAccount,
	walletCode,
	queryWalletBalance,
	is_THREE_PARTY_WALLET,
} from '@/views/recharge/main/hooks/usePayBet'
import { useChanel, payChannelChange } from './useChanel'
import { usePay } from '@/views/recharge/main/hooks/usePay'
import { goMain } from '@/hooks/navigate'
export default () => {
	const route = router.currentRoute
	const gameStore = useGameStore() // 游戏信息
	const userStore = useUserStore() // 用户Store
	const tenantStore = useTenantStore() // 商户Store
	const channelStore = useChannelStore() // 渠道信息
	const rechargeStore = useRechargeStore()
	const tabId = ref(-1) // 导航标签动态值
	const tabList = ref<AssetsTabInfo[]>([]) // 导航标签动态值
	const subTabId = ref(-1) // 导航标签动态值
	const subTabList = ref<AssetsTabInfo[]>([]) // 导航标签动态值
	const limitPlatformList = ref<any[]>([]) // 充值优惠限制平台名称
	const maxAmount = ref(0) // 最大金额
	const minAmount = ref(0) // 最小金额
	const isParticipate = ref(false) // 是否参与充值赠送活动
	const activityIsOpen = ref(false) // 活动是否开启
	const readOnly = ref(false) // 是否只读
	const description = ref('') // 充值描述
	const amountInput = ref('') // 金额(输入框)
	const rateOfGift = ref(0) // 赠送比例
	const amountOfGift = ref(0) // 赠送金额
	const bannerUrl = ref('') // banner图片
	const withdrawFlowStr = ref('') // 提现流水提示
	const isHasBonus = ref(false)
	const iframeLoaded = ref(false) // iframe加载状态
	const amountList = ref<AmountBtnItem[]>([]) // 充值金额可选列表
	let rewardRateList: any[] = []
	let rechargeRewardInfo = {}
	const tabMap = new Map()
	const subActiveTabMap = new Map()
	let jumpDetails = false
	const { t } = useI18n()
	let activityId = 0
	const isDefaultBanner = ref(false)
	const { theme } = getTheme()
	const {
		QRCodeInfo,
		isNoCycle,
		channelId,
		channelList,
		channelLoading,
		bankList,
		bankCode,
		thirdUrl,
		isQRCode,
		orderNo,
		isOpenOrderModal,
		isFromActivity,
	} = toRefs(rechargeStore)
	const isShowThirdParty = computed(() => !!thirdUrl.value || isQRCode.value)
	const isHasBottomTab = computed(() => route.value.meta.hasBottomTab)
	const showCloseBtn = computed(() => {
		return route.value.meta.hasBottomTab === undefined ? false : !route.value.meta.hasBottomTab
	})
	const placeholder = computed(
		() => `${formatMoneyToShow(minAmount.value, 0)} - ${formatMoneyToShow(maxAmount.value, 0)}`,
	)
	const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy as string) // 当前商户货币
	const homeGameList = computed(() => gameStore.homeGames) // 首页游戏列表
	const { rechargeRatio, isVirtualCurrency } = toRefs(tenantStore)

	const btnInfo = computed(() => {
		const btnTextMap = {
			'wallet': !isHasAccount.value ? t('viewsAssets.000004') : t('label.depositNow'),
			'default': t('label.depositNow'),
		}
		const disabled = Number(amountInput.value) < Number(minAmount.value)
		const disabledMap = {
			'wallet': !isHasAccount.value ? false : disabled,
			'default': disabled,
		}
		const name = tabMap.get(tabId.value)?.name
		console.log(disabledMap[name as keyof typeof disabledMap], 'tabMap.get(tabId.value)?.name')
		return {
			btnText: btnTextMap[name as keyof typeof btnTextMap] || btnTextMap.default,
			disabled: name in disabledMap ? disabledMap[name as keyof typeof disabledMap] : disabled,
		}
	})

	const isSelectedChannel = computed(() => (payCreateParams.processMode === 'TRANSFER' ? true : isNoCycle.value))

	const getBonus = (rechargeAmount: number = Number(amountInput.value), checked: boolean = isParticipate.value) => {
		let amount = 0
		if (rechargeAmount) {
			if (checked) {
				let target = rewardRateList.findLast((it: any) => rechargeAmount >= it.amount)
				if (target) {
					let { rate, amount: digit, betMultiple } = target
					amount = (rate / 100) * moneyConvertToServer(digit)
					rateOfGift.value = rate
					withdrawFlowStr.value = t('viewsTabbar.rechargeCenter1', { multiple: betMultiple })
				} else {
					rateOfGift.value = 0
					withdrawFlowStr.value = ''
				}
			} else {
				console.log('fixedAmount', withdrawFlowStr.value)
				withdrawFlowStr.value = ''
				rateOfGift.value = 0
				if (rechargeAmount >= minAmount.value) {
					let { discountRatio } = subActiveTabMap.get(subTabId.value)
					const ratio = ratioConvertToClient(discountRatio)
					amount = (ratio / 100) * moneyConvertToServer(rechargeAmount)
				}
			}
		} else {
			withdrawFlowStr.value = ''
			rateOfGift.value = 0
		}

		amountOfGift.value = moneyConvertToClient(amount)
	}

	watch(
		() => amountInput.value,
		(amount) => {
			// 监听输入框金额变动
			const newAmount = Number(amount)
			getBonus(newAmount)
		},
	)

	const changeRechargeActivity = async (
		rechargeAmount: number = Number(amountInput.value),
		checked: boolean = isParticipate.value,
	) => {
		if (checked) {
			console.log(rewardRateList, 'rewardRateList')
			amountList.value = rewardRateList
			isHasBonus.value = true
		} else {
			const { fixedAmount, discountRatio } = subActiveTabMap.get(subTabId.value)

			amountList.value = fixedAmount.split(',')?.map((it: string) => ({ amount: Number(it) }))
			isHasBonus.value = discountRatio > 0
		}
		getBonus(rechargeAmount, checked)
	}

	const subTabChange = (activeId: number) => {
		if (isSelectedChannel.value && channelLoading.value) return
		const {
			id,
			isInputAmount,
			processMode,
			description: desc,
			maxAmount: maxA,
			minAmount: minA,
		} = subActiveTabMap.get(activeId)
		subTabId.value = id
		rechargeStore.subTypeId = id
		maxAmount.value = maxA / 100
		minAmount.value = minA / 100
		readOnly.value = isInputAmount !== 1
		description.value = desc
		is_THREE_PARTY_WALLET.value = processMode === 'THREE_PARTY_WALLET'
		payCreateParams.processMode = processMode
		useChanel(id, processMode)
		changeRechargeActivity()
	}
	const getSubTabId = (list: AssetsTabInfo[]) => {
		const codeMap = {
			single: () => list[0].id,
			found: (target: AssetsTabInfo) => target.id,
			default: () => list[0].id,
		}

		if (list.length === 1) return codeMap.single()
		const target = list.find((it: AssetsTabInfo) => it.id === rechargeStore.subTypeId)
		return target ? codeMap.found(target) : codeMap.default()
	}

	const mainTabChange = (activeId: number) => {
		tabId.value = activeId
		rechargeStore.typeId = activeId
		let { payTypeSubList } = tabMap.get(activeId)
		payTypeSubList.sort((a: any, b: any) => {
			// 根据sort字段排序
			return b.sort - a.sort
		})
		let list: AssetsTabInfo[] = []
		subActiveTabMap.clear()
		payTypeSubList.forEach((it: any) => {
			const { showName, id, tags, tagValue, processMode, code, icon } = it
			subActiveTabMap.set(id, it)
			let newTagValue =
				tags !== 'NOTHING'
					? tags == 'GIVE_AWAY'
						? `+${formatMoneyToShow(Number(tagValue), 2)}%`
						: t(`tags.${tags}`)
					: ''

			list.push({ id, name: showName, tagValue: newTagValue, icon })
		})
		subTabList.value = list

		subTabChange(getSubTabId(list))
	}

	// 获取限制平台名称
	const getLimitPlatformName = (homeGameList: any, limitGameList: any) => {
		const platformNameList: string[] = []
		// 先建立一个homeGameTypeMap，方便后续查找
		const homeGameTypeMap = new Map<string, LimitGameItem>(homeGameList.map((item: any) => [item.gameType, item]))

		limitGameList.forEach((it: LimitGameItem) => {
			const homeGameInfo = homeGameTypeMap.get(it.gameType)
			if (homeGameInfo) {
				const gameType = homeGameInfo?.gameType
				let platformListMap = new Map(homeGameInfo.platformList?.map((item: any) => [item.id, item.name]))
				it.platformData.forEach((item: LimitGamePlatformItem) => {
					const name = platformListMap.get(item.platformId)
					if (name) {
						platformNameList.push(`${name}${getGameTypeName(gameType)}`)
					}
				})
			}
		})
		return platformNameList
	}

	// 页面加载前
	watch(
		() => route.value.path,
		async (newPath) => {
			if (newPath == '/main/entrar' || newPath === '/recharge/apply') {
				amountInput.value = ''
				rechargeStore.bankMap.clear()
				await tenantStore.getTenantInfo() // 获取商户信息
				gameStore.getHomeGames() // 获取首页游戏列表
				userStore.getUser() // 获取用户信息
				const payList = await tenantStore.getPayList() // 获取充值列表
				rechargeRewardInfo = payList?.rechargeRewardInfo
				const tenantPayTypeList = payList?.tenantPayTypeList

				const list: AssetsTabInfo[] = []
				if (!isEmpty(rechargeRewardInfo)) {
					const {
						rewardRate,
						id,
						isJumpDetail,
						bannerUrl: url,
						auditLimitGame,
						imageType,
					} = rechargeRewardInfo
					rewardRateList = rewardRate.map((it: any) => {
						return {
							amount: moneyConvertToClient(it.amount),

							rate: ratioConvertToClient(it.rate),
							betMultiple: it.betMultiple,
						}
					})
					bannerUrl.value = url
					activityIsOpen.value = true
					jumpDetails = isJumpDetail
					activityId = id
					isDefaultBanner.value = imageType === 'DEFAULT'
					if (!isEmpty(auditLimitGame)) {
						if ('status' in auditLimitGame && 'limitData' in auditLimitGame) {
							if (auditLimitGame.status === 'OFF' || isEmpty(auditLimitGame.limitData)) {
								limitPlatformList.value = []
							} else {
								limitPlatformList.value = getLimitPlatformName(
									homeGameList.value,
									auditLimitGame.limitData,
								)
							}
						}
					}
				} else {
					activityIsOpen.value = false
				}
				if (!isEmpty(tenantPayTypeList)) {
					tabMap.clear()
					tenantPayTypeList.forEach((item: any) => {
						let { id, name, tags, tagValue } = item
						tabMap.set(id, item)
						let newTagValue =
							tags !== 'NOTHING'
								? tags == 'GIVE_AWAY'
									? `+${formatMoneyToShow(Number(tagValue))}%`
									: t(`tags.${tags}`)
								: ''

						list.push({ id, name, tagValue: newTagValue })
					})
				}
				tabList.value = list
				const tabId = tabMap.has(rechargeStore.typeId) ? rechargeStore.typeId : list[0].id
				mainTabChange(tabId)
			}
		},
		{ immediate: true },
	)

	/**
	 * @description 充值记录按钮点击事件
	 */
	function recordHandle() {
		router.push('/rechargeRecord')
	}

	/**
	 * @description 充值金额输入事件
	 * @param event 事件对象
	 */
	const amountInputChange = (event: CustomEvent) => {
		if (event.detail.value > maxAmount.value) {
			// 判断输入金额是否大于最大金额

			setTimeout(() => {
				amountInput.value = maxAmount.value.toString() // 设置输入框金额为最大金额
			}, 0)
			return
		}
		if (event.detail.value <= 0) {
			// 判断输入金额是否大于最大金额

			setTimeout(() => {
				amountInput.value = '' // 设置输入框金额为最小金额
			}, 0)
			return
		}
		amountInput.value = event.detail.value // 设置输入框金额
	}
	/**
	 * @description 充值金额选择事件
	 * @param amount 金额
	 */
	const amountHandle = async (amount: number) => {
		amountInput.value = amount.toString()
	}
	const clearUnauthorizedAmounts = (amountsList: any[]) => {
		//   支持输入和没有输入金额 不用clear
		if (readOnly.value || !amountInput.value) return
		// 判断不支持输入的情况， 已经存在的金额是不是在金额按钮列表里面  amount
		let target = amountsList.find((it: any) => Number(it.amount) === Number(amountInput.value))
		if (!target) {
			amountInput.value = ''
		}
	}

	const handleRechargeActivity = (e: CustomEvent) => {
		const checked = e.detail.checked
		changeRechargeActivity(Number(amountInput.value), checked)
		clearUnauthorizedAmounts(amountList.value)
	}

	/**
	 * @description 宣传图点击事件
	 */
	const bannerHandle = () => {
		if (!jumpDetails) return
		router.push({
			path: `/activity/RechargeReward/${activityId}`,
		})
	}

	/**
	 * @description 充值成功事件
	 */
	const paySuccessHandler = (data: any) => {
		if (orderNo.value !== data.orderNo) return
		showPopup({
			type: PopupType.TIPS,
			msg: t('popup.tips15'),
			leftBtnText: t('main.confirm'),
			leftBtnCallback: goMain,
		})
	}
	const paySuccessCb = (data: any) => {
		paySuccessHandler(data)
		channelStore.APKTaskPopupTime = 'Recharge'
	}

	/**
	 * @description 充值RUL加载完成事件
	 */
	const iframeLoadHandle = () => {
		iframeLoaded.value = true
		btnLoading.value = false
		userStore.isRechargeing = true
		emitter.on('user/pay-success', paySuccessCb) // 监听充值成功事件
	}
	/**
	 * @description 关闭iframe
	 */
	const iframeCloseHandle = () => {
		iframeLoaded.value = false
		rechargeStore.thirdUrl = ''
		rechargeStore.isQRCode = false
		userStore.isRechargeing = false
		emitter.off('user/pay-success', paySuccessCb)

	}

	/**
	 * @description 提交表单
	 * @param event 事件对象
	 */
	const submitForm = (event: Event) => {
		event?.preventDefault() // 阻止默认事件
		const amount = Number(amountInput.value)
		if (amount < minAmount.value || amount > maxAmount.value) {
			// 判断充值金额是否小于最小金额或大于最大金额
			return showToast('toast.invalidInputAmount') // 提示充值金额不能小于最小金额
		}
		if (!Number.isInteger(amount)) {
			return showToast('toast.0001') // 充值金额只能为整数
		}
		payCreateParams.amount = amount * 100 // 设置充值金额(后端金额需乘100)
		payCreateParams.participateReward = isParticipate.value // 设置是否参与优惠
		payCreateParams.payTypeSubId = subTabId.value
		payCreateParams.payChannelId = channelId.value
		payCreateParams.processMode = subActiveTabMap.get(subTabId.value).processMode
		if (isParticipate.value) {
			payCreateParams.extend = {
				activityId: rechargeRewardInfo.id,
				activityType: rechargeRewardInfo.type,
				type: 'activity',
			}
		} else {
			delete payCreateParams.extend
		}
		if (isSelectedChannel.value && bankList.value.length) {
			payCreateParams.bankCode = bankCode.value
		}
		if (!payCreateParams.bankCode) {
			delete payCreateParams.bankCode
		}
		usePay(amountInput.value) // 调用接口-创建充值订单
	}

	// 生命周期: 路由离开
	onBeforeRouteLeave(() => {
		iframeCloseHandle()
	})

	const handleBtnClick = () => {
		const clickEventMap = {
			'register': () => {
				queryWalletBalance(walletCode.value)
			},
			'depositNow': submitForm,
		}
		rechargeStore.isFromActivity = false
		const name = tabMap.get(tabId.value)?.name
		const action = name === 'wallet' && !isHasAccount.value ? 'register' : 'depositNow'
		clickEventMap[action]()
	}

	const bankChange = (code: string) => {
		rechargeStore.bankCode = code
		console.log(code, 'bankChange')
	}

	const transferSuccessCb = () => {
		router.push('/rechargeRecord')
	}

	return {
		isShowThirdParty,
		isHasBottomTab,
		showCloseBtn,
		channelLoading,
		isParticipate,
		thirdUrl,
		tabId,
		tabList,
		description,
		readOnly,
		amountInput,
		placeholder,
		maxAmount,
		minAmount,
		subTabList,
		subTabId,
		channelList,
		channelId,
		amountList,
		isHasBonus,
		activityIsOpen,
		amountOfGift,
		rateOfGift,
		bannerUrl,
		merchantCy,
		withdrawFlowStr,
		limitPlatformList,
		btnLoading,
		iframeLoaded,
		isOpenOrderModal,
		theme,
		isQRCode,
		isSelectedChannel,
		bankCode,
    isFromActivity,
		bankList,
		rechargeRatio,
		isVirtualCurrency,
		QRCodeInfo,
		payChannelChange,
		amountHandle,
		iframeCloseHandle,
		recordHandle,
		mainTabChange,
		amountInputChange,
		subTabChange,
		handleRechargeActivity,
		bannerHandle,
		iframeLoadHandle,
		handleBtnClick,
		transferSuccessCb,
		bankChange,
		btnInfo,
		t,
		isDefaultBanner,
	}
}
