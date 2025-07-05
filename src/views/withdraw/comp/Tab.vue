<script setup lang="ts">
import { TabInfo } from '../type'
import { IonSegment, IonSegmentButton } from '@ionic/vue';
import { getTheme } from '@/theme/hooks'
const { skin, theme } = getTheme()
const emit = defineEmits<{
  (e: 'tabChange', tabId: number): void
  (e: 'update:tabId', tabId: number): void
}>()
const tabId = defineModel<number>('tabId', { required: true })
withDefaults(defineProps<{
  tabList: TabInfo[],
  disabled?: boolean
  activeBg?: string
}
>(), {
  disabled: false
});
const ionChange = (e: CustomEvent) => {
  const typeId = e.detail.value
  emit('tabChange', typeId)
  emit('update:tabId', typeId)
}
const isFirstSkin = computed(() => skin === 'first')
const isDefaultSkin = computed(() => skin === 'default')
</script>
<template>
  <div :class="['tab-list']">
    <ion-segment :value="tabId" :scrollable="true" mode='ios' @ionChange="ionChange" :disabled="disabled">

      <ion-segment-button v-for="(it) in tabList" :value="it.id">
        <div class="textColorBg">
          {{ it.name }}
        </div>

      </ion-segment-button>



    </ion-segment>

  </div>
</template>

<style scoped lang="less">
//公用样式
.tab-list {
  width: 22.125rem;

  margin: 1.5rem auto 2.1875rem;
  box-sizing: border-box;

  ion-segment {
    --background: transparent;
    // width: 21.75rem;
    height: 2.75rem;
    border-radius: var(--rounded-small) !important;

  }

  ion-segment-button.ios::part(native) {
    color: var(--color-text-80);

  }

  .segment-button-checked.ios::part(native) {
    color: var(--theme-color-800);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-14);
    border-radius: var(--rounded-small);
  }

  ion-segment-button::part(indicator-background) {
    background: var(--color-bg-100)
  }

  ion-segment-button {
    --border-radius: var(--rounded-small);
    --padding-start: 12px;
    --padding-end: 12px;
    min-width: 7.5rem;

  }



}

#withdraw-main-bindBankTab-index {
  .style() {
    .tab-list {
      border: 1px solid var(--color-line);
      background-color: var(--color-bg-200);
      border-radius: var(--rounded-middle);

      ion-segment {
        --background: var(--color-bg-200) !important;
      }
    }
  }

  .defaultStyle(@checkedColor: --color-text-100, @checkedBg: --tab-bg-color) {
    .segment-button-checked.ios::part(native) {
      color: var(@checkedColor);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-14);
      --border-radius: var(--rounded-small);
      background: var(@checkedBg);
      border: none;
    }

    ion-segment-button {
      --border-radius: var(--rounded-small);
      --padding-start: 12px;
      --padding-end: 12px;
      min-width: 7.5rem;
      background: var(--color-bg-200);
      margin-right: 10px;
      border: 1px solid var(--color-line);
    }
  }

}

.first {
  #withdraw-main-bindBankTab-index.style()
}

.default {
  #withdraw-main-bindBankTab-index.defaultStyle()
}

.auroral-yellow {
  #withdraw-main-bindBankTab-index.defaultStyle(@checkedBg: --theme-color-800, @checkedColor: --color-text-black-100);
}

.amber-purple {
  .default {
    #withdraw-main-bindBankTab-index.defaultStyle(@checkedColor: --color-text-black-100, @checkedBg: --theme-color-800);

    .tab-list {
      ion-segment-button.ios::part(native) {
        color: var(--text-color-light-purple-1-100);

      }
    }

  }

  .second {
    #withdraw-main-bindBankTab-index.style();

    .tab-list {
      background: var(--color-bg-second);

      .segment-button-checked {
        .textColorBg {
          background: var(--Gradients-orange-purple);
          background-clip: text;
          color: transparent;
        }
      }

      ion-segment-button.ios::part(native) {
        color: var(--color-text-first);
      }
    }
  }
}

.purple-light {
  .tab-list {
    .segment-button-checked.ios::part(native) {
      color: var(--color-text-secondary-1);
    }

    ion-segment-button::part(indicator-background) {
      background: var(--theme-color-800)
    }
  }


}

#withdraw-main-bindBankTab-new-index {
  .style() {

    .tab-list {
      width: 22.125rem;
      border: 1px solid var(--ep-color-border-default);
      margin: 1.5rem auto 2.1875rem;
      box-sizing: border-box;
      border-radius: var(--ep-border-radius-m, .375rem);
      background: var(--ep-color-background-fill-surface-raised-L1);
      ion-segment {
        --background: transparent;
        // width: 21.75rem;
        height: 2.75rem;
        border-radius: var(--ep-border-radius-s, .25rem) !important;
        background: var(--ep-color-background-fill-surface-raised-L1);

      }

      ion-segment-button.ios::part(native) {
        color: var(--ep-color-text-default);

      }

      .segment-button-checked.ios::part(native) {
        color: var(--ep-color-text-selected);
        font-weight: var(--ep-font-weight-bold, 700);
        font-size: var(--ep-font-size-m, .875rem);
        border-radius: var(--ep-border-radius-s, .25rem);
      }

      ion-segment-button::part(indicator-background) {
        background: var(--ep-color-background-fill-surface-raised-L2)
      }

      ion-segment-button {
        --border-radius: var(--ep-border-radius-s, .25rem);
        --padding-start: .75rem;
        --padding-end: .75rem;
        min-width: 7.5rem;
        --margin-top: .1875rem;
        --margin-bottom: .1875rem;
  
      }



    }
  }



}

.new-skin-symbol {
  #withdraw-main-bindBankTab-new-index.style()
}
</style>
