import { defineStore } from 'pinia'
import { Storage } from '@ionic/storage'
import { showLoading } from '@/utils/loading'
import { useAppStore } from '@/store/app'
import { isJSONStr } from '@/utils/verify'
import { piecePrizes, wheelPrizes } from './defaultData'
import { ZNameType } from '@/enums/types/activity.type'
import { ZActivityAwardStatus } from '@/enums/types/activity.type'
import { ActivityListModel, RebateDetailModel, RedPointModel, RedPacketDetailModel } from '@/api/activity/model'
import { Language, generatePreviewText, getActivityDefaultName } from '@/i18n/ruleHelper/activityRule'
import { activityConfigApi, activityListApi, rebateDetailApi, redPointApi, rewardRecordApi, getBindingNewPwaRewardApi, redPacketDetailApi, getUserHomeTopApi } from '@/api/activity'
import { getMixinsInfo } from '@/utils'
import { emitter } from '@/utils/event';

const storage = new Storage();
(async () => {
	await storage.create()
})()

/**
 * @description 活动模块
 */
export const useActivityStore = defineStore({
	id: 'activity',
	state: () => ({
		pageType: 0, // 从优惠页面哪个页签跳转过来的
		curPageType: 0, // 要跳转到优惠页面的哪个页签
		rebateRule: '' as string, // 返水规则
		gameTypes: [] as string[], // 游戏类型列表
		rebateList: [] as Record<string, any>[], // 返利列表
		validBetList: {} as Record<string, any>, // 有效投注列表
		wheelPrizes: [] as Record<string, any>[], // 转盘奖品列表
		piecePrizes: [] as Record<string, any>[], // 助力奖品列表
		activityConfig: {} as Record<string, any>, // 活动配置
		activityList: [] as ActivityListModel['activityList'], // 活动列表
		redPointList: [] as RedPointModel,                                  // 红点列表
		isHasUnclaimed: false,                  //  是否有未领取的活动奖金
		isShowPromoRedPoint: false,                  //  是否显活动tab红点
		isShowProfileRedPoint: false,     //是否显示我的tab红点
		isGetBindingNewPwaReward: false,   //是否已经获取到强制奖励
		showAvailableTomorrow: false,     //是否显示明天可领取返水
		availableTomorrow: 0,     //明天可领取返水
		redPacketDetail: {} as RedPacketDetailModel, // 红包雨详情
		showNewUserExclusivePopup: 0, // 0 未显示 1 显示过 2 通过返回键触发 3 没有开启新人专享活动
		userHomeTop: [], // 登录过未领取的奖励的集合
	}),

	actions: {
		// 获取强制弹出切更新新的b域奖励
		async getBindingNewPwaReward(route: RouteLocationNormalized) {
			const { contenthost, fromEntry } = getMixinsInfo();
			const isExist = this.isGetBindingNewPwaReward || (await storage.get('isGetBindingNewPwaReward'));
			const next = () => !isExist && contenthost && !route.path.includes('download') && fromEntry === 'newPwa'
			if (next()) { // 如果当前b域名为上文b域名，则获取奖励 并且不是下载页面 并且是从新装的pwa打开
				const { success } = (await getBindingNewPwaRewardApi({ domain: contenthost }))?.data
				if (success) {
					this.isGetBindingNewPwaReward = success;
					await storage.set('isGetBindingNewPwaReward', success)
				}
			}
		},
		// 获取活动列表
		async getActivityList() {
			if (!this.activityList.length) this.activityList = await this.requestActivityList()
			return this.activityList
		},
		// 获取新人专享活动状态
		async getUserHomeTop(token?: string) {
			const hasToken = token || await useAppStore().getToken()
			if (hasToken) {
				const userHomeTop = (await getUserHomeTopApi()) || []
				this.userHomeTop = userHomeTop
			}
			return this.userHomeTop || []
		},
		// 设置新人专享活动状态
		async setNewUserExclusivePopup(showNewUserExclusivePopup: number) {
			await storage.set('showNewUserExclusivePopup', showNewUserExclusivePopup)
			this.showNewUserExclusivePopup = showNewUserExclusivePopup
		},
		// 获取新人专享活动状态
		async getNewUserExclusivePopup(checkLocal: boolean = false) {
			const cachedNewUserExclusivePopup = await storage.get('showNewUserExclusivePopup')
			this.showNewUserExclusivePopup = this.showNewUserExclusivePopup || cachedNewUserExclusivePopup
			if (checkLocal) {
				return await storage.get('showNewUserExclusivePopup') || 0
			}
			return this.showNewUserExclusivePopup
		},
		// 请求最新活动列表
		async requestActivityList(isEmitActivityList: boolean | null) {
			this.activityList = (await getActivityListRequest()) || [];
			// 首页充值酬宾需要用到，非首页不需要
			if (!isEmitActivityList) {
				emitter.emit('/activity/list');
			}
			return this.activityList
		},
		// 加载本地活动列表
		async loadActivityList() {
			this.activityList = (await storage.get('activityList')) || []
			return this.activityList
		},
		// 清理活动列表
		async clearActivityList() {
			this.activityList = []
			await storage.remove('activityList')
		},
		// 获取活动配置
		async getActivityConfig() {
			if (!this.activityConfig) this.activityConfig = await getActivityConfigRequest()
			return this.activityConfig
		},
		// 请求最新活动配置
		async requestActivityConfig() {
			this.activityConfig = await getActivityConfigRequest()
			return this.activityConfig
		},
		// 加载本地活动配置
		async loadActivityConfig() {
			this.activityConfig = (await storage.get('activityConfig')) || {}
			return this.activityConfig
		},
		// 获取返水活动信息
		async getRebateDetail(activityId: number) {
			if (!this.rebateList.length) {
				showLoading()
				await this.setRebateDetail(activityId)
			}
			return this.rebateList
		},
		// 设置红包雨活动信息
		async setRedPacketDetail(activityId: number) {
			this.redPacketDetail = (await redPacketDetailApi(activityId)) as RedPacketDetailModel
			return this.redPacketDetail
		},
		// 设置返水活动信息
		async setRebateDetail(activityId: number) {
			await getRebateDetailRequest(activityId)
			return this.rebateList
		},
		// 设置转盘奖品列表
		async setWheelPrizes(prizes?: Record<string, any>[]) {
			if (prizes) {
				await storage.set('wheelPrizes', JSON.stringify(prizes))
				this.wheelPrizes = prizes
				return this.wheelPrizes
			} else {
				const prizes = (await storage.get('wheelPrizes')) || JSON.stringify(wheelPrizes)
				this.wheelPrizes = JSON.parse(prizes)
				return this.wheelPrizes
			}
		},
		// 设置助力奖品列表
		async setPiecePrizes(prizes?: Record<string, any>[]) {
			if (prizes) {
				await storage.set('piecePrizes', JSON.stringify(prizes))
				this.piecePrizes = prizes
				return this.piecePrizes
			} else {
				const prizes = (await storage.get('piecePrizes')) || JSON.stringify(piecePrizes)
				this.piecePrizes = JSON.parse(prizes)
				return this.piecePrizes
			}
		},
		// 获取是否显示红点列表
		async setRedPointList() {
			this.redPointList = await redPointApi({ activityIds: [] })
			//  只要有一个可以领取的红点， 底部的活动tabBar显示红点
			this.isShowPromoRedPoint = this.redPointList.some(it => it.redPoint)
			return this.redPointList
		},


		async setIsHasUnclaimed() {
			const activityRecordParams = {
				status: ZActivityAwardStatus.enum.DISTRIBUTED,
				page: 1,
				pageSize: 20,
				order: [
					{
						key: 'time',
						type: 'desc',
					},
				],
			}
			let data = await rewardRecordApi(activityRecordParams)
			return this.isHasUnclaimed = !!data?.total
		},
		//  用户点击之后更新红点列表
		async updateRedPointData() {
			Promise.all([this.setRedPointList(), this.setIsHasUnclaimed()]).then((res) => {
				this.redPointList = res[0]
				this.isHasUnclaimed = res[1]
				this.isShowPromoRedPoint = this.redPointList.some(it => it.redPoint) || this.isHasUnclaimed
			})
		},
		clearRedPointList() {
			this.redPointList = []
			this.isHasUnclaimed = false
			this.isShowPromoRedPoint = false
		},
	}
})

/**
 * @description 获取活动列表
 */
export async function getActivityListRequest() {
	const res = await activityListApi()
	if (res && 'activityList' in res) {

		const language = await useAppStore().getLocale() as Language
		const activityList = res.activityList.map((item) => {
			if (item.nameType === ZNameType.enum.DEFAULT && isJSONStr(item.nameParams)) {
				const nameParams = JSON.parse(`${item.nameParams}`)
				item.name = getActivityDefaultName(language, item.type, nameParams.variablesValue)
			}

			if (item.previewText && isJSONStr(item.previewText)) {
				const preTextParams = JSON.parse(item.previewText)
				item.previewText = generatePreviewText(language, preTextParams.variablesValue)
			}
			return item
		})
		storage.set('activityList', activityList)
		return activityList
	}
}

/**
 * @description 获取返水活动信息
 */
export async function getRebateDetailRequest(activityId: number) {
	const res = (await rebateDetailApi(activityId)) as RebateDetailModel
	if (res?.resetType === 'DAILY') {
		useActivityStore().showAvailableTomorrow = true;
		useActivityStore().availableTomorrow = Number(res.receiveAmount) / 100;
	} else if (res?.resetType === 'NONE') {
		useActivityStore().showAvailableTomorrow = false;
		useActivityStore().availableTomorrow = 0;
	}
	if (res && 'rebateList' in res) {
		useActivityStore().rebateRule = res.rule
		useActivityStore().validBetList = res.validBetList
		useActivityStore().rebateList = res.rebateList
		useActivityStore().gameTypes = res.gameTypes
	}
}

export async function getActivityConfigRequest() {
	const res = await activityConfigApi()
	if (res && 'configList' in res) {
		const activityConfig = res.configList.tabSort
			.map((item) => {
				return JSON.parse(item)
			})
			.filter((item) => item.isOpen)
			.sort((a, b) => {
				return b.sort - a.sort
			})
		storage.set('activityConfig', activityConfig)
		return activityConfig
	} else {
		return []
	}
}
