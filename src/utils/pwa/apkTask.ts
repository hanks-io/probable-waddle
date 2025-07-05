import router from "@/router";
import type { PopupTimeType } from './compulsory'
import showCompulsoryModal from '@/pwa/hooks/useCompulsoryModal';
import {closeForceModal} from '@/utils/pwa/forcedModal/useClose'
import { getUrlParam } from '@/utils';
const popupTimeList = ['Recharge', 'Home', 'Withdrawal'] as const
export type APKTaskPopupTimeType = typeof popupTimeList[number]
interface PopupTimeInfoType {
	key: APKTaskPopupTimeType,
	value: boolean,
	isEqual: boolean
}
const popupTimeMap: Record<APKTaskPopupTimeType, PopupTimeType> = {
	Recharge: 'RECHARGE',
	Home: 'HOME',
	Withdrawal: 'FIRST_WITHDRAWAL'
}
const getPopupTime = (popupTimeInfoList: PopupTimeInfoType[]) => {
	let list = popupTimeInfoList.filter(it => it.isEqual)
	if (list.length) return popupTimeMap[list[0].key]
	return popupTimeMap[popupTimeInfoList[0].key]
}
export default async () => {
	const taskStore = useTaskStore()
	const userStore = useUserStore();       // 用户信息
	const route = router.currentRoute
	const channelStore = useChannelStore(); // 渠道信息 
	const { isShowCompulsoryModal, compulsoryInstallKey, APKTaskPopupTime } = toRefs(channelStore)
	const ch = (route.value.query.ch || 0) as number
	if (route.value.path !== '/main/inicio') return false
	const taskData = await taskStore.getInstallApkTaskDetail()
	const { rewardMax, rewardMin, popupSwitch } = taskData
	if (popupSwitch !== 'ON') return false
	const { popupInterval, range, apkUrl, popupType, domainRange } = taskData.otherConfig
	if (popupInterval != 0) {
		// 判断是否有强制安装过期时间
		const expire = await channelStore.getCompulsoryInstallTime('taskAPK');
		if (expire > Date.now()) return false;
	}
	let isInRange = domainRange.length ? domainRange.some((it: any) => it.name.includes(window.location.hostname)) : false
	if (!isInRange) {
		const channelIdList: number[] = range.reduce((acc: number[], cur: any) => {
			if (cur.channelIdList.length) {
				acc.push(...cur.channelIdList)
			}
			return acc;
		}, [])
		isInRange = channelIdList.includes(Number(ch))
	}

	if (!isInRange) return false
	const popupTimeInfo: Record<APKTaskPopupTimeType, boolean> = {
		Recharge: !!userStore.user?.firstRechargeAmount,
		Home: true,
		Withdrawal: userStore.user?.withdrawCount >= 1
	};
	// "Recharge", "Withdrawal", "Home", "FirstWithdrawal"

	const isShow = (popupType as APKTaskPopupTimeType[]).some(it => popupTimeInfo[it])
	if (!isShow) return false
	if (route.value.path !== '/main/inicio') return false
	const popupTimeInfoList: PopupTimeInfoType[] = []
	for (const item in popupTimeInfo) {
		if (popupTimeInfo[item as APKTaskPopupTimeType] && popupType.includes(item as APKTaskPopupTimeType)) {
			popupTimeInfoList.push({ key: item as APKTaskPopupTimeType, value: popupTimeInfo[item as APKTaskPopupTimeType], isEqual: item === APKTaskPopupTime.value })
		}
	}


	channelStore.promotionInfo = {
		...(channelStore?.promotionInfo || {}),
		installType: "APK",
		installUrl: apkUrl,
		popupInterval: `${popupInterval}`,
		popupTime: getPopupTime(popupTimeInfoList),
		showGiftAmount: [`${rewardMin}`, `${rewardMax}`],
	}
	if (isShowCompulsoryModal.value && compulsoryInstallKey.value === 'compulsoryInstallTime') {
		closeForceModal(false)
		channelStore.compulsoryInstallKey = 'taskAPK'
		channelStore.isShowCompulsoryModal = false
	}
	await showCompulsoryModal()
	channelStore.compulsoryInstallKey = 'taskAPK'
	return true
}
