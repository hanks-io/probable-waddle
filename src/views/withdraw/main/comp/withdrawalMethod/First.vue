<script setup lang="ts">
import Input from '@/components/first/Input/index.vue'
import { IonIcon } from '@ionic/vue'
import uselogic, { Props } from './uselogic'

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
  getFormValue,
  handleInput,


} = uselogic(props)
const onlyText = computed(() => {
  if (props.dynamicType in inputInfo) {
    return Object.values(statusInfo).every(Boolean)
  } else {
    return statusInfo.cpfReadonly && statusInfo.nameReadonly
  }
})
const validate = () => {
  if (onlyText.value) return true
  let nodeList = formEl.value?.querySelectorAll(".ion-invalid")
  if (nodeList && nodeList.length) return false
  if (!realName.value) {
    realNameEl.value?.addErrTip()
    return false
  }
  if (current.value) {
    if (!accountInfo[props.dynamicType]) {
      withdrawalAccountEL.value?.addErrTip()
      return false
    }
  }
  if (!cpf.value) {
    cpfEl.value?.addErrTip()
    return false
  }
  return true
}
onBeforeRouteLeave(() => {
  cpfEl.value?.removeStatus()
  if (current.value) {
    withdrawalAccountEL.value?.removeStatus()
  }


})
defineExpose({
  validate,
  getFormValue,
  statusInfo
})

//  去除ios复制粘贴自带的空格
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const clipboardData = event.clipboardData
  const pastedData = clipboardData?.getData('Text').trim()
  if (pastedData) {
    realName.value += pastedData

  }
}

</script>
<template>
  <div :class="['form-wrap', theme]" ref="formEl">
    <template v-if="onlyText">
      <div class="flex-between">
        <div class="text-item">
          <p class="label">{{ $t('label.name') }}</p>
          <p class="only-text real-name">{{ realName }}</p>
        </div>
        <div class="text-item">
          <p class="label">{{ $t('label.cpf') }}</p>
          <p class="only-text">{{ cpf }}</p>
        </div>

      </div>
      <div class="item" v-if="current">
        <p class="label">{{ $t(`label.${current.label}`) }}</p>
        <p class="only-text">{{ accountInfo[dynamicType] }}</p>


      </div>

      <div class="tip-text flex-start">
        <ion-icon class="balance-fee" src="/first/svg/assets/warning.svg" />
        <span>{{ $t('viewsAssets.withdrawalInfo') }}</span>
      </div>

    </template>
    <template v-else>
      <div>
        <p class="label">{{ $t('label.name') }}</p>
        <div class="input-area">
          <Input type="text" :placeholder="$t('hint.tipName')" ref='realNameEl' :maxlength="REAL_NAME_LEN"
            :error-text="$t('hint.invalidName')" v-model="realName" mode="md" @input="handleInput"
            :readonly="statusInfo.nameReadonly" v-if="!statusInfo.nameReadonly" @paste="handlePaste" />
          <div class="real-name leading-[2.875rem] pl-[0.75rem]" v-else>{{ realName }}</div>
        </div>
      </div>
      <div class="item" v-if="current">
        <p class="label">{{ $t(`label.${current.label}`) }}</p>
        <div class="input-area">
          <Input :type="current.type" :placeholder="$t(`hint.${current.placeholder}`)" ref="withdrawalAccountEL"
            v-model="accountInfo[dynamicType]" :error-text="$t(`hint.${current.errorText}`)"
            v-bind="dynamicType !== 'PHONE' ? current.rule : {}" />
        </div>
      </div>
      <div class="item">
        <p class="label">{{ $t('label.cpf') }}</p>
        <div class="input-area">
          <Input type="cpf" :minlength="11" :maxlength="11" ref='cpfEl' :placeholder="$t('hint.tipCPF')"
            :error-text="$t('hint.invalidCPF')" v-model="cpf" :readonly="statusInfo.cpfReadonly" :hideCurrency="true" />
        </div>
      </div>
    </template>

  </div>
</template>

<style scoped lang="less">
.real-name {
  padding-right: .75rem;
  overflow-x: scroll;
  white-space: nowrap;

}

.real-name::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}

.form-wrap {
  .bg-300();
  width: 24.375rem;
  padding: .75rem .75rem 1.875rem;
  box-sizing: border-box;
  text-align: left;
  .dynamic-font(@color: --color-text-40);

  .item {
    margin-top: 1.5rem;
  }

  .text-item {
    width: 50%;
  }

  .label {
    line-height: 18px;
  }

  .input-area {
    width: 22.875rem;

    .bg-400();
  }

  .only-text {
    text-indent: 1em;
    .dynamic-font(@color: --color-text-100, @fontWeight: --font-weight-bold);
  }

  .tip-text {
    .dynamic-font(@color: --color-link, @fontWeight: --font-weight-medium);
    line-height: 1.125rem;
    margin-top: 1.3125rem;
    align-items: flex-start;

    ion-icon {
      .dynamic-font(@color: --color-link, @fontWeight: --font-weight-medium);
      font-size: 32px;
    }

    span {
      margin-left: .1875rem;
    }
  }
}

.form-wrap.purple-light {
  .label {
    .dynamic-font(@color: --text-color-black-80);
  }

}

.form-wrap.amber-purple {
  .label {
    .dynamic-font(@color: --color-text-first);
  }

  .only-text {
    margin-top: 0.75rem;
    font-size: 0.875rem;
  }
}

#withdraw-main-withdrawalMethod-first-index {
  .style() {
    .form-wrap {
      width: 24.375rem;
      padding: .75rem .75rem 1.875rem;
      box-sizing: border-box;
      text-align: left;
      color: var(--ep-color-text-weaker);
      font-size: var(--ep-font-size-s, .75rem);
      .item {
        margin-top: 1.5rem;
      }

      .text-item {
        width: 50%;
      }

      .label {
        line-height: 18px;
      }

      .input-area {
        width: 22.875rem;

        background: var(--ep-color-background-fill-surface-lowered);
      }

      .only-text {
        text-indent: 1em;
        font-weight: 700;
        color: var(--ep-color-text-default);
      }

      .tip-text {
        line-height: 1.125rem;
        margin-top: 1.3125rem;
        align-items: flex-start;
        font-weight: 500;
        font-size: var(--ep-font-size-s, .75rem);
        color: var(--ep-color-text-info);
        ion-icon {
          
          color: var(--ep-color-icon-info);
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          margin-top: -0.4375rem;
        }

        span {
          margin-left: .1875rem;
        }
      }
    }
  }
}

.new-skin-symbol {
  #withdraw-main-withdrawalMethod-first-index.style();
}
</style>
