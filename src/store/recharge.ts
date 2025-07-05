import { defineStore } from 'pinia'
import { AssetsTabInfo } from '@/views/withdraw/type'
const rechargeModeList = ["ConfigCycle", "NoCycle"] as const
export type rechargeModeType = typeof rechargeModeList[number]
export interface BankInfoType {
  name: string
  id: number,
  logo: string,
  code: string,
}
interface TransferConfigType {
  showTransferName: "OFF" | "ON",
  showTransferVoucher: "OFF" | "ON",
  transferNameRequired: "OFF" | "ON",
  transferOrderRequired: "OFF" | "ON",
}
export const useRechargeStore = defineStore({
  id: 'recharge',
  state: () => ({
    typeId: 0,
    subTypeId: 0,
    QRCodeInfo: {
      orderNo: '',
      QRCode: '',
      expireTime: 0,
      createTime: '',
      amount: '',
    },
    rechargeMode: 'ConfigCycle' as rechargeModeType,
    channelLoading: false,
    channelId: 0 as number,
    channelList: [] as AssetsTabInfo[],
    bankList: [] as BankInfoType[],
    channelMap: new Map<number, any>(),
    bankMap: new Map<number, BankInfoType[]>(),
    bankCode: '' as string,
    isOpenOrderModal: false as boolean,
    thirdUrl: '' as string,
    orderNo: '' as string,
    isQRCode: false as boolean,
    isFromActivity: false as boolean,
    transferConfig: {
      showTransferName: 'OFF',
      showTransferVoucher: 'OFF',
      transferNameRequired: 'OFF',
      transferOrderRequired: 'OFF',
    } as TransferConfigType,
    orderInfo: {
      amount: '',
      qrCodeUrl: '',
      transferAccount: '',
      transferCompany: '',
      transferRealName: '',
      transferVoucher: '',
      orderNo: '',
      expireTime: 0,
      createTime: '',
      voucher: '',
      payTypeName: '',
      isTransfer: false as boolean,
      status: '' as string,
      payerRealName: '',
      payerName: '',
    },
  }),
  getters: {
    isNoCycle(state) {
      console.log('state.rechargeMode', state.rechargeMode)
      return state.rechargeMode === 'NoCycle'
    },
  },

})
