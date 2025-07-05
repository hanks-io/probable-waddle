import { BindInfo } from './model'
import { defineStore } from 'pinia'
import { Storage } from '@ionic/storage'
import { SD_MODEL } from '@/enums/device'
import { handleUerAvatar } from '@/utils/avatarSkin'
import { announcementMessageApi } from '@/api/normal'
import { storeDefaultValue } from '@/hooks/StoreDefaultValue'
import { withdrawTypeApi } from '@/api/assets'
import {
	favoriteAddApi,
	favoriteDelApi,
	favoriteListApi,
	mailUnreadApi,
	userAssetsApi,
	userDetailsApi,
} from '@/api/personal'
import type {
	FavoriteAddParams,
	FavoriteDelParams,
	FavoriteListModel,
	UserAssetsModel,
	UserDetailsModel,
} from '@/api/personal/model'
import { AccountStatus } from '@/enums/common'
import type { WithdrawTypeModel } from '@/api/assets/model'
import type { WithdrawAccountModel } from '@/api/assets/model'
import dayjs from 'dayjs'
import axios from 'axios'
import { formatToDateTime } from '@/utils/date'
import { PwaAllowSd } from '@/common/data'
import store from '@/store'
const storage = new Storage()
	; (async () => {
		await storage.create()
	})()

type FavoriteModel = FavoriteListModel['favortieList'][number] & { isFavorite?: boolean }



export const useUserStore = defineStore({
	id: 'user',
	state: () => ({
		unreadMailCount: 0, // 未读邮件数量
		newWithdrawAccount: '', // 新增提现账号
		announcementList: [] as any[], // 公告消息列表(编辑后)
		readAnnouncements: [] as number[], // 已读公告
		favoriteList: [] as FavoriteModel[], // 收藏列表
		user: storeDefaultValue<UserDetailsModel>(), // 用户信息
		withdrawSwitch: storeDefaultValue<boolean>(), // 提现开关
		assets: storeDefaultValue<UserAssetsModel>(), // 用户财务信息
		withdrawType: [] as WithdrawTypeModel['withdrawType'], // 提现类型
		withdrawAccount: storeDefaultValue<WithdrawAccountModel['queryData'][0]>(), // 提现账号
		experienceGold: 0, // 体验金
		trialPlayAmountType: '', // 体验金类型
		defaultAvatar: '', // 默认头像
		isRechargeing: false, // 是否正在充值
		accountStatus: AccountStatus.NORMAL, // 账号状态
		isAlreadyDisplayRegisterReward: false, // 是否已经显示注册奖励
	}),

	getters: {
		// 获取用户绑定信息
		getBindInfo(): BindInfo[] {
			const bindInfo = []
			if (this.user?.phoneNumber) {
				bindInfo.push({
					name: 'phone',
					value: this.user.phoneNumber,
				})
			}
			if (this.user?.email) {
				bindInfo.push({
					name: 'email',
					value: this.user.email,
				})
			}
			return bindInfo
		},
		// 获取未读公告数量
		getUnreadAnnouncementCount(state): number {
			let count = 0
			state.announcementList.forEach((item) => {
				if (Array.isArray(item)) {
					item.forEach((subItem) => {
						if (subItem.id && !state.readAnnouncements.includes(subItem.id)) {
							count++
						}
					})
				}
			})
			return count
		},
		// 是否为App用户
		isAppUser(): boolean {
			if (this.user?.appType) {
				return !PwaAllowSd.includes(this.user.appType)
			} else {
				return false
			}
		},
		// 是否为PWA用户
		isPwaUser(): boolean {
			return this.user?.appType === SD_MODEL.PWA
		},
		// 是否为APK用户
		isAPKUser(): boolean {
			return this.user?.appType === SD_MODEL.APK
		},
		// 是否为IOS用户
		isIOSAppUser(): boolean {
			return this.user?.appType === SD_MODEL.IOS_APP
		},
	},

	actions: {
		// 设置用户信息
		async setUser(user: any = null) {
			if (!user) user = await userRequest()

			if (user?.userId) {
				const avatar = handleUerAvatar(user.avatar)
				this.user = { ...user, avatar }
				storage.set('user', { ...user, avatar })
			}
			return this.user
		},
		// 获取用户信息
		async getUser() {
			if (!this.user) {
				this.user = await storage.get('user')
				if (!this.user) {
					const res = await userRequest()
					this.setUser(res)
				}
			}
			return this.user
		},
		// 设置头像缓存
		setDefaultAvatar(avatar: string) {
			this.defaultAvatar = avatar
			storage.set('defaultAvatar', avatar)
		},
		// 获取头像缓存
		async getDefaultAvatar() {
			this.defaultAvatar = await storage.get('defaultAvatar')
			return this.defaultAvatar
		},
		// 设置用户体验金
		setExperienceGold(experienceGold: number) {
			if (typeof experienceGold == 'number') {
				this.experienceGold = experienceGold
			}
		},
		// 获取用户体验金
		getExperienceGold() {
			return this.experienceGold
		},
		// 设置体验金类型
		setExperienceGoldType(type: string) {
			this.trialPlayAmountType = type;
		},
		// 获取体验金类型
		getExperienceGoldType() {
			return this.trialPlayAmountType
		},
		// 删除用户信息
		removeUser() {
			this.user = undefined
			this.setFirstRechargeStatus(false)
			storage.remove('user')
		},
		// 获取用户财务信息
		async getAssets() {
			if (!this.assets) {
				this.assets = (await assetsRequest()) as UserAssetsModel | undefined
			}
			return this.assets
		},
		// 设置用户财务信息
		async setAssets() {
			if (!await useAppStore().checkUserHasLogin()) {
				return undefined
			}
			this.assets = (await assetsRequest()) as UserAssetsModel | undefined
			return this.assets
		},
		// 删除用户财务信息
		removeAssets() {
			this.assets = undefined
		},
		// 获取提现类型
		async getWithdrawType() {
			if (!this.withdrawType.length) this.withdrawType = (await withdrawTypeRequest()) || []
			return this.withdrawType
		},
		// 设置提现类型
		async setWithdrawType() {
			this.withdrawType = (await withdrawTypeRequest()) || []
			return this.withdrawType
		},
		// 获取用户收藏列表
		async getFavoriteList() {
			if (!this.favoriteList.length) this.favoriteList = (await favoriteListRequest()) || []
			return this.favoriteList
		},
		async setFavoriteList() {
			this.favoriteList = (await favoriteListRequest()) || []
			return this.favoriteList
		},
		// 添加收藏
		async addFavorite(item: any, platform?: any) {
			const params: FavoriteAddParams = {
				gameType: item.gameType || platform.gameType,
				platformId: Number(item.platformId) || item.id,
				gameId: item.gameId || (!platform && item.name) ? Number(item.gameId) || Number(item.id) : undefined,
			}
			addFavoriteRequest(params)
			this.favoriteList.push({
				id: 0,
				gameType: item.gameType || platform.gameType,
				platformId: item.platformId || item.id,
				palateformLogo: item.logo,
				plateformName: item.platformName || (platform ? item.name : null),
				plateformBackground: item.background,
				gameId: item.gameId || (item.type == 'game' ? item.id : item.gameName ? item.id : null),
				gameName: item.gameName || (item.type == 'game' ? item.name : null),
				gameLogo: item.logo,
				gameStatus: item.status
			})
			storageFavorite(this.favoriteList)
		},
		// 取消收藏
		async cancelFavorite(item: any, platform?: any) {
			const params: FavoriteDelParams = {
				gameType: item.gameType || platform.gameType,
				platformId: Number(item.platformId) || item.id,
				gameId: item.gameId || (!platform && item.name) ? Number(item.gameId) || Number(item.id) : undefined,
			}
			cancelFavoriteRequest(params)
			this.favoriteList.forEach((favoriteItem, index) => {
				if (item.gameId) {
					if (item.gameId == favoriteItem.gameId) this.favoriteList.splice(index, 1)
				} else if (item.gameName) {
					if (item.id == favoriteItem.gameId) this.favoriteList.splice(index, 1)
				} else if (
					!favoriteItem.gameId &&
					item.gameType == favoriteItem.gameType &&
					item.platformId == favoriteItem.platformId
				) {
					this.favoriteList.splice(index, 1)
				} else if (
					platform &&
					platform.gameType == favoriteItem.gameType &&
					item.id == favoriteItem.platformId
				) {
					this.favoriteList.splice(index, 1)
				}
			})
			storageFavorite(this.favoriteList)
		},
		// 清空收藏列表
		clearFavoriteList() {
			this.favoriteList = []
		},
		// 设置未读邮件数量
		async setUnreadMailCount() {
			this.unreadMailCount = (await getUnreadMailCount()) || 0
			return this.unreadMailCount
		},
		// 获取未读邮件数量
		async getUnreadMailCount() {
			if (!this.unreadMailCount) this.unreadMailCount = await this.setUnreadMailCount()
			return this.unreadMailCount
		},
		// 获取公告消息列表(编辑后)
		async getAnnouncements() {
			if (!this.announcementList.length) this.announcementList = await this.setAnnouncements()
			return this.announcementList
		},
		// 设置公告消息列表(编辑后)
		async setAnnouncements() {
			this.announcementList = await getAnnouncementRequest()
			return this.announcementList
		},
		// 设置用户已读公告消息
		async setReadAnnouncement(id: number) {
			const readAnnouncementObj: Record<string, number[]> = (await storage.get('readAnnouncement')) || {}
			const userId = this.user?.userId.toString()
			if (userId) {
				if (userId in readAnnouncementObj) {
					if (!readAnnouncementObj[userId].includes(id)) readAnnouncementObj[userId].push(id)
				} else {
					readAnnouncementObj[userId] = [id]
				}
				this.readAnnouncements = readAnnouncementObj[userId]
				storage.set('readAnnouncement', readAnnouncementObj)
			}
		},
		// 一键已读公告消息
		async setAllReadAnnouncement(arr: any) {
			const readAnnouncementObj: Record<string, number[]> = (await storage.get('readAnnouncement')) || {};
			const userId = this.user?.userId.toString();
			if (userId) {
				if (userId in readAnnouncementObj) {
					arr.forEach((item: any) => {
						if (!readAnnouncementObj[userId].includes(item)) readAnnouncementObj[userId].push(item)
					})
				} else {
					readAnnouncementObj[userId] = arr
				}
				this.readAnnouncements = readAnnouncementObj[userId]
				storage.set('readAnnouncement', readAnnouncementObj)
			}
		},
		// 获取用户已读公告消息
		async getReadAnnouncement() {
			const readAnnouncementObj: Record<string, number[]> = (await storage.get('readAnnouncement')) || {}
			const userId = this.user?.userId.toString()
			if (userId && userId in readAnnouncementObj) {
				this.readAnnouncements = readAnnouncementObj[userId]
			} else {
				this.readAnnouncements = []
			}
			return this.readAnnouncements
		},
		// 设置已经弹窗的批量优惠
		setBatchDiscountList(id: string) {
			const batchDiscountList = sessionStorage.getItem('batchDiscountList')?.split(',') ?? []
			if (!batchDiscountList.includes(id)) {
				batchDiscountList.push(id)
				sessionStorage.setItem('batchDiscountList', batchDiscountList.toString())
			}
		},
		// 检查当前批量优惠是否已经弹窗
		checkBatchDiscountList(id: string) {
			const batchDiscountList = sessionStorage.getItem('batchDiscountList')?.split(',') ?? []
			return batchDiscountList.includes(id)
		},
		// 设置用户首充上报状态
		setFirstRechargeStatus(status: boolean) {
			localStorage.setItem('firstRechargeStatus', status ? 'true' : 'false')
		},
		// 获取用户首充上报状态
		getFirstRechargeStatus(): boolean {
			const status = localStorage.getItem('firstRechargeStatus')
			return status === 'true'
		}
	},
})

/**
 * @description 获取用户信息
 */
async function userRequest() {
	if (!await useAppStore().checkUserHasLogin()) {
		return undefined
	}
	return await userDetailsApi()
}

/**
 * @description 获取用户财务信息
 */
export async function assetsRequest() {
	return await userAssetsApi()
}

/**
 * @description 获取提现类型
 */
export async function withdrawTypeRequest() {
	const res = await withdrawTypeApi()
	if (res && 'withdrawType' in res) {
		useUserStore().withdrawSwitch = res.withdrawSwitch
		return res.withdrawType
	}
}

/**
 * @description 获取用户收藏列表
 */
export async function favoriteListRequest() {
	const res =(await useAppStore().checkUserHasLogin()) && (await favoriteListApi({ page: 1, pageSize: 1000 }))
	if (res && 'favortieList' in res) return res.favortieList
}

/**
 * @description 添加收藏
 */
export async function addFavoriteRequest(params: FavoriteAddParams) {
	await favoriteAddApi(params)
}

/**
 * @description 删除收藏
 */
export async function cancelFavoriteRequest(params: FavoriteDelParams) {
	await favoriteDelApi(params)
}

/**
 * @description 获取未读邮件数量
 */
export async function getUnreadMailCount() {
	return await mailUnreadApi()
}

/**
 * @description 获取公告消息
 */
export async function getAnnouncementRequest() {
	try {
		const res = await announcementMessageApi()
		let startTimestamp = dayjs(res[0].updateTime).unix() + 601 // 设置初始时间戳
		const announcementList: any[] = [] // 公告列表(编辑后)

		for (const item of res) {
			const response = await axios.get(item.content, { responseType: 'blob' }) // 获取公告详情<blob格式>

			const readBlobAsText = (blob: any): Promise<string> =>
				new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = () => resolve(reader.result as string)
					reader.onerror = () => reject(reader.error)
					reader.readAsText(blob)
				})

			try {
				item.content = await readBlobAsText(response.data) // 读取文件<blob格式>转换为文本
			} catch (e) {
				item.content = ''
			}

			if (dayjs(item.updateTime).unix() < startTimestamp - 600) {
				// 判断是否需要添加日期
				announcementList.push(formatToDateTime(item.updateTime)) // 添加日期
				announcementList.push([item]) // 添加公告(新数组)
			} else {
				announcementList[announcementList.length - 1].push(item) // 添加公告(最后一个数组中添加)
			}
			startTimestamp = dayjs(item.updateTime).unix() // 更新添加公告的时间戳
		}
		return announcementList
	} catch (error) {
		return []
	}
}

// 保存用户Tag
export const saveUserTag = (xTag: string) => {
	storage.set('xTag', xTag)
}

// 获取用户Tag
export const getUserTag = async () => {
	return await storage.get('xTag') || ''
}


export const storageFavorite = async (list: any[]) => {
	const userStore = useUserStore()
	const user = await userStore.getUser()
	const userId = user.id
	let data = await storage.get("favorite") ?? {}
	// {id: list, date: time}
	data[userId] = JSON.stringify(list)
	data.date = Date.now()
	await storage.set('favorite', data)
}



// Need to be used outside the setup
export const useUserStoreWithOut = () => {
  return useUserStore(store);
}
