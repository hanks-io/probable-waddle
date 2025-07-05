import {
  WithdrawCreateParams,
} from '@/api/assets/model'
import { showToast, truncateText } from '@/utils'
import { useCPFInfoConfirmAgain } from '@/hooks/useCPFInfoConfirmAgain'
import type { ValidatorParams } from '@/hooks/useCPFInfoConfirmAgain'
import { paybetAccountInfo } from '@/views/withdraw/main/hooks/usePaybet'
export const withdrawCreateParams = reactive<WithdrawCreateParams>({
  // 提现参数
  amount: 0,
  withdrawalType: 'withdrawal',
  tenantWithdrawTypeId: 0,
  bankAccount: undefined,
  tenantWithdrawTypeSubId: 0,
  withdrawalAccount: '',
  realName: '',
  cpf: '',
  password: '',
})
export const accountList = ref<any[]>([])
export const subTabCode = ref<string>('')  //小类id
export const formEl = ref(null)
export const accountEl = ref(null)
export const confirmModalVisible = ref(false) // 确认提现弹窗状态
const withdrawalConfigList = ['BindFirst', 'WithdrawFirst'] as const
type WithdrawalConfigType = (typeof withdrawalConfigList)[number]

export const useUserInputData = () => {
  const withdrawStore = useWithdrawStore() // 提现信息
  const tenantStore = useTenantStore() // 商户信息
  const withdrawalConfig = computed(() => tenantStore.withdrawalConfig) // 提现配置
  const { accountItems, } = toRefs(withdrawStore)
  const isNeedValidatorCPF = computed(() => !accountItems.value.some((it: any) => it.code === 'CPF'))
  const isNeedValidatorCNPJ = computed(() => !accountItems.value.some((it: any) => it.code === 'CNPJ'))

  const currentRegionCode = computed(() => tenantStore.tenantInfo?.code); // 租户信息

  const getBindFirstData = () => {
    if (!accountList.value.length) {
      showToast(`${t('viewsAssets.appendTip')}`)
      return true
    }
    let values = accountEl.value?.getAccountValue()
    withdrawCreateParams.withdrawalAccount = values.account
    withdrawCreateParams.realName = truncateText(values.realName?.trim())
    withdrawCreateParams.bankAccount = values.bankAccount
    withdrawCreateParams.tenantWithdrawTypeSubId = values.tenantWithdrawTypeSubId
    withdrawCreateParams.cpf = undefined

    return false
  }
  const handlePIX = () => {
    let isValid = formEl.value?.validate()
    if (!isValid) return true
    let values = formEl.value?.getFormValue()
    withdrawCreateParams.withdrawalAccount = subTabCode.value === 'CPF' ? values.cpf : values.withdrawalAccount
    withdrawCreateParams.realName = truncateText(values.realName)
    withdrawCreateParams.cpf = values.cpf
    return false
  }
  const handlePaybet = () => {
    if (!paybetAccountInfo.value.walletUserId) return true
    const cpfInfoMap = accountItems.value.reduce((map: Map<string, string>, item: {code: string, value: string}) => {
      if (["REALNAME", "CPF"].includes(item.code)) {
        map.set(item.code, item.value)
      }
      return map
    }, new Map())
    console.log(cpfInfoMap, 'cpfInfoMap')
    withdrawCreateParams.withdrawalAccount = paybetAccountInfo.value.accountInfo
    withdrawCreateParams.realName = cpfInfoMap.get('REALNAME')
    withdrawCreateParams.cpf =  cpfInfoMap.get('CPF')
    return false
  }
  const getWithdrawFirstData = (subTabId: number) => {
    const getDataMap = {
      'PAYBETWALLET': handlePaybet,
      'PIX': handlePIX,
    }
    withdrawCreateParams.tenantWithdrawTypeSubId = subTabId
     
    return (getDataMap[subTabCode.value as keyof typeof getDataMap] || getDataMap['PIX'])()

  }

  const getUserInputDataMap: Record<WithdrawalConfigType, (subTabId: number) => boolean> = {
    BindFirst: getBindFirstData,
    WithdrawFirst: getWithdrawFirstData,
  }

  const getValidateCode = (): [Map<string, string>, boolean] => {
    if (!currentRegionCode.value !== "PH") return [new Map(), false]
    const params = new Map([
      ['cpf', ''],
      ['name', ''],
    ])
    if (subTabCode.value === 'CNPJ') {
      params.set('cnpj', "")
    }
    let isNeed = true
    if (!accountItems.value.length) return [params, isNeed]
    const codeMap: ReadonlyMap<string, string> = new Map([
      ['CPF', 'cpf'],
      ['CNPJ', 'cnpj'],
      ['REALNAME', 'name'],
    ])
    accountItems.value.forEach((item: any) => {
      if (codeMap.has(item.code)) {
        params.delete(codeMap.get(item.code)!)
      }

    })

    isNeed = params.size > 0

    return [params, isNeed]
  }

  const getUserInputData = (tabId: number, subTabId: number, amount: number) => {
    const isNotValidate = getUserInputDataMap[withdrawalConfig.value as WithdrawalConfigType](subTabId)
    if (isNotValidate) return true

    withdrawCreateParams.amount = amount  // 设置输入框金额
    withdrawCreateParams.tenantWithdrawTypeId = tabId

    const [params, isNeed] = getValidateCode()
    if (isNeed) {
      const valueMap: ReadonlyMap<string, string> = new Map([
        ['cpf', withdrawCreateParams.cpf!],
        ['cnpj', subTabCode.value === 'CPF' ? '' : withdrawCreateParams.withdrawalAccount!],
        ['name', withdrawCreateParams.realName!],
      ])
      valueMap.forEach((value, key) => {
        if (value && params.has(key)) {
          params.set(key, value)
        }

      })
      if (subTabCode.value === 'CNPJ') {
        params.set('name', valueMap.get('name')!)
      }

      const validatorParams = {
        cb: () => confirmModalVisible.value = true,
        ...Object.fromEntries(params)
      }
      useCPFInfoConfirmAgain(validatorParams)
      return true
    }


    return false
  }

  return {
    getUserInputData,
  }

}
