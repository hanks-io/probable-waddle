<template>
  <div class="button flex items-center" :class="{ shiny: shiny && !disabled && !suffixLoading && !prefixLoading }"
    :style="{ height: height || '2.875rem', width: width || '100%' }">
    <ion-button mode="md" @click="handleClick" :disabled="disabled || suffixLoading || prefixLoading"
      :class="{ disabled: disabled, loading: suffixLoading || prefixLoading, [getClassType(classType)]: true }"
      :style="{ '--background': background }" v-bind="$attrs" @click.stop>
      <ion-spinner class="w-4 h-4" slot="start" :name="`${spinner || 'bubbles'}`"
        v-if="prefixLoading && !disabled && !suffixLoading" />
      <p>
        <span>
          <slot />
        </span><span>{{ ellipsis }}</span>
      </p>
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { IonButton, IonSpinner } from "@ionic/vue";
const emit = defineEmits<{
  (e: "handleBtnClick", event: CustomEvent): void;
}>();

let interval: NodeJS.Timeout;
let count = 0;

interface Props {
  disabled?: boolean;
  prefixLoading?: boolean;
  suffixLoading?: boolean;
  shiny?: boolean;
  spinner?: "bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-small" | "lines-sharp" | "lines-sharp-small";
  height?: string;
  width?: string;
  background?: string;
  onClick?: Function;
  classType?: string | undefined;
}
const props = defineProps<Props>();
const ellipsis = ref("");
const getClassType = (cusclass: string = 'first-button') => {
  const classList = ['first-button', 'style-1', 'style-2', 'raised', 'primary'];
  return classList[classList.indexOf(cusclass)] ? classList[classList.indexOf(cusclass)] : '';
};
watch(
  () => props.suffixLoading,
  (val) => {
    const updateEllipsis = () => {
      ellipsis.value = "";
      Array.from({ length: count % 4 }, (_, i) => i).forEach((i) => {
        ellipsis.value += ".";
      });
      count++;
    };

    if (val) {
      updateEllipsis();
      interval = setInterval(updateEllipsis, 500);
    } else {
      clearInterval(interval);
      ellipsis.value = "";
    }
  },
  { immediate: true },
);

function handleClick() {
  if (props.disabled || props.suffixLoading || props.prefixLoading) return;
  props.onClick && props.onClick();
}
</script>

<style scoped lang="less">
ion-button {
  --border-radius: var(--rounded-small);
  --padding-start: 0.625rem;
  --padding-end: 0.625rem;
  --box-shadow: none;
  font-size: var(--button-font-size, 0.875rem);
  font-weight: var(--button-font-weight, bold);
  min-height: 26px;
  min-width: 40px;
  width: 100%;
  height: 100%;
  margin-top: 0;
  margin-bottom: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
}

.btn-bus(@--background: var(--background, var(--theme-color-800)),
  @--button-text-color: --button-text-color,
  @--color-primary-btn-text-active: --color-primary-btn-text-active,
  @--color-primary-btn-text-disable: var(--color-primary-btn-text-disable),
  @--color-primary-btn-text-active: var(--color-primary-btn-text-active)) {
  --background: @--background;

  &::part(native) {
    background: @--background;
  }

  p {
    font-size: inherit;

    span {
      color: var(@--button-text-color, @--color-primary-btn-text-active);
      /* 默认白色文字 */
    }
  }

  .disabled p span {
    color: @--color-primary-btn-text-disable;
    /* 默认白色文字 */
  }

  :global(ion-button.first-button p) {
    color: var(@--color-primary-btn-text-active);
    /* 默认白色文字 */
  }

}

div.button ion-button.first-button {
  .btn-bus();
}

.new-skin-symbol {
  div.button ion-button.first-button {
    .btn-bus(@--background: var(--ep-dynamic-primary),
      @--button-text-color: --ep-color-text-inverse);
  }

  ion-button {
    --border-radius: var(--ep-border-radius-m);
    font-size: var(--ep-font-size-m);
    font-weight: var(--ep-font-weight-bold);
  }

  div.button ion-button.first-button.disabled {
    .btn-bus(@--background: var(--ep-color-background-fill-active-disabled),
      @--button-text-color: --ep-color-text-inverse-disabled);
  }

  .button-disabled {
    opacity: 1;
  }

  div.button ion-button.first-button {
    .btn-bus(@--background: var(--ep-dynamic-primary),
      @--button-text-color: --ep-color-text-inverse);
  }

  div.button ion-button.raised {
    .btn-bus(@--background: var(--ep-color-background-fill-surface-raised-L2),
      @--button-text-color: --ep-color-text-default);
  }

  div.button ion-button.primary {
    .btn-bus(@--background: var(--ep-color-background-fill-active-active),
      @--button-text-color: --ep-color-text-inverse);
  }
}

div.button ion-button.style-2 {
  .btn-bus(@--background: var(--color-button-bg-gray));
}

.amber-purple {
  .default,
  .second {
    div.button ion-button.first-button {
      .btn-bus(@--background: var(--theme-color-gradient-100))
    }
  }
}

div.button ion-button.style-1 {
  .btn-bus();

  &::part(native) {
    --background: linear-gradient(96deg, #6845DA 0%, #FF972F 97.21%);
    --border-radius: 52px;
    border: 1px solid #FFECA6;
    --box-shadow: 0px 4px 20px 0px rgba(255, 142, 86, 0.26);
  }
}

div.button ion-button.style-1.disabled {
  .btn-bus();

  &::part(native) {
    opacity: 0.4;
    --background: linear-gradient(96deg, #6845DA 0%, #FF972F 97.21%);
    --border-radius: 52px;
    border: 1px solid #FFECA6;
    --box-shadow: 0px 4px 20px 0px rgba(255, 142, 86, 0.26);
  }
}

ion-button.disabled {
  --background: var(--color-primary-btn-disable) !important;
  /* 禁用状态背景色 */
  --color: var(--color-primary-btn-text-disable);
  /* 禁用状态文字颜色 */
}

ion-button.loading {
  --background: var(--color-primary-btn-load) !important;
  /* 加载状态背景色 */
  --color: var(--color-primary-btn-text-load);
  /* 加载状态文字颜色 */
}

div.shiny {
  position: relative;
  overflow: hidden;
  border-radius: 0.25rem;
}

div.shiny::before {
  content: "";
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
