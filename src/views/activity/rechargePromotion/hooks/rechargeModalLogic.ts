import { isEmpty } from '@/utils'
import { ref, computed } from 'vue'
import { useTenantStore } from '@/store/tenant'
import type { BankInfoType } from '@/store/recharge'
import { AssetsTabInfo } from '@/views/withdraw/type'
import { rechargeModalProps } from '@/views/activity/rechargePromotion/data'
import { formatMoneyToShow } from '@/utils/custom'
import { useChanel, payChannelChange } from '@/views/recharge/main/hooks/useChanel'
import { payCreateParams } from '@/views/recharge/hooks/usePayCreate'
import { usePay } from '@/views/recharge/main/hooks/usePay'
import router from '@/router'
import { getTheme } from '@/theme/hooks'
import { showToast } from '@/utils'
interface Params {
	emit: any
}

export function useRechargeModalLogic(props: rechargeModalProps, { emit }: Params) {
	const tenantStore = useTenantStore() // 租户store
	const { t } = useI18n()
	const visible = ref<boolean>(true)
	const tabId = ref(-1) // 导航标签动态值
	const tabList = ref<AssetsTabInfo[]>([]) // 导航标签动态值
	const subTabId = ref(-1) // 导航标签动态值
	const subTabList = ref<AssetsTabInfo[]>([]) // 导航标签动态值
	const vietnamRechargeAmount = ref<number | null>(null)

	const activeBankInfo = reactive({
		logo: '',
		name: '',
		code: '',
	})
	const subActiveTabMap = new Map()
	const tabMap = new Map()
	const rechargeStore = useRechargeStore()
	const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy)
	const isGameAmount = computed(() => tenantStore?.isVirtualCurrency)
	const { isNoCycle, channelId, channelList, channelLoading, bankList, bankCode } = toRefs(rechargeStore)
	const isSelectedChannel = computed(() => (payCreateParams.processMode === 'TRANSFER' ? true : isNoCycle.value))

	const stop = watchEffect(
		() => {
			if (!bankCode.value || !bankList.value.length) return
			const activeBank = bankList.value.find((it) => it.code === bankCode.value)
			if (!activeBank) {
				activeBankInfo.logo = ''
				activeBankInfo.name = ''
				activeBankInfo.code = ''
			} else {
				Object.assign(activeBankInfo, { ...activeBank })
			}
		},
		{ flush: 'post' },
	)

	// 充值活动弹窗 create

	onMounted(async () => {
		if (isGameAmount.value) {
			const currentRatio = await useCalcRealCurrencyRatio();
			vietnamRechargeAmount.value = Number(props?.rechargeItemInfo?.rechargeAmount) * currentRatio;
		}
		getRechargeList()
	})

	const subTabChange = async (activeId: number) => {
		if (isSelectedChannel.value && channelLoading.value) return
		const { id, processMode } = subActiveTabMap.get(activeId)
		subTabId.value = id

		// is_THREE_PARTY_WALLET.value = processMode === 'THREE_PARTY_WALLET'
		payCreateParams.processMode = processMode
		useChanel(id, processMode)
	}
	const mainTabChange = (activeId: number) => {
		tabId.value = activeId

		const { payTypeSubList } = tabMap.get(activeId)
		payTypeSubList.sort((a: any, b: any) => {
			// 根据sort字段排序
			return b.sort - a.sort
		})
		const list: AssetsTabInfo[] = []
		subActiveTabMap.clear()
		payTypeSubList.forEach((it: any) => {
			const { showName, id, tags, tagValue, icon } = it
			subActiveTabMap.set(id, it)
			const newTagValue =
				tags !== 'NOTHING'
					? tags == 'GIVE_AWAY'
						? `+${formatMoneyToShow(Number(tagValue), 2)}%`
						: t(`tags.${tags}`)
					: ''

			list.push({ id, name: showName, tagValue: newTagValue, icon })
		})
		subTabList.value = list

		subTabChange(list[0].id)
	}

	// 获取充值列表
	async function getRechargeList() {
		const payList = await tenantStore.getPayList()
		const tenantPayTypeList = payList?.tenantPayTypeList
		const list: AssetsTabInfo[] = []
		if (!isEmpty(tenantPayTypeList)) {
			tabMap.clear()
			tenantPayTypeList.forEach((item: any) => {
				const { id, name, tags, tagValue } = item
				tabMap.set(id, item)
				const newTagValue =
					tags !== 'NOTHING'
						? tags == 'GIVE_AWAY'
							? `+${formatMoneyToShow(Number(tagValue))}%`
							: t(`tags.${tags}`)
						: ''

				list.push({ id, name, tagValue: newTagValue })
			})
		}
		tabList.value = list
		const tabId = list[0].id
		mainTabChange(tabId)
	}

	// 充值按钮 click事件
	const rechargeBtnClick = () => {
		console.log(props.rechargeItemInfo, 'subTabId.value')
		const amount = props.rechargeItemInfo.requestRechargeAmount
		payCreateParams.amount = amount
		payCreateParams.payTypeSubId = subTabId.value
		payCreateParams.payChannelId = channelId.value
		payCreateParams.processMode = subActiveTabMap.get(subTabId.value).processMode
		payCreateParams.extend = {
			activityId: props.rechargeItemInfo.activityId,
			activityType: props.rechargeItemInfo.activityType,
			rewardLevelId: props.rechargeItemInfo.uuid,
			type: 'activity',
		}
		console.log(bankList.value, 'bankList.value')
		if (isSelectedChannel.value && bankList.value.length) {
			if (!bankCode.value) {
				showToast('depositWithdrawal.000034')
				return
			}
			payCreateParams.bankCode = bankCode.value
		}
		if (!payCreateParams.bankCode) {
			delete payCreateParams.bankCode
		}
		delete payCreateParams.participateReward

		const cbParams = {
			THREE_PARTY_PAYMENT: async () => {
				router.push('/recharge/apply')
			},
			TRANSFER: () => {
				emit('closeRechargeModal')
				rechargeStore.isOpenOrderModal = true
			},
		}
		usePay(`${amount}`, cbParams) // 调用接口-创建充值订单
	}

	// 关闭弹窗
	function closeClick() {
		emit('closeRechargeModal')
	}
	const bankChange = (bank: BankInfoType) => {
		console.log(bank, 'bank')
		rechargeStore.bankCode = bank.code
		Object.assign(activeBankInfo, { ...bank })
	}
	const handlePayChanelChange = async (activeId: number) => {
		await payChannelChange(activeId)
		const activeBank = bankList.value.find((it) => it.code === activeBankInfo.code)
		if (!activeBank) {
			activeBankInfo.logo = ''
			activeBankInfo.name = ''
			activeBankInfo.code = ''
		}
	}

	return {
		visible,
		merchantCy,
		tabId,
		channelLoading,
		tabList,
		subTabList,
		subTabId,
		channelList,
		channelId,
		bankList,
		bankCode,
		activeBankInfo,
		isGameAmount,
		bankChange,
		handlePayChanelChange,
		mainTabChange,
		subTabChange,
		closeClick,
		rechargeBtnClick,
		vietnamRechargeAmount,
	}
}

export const useComponents = () => {
	const { skin } = getTheme()
	const templList: Record<string, () => Promise<typeof import('*.vue')>> = {
		'first': () => import('@/views/recharge/main/comp/Tab.vue'),
		'default': () => import('@/views/recharge/main/comp/TabDefault.vue'),
	}
	const computedTemplate = templList[skin === 'default' ? `default` : 'first']
	return markRaw(defineAsyncComponent(computedTemplate)) as unknown as ComponentPublicInstance
}
