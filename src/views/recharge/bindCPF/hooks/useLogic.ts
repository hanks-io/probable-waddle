
import router from '@/router'
import type { PayResultType, bindCPFInfoType, processModeType } from '@/views/recharge/hooks/usePayCreate'
import handlePayCreate, { needBindCPFInfoList, btnLoading } from '@/views/recharge/hooks/usePayCreate'
import { REAL_NAME_LEN } from '@/views/withdraw/constant'
import { payBindCPFApi } from '@/api/assets'
import useSpecialChar from '@/views/withdraw/hooks/useSpecialChar'
import type { TInput } from '@/components/first/Input/type'
import { useThreePartyPayment } from '@/views/recharge/hooks/useThreePartyPayment'
import { useCPFInfoConfirmAgain } from '@/hooks/useCPFInfoConfirmAgain'
import type { ValidatorParams } from '@/hooks/useCPFInfoConfirmAgain'
import { truncateText } from '@/utils'
import { enterWallet, } from '@/views/recharge/main/hooks/usePayBet'

 const thirdUrl = ref("")
 const orderNo = ref("")
 const isQRCode = ref(false)


export default () => {
  const { t } = useI18n() // 国际化
  const formEl = ref<null | HTMLElement>(null)
  const CPFInfo = reactive<Record<string, string>>({});
  const CPFInfoRefs = ref<Record<string, HTMLElement>>({});
  const route = router.currentRoute
  const btnDisabled = computed(() => Object.values(CPFInfo).every((item) => item))
  const setItemRef = (el: HTMLElement | null, key: bindCPFInfoType) => {
    if (el) {
      CPFInfoRefs.value[key] = el
    }
  };
  let isLoading = false

  const inputInfo = {
    phone: { name: 'phone' as bindCPFInfoType, label: 'phone', placeholder: 'tipPhone', errorText: 'invalidPhone', type: 'phone' as TInput, rule: {} },
    email: { name: 'email' as bindCPFInfoType, label: 'email', placeholder: 'tipEmail', errorText: 'invalidEmail', type: 'email' as TInput, rule: { maxlength: 36 } },
    realName: { name: 'realName' as bindCPFInfoType, label: 'name', placeholder: 'tipName', errorText: 'invalidName', type: 'text' as TInput, rule: { maxlength: REAL_NAME_LEN } },
    cpf: { name: 'cpf' as bindCPFInfoType, label: 'cpf', placeholder: 'tipPayCPF', errorText: 'invalidCPF', type: 'cpf' as TInput, rule: { minlength: 11, maxlength: 11 } },
  }
  // 获取 inputInfo 的类型
  type InputInfoType = typeof inputInfo;

  // 获取 inputInfo 每一项的类型
  type InputItemType = InputInfoType[keyof InputInfoType]

  const handleThreePartyPayment = (result: PayResultType) => {
    const res = useThreePartyPayment(result.payUrl)
    const rechargeStore = useRechargeStore()
    rechargeStore.thirdUrl = res.url
    rechargeStore.isQRCode = res.isQRCode
    rechargeStore.orderNo = result.orderNo
    router.replace('/recharge/apply')



  }
  const clearBindCPFInfo = (isRemoveStatus: boolean = true) => {
    needBindCPFInfoList.value.forEach((item) => {
      Reflect.deleteProperty(CPFInfo, item);
      isRemoveStatus && CPFInfoRefs.value[item]?.removeStatus()
    })
  }

  const submitHandle = async (cb?: () => void) => {

    try {
      // //  真实姓名只保留128个字符
      if (CPFInfo.realName) {
        CPFInfo.realName = truncateText(CPFInfo.realName)
      }


      await payBindCPFApi(CPFInfo)
      cb?.()
      clearBindCPFInfo(false)
    } catch (error) {

      isLoading = false
    }
  }
  const submitHandlePayment = () => {

    submitHandle(() => handlePayCreate(handleThreePartyPayment).then(() => {
      isLoading = false
    }))
  }

  const submitHandleWallet = () => {
    submitHandle(() => {
      isLoading = false
      setTimeout(() => {
        router.back()
      }, 500)
    })

  }
  const enterWalletCb = () => {
    submitHandle(async () => {
      isLoading = false
      await enterWallet('PAYBETWALLET')
      router.back()

    })
  }
  const getCallbackAfterBinding = (processMode: processModeType) => {
    const callbackMap: Record<processModeType | 'enterWallet', () => void> = {
      'THREE_PARTY_PAYMENT': submitHandlePayment,
      'TRANSFER': () => {
        console.log('transfer')
      },
      'THREE_PARTY_WALLET': submitHandleWallet,
      'enterWallet': enterWalletCb
    }

    return callbackMap[processMode as processModeType]
  }

  const bindCPF = async () => {
    if (isLoading) return
    isLoading = true
    let nodeList = formEl.value?.querySelectorAll(".ion-invalid")
    if (nodeList && nodeList.length) {
      isLoading = false
      return false
    }
    const currentProcessMode = route.value.params.processMode as processModeType
    const callbackFn = getCallbackAfterBinding(currentProcessMode)
    const validatorParams: ValidatorParams = {
      cb: callbackFn,
      cpf: CPFInfo.cpf,
      name: CPFInfo.realName,
    }
    if (CPFInfo.cpf || CPFInfo.realName) {
      useCPFInfoConfirmAgain(validatorParams, 'recharge')
      isLoading = false
      return
    }

    callbackFn()

  }

  const handleInput = (event: CustomEvent, key: bindCPFInfoType) => {
    if (key !== 'realName') return
    setTimeout(() => {
      CPFInfo.realName = useSpecialChar(event)

    })
  }

  const genCPFInfo = (list: bindCPFInfoType[]) => {

    list.forEach((item) => {
      CPFInfo[item] = ''
    })
  }

  const genInputInfoList = (list: bindCPFInfoType[]) => {
    const genText = (key: string, i18nKey: string = 'hint') => {
      return `${t(`${i18nKey}.${key}`)}`
    }
    return list.map((item) => {
      let currentInputInfo = inputInfo[item]
      const placeholder = genText(currentInputInfo.placeholder)
      const errorText = genText(currentInputInfo.errorText)
      const label = genText(currentInputInfo.label, 'label')

      return { ...currentInputInfo, label, errorText, placeholder }
    })
  };

  const inputInfoList = computed(() => {
    if (!needBindCPFInfoList.value.length) {
      router.back()
      return []
    }
    genCPFInfo(needBindCPFInfoList.value)
    return genInputInfoList(needBindCPFInfoList.value)
  })

  onBeforeRouteLeave(() => {
    if (!needBindCPFInfoList.value.length) return
    clearBindCPFInfo()

  })
  // removeStatus
  return {
    inputInfoList,
    CPFInfo,
    btnDisabled,
    formEl,
    setItemRef,
    t,
    bindCPF,
    handleInput
  }

}
