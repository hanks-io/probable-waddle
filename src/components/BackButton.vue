<template>
  <ion-button slot="start" @click="navigate">
    <ion-icon class="mx-2" :style="`font-size:${size}`" slot="icon-only" src="/svg/arrow_left.svg" />
  </ion-button>
</template>

<script setup lang="ts">
import { chevronBack } from "ionicons/icons";
import { IonButton, IonIcon } from "@ionic/vue";
import { PageParam, setPageParam } from "@/store/pageParam";
import useNavigateBack from "@/hooks/useNavigaterBack";

const props = withDefaults(
  defineProps<{
    icon?: string,
    size?: string,
    backRebate?: boolean
  }>(),
  {
    icon: chevronBack,
    size: `var(--font-size-back-button)`,
    isUpdateRedPoint: false,
    backRebate: false,
  },
);

/**
 * @description 路由跳转
 */
function navigate() {
  setPageParam(PageParam.RECORD_BACK_REBATE, props.backRebate);
  useNavigateBack();
}
</script>

<style scoped>
ion-button {
  --padding-top: 0.1875rem;
  --padding-bottom: 0.1875rem;
  --background: transparent;
  --background-activated: transparent;
  --background-hover: transparent;
  --background-focused: transparent;
  --box-shadow: none;
  min-height: 0;
}

ion-button::part(native) {
  --padding-start: 0.125rem;
  --padding-end: 0.25rem;
  background: transparent;
}

ion-button ion-icon {
  color: var(--color-text-title-basic);
}

.new-skin-symbol  {
  ion-button ion-icon {
    color: var(--ep-color-icon-default);
    font-size: var(--ep-font-size-xl) !important;
    font-weight: var(--ep-font-weight-medium);
  }
}
</style>
