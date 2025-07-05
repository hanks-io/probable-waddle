import { defineStore } from 'pinia'
import { Storage } from '@ionic/storage'
import { LanguageSupport, LanguageType } from '@/enums/language'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import i18n, { loadAsycMassage } from '@/i18n'
import { showLoading, hideLoading } from '@/utils/loading'
import { LoginType } from "@/enums/common";
import { saveCrossPlatformLoginInfo } from '@/utils'
import { useSystemStore } from '@/store/system'
const storage = new Storage()
	; (async () => {
		await storage.create()
	})()

export const useAppStore = defineStore({
	id: 'app',
	state: () => ({
		token: '', // 用户token
		locale: '', // 语言
		account: '', // 用户账号
		loginType: '', // 最后登录时使用的登录类型
		password: '', // 用户密码
		parentId: '', // 推荐人ID
		channelId: '', // 渠道ID
		pwaBarVisible: true, // PWA安装提示栏显示状态
		drawerLoad: false, // 抽屉加载状态
		oldVerifyToken: '', // 旧的验证码token
		newVerifyToken: '', // 新的验证码token
		operation: 'login', // 操作类型(用于全局弹窗操作)
		pwaFooterVisible: true, // PWA底部提示栏显示状态
		modalVisible: false, // 全局弹窗显示状态
		unStandalone: false, // 是否未在PWA中运行且可以安装PWA
		pwaLaunchAllow: false, // 是否允许PWA启动
		rememberAccount: true, // 是否记住账号
		sendedBindTimestamp: 0, // 已发送绑定时间时间戳
		sendedVerifyTimestamp: 0, // 已发送验证码时间时间戳
		languageModalVisible: false, // 语言选择弹窗显示状态
		appInfo: {} as Record<string, any>, // App信息(名称、logo)
		announcementNotice: {} as Record<string, any>, // 公告通知内容
		isShowGuidePwa: false, //  是否显示pwa引导
		isShowInstallModalContent: true, //  是否显示pwa安装弹窗内容
		isShowPwaBar: false, //   这个是整个所有的条件， pwaBarVisiblePWA只是一个状态
		isShowPwaFooter: false, //   这个是整个所有的条件，pwaFooterVisible只是一个状态
		alreadyPwaFooter: false, //   PwaFooter弹框是否弹出过， 默认是没有
		receviceMessageFromChild: '',
		isShowFacebookModal: false,
		startUrlSearchParams: window.location.search,
		webPushRegId: '', // 极光webpush 注册ID
		MTTimeId: null as null | number, // 定时器ID
	}),

	actions: {
		// 设置渠道ID
		async setChannelId(channelId: string = '') {
			this.channelId = channelId
		},

		async setStartUrlSearchParams() {
			await storage.set('startUrlSearchParams', window.location.search)
		},

		// 加载token
		async getToken(route?: RouteLocationNormalizedLoaded) {
			if (!this.token){
				 this.token = await storage.get('token')
				 if(this.token && isUndefinedProps(this.token)){
					saveCrossPlatformLoginInfo(this.token)
				 }
			} 
			if (!this.token) {
				if (route && isUndefinedProps(route.query.token)) {
					this.token = route.query.token as string
					await storage.set('token', this.token)
					await saveCrossPlatformLoginInfo()
				}
			}
			return this.token
		},

		// 设置token
		async setToken(token: string = '') {
			if (isUndefinedProps(token)) {
				await storage.set('token', token);
				this.token = token;
			} else {
				await storage.remove('token').then(() => {
					this.token = ''
				})
			}
			await saveCrossPlatformLoginInfo()
		},

		async checkUserHasLogin() {
			const token = await this.getToken()
			return !!token
		},

		// 移除token
		async removeToken() {
			await saveCrossPlatformLoginInfo()
			await storage.set('token', '').then(() => {
				this.token = ''
			})
		},

		// 设置语言
		async setLocale(language: string = '') {
			if (!language) language = (await storage.get('locale'));
			if (LanguageSupport.includes(language)) {
				// 判断是否为支持的语言
				this.locale = language
			}
			i18n.global.locale.value = this.locale as LanguageType	// 设置全局语言
			await showLoading();
			await loadAsycMassage(this.locale) // 加载语言包
			hideLoading();
			storage.set('locale', this.locale) 											// 保存语言
			return this.locale
		},

		// 获取语言
		async getLocale() {
			if (!this.locale) this.locale = await this.setLocale()
			return this.locale
		},

		// 是否有语言缓存
		async hasLocale() {
			return !!(await storage.get('locale'))
		},

		// 保存用户账号
		async setAccount(account: string, password: string, reset: boolean = true) {
			const systemStore = useSystemStore()
			const oldAccount = (await storage.get('account')) || ''
			if (!oldAccount || reset || systemStore.isApk) {
				if (isUndefinedProps(account)) {
					await storage.set('account', account)
					this.account = account
				}
			}

			const oldPassword = (await storage.get('password')) || ''
			if (!oldPassword || reset || systemStore.isApk) {
				if (isUndefinedProps(password)) {
					await storage.set('password', password)
					this.password = password
				}
			}

			// 保存登录类型
			if (isUndefinedProps(account)) {
				this.loginType = /^\d+$/.test(account) ? LoginType.Phone : LoginType.Account;
				await storage.set('loginType', this.loginType)
			}
			await saveCrossPlatformLoginInfo()
		},

		// 获取用户账号
		async getAccount() {
			if (!this.account) this.account = (await storage.get('account')) || ''
			return this.account
		},

		// 获取用户密码
		async getPassword() {
			if (!this.password) this.password = (await storage.get('password')) || ''
			return this.password
		},

		// 获取登录类型
		async getLoginType() {
			if (!this.loginType) this.loginType = (await storage.get('loginType')) || LoginType.Phone
			return this.loginType
		},

		// 删除用户账号
		removeAccount() {
			this.account = '';
			this.password = '';
			this.loginType = '';
			storage.remove('account')
			storage.remove('password')
			storage.remove('loginType')
		},

		// 设置记住密码
		setRememberAccount(remember: boolean) {
			this.rememberAccount = remember
		},

		// 设置推荐人
		setParentId(route?: RouteLocationNormalizedLoaded) {
			if (route && route.query.pid) {
				this.parentId = route.query.pid as string
				storage.set('parent', this.parentId)
			}
		},

		// 获取推荐人
		async getParentId() {
			if (!this.parentId) {
				this.parentId = (await storage.get('parent')) || ''
			}
			return Number(this.parentId)
		},

		// 设置旧的验证码token
		setOldVerifyToken(token: string) {
			this.oldVerifyToken = token
			storage.set('oldVerifyToken', token)
		},

		// 获取旧的验证码token
		async getOldVerifyToken() {
			if (!this.oldVerifyToken) this.oldVerifyToken = (await storage.get('oldVerifyToken')) || ''
			return this.oldVerifyToken
		},

		// 设置新的验证码token
		setNewVerifyToken(token: string) {
			this.newVerifyToken = token
			storage.set('newVerifyToken', token)
		},

		// 获取新的验证码token
		async getNewVerifyToken() {
			if (!this.newVerifyToken) this.newVerifyToken = (await storage.get('newVerifyToken')) || ''
			return this.newVerifyToken
		},

		// 设置已发送验证码时间戳
		setSendedVerifyTimestamp() {
			this.sendedVerifyTimestamp = Math.floor(Date.now() / 1000)
			storage.set('sendedVerifyTimestamp', this.sendedVerifyTimestamp)
		},

		// 获取已发送验证码时间戳与当前时间差
		async getVerifyTimestampDiff() {
			if (!this.sendedVerifyTimestamp)
				this.sendedVerifyTimestamp = (await storage.get('sendedVerifyTimestamp')) || 0
			return Math.floor(Date.now() / 1000) - this.sendedVerifyTimestamp
		},
		// 设置已发送绑定时间戳
		setSendedBindTimestamp() {
			this.sendedBindTimestamp = Math.floor(Date.now() / 1000)
			storage.set('sendedBindTimestamp', this.sendedBindTimestamp)
		},

		// 获取已发送绑定时间戳与当前时间差
		async getBindTimestampDiff() {
			if (!this.sendedVerifyTimestamp) this.sendedBindTimestamp = (await storage.get('sendedBindTimestamp')) || 0
			return Math.floor(Date.now() / 1000) - this.sendedBindTimestamp
		},

		// 设置App信息
		setAppInfo(info: Record<string, any>) {
			Object.assign(this.appInfo, info)
			storage.set('appInfo', info)
		},

		// 获取App信息
		async getAppInfo() {
			if (!Object.keys(this.appInfo).length) this.appInfo = (await storage.get('appInfo')) || {}
			return this.appInfo
		},

		// 设置公告通知
		setAnnouncementNotice(notice: Record<string, any>) {
			this.announcementNotice = notice
		},

		// 设置是否未在PWA中运行且可以安装PWA
		setUnStandalone(unStandalone: boolean) {
			this.unStandalone = unStandalone
		},

		// 设置抽屉加载状态
		setDrawerLoad(load: boolean = false) {
			this.drawerLoad = load
		},

		// 设置语言选择弹窗显示状态
		setLanguageModalVisible(visible: boolean = false) {
			this.languageModalVisible = visible
		},

		// 设置PWA是否允许启动
		setPwaLaunchAllow(allow: boolean = false) {
			this.pwaLaunchAllow = allow
		},

		// 设置PWA安装提示栏显示状态
		setPwaBarVisible(bool: boolean) {
			this.pwaBarVisible = bool
		},

		// 设置pwa底部提示栏显示状态
		setPwaFooterVisible(bool: boolean) {
			this.pwaFooterVisible = bool
		},

		// 设置来自iframe的消息
		setReceviceMessage(receviceMessageFromChild: string) {
			console.log('setReceviceMessage', receviceMessageFromChild)
			this.receviceMessageFromChild = receviceMessageFromChild;
			storage.set('receviceMessageFromChild', receviceMessageFromChild);
		},
		// 获取来自iframe的消息
		async getReceviceMessage() {
			if (!this.receviceMessageFromChild) this.receviceMessageFromChild = (await storage.get('receviceMessageFromChild'));
			console.log('getReceviceMessage', this.receviceMessageFromChild)
			return this.receviceMessageFromChild;
		},
		// 保存webpush注册ID
		setWebPushRegId(regId: string) {
			this.webPushRegId = regId;
			localStorage.setItem('webPushRegId', regId);
		},
		// 获取webpush注册ID
		getWebPushRegId(): string {
			if (!this.webPushRegId) {
				this.webPushRegId = localStorage.getItem('webPushRegId') || '';
				if (!this.webPushRegId) {
					const urlParams = new URLSearchParams(window.location.search);
					this.webPushRegId = urlParams.get('webPushRegId') || '';
					if (this.webPushRegId) {
						localStorage.setItem('webPushRegId', this.webPushRegId);
					}
				}
			}
			return this.webPushRegId;
		}
	},
})
function isUndefinedProps(value: any) {
	return value === 'undefined' ? undefined : value;
}
