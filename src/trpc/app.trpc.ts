import { useAppStore } from '@/store/app'
import { useTenantStore } from '@/store/tenant'
import { useSystemStore } from '@/store/system'
import { errorHandleLink } from './errorHandlerLink'
import { createTRPCProxyClient, httpLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '~/server/logic/trpc/frontend/routers'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'
import { isGray } from "@/utils/app";
import { getApiUrl } from '@/utils/apiUrl'
import { saveUserTag, getUserTag } from '@/store/user'

/**
 * @description 创建traceID用于定位消息请求
 * @param length 生成traceID长度, 默认值为8
 * @returns tarceID
 */
function getTraceID(length = 8): string {
	const characters = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let result = ''
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		result += characters.charAt(randomIndex)
	}
	return result
}

//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const { version } = window.__APP_CONFIG__ || {};
const TrpcUrl = getApiUrl();
export const appTrpc = createTRPCProxyClient<AppRouter>({
	transformer: superjson,
	links: [
		loggerLink({
			enabled: opts =>
				(process.env.NODE_ENV === 'development'
					&& typeof window !== 'undefined')
				|| (opts.direction === 'down' && opts.result instanceof Error),
		}),
		errorHandleLink,
		httpLink({
			url: `${TrpcUrl}/api/frontend/trpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
				}).then(async (res) => {
					if (res.url.includes('user.details')) {
						const xTag = res.headers.get('X-Tag')
						xTag && saveUserTag(xTag)
					}
					return res
				})
			},
			async headers(op) {
				const traceId = getTraceID()
				op.op.context.traceId = traceId
				const appStore = useAppStore()
				const tenantStore = useTenantStore()
				const systemStore = useSystemStore()
				const lang = await appStore.getLocale()
				const xTag = await getUserTag()

				const grayOption = isGray() ?
					{
						'X-Gray': 'true',
					} : {}
				return {
					'Authorization': `Bearer ${appStore.token}`,
					'tenantId': tenantStore.tenantId,
					'channelId': appStore.channelId,
					'X-Trace-ID': traceId,
					'X-Device-Type': systemStore.app?.build || 'unKnown',
					'X-Device-Id': systemStore.deviceId || 'unKnown',
					'Client-Language': lang,
					'X-Tag': xTag,
					...grayOption,
					'X-Client-Version': version,
				}
			},
		}),
	],
})

/**
 * 路由输入类型: docs: https://trpc.io/docs/client/react/infer-types
 */
export type RouterInput = inferRouterInputs<AppRouter>
/**
 * 路由输出类型 docs: https://trpc.io/docs/client/react/infer-types
 */
export type RouterOutput = inferRouterOutputs<AppRouter>
