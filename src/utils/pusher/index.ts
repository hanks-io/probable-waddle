import { emitter } from '../event'
import { useAppStore } from '@/store/app'
import { useTenantStore } from '@/store/tenant'
import { useSystemStore } from '@/store/system'
import { registerEvents } from './event-register'
import Pusher from 'pusher-js'
import { getApiUrl } from '../apiUrl'
import { isGray, showToast } from '@/utils'
import { handleLoginInvalid } from '@/trpc/errorHandlerLink'
import { ERROR_CODE } from "@/enums/types/errorCode";
import { AccountStatus } from '@/enums/common'


Pusher.logToConsole = false

export function getPusher(): Pusher {
	const grayOption = isGray()
		? {
			'X-Gray': 'true',
		}
		: {}

	const pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_KEY || '90915926774e1fee4451', {
		cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'mt1',
		channelAuthorization: {
			endpoint: `${getApiUrl()}/api/frontend/pusher/channel-auth`,
			transport: 'ajax',
			headersProvider: () => {
				const appStore = useAppStore()
				const tenantStore = useTenantStore()
				return {
					'Authorization': `Bearer ${appStore.token}`,
					'Client-Language': appStore.locale || 'zh-CN',
					'tenantId': tenantStore.tenantId,
					...grayOption,
				}
			},
		},
		userAuthentication: {
			transport: 'ajax',
			endpoint: `${getApiUrl()}/api/frontend/pusher/user-auth`, // 指定endpoint地址 不然自定义中初始化会出现4009
			customHandler: async (authParams, callback: (error: Error | null, data: any) => void) => {
				try {
					// 获取必要的状态
					const { token, locale } = useAppStore()
					const { tenantId } = useTenantStore()
					const { app } = useSystemStore()
					
					// 构建请求头
					const headers = {
						Authorization: `Bearer ${token}`,
						'tenantId': tenantId,
						'Client-Language': locale || 'en-US',
						'X-Device-Type': app?.build,
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						...grayOption,
					}

					// 处理请求参数
					const body = Object.entries(authParams as unknown as Record<string, string>)
						.map(([key, value]) => [
							key.replace(/([A-Z])/g, '_$1').toLowerCase(),
							value
						])
						.reduce((params, [key, value]) => {
							params.append(key, value);
							return params;
						}, new URLSearchParams())
						.toString()

					// 发送认证请求
					const response = await fetch(`${getApiUrl()}/api/frontend/pusher/user-auth`, {
						method: 'POST',
						headers,
						body
					})

					// 处理响应
					const responseData = await response.json()

					// 处理403错误
					if (response.status === 403) {
						const { code, message } = JSON.parse(responseData?.message || '{}')
						if ([ERROR_CODE.LOGIN_BLACKLIST, "USERS:LOGIN", ERROR_CODE.TOKEN_INVALID].includes(code)) {
							await useAppStore().removeToken()
							useUserStore().removeUser()
							handleLoginInvalid(code === ERROR_CODE.TOKEN_INVALID ? AccountStatus.OFFLINE : AccountStatus.FROZEN)
							return
						}
						showToast(message)
						return
					}
					callback(null, responseData)
				} catch (error) {
					console.error('Pusher auth error:', error)
					showToast(t("tip.serverBusy"))
					callback(error as Error, null)
				}
			},
		},
	})

	//注册事件
	registerEvents(pusherInstance)

	return pusherInstance
}

export async function initPusher() {
	const appStore = useAppStore()
	if (!appStore.token) {
		return
	}
	const pusher = getPusher()
	const tenantStore = useTenantStore()
	pusher.signin()
	pusher.subscribe(`private-${tenantStore.tenantId}`)
}

export async function disconnectPusher() {
	Pusher.instances.forEach((pusher) => {
		pusher.disconnect()
	})
}

export function registerPusherEvents() {
	emitter.on('system/init-finish', async (data) => {
		await initPusher()
	})

	emitter.on('user/login', async (data) => {
		await initPusher()
	})

	emitter.on('user/logout', (data) => {
		disconnectPusher()
	})

	emitter.on('system/exit', () => {
		disconnectPusher()
	})
}
