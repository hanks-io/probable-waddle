// 代理详情 逻辑层
import { useRoute } from 'vue-router'
import { InfiniteScrollCustomEvent } from '@ionic/vue'
import { activityAgentMemberApi } from '@/api/activity'
import { useI18n } from 'vue-i18n'
import {
	ActivityAgentValidUserItem,
	ActivityAgentValidUsersModel,
	ActivityAgentValidUsersParams,
} from '@/api/activity/model'
import { convertMoneyToShow, formatToDate, getCustomerActivityId } from '@/utils'
import { debounce } from '@/utils'
export default function useLogic() {
	const systemStore = useSystemStore()
	const { t } = useI18n()
	const infiniteRef = ref()
	const queryUserId = ref('')
	const titleList = [
		t('activity.agent30'),
		t('activity.agent31'),
		t('activity.agent32'),
		t('activity.agent33'),
		t('activity.agent34'),
	]
	const pageData = ref<ActivityAgentValidUserItem[]>([])
	const isLoading = ref(false)
	const loadMore = ref('more')
	const loading = ref(false)
	const { id } = getCustomerActivityId()
	const pageInfo = {
		page: 1,
		pageSize: 10,
	}

	const getUserDetails = async () => {
		if (loading.value) return
		loading.value = true
		const params = {
			...pageInfo,
			activityId: id,
		}
		if (queryUserId.value) {
			params.queryUserId = Number(queryUserId.value)
		}
		try {
			const res = await activityAgentMemberApi(params)

			loading.value = false
			if (res.pageData.length < pageInfo.pageSize) {
				loadMore.value = 'noMore'
			} else {
				loadMore.value = 'more'
			}

			const list = res.pageData.map((item) => {
				const {
					rechargeCount,
					historicalPay,
					firstRechargeAmount,
					historicalBetting,
					registerTime,
					rechargeDays,
					userId,
					id,
				} = item
				return {
					rechargeCount,
					historicalPay: convertMoneyToShow(historicalPay!),
					rechargeDays,
					firstRechargeAmount: convertMoneyToShow(firstRechargeAmount!),
					historicalBetting: convertMoneyToShow(historicalBetting!),
					registerTime: formatToDate(registerTime!),
					userId,
					id,
				}
			})
			pageData.value.push(...list)
			infiniteRef.value.$el.complete()
		} catch (e) {
			loading.value = false
		} finally {
			loading.value = false
			infiniteRef.value.$el.complete()
		}
	}

	const handleRefresh = async (event: CustomEvent) => {
		pageInfo.page = 1
		pageData.value = []
		await getUserDetails()
		event?.detail?.complete?.()
	}
	const ionInfinite = async (event: InfiniteScrollCustomEvent) => {
		if (loadMore.value == 'noMore') return
		pageInfo.page++
		await getUserDetails()
		event.target.complete?.()
	}

	onMounted(() => {
		if (systemStore.isPC) {
			pageInfo.pageSize = 100
		}
		getUserDetails()
	})

	const queryUserDetails = async () => {
		if (queryUserId.value.length && queryUserId.value.length < 6) return
		pageData.value = []
		await getUserDetails()
	}
	const handleInputSearch = debounce((event: CustomEvent) => {
		queryUserId.value = event.detail.value
		queryUserDetails()
	}, 500)

	return {
		titleList,
		pageData,
		queryUserId,
		isLoading,
		getUserDetails,
		handleRefresh,
		ionInfinite,
		queryUserDetails,
		handleInputSearch,
		infiniteRef,
		loadMore,
		loading,
		t,
	}
}
