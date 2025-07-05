<template>
  <ion-button class="unset-btn" mode="md" :class="buttonType === 'text' ? 'text-btn' : ''" :fill="type" @click="$emit('btnClick', eventKey)">
    <slot>
      {{ $t(translatedText) }}
    </slot>
  </ion-button>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';

const props = defineProps({
  translatedText: {
    type: String,
    default: '',
  },
  buttonType: {
    type: String,
    default: 'default',
  },
  eventKey: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['btnClick']);

const fillType = {
  text: 'clear',
  line: 'outline',
  default: 'solid',
}

const type = computed(() => {
  return fillType[props.buttonType];
})

</script>

<style lang="less" scoped>
ion-button {
  &.unset-btn {
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0;
    margin: 0;
    min-height: min-content;
    min-width: min-content;
  }

  &.text-btn {
    --background: transparent;

    &::part(native) {
      background: transparent !important;
    }
  }
}

</style>
