<script setup lang="ts">

import { getTheme } from '@/theme/hooks'
import {
  IonSegment,
  IonSegmentButton
} from '@ionic/vue'
import { AssetsTabInfo } from '@/views/withdraw/type'
const { theme } = getTheme()
const emit = defineEmits<{
  (e: 'tabChange', tabId: number): void
  (e: 'update:tabId', tabId: number): void
}>()
const props = defineProps<{
  tabList: AssetsTabInfo[]


  loading: boolean,
  activeBgColor?: string
}
>()
const tabId = defineModel<number>('tabId', { required: true })

const tabChange = (e: CustomEvent) => {
  const activeId = e.detail.value
  if (activeId === tabId.value) return
  emit('tabChange', activeId)
  emit('update:tabId', activeId)

}

</script>
<template>

  <div :class="['pay-list', theme]">
    <ion-segment :value="tabId" :scrollable="true" mode='ios' @ionChange="tabChange" :disabled="loading">

      <ion-segment-button v-for="(it) in tabList" :value="it.id">
        {{ it.name }}
        <div class="tag" v-if="it.tagValue"> {{ it.tagValue }}</div>
      </ion-segment-button>

    </ion-segment>
  </div>
</template>

<style scoped lang="less">
.pay-list.amber-purple {
  background-color: var(--color-bg-100);

  ion-segment-button.ios::part(native) {
    color: var(--text-color-light-purple-2-100);
  }

  .segment-button-checked.ios::part(native) {
    color: var(--text-color-light-purple-1-100);

  }


  .tag {
    background: var(--gradients-orange-purple);
  }

}

#recharge-main-comp-tab {

  .style(@wrapBg: --ep-color-background-fill-top-nav-secondary,
    @segmentBg: --ep-color-background-fill-body-default,
    @btnColor: --ep-color-text-weaker,
    @btbActiveColor: --ep-color-text-default,
    @btbActiveBgColor: --ep-color-background-fill-surface-raised-L2,
    @tagBg: --ep-color-icon-tips,
    @tagColor: --ep-color-text-highlight-white,
  ) {
    .pay-list {
      width: 100%;
      padding: .75rem;
      border-radius: 0px 0px var(--ep-border-radius-xl, .625rem) var(--ep-border-radius-xl, .625rem);
      background: var(@wrapBg);
      box-shadow: 0px 4px 28.4px 0px rgba(0, 0, 0, 0.10);

      ion-segment {
        --background: var(@segmentBg);
        width: 100%;
        height: 3rem;
        border-radius: var(--ep-border-radius-m, .375rem) !important;
      }

      ion-segment-button.ios::part(native) {
        color: var(@btnColor);
      }

      .segment-button-checked.ios::part(native) {
        color: var(@btbActiveColor);
        font-weight: var(--ep-font-weight-bold, 700);

      }

      ion-segment-button::part(indicator-background) {
        background: var(@btbActiveBgColor);
      }

      ion-segment-button {
        --border-radius: var(--ep-border-radius-s, .25rem);
        height: 2.75rem;
        --padding-start: 12px;
        --padding-end: 12px;
        min-width: 7.5rem;

      }

      .tag {
        position: absolute;
        min-width: 2.375rem;
        height: .8125rem;
        right: -0.625rem;
        top: 0;
        line-height: .875rem;
        background: var(@tagBg);
        z-index: 100;
        padding: 0 .375rem;
        text-align: center;
        border-radius: 0 var(--ep-border-radius-s, .25rem) 0 var(--ep-border-radius-s, .25rem);
        font-size: var(--ep-font-size-xs, 0.625rem);
        font-weight: var(--ep-font-weight-bold, 700);
        color: var(@tagColor);
      }

    }

  }
}

.green-dark,
.yellow-dark {
  #recharge-main-comp-tab.style(@wrapBg: --color-bg-200,
    @segmentBg: --color-bg-300,
    @btnColor: --color-text-40,
    @btbActiveColor: --color-text-100,
    @btbActiveBgColor: --color-bg-100,
    @tagBg: --accent-color-red,
    @tagColor: --color-text-100,
  )
}

.amber-purple {
  #recharge-main-comp-tab.style(@wrapBg: --color-bg-100,
    @segmentBg: --color-bg-300,
    @btnColor: --color-text-40,
    @btbActiveColor: --color-text-100,
    @btbActiveBgColor: --theme-color-800,
    @tagBg: --accent-color-red,
    @tagColor: --color-text-tag,
  )
}

.purple-light {
  #recharge-main-comp-tab.style(@wrapBg: --color-bg-500,
    @segmentBg: --color-bg-300,
    @btnColor: --color-text-40,
    @btbActiveColor: --text-color-white-100,
    @btbActiveBgColor: --theme-color-800,
    @tagBg: --accent-color-red,
    @tagColor: --color-text-tag,
  )
}

.new-skin-symbol {
  #recharge-main-comp-tab.style();
}
</style>
