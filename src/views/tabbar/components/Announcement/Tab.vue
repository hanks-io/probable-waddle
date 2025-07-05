<script setup lang="ts">
import { TabInfo } from '../type'
import { IonSegment, IonSegmentButton } from '@ionic/vue';

const emit = defineEmits<{
  (e: 'tabChange', tabId: number): void
  (e: 'update:tabId', tabId: number): void
}>()
const tabId = defineModel<number>('tabId', { required: true })
defineProps<{
  tabList: TabInfo[],
  tabPositionClassName: string
}
>()
const ionChange = (e: CustomEvent) => {
  const typeId = e.detail.value
  emit('tabChange', typeId)
  emit('update:tabId', typeId)
}

</script>
<template>
  <div :class="['tab-list', tabPositionClassName]">
    <ion-segment :value="tabId" :scrollable="true" mode='md' @ionChange="ionChange">

      <ion-segment-button v-for="(it) in tabList" :value="it.id" mode='md'>
        <div :class="['textColor', { active: it.id === tabId }]">
          {{ it.title }}
        </div>

      </ion-segment-button>



    </ion-segment>

  </div>
</template>

<style scoped lang="less">
//公用样式
.tab-list {
  width: 21.875rem;
  height: 3.125rem;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;

  .textColor {
    font-size: 12px;
  }


}

#popup-main-announcement-Tab-index {

  .style(@borderColor: --color-line, @bgColor: --color-bg-200, @activeBgColor: --color-bg-100,
    @color: --color-text-40, @activeColor: --color-text-100, @activeBorderColor: --theme-color-800) {
    .tab-list {
      border: 1px solid var(@borderColor);
      background-color: var(@bgColor);


      ion-segment-button {
        height: 3.125rem;
        min-width: 7.25rem;
        text-align: center;
        text-transform: none;
        --background: var(@bgColor);
        --background-checked: var(@activeBgColor);
        --border-width: 2px;
        --color: var(@color);
        --color-checked: var(@activeColor);
        --indicator-color: var(@activeBorderColor);
        --background-hover: var(@activeBgColor);
        --background-hover-opacity: 0.5;
        --padding-start: 0;
        --padding-end: 0
      }
    }

    ion-segment-button.segment-button-checked {
      font-weight: var(--ep-font-weight-bold, 700);

    }

    .tab-list.top {
      border-radius: var(--ep-font-size-m, .375rem) var(--ep-font-size-m, .375rem) 0 0;
      border-bottom-width: 0 !important;
    }

    .tab-list.bottom {
      border-radius: 0 0 var(--ep-font-size-m, .375rem) var(--ep-font-size-m, .375rem);
      border-top-width: 0 !important;

      ion-segment-button {
        --indicator-color: var(@bgColor);
      }

      .textColor {
        width: 100%;
        height: 100%;
        line-height: 3.125rem;

      }

      .active {
        border-top: 1px solid var(@activeBorderColor);
      }
    }

  }



}

html {
  #popup-main-announcement-Tab-index.style()
}

.new-skin-symbol {
  #popup-main-announcement-Tab-index.style(@borderColor: --ep-color-border-default,
    @bgColor: --ep-color-background-fill-surface-raised-L1,
    @activeBgColor: --ep-color-background-fill-surface-raised-L2,
    @color: --ep-color-text-weaker,
    @activeColor: --ep-color-text-default,
    @activeBorderColor: --ep-color-border-selected,
   )
}
</style>
