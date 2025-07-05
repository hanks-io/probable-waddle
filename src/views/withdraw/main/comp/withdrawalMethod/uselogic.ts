import { validateEmail, validatePhone, validateCpf, validateCnpj, validateEvp } from '@/utils/custom'
import { onBeforeRouteLeave } from 'vue-router';
import { getTheme } from '@/theme/hooks'
import useSpecialChar from '../../../hooks/useSpecialChar'
import { REAL_NAME_LEN } from '../../../constant'
export interface Props {
  dynamicType: string
  typeId: number
}
export default (props: Props) => {


  const tenantStore = useTenantStore()
  const { theme } = getTheme()
  const withdrawalAccountEL = ref(null)
  const realName = ref('')
  const realNameEl = ref<null | HTMLElement>(null)
  const cpf = ref<undefined | number>(undefined)
  const cpfEl = ref(null)
  const formEl = ref<null | HTMLElement>(null)
  const language = computed(() => tenantStore.tenantInfo?.language) // 语言
  const withdrawStore = useWithdrawStore() // 提现信息
  const statusInfo = reactive({
    cpfReadonly: false,
    nameReadonly: false,
    accountReadonly: false,
  })
  // removeValid
  const { accountItems } = toRefs(withdrawStore)
  const inputInfo: Record<string, any> = {
    PHONE: { label: 'phone', placeholder: 'tipPhone', errorText: 'invalidPhone', type: 'phone', typeDefault: 'text', rule: { minlength: 11, maxlength: 11 }, validate: validatePhone },
    EMAIL: { label: 'email', placeholder: 'tipEmail', errorText: 'invalidEmail', type: 'email', typeDefault: 'text', rule: { maxlength: 36 }, validate: validateEmail },
    CNPJ: { label: 'cnpj', placeholder: 'tipCNPJ', errorText: 'invalidCNPJ', type: 'cnpj', typeDefault: 'tel', rule: { minlength: 14, maxlength: 14, hideCurrency: true }, validate: validateCnpj },
    EVP: { label: 'evp', placeholder: 'tipEVP', errorText: 'invalidEVP', type: 'evp', typeDefault: 'tel', rule: { minlength: 36, maxlength: 36 }, validate: validateEvp },
  }

  const accountInfo = reactive<Record<string, any>>({
    PHONE: null,
    EMAIL: null,
    CNPJ: null,
    EVP: null
  })

  const current = computed(() => {
    if (props.dynamicType in inputInfo) {
      return inputInfo[props.dynamicType]
    }

    return null

  })

  const currentReadonly = computed(() => {
    if (current.value) {
      return accountItems.value.some((it: any) => it.tenantWithdrawTypeId === props.typeId && it.code === props.dynamicType)
    }
    return false
  })

  const getValue = (type: string) => (
    accountItems.value.find((it: any) => it.tenantWithdrawTypeId === props.typeId && it.code === type)?.value ?? ""

  )

  const nameInit = () => {
    realName.value = ''
    statusInfo.nameReadonly = false
  }
  const cpyInit = () => {
    statusInfo.cpfReadonly = false
    cpf.value = undefined
  }
  const accountInit = () => {
    for (let key in accountInfo) {
      accountInfo[key] = null
    }
    statusInfo.accountReadonly = false

  }
  const init = () => {
    nameInit()
    accountInit()
    cpyInit()

  }

  onBeforeRouteLeave(() => {
    withdrawStore.accountItems = []
    init()
  })

  /**
 * @description 添加错误提示
 */
  const addErrTip = () => {
    nextTick(() => {
      if (typeof withdrawalAccountEL.value?.addErrTip === 'function') {
        withdrawalAccountEL.value?.addErrTip()
      } else {

        withdrawalAccountEL.value.$el.classList.add('ion-invalid', 'ion-touched')
      }

    })
  }

  /**
   * @description 移除成功
   */
  const removeStatus = () => {
    nextTick(() => {
      if (typeof withdrawalAccountEL.value?.removeStatus === 'function') {
        withdrawalAccountEL.value?.removeStatus()

      } else {
        withdrawalAccountEL.value.$el.classList.remove('ion-valid', 'ion-invalid', 'ion-touched')
      }

    })
  }

  const valiDateAccount = (currentValue: string, type: string) => {
    if (currentValue) {
       inputInfo[type].validate(currentValue) ? removeStatus() : addErrTip()
    } else {
      removeStatus()

    }

  }
  watch([() => props.dynamicType, () => props.typeId, () => accountItems.value], (newVale) => {

    let [type, typeId, list] = newVale


    if (!type) return
    //  用户没有提过款的业务逻辑

    if (type && type in inputInfo && !list.length) {

      if (typeof type === 'string' && type in accountInfo) {
        let currentValue = accountInfo[type]
        valiDateAccount(currentValue, type)
      }
      return
    }

    //   用户有提款成功的业务逻辑
    let realNameValue = getValue("REALNAME")
    if (realNameValue) {
      statusInfo.nameReadonly = true
      if (realName.value !== realNameValue) {
        realName.value = realNameValue
      }
    }
    let currentValue = getValue(type)
    let cpfValue = null

    if (type in inputInfo) {
      if (currentValue) {
        accountInfo[type] = currentValue
        statusInfo.accountReadonly = true
      } else {
        let val = accountInfo[type]
        valiDateAccount(val, type)
        statusInfo.accountReadonly = false

      }

      cpfValue = getValue("CPF")


    } else {
      cpfValue = currentValue
    }

    if (cpfValue) {
      if (cpf.value !== cpfValue) {
        statusInfo.cpfReadonly = true
        cpf.value = cpfValue
      }

    }

  }, { immediate: true })








  const getFormValue = () => {

    return {
      withdrawalAccount: accountInfo[props.dynamicType],
      realName: realName.value,
      cpf: cpf.value
    }

  }
  const handleInput = (event: CustomEvent) => {
    setTimeout(() => {
      realName.value = useSpecialChar(event)
    }, 0)
  }



  return {
    formEl,
    cpfEl,
    realNameEl,
    withdrawalAccountEL,
    realName,
    current,
    cpf,
    statusInfo,
    accountInfo,
    inputInfo,
    theme,
    REAL_NAME_LEN,
    currentReadonly,
    getFormValue,
    handleInput,
    valiDateAccount,
  }

}
