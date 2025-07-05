<script setup lang="ts">
import { IonCheckbox } from '@ionic/vue'
const emit = defineEmits<{
  (e: 'handleSwitch', event: CustomEvent): void
  (e: 'update:isParticipate', bool: boolean): void
}>()



const isParticipate = defineModel<boolean>('isParticipate', { required: true })
const checked = ref(isParticipate.value)

const ionChange = (e: CustomEvent) => {
  let checked = e.detail.checked
  emit('handleSwitch', e)
  emit('update:isParticipate', checked)
}
</script>
<template>

  <div :class="['checkbox-area']">
    <ion-checkbox class="" justify="start" label-placement="end" v-model="checked" @ionChange="ionChange" mode="md">
      {{ $t('viewsTabbar.rechargeBonus') }}
    </ion-checkbox>

  </div>


</template>

<style scoped lang="less">
#activity-switch-new-skin-symbol {

  .style(@checkedBorderColor: --ep-color-border-brand,
    @bg: --ep-color-background-fill-body-default,
    @checkedBg: --ep-color-background-fill-active-primary,
    @textColor: --ep-color-text-brand-primary,
    @checkmarkColor: --ep-color-icon-inverse) {
    .checkbox-area {
      padding-left: .8125rem;
      line-height: 1.125rem;
      font-size: var(--ep-font-size-s, 0.75rem);
      color: var(@textColor);

      ion-checkbox {
        --border-color: var(@checkedBorderColor);
        --border-color-checked: var(@checkedBorderColor);
        --checkbox-background: var(@bg);
        --checkbox-background-checked: var(@checkedBg);
        --size: var(--ep-font-size-l, 1rem);
        --border-radius: var(--ep-border-radius-s, .25rem);
        --checkmark-color: var(@checkmarkColor);
      }

      ion-checkbox::part(container) {
        border-radius: var(--ep-border-radius-s, .25rem);
        border: 1px solid var(@checkedBorderColor);
      }

    }
    .default{
      .checkbox-area{
        padding-left: 0;
      }
    }

    .default {
      .checkbox-area {
        padding-left: 0;
      }
    }

  }


}

.new-skin-symbol {
  #activity-switch-new-skin-symbol.style();
}

.purple-light,
.blue-default,
.green-default,
.yellow-dark {
  #activity-switch-new-skin-symbol.style(@checkedBorderColor: --color-primary-800, @bg: --color-bg-300, @checkedBg: --color-primary-800,
   @textColor: --color-primary-800, @checkmarkColor: --text-color-white-100);
}

.forest-green {
  #activity-switch-new-skin-symbol.style(@checkedBorderColor: --theme-color-800-2, @bg: --color-bg-300, @checkedBg: --theme-color-800-2, @textColor: --theme-color-800-2, @checkmarkColor: --text-color-white-100);
}

.auroral-yellow {
  #activity-switch-new-skin-symbol.style(@checkedBorderColor: --theme-color-800-2,
    @bg: --color-bg-300,
    @checkedBg: --theme-color-800-2,
    @textColor: --theme-color-800-2,
    @checkmarkColor: --color-text-black-100);
}
.green-dark, .amber-purple{
  #activity-switch-new-skin-symbol.style(@checkedBorderColor: --theme-color-800,
    @bg: --color-bg-300,
    @checkedBg: --theme-color-800,
    @textColor: --theme-color-800,
    @checkmarkColor: --color-text-100);
}
</style>
