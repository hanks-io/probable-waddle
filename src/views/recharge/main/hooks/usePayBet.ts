import { queryWalletBalanceApi, getWalletHallApi } from "@/api/assets/index"
import type { processModeType } from '@/views/recharge/hooks/usePayCreate'
import { payCreateParams } from '@/views/recharge/hooks/usePayCreate'
import { convertMoneyToShow } from '@/utils';
import { openUrl } from "@/utils"
import { needBindCPFInfoList } from '@/views/recharge/hooks/usePayCreate'
import type { bindCPFInfoType } from '@/views/recharge/hooks/usePayCreate'
import router from '@/router'
import { debounce, } from '@/utils'
export const payBetBalance = ref<string>('0.00')
export const walletCode = ref<string>('')
export const is_THREE_PARTY_WALLET = ref<boolean>(false)
export const isCompleted = ref<boolean>(false)
export const isHasAccount = ref(false)

interface useWalletParams {
  walletCode: string
  processCode: processModeType
}
const bindWalletAccount = (list: string[],  key: processModeType | 'enterWallet') => {
  const codeMap: Record<string, bindCPFInfoType> = {
    "CPF": "cpf",
    "REALNAME": "realName",
  }
  needBindCPFInfoList.value = list.map(item => codeMap[item])
  router.push(`/bindCPF/${key}`)

}
export const queryWalletBalance = debounce( async (code: string = walletCode.value,  isBindAccount: boolean = true) => {
  if (!code) return
  isCompleted.value = true
  try {
    const result = await queryWalletBalanceApi(code)
    payBetBalance.value = convertMoneyToShow(result.balance || 0)
    const codeMap = {
      FAIL: () =>  {
        isHasAccount.value = false
        isBindAccount ? bindWalletAccount(result.msg, "THREE_PARTY_WALLET") : null
      },
      SUCCESS: () => {
        isHasAccount.value = true
      }
    }

    if (result.code && result.code in codeMap) {
      codeMap[result.code as keyof typeof codeMap]();
    }

  } catch (error) {
    payBetBalance.value = "0.00"
  } finally {
    isCompleted.value = false

  }

}, 300)




const handleRedirect = (url: string) => {
  const systemStore = useSystemStore();
  systemStore.isIOS ? location.href = url : openUrl(url, 'OPEN_URL')

}
export const enterWallet = debounce(async (code: string = walletCode.value) => {
  if (!code) return
  const res = await getWalletHallApi(code)

  const codeMap = {
    FAIL: () => bindWalletAccount(res.msg, "enterWallet"),
    SUCCESS: () => {
      handleRedirect(res.hallUrl)
    }
  }
  if (res.code && res.code in codeMap) {
    codeMap[res.code as keyof typeof codeMap]();
  }
}, 300)




export const useWallet = async (params: useWalletParams) => {
  payCreateParams.processMode = params.processCode
  walletCode.value = params.walletCode

  queryWalletBalance(params.walletCode, false)


}


