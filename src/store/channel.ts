import { defineStore } from 'pinia'
import { Storage } from '@ionic/storage'
import { useTenantStore } from './tenant'
import { channelInfoApi, domainInfoApi } from '@/api/normal'
import { storeDefaultValue } from '@/hooks/StoreDefaultValue'
import { SD_MODEL } from '@/enums/device'
import { useSystemStore } from './system'
import { getWebDomain } from '@/utils/app'
import { useAppStore } from './app'
import type { APKTaskPopupTimeType } from '@/utils/pwa/apkTask'
import type { ForceModalKeyType } from '@/utils/pwa/forcedModal/useShow'
const installStatusList = ['NotInstall', 'Installing', 'Installed'] as const
const compulsoryInstallKeyList = ['compulsoryInstallTime', 'taskAPK', "registerReward"] as const
export type installStatusType = typeof installStatusList[number]
export type compulsoryInstallKeyType = typeof compulsoryInstallKeyList[number]
interface ChannelParams {
	id: string | number
	tenantId: string | number
	domain: string
}

const storage = new Storage()
	; (async () => {
		await storage.create()
	})()

export const useChannelStore = defineStore({
	id: 'channel',
	state: () => ({
		installStatus: 'NotInstall' as installStatusType, // 安装状态(0为安装, 1安装中, 2安装成功)
		copyUrlModalVisible: false, // 复制链接弹窗显示状态
		modalChecked: storeDefaultValue<boolean>(), // 安装弹窗检测状态
		mainChannelInstallInfo: <Record<string, any>>{}, // 主渠道安装信息
		channelConfig: storeDefaultValue<Record<string, any>>(), // 渠道配置
		promotionInfo: storeDefaultValue<Record<string, any>>(), // 推广渠道
		downloadTemplate: storeDefaultValue<Record<string, any>>(), // 下载模板
		isShowCompulsoryModal: false as boolean | nu, // 
		APKTaskPopupTime: 'Home' as APKTaskPopupTimeType, // 
		compulsoryInstallKey: 'compulsoryInstallTime' as compulsoryInstallKeyType, // 强制安装时间key
		isShowForceModal: false, // 是否显示强制弹窗
		forceModalKey: null as ForceModalKeyType | null,  // 强制安装时间key
		forceModalCloseType: 2 as 1 | 2 // 1表示通过弹出关闭，2表示通过路由跳转或者链接跳转关闭
	}),

	getters: {
		// 是否为上架包
		isShelfPackage(): boolean {
			return useSystemStore().isApkShelfPackage
		},
		isTikTokAPI(): boolean {
			return this.channelConfig?.pointType === 'TikTokAPI'
		},
		isTikTok(): boolean {
			return this.channelConfig?.pointType === 'TikTok'
		},
		isFacebookAPI(): boolean {
			return this.channelConfig?.pointType === 'FacebookAPI'
		},
		isAFAPI(): boolean {
			return this.channelConfig?.pointType === 'AFAPI'
		},
	},

	actions: {
		// 设置强制安装时间(戳)
		setCompulsoryInstallTime(hour: number) {
			storage.set(this.forceModalKey, Date.now() + hour * 60 * 60 * 1000)

		},

		// 获取强制安装时间(戳)
		async getCompulsoryInstallTime(key: ForceModalKeyType = 'compulsoryInstallTime') {
			return (await storage.get(key)) || 0
		},

		// 获取下载模板
		async getDownloadTemplate(url: string) { // 获取下载模板 
			const res = await templateRequest(url) || {};
			return (this.downloadTemplate = res)
		},
		// 设置安装弹窗检测状态
		setModalChecked(checked: boolean = false) {
			this.modalChecked = checked
		},

		// 设置安装状态
		setInstallStatus(status: installStatusType) {
			this.installStatus = status
		},

		// 获取主渠道安装信息
		async requestMainChannelInstallInfo() {
			this.mainChannelInstallInfo = await mainChannelInstallInfoRequest()
		},

		// 获取渠道信息
		getChannelInfo(channelId: string) {
			if (!this.channelConfig) this.requestChannelInfo(channelId)
		},

		async reqChannelInfo(params?: ChannelParams) {
			const systemStore = useSystemStore()
			const res = await channelInfoApi(params)
			if (res && 'config' in res && res.config?.frontConfig) {
				let frontConfig = {}
				try {
					frontConfig = JSON.parse(res.config.frontConfig as string)
				} catch (error) {
					frontConfig = {}
				}
				this.channelConfig = { ...res.config, ...frontConfig }
				if (systemStore.app?.build === SD_MODEL.IOS_H5) {
					this.promotionInfo = this.channelConfig?.ios
				} else {
					this.promotionInfo = this.channelConfig?.android
				}
			}

		},

		// 调用网络接口: 请求渠道信息
		async requestChannelInfo(channelId: string) {
			const appStore = useAppStore()
			const tenantStore = useTenantStore()
			const domain = getWebDomain()
			appStore.setChannelId(channelId)
			this.reqChannelInfo({
				id: channelId || 0,
				tenantId: tenantStore.tenantId || 0,
				domain: domain,
			})
		},
	},
})

export async function templateRequest(url: string) {
	const res = await domainInfoApi(url, false)
	if (res?.info.styleConfig) {
		const template = {
			...JSON.parse(res.info.styleConfig as string),
			authentication: res.info.authentication,
			style: res.info.style,
			jumpDomainType: res.info.jumpDomainType,
			appScore: JSON.parse(res.info.styleConfig).appScore,
			imitationAppType:res.info.imitationAppType,
		}
		return template
	}
}

export async function mainChannelInstallInfoRequest() {
	const tenantStore = useTenantStore()
	const tenantId = await tenantStore.getTenantId()

	const res = await channelInfoApi({ tenantId })
	if (res && 'config' in res && res.config?.frontConfig) {
		let frontConfig = {}
		try {
			frontConfig = JSON.parse(res.config.frontConfig as string)
		} catch (error) {
			frontConfig = {}
		}
		const config = { ...res.config, ...frontConfig }
		return config
	}
	return {}
}
