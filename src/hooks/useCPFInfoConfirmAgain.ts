
import { PopupType } from '@/components/Popup/data';
import { showPopup } from '@/hooks/ShowPopup'
import { omit } from '@/utils'

const operationList = ['recharge', 'withdraw']
export type OperationType = typeof operationList[number]
export interface ValidatorParams {
  cpf?: string
  name?: string
  cnpj?: string
  cb: () => void
}

export const useCPFInfoConfirmAgain = (params: ValidatorParams, operationType: OperationType = 'withdraw') => {
  const { t } = useI18n() // 国际化

  const labelMap: ReadonlyMap<keyof Omit<ValidatorParams, 'cb'>, string> = new Map([
    ['cpf', `${t('label.cpf')}`],
    ['cnpj', `${t('label.cnpj')}`],
    ['name', `${t('label.name')}`],
  ])

  const operationMap: ReadonlyMap<OperationType, string> = new Map([
    ['recharge', `${t('main.entrar')}`.toLowerCase()],
    ['withdraw', `${t('main.withdraw')}`.toLowerCase()],
  ])
  const list = (Object.keys(omit(params, 'cb')) as Array<keyof Omit<ValidatorParams, 'cb'>>).filter(item => params[item])
  let type = ''
  let info = ''
  const operation = operationMap.get(operationType)
  list.forEach((item, i) => {
    const label = labelMap.get(item)
    type +=`<span class="mr-0.5 font-medium">${label}${i === list.length - 1 ? '' : ','}</span>`
    info += `<div class="text-left mb-3 leading-4  "><span class="w-14 inline-block">${label}:</span><span class="mr-0.5 font-bold inline-block w-48">${params[item]}</span></div>`

  })

  let title = t('viewsAssets.validatorTip2', { type, operation })
  if (list.length === 1) {
    title = title.replace(/\b(are)\b/, 'is')
  }
  showPopup({
    type: PopupType.TIPS,
    msg: `<div class="mb-3 text-left">${title}</div>${info}`,
    showRightBtn: true,
    leftBtnCallback: params.cb,
    leftBtnText: t('viewsAssets.validatorTip3'),
    reverseBtn: true,
  })
}
