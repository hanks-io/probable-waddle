import { getCustomerActivityId, convertMoneyToShow } from '@/utils'
import { activityApplyApi, getActivityDetail } from '@/api/activity'
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { ZTActivityTypes, ZActivityRuleType } from '@/enums/types/activity.type'
import { getTheme } from '@/theme/hooks'
import { PopupType } from '@/components/Popup/data'
import { showPopup } from '@/hooks/ShowPopup'
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { ActivityNames } from '@/router/modules/activity'
import { getLocalTime, getCurrentLocalTime } from '@/utils/date'
import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { throttleActivity } from '@/utils';

interface ActionDateRangeParams {
	canReceiveAmount: number
	settlementDate: string
}

dayjs.extend(duration)
export const useLogic = () => {
	const tenantStore = useTenantStore()
	const appStore = useAppStore()
	const userStore = useUserStore()
	const router = useRouter()
	const loading = ref(false)
	const { id } = getCustomerActivityId()
	const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
	const btnDisabled = ref(false)
	const currentCanReceiveAmount = ref('0')
	const currentPoolAmount = ref('0')
	const activityRule = ref('')
	const activityName = ref('')
	const isCountdown = ref(false)
	const statusText = ref('')
	const openShareModal = ref(false)
	const { shareUrl } = useShareUrl()
	const { t } = useI18n()
	let activityDetailSelect = ''
	let timeId: number | null = null
	const dateRangeMap = new Map<string, { start: Dayjs; end: Dayjs }>([
		[
			'pending',
			{
				start: getCurrentLocalTime().hour(3).minute(59).second(59),
				end: getCurrentLocalTime().hour(22).minute(59).second(59),
			},
		],
		[
			'countdown',
			{
				start: getCurrentLocalTime().hour(22).minute(59).second(59),
				end: getCurrentLocalTime().hour(23).minute(59).second(59),
			},
		],
		[
			'processing',
			{
				start: getCurrentLocalTime().hour(0).minute(0).second(0),
				end: getCurrentLocalTime().hour(3).minute(59).second(59),
			},
		],
	])

	const getActivityConfig = async () => {
		const res = await getActivityDetail(id, 'ReferralRewardsNew')
		const { multilingual, currentTime, poolAmount, canReceiveAmount, settlementDate } = res
		const dateRangeKey = getDateRangeKey(currentTime)
		isCountdown.value = dateRangeKey === 'countdown'
		console.log(dateRangeKey, 'dateRangeKey')
		activityDetailSelect = multilingual?.activityDetailSelect
		const language = (await appStore.getLocale()) as Language

		actionDateRangeMap.get(dateRangeKey)?.({ canReceiveAmount, settlementDate })
		currentPoolAmount.value = convertMoneyToShow(poolAmount)
		btnDisabled.value = canReceiveAmount <= 0
		currentCanReceiveAmount.value = convertMoneyToShow(canReceiveAmount)
		activityName.value = await getCurrentActivityName(
			multilingual,
			language,
			ZTActivityTypes.enum.ReferralRewardsNew || 'ReferralRewardsNew',
		)
		// 处理活动规则
		if (ZActivityRuleType.enum.DEFAULT === multilingual.ruleType) {
			const ruleParam = JSON.parse(multilingual.rule)
			activityRule.value = generateDefultRules(
				language,
				ZTActivityTypes.enum.ReferralRewardsNew || 'ReferralRewardsNew',
				ruleParam.variablesValue,
			)
		} else {
			activityRule.value = multilingual.rule
		}
	}
	const calcCountdown = () => {
		timeId = window.setInterval(() => {
			const now = getCurrentLocalTime()
			const end = dateRangeMap.get('countdown')?.end
			const diffMs = end.diff(now)
			console.log(diffMs, 'dateRangeKeydiffMs')
			if (diffMs <= 0 && timeId) {
				window.clearInterval(timeId)
				getActivityConfig()
				return
			}

			const d = dayjs.duration(diffMs)
			const h = String(d.hours()).padStart(2, '0')
			const m = String(d.minutes()).padStart(2, '0')
			const s = String(d.seconds()).padStart(2, '0')
			statusText.value = `${h}  :  ${m}  :  ${s}`
		}, 1000)
	}

	const istToday = (inputDate: string) => {
		const today = getCurrentLocalTime()
		const targetDate = dayjs(inputDate)
		return today.isSame(targetDate, 'day')
	}
	const actionDateRangeMap = new Map([
		[
			'pending',
			(params: ActionDateRangeParams) => {
				statusText.value = t(
					`referralRewardsNew.00000${istToday(params.settlementDate) && params.canReceiveAmount > 0 ? 5 : 3}`,
				)
			},
		],
		['countdown', calcCountdown],
		[
			'processing',
			(params: ActionDateRangeParams) => {
				statusText.value = t(`referralRewardsNew.00000${istToday(params.settlementDate) ? 5 : 4}`)
			},
		],
	])
	const statusInfo = computed(() => (isCountdown.value ? 'hourglass' : 'treasureChest'))
	const getDateRangeKey = (date: string) => {
		const targetDate = getLocalTime(date)

		for (const [key, value] of dateRangeMap) {
			console.log(
				value.start.format('YYYY-MM-DD HH:mm:ss'),
				value.end.format('YYYY-MM-DD HH:mm:ss'),
				'dateRangeKey',
			)
			console.log(targetDate.isAfter(value.start), targetDate.isBefore(value.end), 'dateRangeKey')
			if (targetDate.isAfter(value.start) && targetDate.isBefore(value.end)) {
				return key
			}
		}
		return ''
	}

	const pathToDetail = () => {
		const path = `/activity/referralRewardsNew/details/${activityDetailSelect ? id + '@' + activityDetailSelect : id}`
		router.push({ path })
	}

	getActivityConfig()

	const receiveBonus = throttleActivity(async () => {
		if (btnDisabled.value || loading.value) return
		const user = await userStore.getUser()
		const userId = user?.id || ''
		if (!userId) return
		try {
			const data = await activityApplyApi({
				id,
				applyInfo: {
					type: ZTActivityTypes.enum.ReferralRewardsNew || 'ReferralRewardsNew',
					info: {
						userId,
					},
				},
			})
			if (data?.result && !data?.allMark) {
				return validationActivityClaimLimits(data, PopupType.BONUS, activityName.value)
			}
			if (data.rewardAmount) {
				showPopup({
					type: PopupType.BONUS,
					msg: t('popup.tips05', { amount: merchantCy.value + convertMoneyToShow(data.rewardAmount) }),
				})

				btnDisabled.value = true
			}
		} finally {
			loading.value = false
			getActivityConfig()
		}
	})
	const closeShareModalFun = () => {
		openShareModal.value = false
	}
	const openShareModalFun = () => {
		openShareModal.value = true
		console.log('openShareModalFun', openShareModal.value)
	}
	return {
		currentCanReceiveAmount,
		currentPoolAmount,
		activityName,
		activityRule,
		merchantCy,
		btnDisabled,
		statusInfo,
		statusText,
		openShareModal,
		shareUrl,
		closeShareModalFun,
		receiveBonus,
		pathToDetail,
		openShareModalFun,
		t,
	}
}

export const useComponents = (isDetails?: boolean) => {
	const { activityConfig } = getTheme()
	const template = activityConfig?.[ActivityNames.ReferralRewardsNew]?.template
	const { defStyle } = getCustomerActivityId(template)
	const templList: Record<string, () => Promise<any>> = {
		'style_0': () => import('@/views/activity/referralRewardsNew/style_0/index.vue'),

		'style_0_detail': () => import('@/views/activity/referralRewardsNew/style_0/detail.vue'),
	}
	const computedTemplate = templList[isDetails ? `${defStyle}_detail` : defStyle]
	return markRaw(defineAsyncComponent(computedTemplate)) as unknown as ComponentPublicInstance
}
