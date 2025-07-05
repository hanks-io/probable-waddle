import { useThreePartyPayment } from '@/views/recharge/hooks/useThreePartyPayment'
import type { PayResultType, processModeType } from '@/views/recharge/hooks/usePayCreate'
import handlePayCreate, { payCreateParams } from '@/views/recharge/hooks/usePayCreate'
import { showLoading } from '@/utils/loading'
import { payConfirmApi, updateVoucherApi, payAgainApi } from '@/api/assets'
import router from '@/router'
import { showToast } from '@/utils'
import { delay } from '@/utils/delay'
import dayjs from 'dayjs'
import { getLocalTime } from '@/utils/date'
interface CBParams {
	THREE_PARTY_PAYMENT?: (result: PayResultType) => void
	TRANSFER?: (result: PayResultType) => void
}
export const usePay = (amountInput: string, cbParams?: CBParams) => {
	const rechargeStore = useRechargeStore()
	const { channelId, channelMap } = toRefs(rechargeStore)
	const handleThreePartyPayment = (result: PayResultType) => {
		const res = useThreePartyPayment(result.payUrl, result.redirectType)
		console.log(res, 'res')
		rechargeStore.thirdUrl = res?.url
		rechargeStore.isQRCode = res.isQRCode
		rechargeStore.orderNo = result.orderNo
		cbParams?.THREE_PARTY_PAYMENT?.(result)
	}
	const handleTransferPayment = (result: PayResultType) => {
		const { transferRealName, transferCompany, transferAccount, qrCodeUrl } = channelMap.value.get(channelId.value)
		rechargeStore.orderInfo = {
			...rechargeStore.orderInfo,
			transferRealName,
			transferCompany,
			transferAccount,
			qrCodeUrl,
			voucher: '',
			isTransfer: true,
			payerRealName: '',
			transferVoucher: '',
			payerName: '',
			status: 'BE_PAID',
		}
		cbParams?.TRANSFER?.(result)
		rechargeStore.isOpenOrderModal = true
	}
	const processModeMap: Record<processModeType, (params: PayResultType) => void> = {
		THREE_PARTY_PAYMENT: handleThreePartyPayment,
		TRANSFER: handleTransferPayment,
		THREE_PARTY_WALLET: handleThreePartyPayment,
	}
	rechargeStore.QRCodeInfo.amount = amountInput
	rechargeStore.orderInfo.amount = `${Number(amountInput) * 100}`
	handlePayCreate(processModeMap[payCreateParams.processMode])
}

/**
 * @description 调用接口: 确认充值订单
 */
export const confirmTransferOrder = async () => {
	const rechargeStore = useRechargeStore()
  const tenantStore = useTenantStore()
	const { transferConfig, orderInfo } = toRefs(rechargeStore)
	if (orderInfo.value.isTransfer) {
		if (transferConfig.value.transferNameRequired === 'ON') {
			if (!orderInfo.value.payerName) {
				showToast('depositWithdrawal.000032')
				return false
			}
		}
		if (!orderInfo.value.voucher) {
			showToast('depositWithdrawal.000028')
			return false
		}
	
		await updateVoucherApi({
			tenantId: Number(tenantStore.tenantId),
			orderNo: rechargeStore.orderInfo.orderNo,
			transferVoucher: rechargeStore.orderInfo.voucher,
			payerRealName: rechargeStore.orderInfo.payerName,
		})
	}
	const res = await payConfirmApi({ orderNo: rechargeStore.orderInfo.orderNo })
	if (res && 'status' in res) {
		showToast('status.SUCCESS')

		return true
	}
	return false
}
export const continuePayHandle = async () => {
	const rechargeStore = useRechargeStore()
	const result = (await payAgainApi({ orderNo: rechargeStore.orderNo })) as PayResultType

	if (result && 'message' in result) {
		showToast(result.message ?? '')
		return false
	}
	if (result && 'payUrl' in result) {
		const res = await useThreePartyPayment(result.payUrl, result.redirectType)
		rechargeStore.isQRCode = res.isQRCode
		rechargeStore.thirdUrl = res.url
		if (res.isQRCode) {
			console.log(
				(getLocalTime(result.expireTime) as dayjs.Dayjs).unix() -
					(getLocalTime(result.createTime) as dayjs.Dayjs).unix(),
				'result',
			)
			rechargeStore.QRCodeInfo = {
				QRCode: result.payUrl,
				orderNo: result.orderNo,
				expireTime: dayjs(result.expireTime).diff(dayjs(result.createTime), 's'),
				createTime: getLocalTime(result.createTime, 'YYYY-MM-DD HH:mm:ss') as string,
				amount: `${Number(rechargeStore.orderInfo.amount) / 100}`,
			}
		}
		return true
	}
	return false
}
