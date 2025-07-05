import axios from 'axios'
import { emitter } from '../event'
import { AdConfigMap, AdTypes } from './adTypes'
import { useEventStore } from '@/store/event'
import { useChannelStore } from '@/store/channel'
import { getApiUrl } from '../apiUrl'
import { isGray } from '@/utils/app'
import { isInIframe, delay } from '@/utils'
import { updateFirstRechargeStatusApi } from "@/api/personal";
import { useUserStore } from "@/store/user";
import { v4 as uuidv4 } from 'uuid';
import { logPixelReport } from '@/utils';

axios.defaults.headers.common['X-Gray'] = isGray()
const queue: {
	userId: number
	tenantId: number
	amount: number
	changeTwoType: string
	currency: string
	isFirstRecharge: boolean
	orderNo: string
}[] = []
let isProcessing = false;

const pixelTrackerList = {
	"Facebook": fbqTrackEvent,
	"TikTok": ttqTrackEvent,
	"Kwai": kwaiTrackEvent,
	"GTM": gtmTrackEvent,
	"MgSkyAds": mgSkyTrackEvent,
	"IOSShelfPackage": androidTrackEvent,
	"APK": androidTrackEvent,
	"ShelfPackage": androidTrackEvent,
}

// 获取当前链接的像素ID
function getUrlPixelId(): string {
	let pixelIds: string[] = [];
	const keys = ['kwaiId', 'fbPixelId', 'ttPixelId', 'bgPixel', 'gtagId', 'mgSkyPixelId'];
	const urlParams = new URLSearchParams(window.location.search);
	keys.forEach(key => {
		const id = localStorage[key] || urlParams.get(key)
		id && (pixelIds.push(id))
	});
	return pixelIds.toString()
}

export function registerTrackEvents() {
	emitter.on('user/login', (data) => {
		trackEvent('login', data)
	})
	emitter.on('user/logout', (data) => {
		trackEvent('logout', data)
	})
	emitter.on('user/register', async (data) => {
		await delay(500)
		trackEvent('register', data)
	})
	emitter.on('user/registerClick', (data) => {
		trackEvent('registerClick', data)
	})
	emitter.on('user/start-pay', async (data) => {
		trackEvent('addToCart', data)
		await delay(1000)
		trackEvent('initiateCheckout', data)
	})
	emitter.on('user/play-game', (data) => {
		trackEvent('playGame', data)
	})
	emitter.on('user/download', (data) => {
		trackEvent('download', data)
	})
	emitter.on('user/installPWA', (data) => {
		trackEvent('installPWA', data)
	})
	emitter.on('user/openPWA', (data) => {
		trackEvent('openPWA', data)
	})

	emitter.on('user/recharge-ad-report', (data) => {
		queue.push(data)
		handleRechargeAdReport()
	})

	// 添加消息监听
	window.addEventListener('message', (event) => {
		if (event.data?.type === 'TRACK_EVENT') {
			const { type, data } = event.data.payload
			// 确保不是在 iframe 中才执行追踪
			if (!isInIframe()) {
				// 直接调用追踪事件
				const pointType = useChannelStore().channelConfig?.pointType;
				const tracker = pixelTrackerList?.[pointType]
				if (tracker) {
					tracker(type, data)
				}
			}
		}
	})
}

// 像素回传上报成功
async function updatePixelReportSuccess(orderNo: string) {
	await axios
		.post(`${getApiUrl()}/api/frontend/pusher/ad-report-success`, {
			orderNo,
		})
		.catch((e) => {
			console.error('ad-report-success error', e)
		})
		.then(() => {
			console.log('ad-report-success success')
		})
}

// 更新像素上报状态
async function updateReportStatus(eventType: AdTypes, data: { userId: string; orderNo: string }) {
	if (eventType === "firstpay") {
		useUserStore().setFirstRechargeStatus(true);
		await Promise.allSettled(
			[
				await updateFirstRechargeStatusApi(),
				await updatePixelReportSuccess(data.orderNo),
				logPixelReport(eventType, {
					pixelId: getUrlPixelId() || `UID-${uuidv4()}`,
					userId: data.userId,
					orderNo: data.orderNo
				})
			]
		)
	} else if (eventType === "register") {
		logPixelReport(eventType, {
			pixelId: getUrlPixelId() || `UID-${uuidv4()}`,
			userId: data.userId,
		})
	}
}

async function handleRechargeAdReport() {
	if (isProcessing) return
	isProcessing = true

	const data = queue.shift()
	if (!data) return isProcessing = false
	const hasReported = await useEventStore().checkOrder(data.orderNo)
	if (hasReported) {
		console.log('orderNo has been reported', data.orderNo)
		return isProcessing = false
	}
	if (data.isFirstRecharge) {
		await trackEvent('firstpay', data)
		await delay(500)
		await trackEvent('pay', data)
	}

	isProcessing = false
	if (queue.length) {
		handleRechargeAdReport()
	}
}

async function trackEvent(type: AdTypes, data: any) {
	if (isInIframe()) {
		// 如果在 iframe 中，发送消息到父窗口
		window.parent.postMessage({
			type: 'TRACK_EVENT',
			payload: {
				type,
				data
			}
		}, '*')
	} else {
		// 直接调用追踪事件
		const pointType = useChannelStore().channelConfig?.pointType;
		const tracker = pixelTrackerList?.[pointType]
		if (tracker) {
			await tracker(type, data)
		}
	}
}

async function fbqTrackEvent(type: AdTypes, data: any) {
	// @ts-ignore
	if (!window.fbq || !AdConfigMap[type].fbq.event || AdConfigMap[type].fbq.event === '') return
	// @ts-ignore
	fbq('track', AdConfigMap[type].fbq.event, mappedData(AdConfigMap[type].fbq.dataMapping, data))
	await updateReportStatus(type, data)
}

async function ttqTrackEvent(type: AdTypes, data: any) {
	// @ts-ignore
	if (!window.ttq || !AdConfigMap[type].ttq.event || AdConfigMap[type].ttq.event === '') return
	// @ts-ignore
	ttq.track(AdConfigMap[type].ttq.event, {
		content_id: data?.userId || '',
		...mappedData(AdConfigMap[type].ttq.dataMapping, data),
	})
	await updateReportStatus(type, data)
}

async function kwaiTrackEvent(type: AdTypes, data: any) {
	// @ts-ignore
	if (!window.kwaiq || !AdConfigMap[type].kwai.event || AdConfigMap[type].kwai.event === '') return
	// @ts-ignore
	kwaiq
		// @ts-ignore
		.instance(window.kwaiId)
		.track(AdConfigMap[type].kwai.event, mappedData(AdConfigMap[type].kwai.dataMapping, data))
	await updateReportStatus(type, data)
}

async function gtmTrackEvent(type: AdTypes, data: any) {
	// @ts-ignore
	if (!window.dataLayer || !AdConfigMap[type].gtm.event || AdConfigMap[type].gtm.event === '') return
	// @ts-ignore
	window.dataLayer.push({
		event: AdConfigMap[type].gtm.event,
		...mappedData(AdConfigMap[type].gtm.dataMapping, data),
	})
	await updateReportStatus(type, data)
}

async function androidTrackEvent(type: AdTypes, data: any) {
	// @ts-ignore
	if (!window.jsBridge || !AdConfigMap[type].android.event || AdConfigMap[type].android.event === '') return
	const info = data ? { ...mappedData(AdConfigMap[type].android.dataMapping, data), success: 1 } : {}
	const jsonStr = JSON.stringify(info)
	// @ts-ignore
	window.jsBridge.postMessage(AdConfigMap[type].android.event, jsonStr)
	await updateReportStatus(type, data)
}

async function mgSkyTrackEvent(type: AdTypes, data: any) {
	// @ts-ignore
	if (!window._atTag || !AdConfigMap[type].mgSky.event || AdConfigMap[type].mgSky.event === '') return
	// @ts-ignore
	window._atTag.push({
		eid: AdConfigMap[type].mgSky.event,
		...mappedData(AdConfigMap[type].mgSky.dataMapping, data),
	})
	await updateReportStatus(type, data)
}

function mappedData(dataMapping: any, data: any) {
	return Object.keys(dataMapping).reduce((acc, key) => {
		if (dataMapping[key] && Object.prototype.hasOwnProperty.call(data, key)) {
			const mappedKey = dataMapping[key]
			acc[mappedKey] = data[key]
		}
		return acc
	}, {} as any)
}


