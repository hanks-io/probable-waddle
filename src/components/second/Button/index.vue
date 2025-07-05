<template>
  <div class="button flex items-end" :class="{shiny: shiny && !disabled && !suffixLoading && !prefixLoading}" :style="{height: buttonHeight, width: width || '100%'}">
    <ion-button class="second-button" mode="md" @click="handleClick" :class="{disabled: disabled, loading: suffixLoading || prefixLoading}" :style="{'--background': background}" v-bind="$attrs" @click.stop>
      <ion-spinner class="w-4 h-4" slot="start" :name="`${spinner || 'bubbles'}`" v-if="prefixLoading && !disabled && !suffixLoading"/>
      <p><span><slot /></span><span>{{ ellipsis }}</span></p>
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import { IonButton, IonSpinner } from '@ionic/vue';

const emit = defineEmits<{
  (e: 'handleBtnClick', event: CustomEvent):void
}>()


let interval: NodeJS.Timeout;
let count = 0;

interface Props {
  disabled?: boolean
  prefixLoading?: boolean
  suffixLoading?: boolean
  shiny?: boolean
  spinner?: "bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-small" | "lines-sharp" | "lines-sharp-small"
  height?: string,
  width?: string,
  background?: string,
  onClick?: Function
}

const props = defineProps<Props>()

const ellipsis = ref('')
const buttonHeight = props.height || '3rem';

watch(() => props.suffixLoading, (val) => {
  if (val) {
    interval = setInterval(() => {
      ellipsis.value = ''
      Array.from({ length: count % 4 }, (_, i) => i).forEach((i) => {
        ellipsis.value += '.'
      })
      count++
    }, 500)
  } else {
    clearInterval(interval)
  }
}, { immediate: true })

function handleClick() {
  if (props.disabled || props.suffixLoading || props.prefixLoading) return
  props.onClick && props.onClick()
}


</script>

<style scoped>

div.button ion-button.second-button {
  --background: var(--color-button-bg-basic);
  --border-radius: var(--layout-radius-basic);
  --padding-start: .625rem;
  --padding-end: .625rem;
  --box-shadow: none;
  font-size: var(--button-font-size, .875rem);
  font-weight: var(--button-font-weight, bold);
  min-height: 26px;
  width: 100%;
  height: 100%;
  margin-top: 0;
  margin-bottom: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
}

div.button ion-button::part(native) {
  box-shadow: var(--color-button-shadow-basic);
}

div.button ion-button.second-button.ion-activated {
  height: calc(v-bind(buttonHeight) - 2.4px)
}

div.button ion-button.second-button.ion-activated::part(native) {
  box-shadow: none;
}

div.button ion-button.second-button p {
  font-size: inherit;
}

div.button ion-button.second-button p span {
  color: var(--button-text-color, --color-primary-btn-text-active); /* 默认白色文字 */
}

div.button ion-button.second-button.disabled p span {
  color: var(--color-primary-btn-text-disable); /* 默认白色文字 */
}

:global(ion-button.second-button p) {
  color: var(--color-primary-btn-text-active);
  /* 默认白色文字 */
}

ion-button.disabled {
  opacity: 0.4;
  --background: var(--color-button-bg-disable) !important; /* 禁用状态背景色 */
  --color: var(--color-primary-btn-text-disable); /* 禁用状态文字颜色 */
}

ion-button.loading {
  --background: var(--color-primary-btn-load) !important; /* 加载状态背景色 */
  --color: var(--color-primary-btn-text-load);; /* 加载状态文字颜色 */
}

div.shiny {
  position: relative;
  overflow: hidden;
  border-radius: .25rem;
}

div.shiny::before {
  content: '';
  background: var(--color-text-100);
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px;
  z-index: 99;
  animation: shiny 4s ease-in-out infinite;
}

@keyframes shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }

  80% {
    opacity: 0.5;
    transform: scale(0) rotate(45deg);
  }

  81% {
    opacity: 1;
    transform: scale(4) rotate(45deg);
  }

  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}
</style>
