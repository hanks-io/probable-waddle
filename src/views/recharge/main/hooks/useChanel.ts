import { payChannelListApi, getBankListApi } from '@/api/assets'
import { AssetsTabInfo } from '@/views/withdraw/type'
import type { processModeType } from '@/views/recharge/hooks/usePayCreate'
import type { BankInfoType } from '@/store/recharge'
import { pick } from '@/utils'
import { payCreateParams } from '@/views/recharge/hooks/usePayCreate'
export const payChannelChange = async (channelId: number, allowBankCode?: string) => {
  const rechargeStore = useRechargeStore()
  rechargeStore.channelId = channelId

  if (payCreateParams.processMode === 'THREE_PARTY_WALLET') return
  rechargeStore.bankCode = ''

  const { channelMap, bankMap, bankCode } = toRefs(rechargeStore)
  // If bank list already exists for this channel, use it
  let newBankCode = ''
  let bankList: any[] = bankMap.value.get(channelId) || [];
  if (bankList.length) {
    newBankCode = bankList.find((it: BankInfoType) => it.code === bankCode.value)?.code || bankList[0].code
  }
  rechargeStore.bankList = bankList
  rechargeStore.bankCode = newBankCode
  if (bankMap.value.has(channelId)) return;

  // Get bank list from API if needed
  let bankCodeToUse = allowBankCode
  if (!bankCodeToUse && channelMap.value.has(channelId)) {
    const target = channelMap.value.get(channelId)
    bankCodeToUse = target?.allowBankCode
  }

  // Fetch and store bank list if we have a bank code
  if (bankCodeToUse) {
    const result = await getBankListApi({ bankCodes: bankCodeToUse.split(',') })
    const bankList = result?.bankList?.map((it: BankInfoType) => pick(it, ['name', 'id', 'logo', 'code'])) as BankInfoType[]
    rechargeStore.bankList = bankList
    rechargeStore.bankCode = bankList.find((it: BankInfoType) => it.code === bankCode.value)?.code || bankList[0].code
    console.log(bankList, 'bankList')
    bankMap.value.set(channelId, bankList)
  }
}


export const useChanel = (payTypeSubId: number, processMode: processModeType) => {
  const rechargeStore = useRechargeStore()
  const { isNoCycle } = toRefs(rechargeStore)
  rechargeStore.bankList = []
  rechargeStore.bankCode = ''
  const emptyChannelTodo = () => {

    rechargeStore.channelId = 0
    rechargeStore.channelList = []
  }

  /**
 * @description 调用接口-获取充值渠道列表
 */
  const getPayChannelList = async (payTypeSubId: number) => {
    rechargeStore.channelLoading = true // 设置渠道加载状态

    try {
      const res = await payChannelListApi({ payTypeSubId }) // 调用接口-获取充值渠道列表
      if (!res.length) {
        return emptyChannelTodo()
      }
      const { channelId, allowBankCode } = res[0]

      //allowBankCode
      if (allowBankCode) {
        payChannelChange(channelId, allowBankCode)
      }

      rechargeStore.channelId = channelId
      const list: AssetsTabInfo[] = []
      res.forEach((it: any) => {
        const { tagValue, tags, channelId, channelName } = it
        const newTagValue = tags !== 'NOTHING' ? tags == 'GIVE_AWAY' ?
          `+${formatMoneyToShow(Number(tagValue), 2)}%` : t(`tags.${tags}`) : ''
        list.push({
          id: channelId,
          name: channelName,
          tagValue: newTagValue

        })

        rechargeStore.channelMap.set(it.channelId, { ...it })
      })
      rechargeStore.channelList = list

    } finally {
      rechargeStore.channelLoading = false // 设置渠道加载状态
    }
  }


  const processModeMap: Record<processModeType, () => void> = {
    'TRANSFER': () => {
      getPayChannelList(payTypeSubId)
    },

    'THREE_PARTY_PAYMENT': () => {
      if (isNoCycle.value) {
        getPayChannelList(payTypeSubId)
        return
      }

      emptyChannelTodo()
    }
  }
  processModeMap[processMode]?.()
}

