import router from '@/router'
import { showLoading } from '@/utils/loading'
import { useTenantStore } from '@/store/tenant'
import { withdrawRecordApi } from '@/api/assets'
import { moneyConvertToClient } from '@/utils/custom'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { WithdrawRecordParams, WithdrawRecordModel } from '@/api/assets/model'
import { tenantReportTimeList, handleStatementSelectTime } from '@/utils/reportTime'
import type { RecordItem } from '@/views/recharge/record/comp/RecordList.vue'
import useCalcAssetStatusInfo from '@/hooks/useCalcAssetStatusInfo'
import { getLocalTime } from '@/utils/date'
export default () => {
	const tenantStore = useTenantStore() // 租户store
	const recordList = ref<RecordItem[]>([]) //
	let originRecordList: any[] = [] // 充值记录列表
	const modalVisible = ref(false) // 充值详情弹窗是否显示
	const success = ['success'] // 成功状态
	const fail = ['refuse', 'confiscate', 'autoError'] // 失败状态
	const sumValues = ref('') // 累计提现
	const loading = ref(false) // 加载状态
	const changeTime = ref('today') // 时间类型
	const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
	const withdrawRecordParams = reactive<WithdrawRecordParams>({
		// 充值记录列表参数
		page: 1,
		pageSize: 100,
		startTime: '',
		endTime: '',
	})
	const withdrawDetail = reactive<WithdrawRecordModel['withdrawalOrderPage'][number]>({
		orderNo: '',
		amount: 0,
		tax: 0,
		status: 'success',
		withdrawalTime: new Date(),
		withdrawalType: 'commission',
		actualWithdrawals: 0,
		withdrawalAccount: '',
		tenantWithdrawTypeId: 0,
		payWithdrawTypeName: null,
	})
	const { t } = useI18n() // 国际化
	const getTransactionAccount = (transactionAccount: string, typeName: string) => {
		const accountTypeMap = {
			'WALLET': (account: string) => JSON.parse(account).walletUserId,
			'default': (account: string) => account
		}
		return (accountTypeMap[typeName] || accountTypeMap.default)(transactionAccount)
	}
	const orderList = computed(() => [
		{
			name: `${t('viewsAssets.createTime')}`,
			value: `${getLocalTime(withdrawDetail.withdrawalTime, 'YYYY-MM-DD HH:mm:ss')}`,
		},
		{ name: `${t('viewsAssets.transactionType')}`, value: withdrawDetail.payWithdrawTypeName },
		{
			name: `${t('viewsAssets.actualAmountReceived')}`,
			value: `${merchantCy.value} ${convertMoneyToShow(withdrawDetail.actualWithdrawals)}`,
		},
		{
			name: `${t('viewsAssets.serviceFee')}`,
			value: `${merchantCy.value} ${convertMoneyToShow(withdrawDetail.tax)}`,
		},
		{ name: `${t('viewsAssets.transactionAccount')}`, value: getTransactionAccount(withdrawDetail.withdrawalAccount, withdrawDetail.payWithdrawTypeName) },
		{ name: `${t('viewsAssets.orderNumber')}`, value: withdrawDetail.orderNo, copy: true },
		withdrawDetail.status == 'refuse' || (withdrawDetail.status == 'confiscate' && withdrawDetail.appRemark)
			? { name: `${t('viewsAssets.Remark')}`, value: withdrawDetail.appRemark }
			: '',
	])

	const timeChange = (name: string) => {
		const dateObj = handleStatementSelectTime(name)
		withdrawRecordParams.startTime = dateObj?.startTime
		withdrawRecordParams.endTime = dateObj?.endTime
		withdrawRecordParams.page = 1
		getWithdrawRecord()
	}
	/**
	 * @description: 下拉刷新事件
	 */
	const handleRefresh = (event: CustomEvent) => {
		event.detail.complete()
		getWithdrawRecord()
	}

	/**
	 * @description: 充值详情弹窗事件
	 */
	const detailHandle = (orderNo: string) => {
		const item = originRecordList.find((it) => it.orderNo == orderNo)
		Object.assign(withdrawDetail, item)
		modalVisible.value = true
	}

	/**
	 * 生命周期: 组件挂载前
	 */
	onBeforeMount(async () => {
		timeChange(changeTime.value)
		tenantStore.getTenantInfo() // 获取租户信息
	})

	const calcStatus = useCalcAssetStatusInfo(success, fail)
	const calcStatusText = (status: string) => {
		if (success.includes(status)) return `${t(`status.${status}`)}`
		if (fail.includes(status)) return `${t(`status.${status}`)}`
		return `${t(`viewsAssets.inWithdrawal`)}`
	}

	const processRecordDate = async(list: any[]) => {
		const currentRecordlist: RecordItem[] = []
		for(const it of list){
			const { withdrawalTime: time, amount, status, orderNo } = it
			const realCurrency = await useGetRealCurrency(amount)
			currentRecordlist.push({
				name: `${t(`viewsAssets.withdraw`)}`,
				time,
				amount,
				orderNo,
				statusColor: calcStatus(status),
				status: calcStatusText(status),
				realCurrency
			})
		}
		return currentRecordlist
	}

	/**
	 * @description: 获取充值记录列表
	 */
	async function getWithdrawRecord() {
		await showLoading()
		loading.value = true
		const res = await withdrawRecordApi(withdrawRecordParams)
		loading.value = false
		if (res && 'withdrawalOrderPage' in res) {
			sumValues.value = `${moneyConvertToClient(res.sumValues ? res.sumValues : 0)}`
			recordList.value = await processRecordDate(res.withdrawalOrderPage)
			originRecordList = res.withdrawalOrderPage
		}
	}

	return {
		sumValues,
		loading,
		recordList,
		modalVisible,
		withdrawDetail,
		changeTime,
		orderList,
		handleRefresh,
		detailHandle,
		timeChange,
		t,
	}
}
