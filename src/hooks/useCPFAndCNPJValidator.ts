import { cpfValidator, cnpjValidator } from '@/utils/custom'
import { PopupType } from '@/components/Popup/data';
import { showPopup } from '@/hooks/ShowPopup'

const operationList = ['recharge', 'withdraw']
type OperationType = typeof operationList[number]
interface ValidatorParams {
  CPFValue: string
  CNPJValue?: string
  cb: () => void
}
const alreadyVerifiedlist: string[] = []

export const useCPFAndCNPJValidator = (params: ValidatorParams, operationType: OperationType = 'withdraw') => {
  console.log(params, 'ValidatorParams');
  const { t } = useI18n() // 国际化
  const { CPFValue, CNPJValue, cb } = params
  let type = ''
  const operation = operationType === 'recharge' ? `${t('main.entrar')}` : `${t('main.withdraw')}`
  const isAlreadyVerified = alreadyVerifiedlist.includes(CPFValue)
  if (isAlreadyVerified) {
    return true
  }


  if (CPFValue && !cpfValidator(CPFValue)) {
    alreadyVerifiedlist.push(CPFValue)
    type = "CPF"
  }





  if (CNPJValue && !cnpjValidator(CNPJValue)) {
    alreadyVerifiedlist.push(CNPJValue)
    type += " CNPJ"
  }


  if (!type) {
    return true
  }
  const rightBtnCallback = () => {
    const removeFromList = (value: string) => {
      const index = alreadyVerifiedlist.findIndex(item => item === value)
      if (index >= 0) {
        alreadyVerifiedlist.splice(index, 1)
      }
    }

    if (type.includes('CPF')) {
      removeFromList(CPFValue)
    }
    if (type.includes('CNPJ')) {
      removeFromList(CNPJValue!)
    }

  }
  showPopup({
    type: PopupType.TIPS,
    msg: t('viewsAssets.validatorTip', { type, operation }),
    showRightBtn: true,
    leftBtnCallback: cb,
    rightBtnCallback: rightBtnCallback,
    reverseBtn: true,
  })

  return false
}
