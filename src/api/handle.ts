import { useAppStore } from '@/store/app'
import { showLogin } from '@/hooks/ShowLogin'
import { useTenantStore } from '@/store/tenant'
import { showToast, hideLoading } from '@/utils'

interface DefaultParams {
	[key: string]: any
}

/**
 * 请求处理
 * @param request 请求方法
 * @param params  请求参数
 * @param auth    是否需要登录
 */
export async function apiHandle<T, K = DefaultParams>(request: (params: K) => Promise<T>, params: K = {} as K, auth: boolean = true) {
	let token = useAppStore().token
	if (auth && !token) {
		token = await useAppStore().getToken()
		if (!token) {
			await hideLoading();
			await showLogin();						// 弹出登录框
			return null as T
		}
	}
	if (!useTenantStore().tenantId)
		await useTenantStore().requestDomainInfo()

	try {
		return await request(params)
	} finally {
		hideLoading()
	}
}
