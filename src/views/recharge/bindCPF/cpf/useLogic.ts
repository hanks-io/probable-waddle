import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { truncateText } from '@/utils'
import { payBindCPFApi } from '@/api/assets'
import { REAL_NAME_LEN } from '@/views/withdraw/constant';
import { useCPFInfoConfirmAgain } from '@/hooks/useCPFInfoConfirmAgain';


import type { TInput } from '@/components/first/Input/type'


export default () => {
  const { t } = useI18n() // 国际化
  const router = useRouter();
  const initParams = {
    cpf: '',
    realName: '',
  }
  const params = reactive<Record<string, string>>(JSON.parse(JSON.stringify(initParams)));

  const formEl = ref<null | HTMLElement>(null);

  const btnDisabled = ref(false);

  const inputChange = (e: any) => {
    const isEmpty = Object.values(params).every((item) => item)
    nextTick(() => {
      const errorElList = formEl.value?.querySelectorAll(".ion-invalid")
      let isError = true;
      if (errorElList && errorElList.length) {
        isError = false
      }
      btnDisabled.value = isEmpty && isError
    })
  }
  
  const inputInfoList = computed(() => {
    return [
      { 
        name: 'realName', 
        type: 'text' as TInput, 
        label: t('label.name'),
        errorText: t('hint.invalidName'),
        placeholder: t('hint.tipName'),
        rule: { maxlength: REAL_NAME_LEN } 
      },
      { 
        name: 'cpf',
        type: 'cpf' as TInput,
        label: t('label.cpf'),
        placeholder: t('hint.tipPayCPF'),
        errorText: t('hint.invalidCPF'),
        rule: { minlength: 11, maxlength: 11 }
      },
    ]
  })

  const clearInput = () => {
    Object.assign(params, JSON.parse(JSON.stringify(initParams)))
  }

  const submitHandle = async () => {
    try {
      params.realName = truncateText(params.realName);
      await payBindCPFApi(params);
      clearInput();
      router.back();
    } catch (error) {
      console.error('submitHandle error: ', error)
    }
  }

  const bindCPF = async () => {
    const errorElList = formEl.value?.querySelectorAll(".ion-invalid")
    if (errorElList && errorElList.length) {
      return
    }
    const validatorParams = {
      cb: submitHandle,
      cpf: params.cpf,
      name: params.realName,
    }
    useCPFInfoConfirmAgain(validatorParams, 'recharge')
  }

  return {
    params,
    formEl,
    bindCPF,
    inputChange,
    btnDisabled,
    inputInfoList,
  }
}