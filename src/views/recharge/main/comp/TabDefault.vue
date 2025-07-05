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




  <ion-segment ref="segment" class="tab-list" mode="md" v-model="tabId" :disabled="loading" @ionChange="tabChange">
    <ion-segment-button :value="item.id" v-for="item in tabList" :key="item.id">
      {{ item.name }}
      <p class="tag" v-if="item.tagValue">
        {{ item.tagValue }}
      </p>
    </ion-segment-button>
  </ion-segment>
</template>

<style scoped lang="less">
#recharge-main-default-tabDefault-index {
  .style(@Color: --color-text-gray-200, @indicatorColor: --theme-color-gradient-100, @indicatorHeight: .0625rem) {
    ion-segment.tab-list {
      display: flex;
      justify-content: left;
      margin-top: 0.625rem;
      border-bottom: 1px solid var(--color-line);

      ion-segment-button {
        --color: var(@Color);
        --color-checked: var(--color-text-white-100);
        --indicator-color: var(@indicatorColor);
        --indicator-height: @indicatorHeight;
        text-transform: none;

      }

      .tag {
        position: absolute;
        font-size: var(--font-size-8);
        top: 0.25rem;
        right: .125rem;
        color: var(--text-color-white-100);
        background: var(--color-danger);
        padding: 0 .125rem .125rem;
        border-radius: var(--rounded-small);

      }
    }
  }
}



#recharge-main-default-tabDefault-index.style();

.green-default, .green-v01, .green-v02{
  #recharge-main-default-tabDefault-index.style(@indicatorHeight: .125rem);
}

.amber-purple{
  #recharge-main-default-tabDefault-index.style(@Color: --text-color-light-purple-1-100, @indicatorColor: --gradients-indicatorLine,@indicatorHeight: .125rem);
}
.auroral-yellow{
  #recharge-main-default-tabDefault-index.style(@indicatorColor: --theme-color-800);
}

</style>
