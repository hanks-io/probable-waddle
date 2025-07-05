<template>
  <ion-input
    ref="inputRef"
    :value="inputValue"
    fill="outline"
    mode="ios"
    v-bind="$attrs"
    class="input-box"
    :readonly="isReadonly"
    @ionInput="inputChange"
    @ionBlur="blurHandle"
  >
    <slot></slot>
    <ion-datetime-button v-if="props.type === 'datetime'" slot="end" class="datetime-button" datetime="datetime">
      <!-- <span slot="date-target">
        选择
      </span> -->
    </ion-datetime-button>
  </ion-input>
  <ion-modal :keep-contents-mounted="true">
    <ion-datetime
      v-model="datetime"
      id="datetime"
      class="input-datetime"
      presentation="date"
      :prefer-wheel="true"
      :locale="locale"
      @ionChange="dateChange"
    />
  </ion-modal>
</template>

<script setup lang="ts">
import { IonInput, IonDatetimeButton, IonModal, IonDatetime } from '@ionic/vue';
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'


const attrs = useAttrs()
const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  timeFormat: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  validate: {
    type: Function,
  }
})

const { t, locale } = useI18n()

const inputValue = ref<string | undefined>(props.modelValue)
const datetime = ref<string | undefined>(undefined)

const isReadonly = computed(() => {
  const { disabled, readonly } = props;
  return disabled || readonly;
})

const dateChange = () => {
  const formatDate = dayjs(datetime.value).format(props.timeFormat)
  inputValue.value = formatDate
  inputChange()
  emits('update:modelValue', formatDate)
}

const inputRef = ref<any>(null)

const inputChange = (ev?: any) => {
  const { validate } = props
  const value = ev?.target?.value || inputValue.value
  inputValue.value = value

  inputRef.value.$el.classList.remove('ion-valid');
  inputRef.value.$el.classList.remove('ion-invalid');

  if (Object.hasOwn(attrs, 'required') && value === '') {
    inputRef.value.$el.classList.add('ion-invalid');
  }
  if (value && validate) {
    validate(value)
    ? inputRef.value.$el.classList.add('ion-valid')
    : inputRef.value.$el.classList.add('ion-invalid');
  }
}

const validateFields = () => {
  inputChange()
  blurHandle()
}

/**
 * @description 输入框失去焦点
 */
 const blurHandle = () => {
  if (!inputRef.value?.$el) return
  inputRef.value.$el.classList.add('ion-touched')
}

const addErrTip = () => {
  inputRef.value.$el.classList.remove('ion-valid')
  inputRef.value.$el.classList.add('ion-invalid', 'ion-touched')
}


watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    inputValue.value = ''
  }
})


defineExpose({
  addErrTip,
  validateFields
})

</script>

<style scoped lang="less">
.input-box {
  --border-color: var(--line-color);
  --placeholder-color: var(--color-text-40);
  --color: var(--color-text-100);
  --background: var(--color-bg-400);
  --highlight-color-focused: var(--input-highlight-color);
  --highlight-color-valid: var(--input-highlight-color);
  --placeholder-font-weight: var(--font-weight-regular);
  --border-radius: var(--rounded-small);
  --padding-start: 0.75rem;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --border-width: 0;
  font-size: 0.875rem;
  --placeholder-opacity: 1;
  line-height: 1.5rem;
  height: 2.872rem;

  &.has-focus {
    --border-color: var(--line-color);
    --border-width: 0;
  }

  :deep(.input-bottom) {
    padding-top: 0;

    .error-text {
      font-size: 0.75rem;
      padding-left: .375rem;
      position: relative;

      &::after {
        content: url('src/components/first/Input/assets/warning.svg');
        display: block;
        width: 1rem;
        height: 1rem;
        position: absolute;
        top: .1875rem;
        left: -.75rem;
      }
    }
  }

  .datetime-button {

    &::part(native) {
      margin-inline-end: 0.4375rem;
      padding: 0.375rem 1.0625rem;
      font-size: 0.875rem;
      font-weight: 400;
      border-radius: 0.25rem;
      color: var(--color-text-40);
      background: var(--color-bg-200);
    }
  }
}

ion-modal {
  background: rgba(0, 0, 0, 0.5);

  .input-datetime {
    border-radius: 0.75rem;
    --background: #242424;
    --wheel-highlight-background: #181816;
    --wheel-fade-background-rgb: none;
    --wheel-highlight-border-radius: 3.25rem;
    box-shadow: 0 -4.0625rem 2.625rem -1.375rem rgba(0, 0, 0, 0.80) inset, 0 4.0625rem 2.625rem -1.375rem rgba(11, 11, 11, 0.80) inset;

    .picker-after {
      background: red;
    }

    &::part(wheel-item) {
      color: rgba(255, 255, 255, 0.3);
      font-size: 0.875rem;
    }
    &::part(wheel-item active) {
      color: #fff;
      font-size: 1rem;
    }
  }
}

</style>
