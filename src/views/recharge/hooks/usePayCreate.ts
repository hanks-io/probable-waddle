
import { PayCreateParams } from '@/api/assets/model'
import { RedirectUrl } from '@/common/data'
import { payCreateApi } from '@/api/assets'
import { PopupType } from '@/components/Popup/data';
import router from '@/router'
import { showPopup } from '@/hooks/ShowPopup'
import { emitter } from '@/utils/event'
import type { Time } from '@/utils/date'
import {  getLocalTime } from '@/utils/date'
import dayjs from 'dayjs';
import { moneyConvertToClient } from '@/utils'
// TRANSFER
const codeList = [2001, 2002, 2003] as const
const bindCPFInfoList = ["cpf", "realName", "phone", 'email'] as const
const { t } = useI18n();
type codeType = typeof codeList[number]
export type bindCPFInfoType = typeof bindCPFInfoList[number]
export type processModeType = PayCreateParams['processMode']
export interface PayResultType {
  code: codeType
  payUrl: string
  orderNo: string
  redirectType?: string
  msg: string
  createTime: Time
  expireTime: Time
  message?: string
}

export const needBindCPFInfoList = ref<bindCPFInfoType[]>([])
export const payCreateParams = reactive<PayCreateParams>({
  // 创建充值订单网络接口参数
  amount: 0,
  processMode: 'THREE_PARTY_PAYMENT',
  payTypeSubId: 0,
  participateReward: false,
  lobbyUrl: RedirectUrl,
  bankCode: '',
})
export const btnLoading = ref(false) // 按钮loading状态
const bindDataMap: Record<string, bindCPFInfoType> = {
  "needCPF": "cpf",
  "needPhone": "phone",
  "needRealName": "realName",
  "needEmail": "email",
}

const handleCode2001 = () => {
  showPopup({
    type: PopupType.TIPS,
    msg: t('viewsAssets.rechargeTips01'),
    showRightBtn: true,
    leftBtnText: t('viewsAssets.rechargeTips02'),
    rightBtnText: t('viewsAssets.rechargeTips03'),
    leftBtnCallback: () => {
      router.push('/rechargeRecord')
    },
  })
}

const handleCode2002 = (res: PayResultType) => {
  const needBindCPFInfo = JSON.parse(res.msg)
  needBindCPFInfoList.value = []
  for (const key in needBindCPFInfo) {
    if (!needBindCPFInfo[key]) continue
    needBindCPFInfoList.value.push(bindDataMap[key])
  }
  router.push(`/bindCPF/${payCreateParams.processMode}`)
}
const handleCode2003 = (res: PayResultType) => {
  const truncateText = (text: string, maxLength = 200) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  }
  showPopup({
    type: PopupType.EXCEPTION,
    msg: t('toast.0002', { errMsg: truncateText(res.msg) }),
    showRightBtn: true,
    leftBtnText: t('viewsAssets.suporteOnline'),
    rightBtnText: t('viewsAssets.rechargeTips03'),
    leftBtnCallback: () => {
      router.push('/notification')
    },
  })
}

const startPay = () => {
  const userStore = useUserStore()
  const tenantStore = useTenantStore() // 商户Store
  emitter.emit('user/start-pay', {
    userId: userStore.user!.userId,
    tenantId: Number(tenantStore.tenantId),
    amount: payCreateParams.amount / 100,
    currency: tenantStore.tenantInfo?.currency || 'USD',
  })
}

const codeMap: Record<codeType, (res: PayResultType) => void> = {
  2001: handleCode2001,
  2002: handleCode2002,
  2003: handleCode2003,
}
/**
* @description 调用接口-创建充值订单
*/

export default async (handleProcessModeCb: (params: PayResultType) => void) => {

  if (btnLoading.value) return
  btnLoading.value = true
  try {
    const res = await payCreateApi(payCreateParams) // 调用接口-创建充值订单
    const rechargeStore = useRechargeStore()
    const orderNo = res.orderNo
    const expireTime = dayjs(res.expireTime).diff(dayjs(res.createTime), 's')
    const createTime = getLocalTime(res.createTime, 'YYYY-MM-DD HH:mm:ss') as string
    rechargeStore.QRCodeInfo = {
      ...rechargeStore.QRCodeInfo, 
      QRCode: res.payUrl,
      orderNo,
      expireTime,
      createTime,
      amount: moneyConvertToClient(res.amount),
    }

    rechargeStore.orderInfo = {
      ...rechargeStore.orderInfo, 
      orderNo,
      expireTime,
      createTime,
    }
    // 特殊code处理 2001: 未完成订单限制 2002: 绑定CPFID
    if (res.code && codeList.includes(res.code)) {
      const code = res.code as codeType
      codeMap[code](res)
      return

    }
    handleProcessModeCb(res as PayResultType)
    startPay()
  } catch (error) {
    console.error(error)
    btnLoading.value = false
  } finally {
    setTimeout(() => {
      btnLoading.value = false
    }, 2000)
  }

}
