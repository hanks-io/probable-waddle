import {
	getLocalTime,
	getUtcTime,
	getCurrentDayRange,
	getYesterdayRange,
	getCurrentWeekRange,
	getLastWeekRange,
	getCurrentMonthRange,
	getLastMonthRange,
} from '@/utils/date'
import { InfiniteScrollCustomEvent } from '@ionic/vue'
import dayjs, { Dayjs } from 'dayjs'
import { getBonusPoolContributionListApi } from '@/api/activity'
import { convertMoneyToShow } from '@/utils'
import { showToast } from '@/utils'
import { delay } from '@/utils/delay'
interface ContributionListType {
	contributionAmount: string
	rechargeAmount: string
	registerTime: string
	userId: string
	id: number
}
export const useLogicDetail = () => {
	const { t } = useI18n()
	const dateIndex = ref(0)
	const searchValue = ref('')
	const tenantStore = useTenantStore()
	const contributionList = ref<ContributionListType[]>([])
	const loadMore = ref('more')
	const loading = ref(false)
	const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
	const DATE_TIME_FORMAT_2 = 'YYYY-MM-DDTHH:mm:ss'
	const infiniteRef = ref()
	const systemStore = useSystemStore()
	const dateTimeMap = new Map([
		[0, getCurrentDayRange()],
		[1, getYesterdayRange()],
		[2, getCurrentWeekRange()],
		[3, getLastWeekRange()],
		[4, getCurrentMonthRange()],
		[5, getLastMonthRange()],
	])
	const pageInfo = {
		page: 1,
		pageSize: 10,
	}

	const selectList = [13, 14, 15, 16, 17, 18].map((name, id) => {
		return { id, name: t(`referralRewardsNew.0000${name}`) }
	})
	const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
	const startTime = ref<string>(dateTimeMap.get(dateIndex.value)?.start?.format(DATE_TIME_FORMAT_2) || '')
	const endTime = ref<string>(dateTimeMap.get(dateIndex.value)?.end?.format(DATE_TIME_FORMAT_2) || '')
	const handleChange = (id: number) => {
		dateIndex.value = id
		startTime.value = dateTimeMap.get(id)?.start?.format(DATE_TIME_FORMAT_2)
		endTime.value = dateTimeMap.get(id)?.end?.format(DATE_TIME_FORMAT_2)
	}

	// 判断两个时间是否相差大于31天
	const isMoreThan31Days = (startTime: string, endTime: string) => {
		// 转换为 Day.js 对象
		const d1 = dayjs(startTime)
		const d2 = dayjs(endTime)

		// 验证日期是否有效
		if (!d1.isValid() || !d2.isValid()) {
			throw new Error('Invalid date input')
		}

		// 计算两个日期的绝对差值（以天为单位）
		const diffInDays = Math.abs(d1.diff(d2, 'day'))

		// 返回是否大于31天
		return diffInDays > 31
	}

	// 判断结束时间是否不小于开始时间
	const isEndTimeValid = (startTime: string, endTime: string, unit = 'second') => {
		// 转换为 Day.js 对象
		const start = dayjs(startTime)
		const end = dayjs(endTime)

		// 验证日期是否有效
		if (!start.isValid() || !end.isValid()) {
			throw new Error('Invalid date input')
		}

		// 检查结束时间是否晚于或等于开始时间
		return end.isAfter(start, unit)
	}
	const headerList = [
		'ID',
		t('referralRewardsNew.000021'),
		t('referralRewardsNew.000022'),
		t('referralRewardsNew.000023'),
	]
	const getBonusPoolContributionList = async () => {
		if (!isEndTimeValid(startTime.value, endTime.value)) {
			showToast('referralRewardsNew.000026')
			return
		}
		if (isMoreThan31Days(startTime.value, endTime.value)) {
			showToast('referralRewardsNew.000025')
			return
		}
		if (loading.value) return
		loading.value = true
		try {
			const res = await getBonusPoolContributionListApi({
				...pageInfo,
				search: searchValue.value,
				startTime: dayjs(startTime.value).utc().format(DATE_TIME_FORMAT),
				endTime: dayjs(endTime.value).utc().format(DATE_TIME_FORMAT),
			})

			loading.value = false
			if (res.reviewList.length < pageInfo.pageSize) {
				loadMore.value = 'noMore'
			} else {
				loadMore.value = 'more'
			}

			const list = res.reviewList.map((item) => {
				const { contributionAmount, rechargeAmount, registerTime, userId, id } = item
				return {
					contributionAmount: convertMoneyToShow(contributionAmount),
					rechargeAmount: convertMoneyToShow(rechargeAmount),
					registerTime: getLocalTime(registerTime, DATE_TIME_FORMAT),
					userId,
					id,
				}
			})
			contributionList.value.push(...list)
			infiniteRef.value.$el.complete()
		} catch (e) {
			console.log(e, 'e')
			loading.value = false
		} finally {
			loading.value = false
			infiniteRef.value.$el.complete()
		}
	}

	const handleRefresh = async (event: CustomEvent) => {
		pageInfo.page = 1
		contributionList.value = []
		await getBonusPoolContributionList()
		event?.detail?.complete?.()
	}
	const ionInfinite = async (event: InfiniteScrollCustomEvent) => {
		console.log(event.target.complete, loadMore.value, 'event')
		if (loadMore.value == 'noMore') return
		pageInfo.page++
		await getBonusPoolContributionList()
		event.target.complete?.()
	}
	const datetimeChange = async (datetime: string) => {
		await delay(500)
		if (!startTime.value || !endTime.value) return

		if (!isEndTimeValid(startTime.value, endTime.value)) {
			showToast('referralRewardsNew.000026')
			return
		}
		if (isMoreThan31Days(startTime.value, endTime.value)) {
			showToast('referralRewardsNew.000025')
			return
		}
		for (const [key, value] of dateTimeMap) {
			console.log(
				dayjs(startTime.value).format(DATE_TIME_FORMAT),
				value.start.format(DATE_TIME_FORMAT),
				dayjs(startTime.value).isSame(value.start, 'day'),
				'dayjsstartTime',
			)

			console.log(
				dayjs(endTime.value).format(DATE_TIME_FORMAT),
				value.end.format(DATE_TIME_FORMAT),
				dayjs(endTime.value).isSame(value.end, 'day'),
				'dayjsendTime',
			)
			if (dayjs(startTime.value).isSame(value.start, 'date') && dayjs(endTime.value).isSame(value.end, 'date')) {
				dateIndex.value = key
				return
			}
		}
		dateIndex.value = -1
	}

	const handleInputSearch = (event: CustomEvent) => {
		setTimeout(() => {
			searchValue.value = event.detail.value.replace(/[^\d]/g, '')
		}, 0)
	}

	onMounted(() => {
		if (systemStore.isPC) {
			pageInfo.pageSize = 100
		}
		getBonusPoolContributionList()
	})

	return {
		selectList,
		dateIndex,
		startTime,
		endTime,
		headerList,
		loading,
		merchantCy,
		contributionList,
		loadMore,
		searchValue,
		t,
		handleRefresh,
		ionInfinite,
		handleChange,
		datetimeChange,
		handleInputSearch,
		infiniteRef,
	}
}
