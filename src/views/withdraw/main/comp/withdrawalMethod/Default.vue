<script setup lang="ts">
import { IonInput } from '@ionic/vue'
import uselogic, { Props } from './uselogic'
import { validateCpf } from '@/utils/custom'
import { debounce } from '@/utils'
import { showToast } from '@/utils'
const props = defineProps<Props>()
const {
  formEl,
  cpfEl,
  realNameEl,
  withdrawalAccountEL,
  realName,
  current,
  cpf,
  inputInfo,
  accountInfo,
  statusInfo,
  theme,
  REAL_NAME_LEN,
  currentReadonly,
  getFormValue,
  handleInput,
  valiDateAccount,

} = uselogic(props)
const onlyText = computed(() => {
  if (props.dynamicType in inputInfo) {
    return Object.values(statusInfo).every(Boolean)
  } else {
    return statusInfo.cpfReadonly && statusInfo.nameReadonly
  }
})
const accountValidate = debounce(() => {
  accountInfo[props.dynamicType] ? valiDateAccount(accountInfo[props.dynamicType], props.dynamicType) : removeInValidClass(withdrawalAccountEL.value)
}, 500)
const removeInValidClass = (el: HTMLElement | null) => {
  if (!el) return
  el.$el.classList.remove('ion-valid', 'ion-invalid', 'ion-touched')
}
const addValidClass = (el: HTMLElement | null) => {
  if (!el) return
  el.$el.classList.add('ion-invalid', 'ion-touched')
}
const cpfValidate = debounce(() => {
  if (!cpf.value) {
    removeInValidClass(cpfEl.value)
    return
  }

  validateCpf(`${cpf.value}`) ? removeInValidClass(cpfEl.value) : addValidClass(cpfEl.value)

}, 500)
const validate = () => {
  if (onlyText.value) return true
  let nodeList = formEl.value?.querySelectorAll(".ion-invalid")
  if (nodeList && nodeList.length) return false
  if (!realName.value) {
    showToast('hint.invalidName')
    return false
  }
  if (current.value) {
    if (!accountInfo[props.dynamicType]) {
      showToast(`hint.${current.value.errorText}`)
      return false
    }
  }
  if (!cpf.value) {
    showToast('hint.invalidCPF')
    return false
  }
  return true
}

onBeforeRouteLeave(() => {
  removeInValidClass(cpfEl.value)
  if (current.value) {
    removeInValidClass(withdrawalAccountEL.value)
  }


})
defineExpose({
  validate,
  getFormValue,
  statusInfo
})


</script>
<template>
  <div :class="['form-wrap', theme]" ref="formEl">


    <div class="item">
      <p class="label">{{ $t('label.name') }}</p>

      <IonInput type="text" :placeholder="$t('hint.tipName')" ref='realNameEl' :maxlength="REAL_NAME_LEN"
        :error-text="$t('hint.invalidName')" v-model="realName" mode="md" @ionInput="handleInput"
        :readonly="statusInfo.nameReadonly" v-if="!statusInfo.nameReadonly" clear-input />
      <div class="real-name leading-[2.875rem]" v-else>{{ realName }}</div>

    </div>
    <div class="item" v-if="current">
      <p class="label">{{ $t(`label.${current.label}`) }}</p>

      <IonInput :type="current.typeDefault" :placeholder="$t(`hint.${current.placeholder}`)" ref="withdrawalAccountEL"
        v-model="accountInfo[dynamicType]" :error-text="$t(`hint.${current.errorText}`)" v-bind="current.rule"
        @ionInput="accountValidate" clear-input :readonly="currentReadonly" />

    </div>
    <div class="item">
      <p class="label">{{ $t('label.cpf') }}</p>

      <IonInput type="tel" :minlength="11" :maxlength="11" ref='cpfEl' :placeholder="$t('hint.tipCPF')"
        :error-text="$t('hint.invalidCPF')" v-model="cpf" :readonly="statusInfo.cpfReadonly" :hideCurrency="true"
        @ionInput="cpfValidate" clear-input />

    </div>


  </div>
</template>

<style scoped lang="less">
.real-name {
  padding-right: .75rem;
  overflow-x: scroll;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-line);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-bold);

}


.real-name::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}

#withdraw-main-default-withdrawalMehtod-index {
  .style(@textColor: --color-text-gray-100, @placeholderColor: --color-text-gray-200, @inputColor: --color-text-white-100, @highlightColor: --theme-color-700) {
    .form-wrap {
      margin-top: 1.3125rem;
      overflow: hidden;

      .item {
        margin-bottom: 1.875rem;

        .label {
          font-size: .75rem;
          line-height: 1.375rem;
          color: var(@textColor)
        }

        ion-input {
          --color: var(@inputColor);
          --border-color: var(--color-line);
          font-size: var(--font-size-14);
          font-weight: var(--font-weight-bold);
          height: 2.5rem;
          --placeholder-font-weight: var(--font-weight-regular);
          --highlight-color-invalid: var(--color-danger);
          --highlight-color-valid: var(--color-success);
          --placeholder-color: var(@placeholderColor);
          --highlight-color: var(@highlightColor);
          --highlight-color-focused: var(@highlightColor);
        }
      }
    }

  }


}

.blue-default {
  #withdraw-main-default-withdrawalMehtod-index.style(@textColor: --color-text-white-100)
}

.green-default, .forest-green {
  #withdraw-main-default-withdrawalMehtod-index.style(@inputColor: --color-text-gray-100, @highlightColor: --theme-color-800)
}

.amber-purple {
  #withdraw-main-default-withdrawalMehtod-index.style(--text-color-light-purple-1-100, --text-color-light-purple-2-100, --text-color-light-purple-1-100, --theme-color-800)
}
.auroral-yellow {
  #withdraw-main-default-withdrawalMehtod-index.style(@textColor: --color-text-gray-200,  @highlightColor: --theme-color-800)
}





.amber-purple {
  .form-wrap .item {
    p {
      color: var(--text-color-light-purple-1-100)
    }

    ion-input {
      --placeholder-color: var(--text-color-light-purple-2-100);
      --highlight-color: var(--theme-color-800);
      --highlight-color-focused: var(--theme-color-800);

    }
  }

}
</style>
