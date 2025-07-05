import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { getTheme } from '@/theme/hooks'
import { showToast } from '@/utils/toast';
import { rechargeBonusModel } from '@/api/activity/model'
import { computed, ref, reactive, onMounted } from 'vue'
import { useTenantStore } from '@/store/tenant'
import { showLoading } from '@/utils/loading'
import { getCustomerActivityId } from '@/utils/custom'
import { moneyConvertToClient } from '@/utils/custom'
import { getCurrentLocalTime } from '@/utils/date'
import { rechargePromotionDynamicImg } from '@/views/activity/rechargePromotion/data'
import { rechargePromotionApi } from '@/api/activity'
import { rechargeItemObj, handleRechargeBtnType, calculateWeekDays } from '../data'
import { ZTActivityTypes, ZActivityRuleType } from '@/enums/types/activity.type'
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import router from '@/router'
export function useRechargeLogic() {
	const { t } = useI18n()
	const appStore = useAppStore()
	const tenantStore = useTenantStore() // 租户store
	const rechargeStore = useRechargeStore()
	const { id } = getCustomerActivityId()

	const currentDate = getCurrentLocalTime() as dayjs.Dayjs
	const activityName = ref<string>('')
	const activityRule = ref<string>('')
	const rechargeList = ref([])
	const currentWeekName = ref<string>('')
	const isStartTime = ref<boolean>(true)
	const currentToday = ref<number>(1)
	const currentSkinTopBg = ref<string>('')
	const openRechargeModal = ref<boolean>(false)
	const rechargedId = ref<string | null>(null);
	const disabledBtn = ref<boolean>(false);
	const activityStatus = ref<string>('PROCESSING');
	const countDownTips = ref<string>('');

	const activityDetail = reactive<rechargeBonusModel>({})
	const rechargeItemInfo = reactive<rechargeItemObj>({})
	const { isOpenOrderModal } = toRefs(rechargeStore)

  const isToken = computed(() => appStore.token ? true : false);
	const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy)
	const rechargeCountryCode = computed(() => tenantStore.tenantInfo?.code)
	const rechargeBtnBorder = computed(() => {
		return !disabledBtn.value && !isStartTime.value && isToken.value
	})
	const { isVirtualCurrency } = toRefs(tenantStore)

	// create init初始化
	initSignVue()
	function initSignVue() {
		currentToday.value = calculateWeekDays(currentDate.day())
		getRechargePromotionDetail()
	}

	// 页面挂载后
	onMounted(async () => {
		const { theme, newSkin } = getTheme()
		await loadDynamicImgTsList(theme, newSkin)
	})

	// 加载多皮肤动态图片
	async function loadDynamicImgTsList(theme: string, newSkin?: string) {
		const imgKey = newSkin && newSkin in rechargePromotionDynamicImg ? newSkin : theme
		const skinTopBg = await rechargePromotionDynamicImg[imgKey].topBgImg()
		currentSkinTopBg.value = skinTopBg.default
		
	}

	// 充值大酬宾活动需求
	async function getRechargePromotionDetail() {
		showLoading()
		const res = await rechargePromotionApi(Number(id))
		Object.assign(activityDetail, { ...res })
		// 充值列表金额处理
		if (res?.activityConfig.length) {
			rechargeList.value = res.activityConfig.map((item: any) => {
				item.requestRechargeAmount = item.rechargeAmount;
				item.rechargeAmount = moneyConvertToClient(item.rechargeAmount)
				item.rewardAmount = moneyConvertToClient(item.rewardAmount)
				item.totalAmount = item.rechargeAmount + item.rewardAmount
				// 需要的投注： 赠送部分 = 奖金 * 稽核   本金加赠送 = （奖金 + 充值）* 稽核
				if (res?.rewardAuditType === 'Gift') {
					item.needBetAmount = item.rewardAmount * item.auditMultiple
				} else {
					item.needBetAmount = item.totalAmount * item.auditMultiple
				}
				return item
			})
		}
		activityStatus.value = res?.status;
		currentWeekName.value = handleWeekName(res?.activityDay)
		// 处理充值大酬宾活动名字/规则
		if (res?.multilingual) {
			const language = (await appStore.getLocale()) as Language
			const multilingual = res.multilingual as Record<string, string>
			activityName.value = await getCurrentActivityName(
				multilingual,
				language,
				ZTActivityTypes.enum.RechargePromotion,
			)
			if (ZActivityRuleType.enum.DEFAULT === multilingual.ruleType) {
				const ruleParam = JSON.parse(multilingual.rule)
				activityRule.value = generateDefultRules(
					language,
					ZTActivityTypes.enum.RechargePromotion,
					ruleParam.variablesValue,
				)
			} else {
				activityRule.value = multilingual.rule
			}
			activityRule.value = activityRule.value.replace(/\n/g, '\n\n')
		}
		// 处理充值按钮状态
		const { result1, result2, result3 } = await handleRechargeBtnType(res, currentToday.value);
		disabledBtn.value = result1;
		isStartTime.value = result2;
		rechargedId.value = result3;
		countDownTips.value = result2 ? t('viewsActivity.rechargePromotion10') : t('viewsActivity.rechargePromotion11');
	}

	// 处理星期几文案显示
	function handleWeekName(day: number) {
		switch (day) {
			case 1:
				return t('viewsActivity.rechargePromotion01')
			case 2:
				return t('viewsActivity.rechargePromotion02')
			case 3:
				return t('viewsActivity.rechargePromotion03')
			case 4:
				return t('viewsActivity.rechargePromotion04')
			case 5:
				return t('viewsActivity.rechargePromotion05')
			case 6:
				return t('viewsActivity.rechargePromotion06')
			case 7:
				return t('viewsActivity.rechargePromotion07')
			default:
		}
	}

	// 充值按钮 click事件
	async function rechargeBtnClick(item: any) {
		if (!isToken.value || isStartTime.value) return;
		if (['PENDING','FINISHED'].includes(activityStatus.value)) return;
		if (disabledBtn.value) return showToast('viewsActivity.rechargePromotion21');
		Object.assign(
			rechargeItemInfo,
			{ ...item },
			{ activityId: Number(id), activityType: ZTActivityTypes.enum.RechargePromotion },
		)
		openRechargeModal.value = true
		rechargeStore.isFromActivity = true
		rechargeStore.bankMap.clear()
	}

	// 关闭充值方式弹窗
	function closeRechargeModal() {
		openRechargeModal.value = false
		rechargeStore.isFromActivity = false
	}

	onBeforeRouteLeave(() => {
		openRechargeModal.value = false
	})

	const transferSuccessCb = () => {
		router.push('/rechargeRecord')
	}

	return {
		activityName,
		activityRule,
		rechargeList,
		merchantCy,
		currentWeekName,
		isStartTime,
		currentSkinTopBg,
		openRechargeModal,
		rechargeCountryCode,
		rechargeItemInfo,
		isVirtualCurrency,
		isOpenOrderModal,
		rechargedId,
		disabledBtn,
		rechargeBtnBorder,
		isToken,
		countDownTips,
		activityDetail,
		rechargeBtnClick,
		closeRechargeModal,
		transferSuccessCb,
	}
}
