import {
	getCustomerActivityId,
	convertMoneyToShow,
} from '@/utils'
import { activityApplyApi, getActivityDetail } from '@/api/activity';
import type { rewardConfigsType, receiveType, TWinType, RewardType, ReceiveCountType, limitLevelType } from './type';
import { winTypeList, rewardTypeList, receiveCountTypeList } from './type';
import { ZTActivityTypes, ZActivityRuleType } from '@/enums/types/activity.type'
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { PopupType } from '@/components/Popup/data';
import { throttleActivity } from '@/utils';

export const useLogic = () => {
	const { t } = useI18n()
	const tenantStore = useTenantStore();
	const tabId = ref('Rules')
	const tabs = [
		{ id: 'Rules', name: t('luckyBetSlip.000001') },
		{ id: 'Record', name: t('luckyBetSlip.000002') },
	]
	const winTypeTextMap = {
		[winTypeList[0]]: t('luckyBetSlip.000003'),
		[winTypeList[1]]: t('luckyBetSlip.000004'),
		[winTypeList[2]]: t('luckyBetSlip.000005')
	}
	const rewardTextMap = {
		[rewardTypeList[0]]: t('luckyBetSlip.000006'),
		[rewardTypeList[1]]: t('luckyBetSlip.000012'),

	}
	const receiveCountTypeTextMap = {
		[receiveCountTypeList[0]]: t('luckyBetSlip.000017'),
		[receiveCountTypeList[1]]: t('luckyBetSlip.000018'),
		[receiveCountTypeList[2]]: t('luckyBetSlip.000021'),
	}
	const rewardConvertDataMap = {
		[rewardTypeList[1]]: convertMoneyToShow,
		[rewardTypeList[0]]: (num: number) => `${num / 100}`,
	}
	const userStore = useUserStore()
	const appStore = useAppStore()
	const activityRule = ref('')
	const activityName = ref('')
	const loading = ref(false)
	const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 当前商户货币
	const headerTextList = ref<string[]>([])
	const btnDisabled = ref(false)
	const rewardConfigs = ref<rewardConfigsType[]>([])
	const receiveDataList = ref<receiveType[]>([])
	const currentAwardType = ref('')
	const currentReceiveCountType = ref('')
	const { id } = getCustomerActivityId();
	const splitFirstWord = (str: string) => {
		const [firstWord, ...rest] = str.split(/\s+/);
		return {
			firstWord,
			remainingText: rest.join(' '),
		}
	}
	const limitLevelList = ref<limitLevelType[]>([])
	const getLimitLevelList = (type: ReceiveCountType, limitData: Record<ReceiveCountType, any>) => {
		const getFixedCountData = () => {
			const data = limitData[type]
			console.log(data, 'dddd', limitData)
			return [{
				conditionAmount: receiveCountTypeTextMap[type],
				rewardAmount: data.dayLimit,
				uuid: 'fixed_count',
			}]
		}
		const getLimitLevelData = () => {
			const data = limitData[type]
			return data.limitLevel.map((it: limitLevelType) => ({
				conditionAmount: `${convertMoneyToShow(it.conditionAmount)}`,
				rewardAmount: it.rewardAmount,
				uuid: it.uuid,
			}))
		}
		const  getDataMap = new Map([
			[receiveCountTypeList[0], getLimitLevelData],
			[receiveCountTypeList[1], getLimitLevelData],
			[receiveCountTypeList[2], getFixedCountData],
		])
		return getDataMap.get(type)?.() || []


	}
	const getActivityConfig = async () => {
		const res = await getActivityDetail(id, 'LuckyBet')
		const { receiveCount, receiveLimit, rewardAmount, rewardType, showRewardLimit, winType, multilingual, awardType, numberTimesReceived, receiveCountType, receiveCountLimit } = res
		const textList = [winTypeTextMap[winType as TWinType], rewardTextMap[rewardType as RewardType]]
		const isShowRewardLimit = rewardType === rewardTypeList[0] && showRewardLimit
		if (isShowRewardLimit) {
			textList.push(t('luckyBetSlip.000007'))
		}
		headerTextList.value = textList
		currentAwardType.value = awardType
		const rewardTypeIsFixed = rewardType === rewardTypeList[1]
		const isContains = winType === winTypeList[2]
		currentReceiveCountType.value = receiveCountTypeTextMap[receiveCountType as ReceiveCountType]
		limitLevelList.value = getLimitLevelList(receiveCountType, receiveCountLimit)
		rewardConfigs.value = res.rewardConfigs.map((it: rewardConfigsType) => {
			if (it.rewardLimit && isShowRewardLimit) {
				it.rewardLimit = convertMoneyToShow(Number(it.rewardLimit))
			}
			it.rewardAmount = rewardConvertDataMap[rewardType as RewardType](Number(it.rewardAmount))
			it.isShowRewardLimit = isShowRewardLimit
			it.rewardTypeIsFixed = rewardTypeIsFixed
			it.isContains = isContains
			return it
		})
		const language = (await appStore.getLocale()) as Language
		activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.LuckyBet);
		// 处理活动规则
		if (ZActivityRuleType.enum.DEFAULT === multilingual.ruleType) {
			const ruleParam = JSON.parse(multilingual.rule)
			activityRule.value = generateDefultRules(language, ZTActivityTypes.enum.LuckyBet, ruleParam.variablesValue)
		} else {
			activityRule.value = multilingual.rule;
		}
		const getUsageLimit = (receiveLimit: number, numberTimesReceived: number) => {
			if (!receiveLimit) return Number.POSITIVE_INFINITY
			const usageLimit = receiveLimit - numberTimesReceived
			return usageLimit > 0 ? usageLimit : 0
		}
		const usageLimit = getUsageLimit(receiveLimit, numberTimesReceived)
		const valueList = [receiveCount >= 0 ? receiveCount : 0, usageLimit, convertMoneyToShow(rewardAmount || 0)]
		btnDisabled.value = (rewardAmount || 0) <= 0
		receiveDataList.value = ['000008', '000009', '000010'].map((item, index) => {
			const { firstWord, remainingText } = splitFirstWord(t(`luckyBetSlip.${item}`))
			return {
				firstWord,
				remainingText,
				value: valueList[index],
				id: item,
			}
		})


	}
	const isShowAwardBtn = computed(() => currentAwardType.value === 'ACTIVITY' && tabId.value === 'Rules')
	const isScrollY = computed(() => tabId.value !== 'Record')
	const paddingBottom = computed(() => `calc(${(isShowAwardBtn.value ? 5 : 0) + 1.875}rem +  env(safe-area-inset-bottom)) `)

	getActivityConfig()
	const componentProps = computed(() => {
		if (tabId.value === 'Rules') {
			return {
				rewardConfigs: rewardConfigs.value,
				receiveDataList: receiveDataList.value,
				headerTextList: headerTextList.value,
				merchantCy: merchantCy.value,
				activityRule: activityRule.value,
				receiveCountType: currentReceiveCountType.value,
				limitLevelList: limitLevelList.value
			}
		}
		return {}
	})

	const receiveLuckyBet = throttleActivity(async () => {
		if (btnDisabled.value || loading.value) return
		const user = await userStore.getUser()
		const userId = user.id

		try {
			const data = await activityApplyApi({
				id,
				applyInfo: {
					type: ZTActivityTypes.enum.LuckyBet || 'LuckyBet',
					info: {
						userId,
					},
				},
			})
			if (data?.result && !data?.allMark) {
				return validationActivityClaimLimits(data, PopupType.BONUS, activityName.value);
			}
			if (data) {
				showPopup({
					type: PopupType.BONUS,
					msg: t('popup.tips05', { amount: merchantCy.value + convertMoneyToShow(data) }),
				})

				btnDisabled.value = true
			}
		} finally {
			loading.value = false
			getActivityConfig()
		}

	})
	return {
		tabId,
		tabs,
		btnDisabled,
		activityName,
		componentProps,
		isShowAwardBtn,
		paddingBottom,
		isScrollY,
		receiveLuckyBet
	}
}
export const useLuckyBetSlipComp = (tabId: string) => {
	const defStyle = getCustomerActivityId()?.defStyle || 'style_0'
	const templList: Record<string, () => Promise<typeof import('*.vue')>> = {
		'Rules': () => import(`@/views/activity/luckyBet/${defStyle}/Rules.vue`),
		'Record': () => import(`@/views/activity/luckyBet/${defStyle}/Record.vue`),
	}
	return markRaw(defineAsyncComponent(templList[tabId])) as unknown as ComponentPublicInstance
}
export const useComponents = () => {
	const { defStyle } = getCustomerActivityId()
	const templList: Record<string, () => Promise<typeof import('*.vue')>> = {
		'style_0': () => import('@/views/activity/luckyBet/style_0/index.vue'),
	}
	const computedTemplate = templList[defStyle]
	return markRaw(defineAsyncComponent(computedTemplate)) as unknown as ComponentPublicInstance
}
