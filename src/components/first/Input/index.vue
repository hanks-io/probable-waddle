<template>
  <div :class="['relative', theme, type, newSkin]">
    <ion-input ref="inputRef" mode="ios" v-model="inputVal" v-bind="$attrs" :minlength="minLen" :maxlength="maxLen"
      :type="inputType" @ionInput="inputHandle" @ionBlur="blurHandle" @keydown="restrictInput" @paste="handlePaste"
      :disabled="disabled" :readonly="readonly || onlyText" :class="{ text: onlyText }">
      <div class="flex items-center" slot="label" v-if="type === 'phone' && !hideCurrency">
        <div class="mr-1">
          <flag :iso="country" style="font-size:1.25rem;border-radius: 50%" />
        </div>
        <span class="border-r-2 mr-1.5 pr-2.5">{{ areaCode }}</span>
      </div>
      <ion-icon class="text-2xl" slot="label" v-if="type === 'realName'" src="/svg/login/realName.svg" />
      <ion-icon class="text-2xl" slot="label" v-if="type === 'search'" src="/first/svg/magnifier.svg" />
      <ion-icon class="text-2xl" slot="label" v-else-if="type === 'account'" src="/svg/login/account.svg" />
      <ion-icon class="text-2xl" slot="label" v-else-if="type === 'password'" src="/svg/login/password.svg" />
      <ion-icon class="text-2xl" slot="label" v-else-if="type === 'cpf'" src="/svg/login/register-cpf.svg" />
      <p class="currency" slot="label" v-if="type && ['recharge', 'withdraw'].includes(type)">{{ merchantCy }}</p>
      <div class="flex items-center h-full" slot="end">
        <div class="flex items-center h-full pr-[.8128rem]" @click="clearHandle" v-if="clear">
          <ion-icon class="text-xs" :src="clearImg" />
        </div>
        <div class="flex items-center h-full pr-[.8125rem]" @click="showPassword = !showPassword"
          v-if="type === 'password'">
          <ion-icon class="text-base color-text-100 password-icon" :src="showPassword ? eyeImg : eyeOffImg" />
        </div>
        <div class="flex items-center h-full pr-[.8125rem]" v-if="type === 'captcha'">
          <Button height="2.125rem" spinner="bubbles" :prefixLoading="loading" :disabled="verifySended"
            @click="verifyHandle">
            <span v-if="verifySended">{{ countdown }}</span>
            <span v-else>{{ $t('label.sendVerifyCode') }}</span>
          </Button>
        </div>
        <div class="recharge flex pr-[.625rem]" v-if="type === 'recharge'">
          <p class="extra" v-if="!noBonus"> {{ $t('tags.GIVE_AWAY') }} +</p>
          <p class="ml-1 amount" v-if="!noBonus">{{ merchantCy }} {{ extra || 0 }}</p>
        </div>
        <div class="max-box  mr-[.375rem]" v-if="type === 'withdraw' && !readonly" @click="emit('setMaxValue')">
          <p class="max-text">{{ $t('viewsAssets.max') }}</p>
        </div>
      </div>
    </ion-input>
  </div>
</template>

<script setup lang="ts">
import { IonInput, IonIcon } from '@ionic/vue'
import { useTenantStore } from '@/store/tenant'
import { validateEmail, securityValidateEmail, validatePhone, validateAccount, validatePassword, getPhoneLength, validateCnpj, validateEvp, validateCpf, validateIFSC, validateRealName, validateBankCodeVN, validateBankCode } from '@/utils/custom'
import Button from "@/components/first/Button/index.vue"
import type { TInput, TInputProps } from '@/components/first/Input/type'
import { getTheme } from '@/theme/hooks'
import { handleAssetsKeydown, assetslist } from '@/utils/keydownEvent'

const props = defineProps<TInputProps>()
const emit = defineEmits(['input', 'update:modelValue', 'setMaxValue', 'keydown'])

const clearImg = new URL('./assets/close.svg', import.meta.url).href
const eyeImg = new URL('./assets/eye.svg', import.meta.url).href
const eyeOffImg = new URL('./assets/eyeOff.svg', import.meta.url).href

const { theme, newSkin } = getTheme()
const tenantStore = useTenantStore()
const attrs = useAttrs()

const country = computed(() => tenantStore.tenantInfo?.code) // 国家代码
const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
const areaCode = computed(() => tenantStore.tenantInfo?.phoneCode) // 区号

const inputRef = ref()// 输入框Element
const inputVal = ref()// 输入框值
const showPassword = ref(false) // 是否显示密码
const minLen = computed<number | undefined>(() => {// 最小长度
  if (attrs.minlength != undefined) {
    return attrs.minlength as number
  }
  const minLenMap: Partial<Record<TInput, () => number>> = {
    phone: () => getPhoneLength(country.value),
    account: () => 6,
    password: () => 6,
    captcha: () => 6,
  }
  return props?.type && minLenMap[props.type]?.()
})
const maxLen = computed<number | undefined>(() => {// 最大长度
  if (attrs.maxlength != undefined) {
    return attrs.maxlength as number
  }
  const maxLenMap: Partial<Record<TInput, () => number>> = {
    phone: () => getPhoneLength(country.value),
    account: () => 16,
    password: () => 16,
    captcha: () => 6,
  }
  return props?.type && maxLenMap[props.type]?.()
})
const bindBgColor = computed(() => props.bgColor ? `var(${props.bgColor})` : `transparent`)

const inputType = computed<string>(() => {
  const typeConfig: Partial<Record<TInput, () => string>> = {
    password: () => (showPassword.value ? 'text' : 'password'),
    recharge: () => 'number',
    withdraw: () => 'number',
    phone: () => 'tel',
    cnpj: () => 'tel',
    cpf: () => 'tel',
    bankCard: () => 'tel',
    evp: () => 'text',
    ifsc: () => 'text',
    captcha: () => 'text',
    realName: () => 'text',
    bankCardVN: () => 'text',
  };
  const isExist = props.type && typeConfig.hasOwnProperty(props.type)
  const result = isExist ? (typeConfig[props.type]?.() ?? 'text') : 'text' as string
  return result;
})
const validateAssets = (value: string) => {
  return Number.isInteger(Number(value))
}

const validateMap: Partial<Record<TInput, (value: string, country?: string) => boolean>> = {
  phone: validatePhone,
  account: validateAccount,
  password: validatePassword,
  recharge: validateAssets,
  withdraw: validateAssets,
  number: validateAmount,
  email: props.isSecurity ? securityValidateEmail : validateEmail,
  cnpj: validateCnpj,
  cpf: validateCpf,
  evp: validateEvp,
  ifsc: validateIFSC,
  realName: validateRealName,
  bankCard: validateBankCode,
  bankCardVN: validateBankCodeVN
}

const height = computed(() => {
  if (props.type === 'search') {
    return '2.25rem'
  } else if (props.type === 'recharge') {
    return '3.25rem'
  } else {
    return '2.872rem'
  }
})

// 监听输入框值变化
watch(() => props.modelValue, (value) => {
  inputVal.value = value
  props.type && validateInput(props.type, value as string)
}, { immediate: true })

/**
 * @description 输入框失去焦点
 */
const blurHandle = (e: CustomEvent) => {
  if (!inputRef.value?.$el) return
  inputRef.value.$el.classList.add('ion-touched')
}

/**
 * @description 校验金额类型数据
 */
function validateAmount(value: string) {
  let minlength = Number(attrs.minlength) ?? 0
  let maxlength = Number(attrs.maxlength) ?? 0
  let reg: RegExp | null = null
  if (!minlength && !maxlength) {
    reg = /\d+?/
  } else if (minlength === maxlength) {
    reg = new RegExp(`^\\d{${minlength}}$`)
  } else {
    minlength = minlength > 1 ? minlength : 1
    reg = new RegExp(`^\\d{${minlength},${maxlength}}$`)
  }
  return reg && reg.test(value.toString())
}

/**
 * @description 清除输入框的校验状态
 */
function clearValidateStatus() {
  if (!inputRef.value?.$el) return
  inputRef.value.$el.classList.remove('ion-valid', 'ion-invalid')
}

/**
 * @description 设置输入框的校验状态
 */
function setValidateStatus(status: boolean) {
  if (!inputRef.value?.$el) return
  clearValidateStatus()
  const className = status ? 'ion-valid' : 'ion-invalid'
  inputRef.value.$el.classList.add(className)
}

/**
 * @description 校验输入框的值
 */
function validateInput(type: TInput, value: string) {
  // 输入内容为空时不校验
  if (!value) {
    clearValidateStatus()
    return
  }
  // 校验长度是否满足要求
  if (minLen.value && value?.length < minLen.value || maxLen.value && value?.length > maxLen.value) {
    setValidateStatus(false)
    return
  }
  // 校验是否满足指定格式
  const validator = validateMap[type]
  if (validator) {
    if (type === 'phone') {
      setValidateStatus(validator(value, country.value))
    } else {
      setValidateStatus(validator(value))
    }
  }
  else {
    setValidateStatus(true)
  }
}

/**
 * @description 输入事件
 */
const inputHandle = (e: CustomEvent) => {
  e.detail.value = e.detail.value.trim()
  let value = e.detail.value
  props.type && validateInput(props.type, value)
  if (inputType.value === 'number' && props.maxAmount && value > props.maxAmount) {
    value = props.maxAmount
  }
  emit('input', e)
  emit('update:modelValue', value);
}

/**
 * @description 添加错误提示
 */
const addErrTip = () => {
  inputRef.value.$el.classList.remove('ion-valid')
  inputRef.value.$el.classList.add('ion-invalid', 'ion-touched')
}

/**
 * @description 移除成功
 */
const removeStatus = () => {
  inputRef.value.$el.classList.remove('ion-valid', 'ion-invalid', 'ion-touched')
}

/**
 * @description 限制输入指定字符
 */
const restrictInput = (event: KeyboardEvent) => {
  emit('keydown', event)
  if (props.type && assetslist.includes(props.type as "recharge" | "withdraw")) {
    handleAssetsKeydown(event, props.type as "recharge" | "withdraw")
  }
  //  阻止 输入 大于maxlength 再输入
  if (props.type && props.type === 'number' && props?.isDigit && attrs?.maxlength) {
    let maxlength = Number(attrs.maxlength)
    if (inputVal.value?.length >= maxlength) {
      if (event.key !== 'Backspace') { // 阻止非 Backspace 按键输入
        event.preventDefault();
      }
    }
  }
}

//  去除ios复制粘贴自带的空格
const handlePaste = (event: ClipboardEvent) => {
  if (props.noTrim) return;
  event.preventDefault();
  const clipboardData = event.clipboardData;
  const text = clipboardData?.getData('Text')
  const pastedData = props.type === 'text' ? text?.trim() : text?.replace(/\s/g, "")
  if (pastedData) {
    inputVal.value += pastedData
    emit('update:modelValue', inputVal.value);
    emit('input', inputVal.value)
  }
}

/**
 * @description 清空输入框事件
 */
function clearHandle() {
  inputVal.value = ''
  emit('update:modelValue', inputVal.value);
  emit('input', inputVal.value)
}

/**
 * @description 发送验证码
 */
async function verifyHandle() {
  if (props && typeof props.verifyHandle === 'function') {
    await props.verifyHandle();
  }
}

defineExpose({
  addErrTip,
  removeStatus
})
</script>

<style scoped lang="less">
div.relative ion-input {
  --placeholder-color: var(--color-text-40);
  --placeholder-opacity: 1;
  --padding-bottom: 0px;
  --padding-start: 0.75rem !important;
  --padding-top: 0px;
  --border-width: 0px;
  --border-radius: var(--rounded-small);
  --color: var(--color-text-100);
  --background: v-bind('bindBgColor');
  --highlight-color-focused: var(--input-highlight-color);
  --highlight-color-valid: var(--input-highlight-color);
  --placeholder-font-weight: var(--font-weight-regular);
  font-size: 0.875rem;
  line-height: 1.5rem;

}

.recharge,
.withdraw,
.font-weight {
  ion-input {
    font-weight: 700;
  }
}


div.relative ion-input.ion-invalid {
  margin-bottom: v-bind(errorHeight);
}

div.relative ion-input div span {
  border-color: var(--color-border-input-prefix);
}

.sc-ion-input-ios-h:not(.legacy-input) {
  height: v-bind("height")
}

:global(div.relative > ion-input .input-wrapper) {
  border: 1px solid var(--color-line) !important;
}

:global(div.relative > ion-input.text .input-wrapper.sc-ion-input-ios) {
  border: none !important;
}

:global(div.relative > ion-input.input-disabled.sc-ion-input-ios-h) {
  opacity: 1;
}

:global(div.relative > ion-input.input-disabled.sc-ion-input-ios-h .input-wrapper.sc-ion-input-ios) {
  border: 1px solid var(--color-line) !important;
}

:global(div.relative > ion-input.ion-valid .input-wrapper.sc-ion-input-ios) {
  border: 1px solid var(--color-success) !important;
}

:global(div.relative > ion-input.ion-invalid .input-wrapper.sc-ion-input-ios) {
  border: 1px solid var(--color-danger) !important;
}

:global(div.relative > ion-input.ion-invalid .input-bottom.sc-ion-input-ios) {
  padding-top: 0;
}

:global(div.relative > ion-input.ion-invalid .input-bottom .error-text) {
  font-size: 0.75rem;
  padding-left: .375rem;
  position: relative;
}

:global(div.relative > ion-input.ion-invalid .input-bottom .error-text::after) {
  content: url('./assets/warning.svg');
  display: block;
  width: 1rem;
  height: 1rem;
  position: absolute;
  top: .1875rem;
  left: -.75rem;
  filter: var(--ep-color-text-danger);

  svg {
    color: var(--ep-color-text-danger);
  }

}

:global(div.relative > ion-input label.input-wrapper .label-text-wrapper.sc-ion-input-ios.sc-ion-input-ios-s) {
  -webkit-margin-end: 0.25rem;
  margin-inline-end: 0.25rem;
}

p.currency {
  color: var(--color-currency);
}

p.extra {
  color: var(--color-text-40);
}

p.amount {
  color: var(--color-bonus);
}

div.max-box {
  background: var(--color-bg-200);
  min-width: 3rem;
  height: 2.125rem;
  border-radius: var(--rounded-small);
  text-align: center;
  line-height: 2.125rem;
  cursor: pointer;
  padding: 0 .375rem;
  box-sizing: border-box;

}

.recharge {
  font-size: var(--font-size-12);
}

p.max-text {
  color: var(--color-text-40);
}

p.no-bonus {
  color: var(--color-link);
}

.purple-light {
  .max-text {
    color: var(--theme-color-800);
  }
}

:global(div.relative.purple-light > ion-input.ion-valid .input-wrapper.sc-ion-input-ios) {
  border: 1px solid var(--color-border) !important;
}

.amber-purple {
  div.max-box {
    background: var(--color-bg-100);
  }

  .max-text {
    color: var(--text-color-light-purple-1-100);
  }
}

:global(div.relative.amber-purple > ion-input.ion-valid .input-wrapper.sc-ion-input-ios) {
  border: 1px solid var(--color-success) !important;
}



#public-input-new-index {
  .style() {
    div.relative {
      ion-input {
        --placeholder-color: var(--ep-color-text-weaker);
        --placeholder-opacity: 1;
        --padding-bottom: 0px;
        --padding-start: 0.75rem !important;
        --padding-top: 0px;
        --border-width: 0px;
        --border-radius: var(--ep-border-radius-m);
        --color: var(--ep-color-text-default);
        --background: var(--ep-color-background-fill-surface-lowered);
        --highlight-color-focused: var(--ep-color-border-selected);
        --highlight-color-valid: var(--ep-color-border-success);
        --placeholder-font-weight: var(--ep-color-border-selected);
        --highlight-color-invalid: var(--ep-color-border-danger);

        font-size: var(--ep-font-size-m);
        line-height: 1.5rem;

      }

      p.currency {
        color: var(--ep-color-text-warning);
      }

      p.extra {
        color: var(--ep-color-text-weaker);
      }

      p.amount {
        color: var(--ep-color-text-success);
      }

      .max-box {
        background: var(--ep-color-background-fill-surface-raised-L1);
        min-width: 3rem;
        height: 2.125rem;
        border-radius: .25rem;
        text-align: center;
        line-height: 2.125rem;
        cursor: pointer;
        padding: 0 .375rem;
        box-sizing: border-box;

        .max-text {
          color: var(--ep-color-text-weaker);
          font-size: var(--ep-font-size-m);
        }


      }

      .password-icon {
        color: var(--ep-color-icon-weaker);
      }
    }


  }
}

.new-skin-symbol {
  #public-input-new-index.style();


}

div.relative.new-skin-symbol ion-input div span {
  border-color: var(--ep-color-border-default);
}

:global(div.relative.new-skin-symbol > ion-input .input-wrapper) {
  border: 1px solid var(--ep-color-border-default) !important;
}



:global(div.relative.new-skin-symbol > ion-input.input-disabled.sc-ion-input-ios-h .input-wrapper.sc-ion-input-ios) {
  border: 1px solid var(--ep-color-border-default) !important;
}

:global(div.relative.new-skin-symbol > ion-input.ion-valid .input-wrapper.sc-ion-input-ios) {
  border: 1px solid var(--ep-color-border-brand) !important;
}

:global(div.relative.new-skin-symbol > ion-input.ion-invalid .input-wrapper.sc-ion-input-ios) {
  border: 1px solid var(--ep-color-border-danger) !important;
}
</style>
