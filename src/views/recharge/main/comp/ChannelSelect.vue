<script setup lang="ts">

import ChannelItem from './ChannelItem.vue'
import { IonIcon, IonPopover, IonContent } from '@ionic/vue'
import { getTheme } from '@/theme/hooks'
const { theme, newSkin } = getTheme()
export interface TypeSelectIem {
  name: string,
  logo?: string
  id?: number
}
const emit = defineEmits<{
  (e: 'handleChannel', id: number): void
  (e: 'update:channelId', id: number): void
}>()
let props = withDefaults(defineProps<{
  list: TypeSelectIem[],
  loading: boolean
}
>(), {

});

const channelId = defineModel<number | null | undefined>('channelId',)

const popoverOpen = ref(false)
const isGt1 = computed(() => props.list.length > 1)

// const currentItem = reactive<TypeSelectIem>({
//   name: '',
//   logo: '',
//   id: 0
// })


const changeSelect = (activeId: number) => {
  popoverOpen.value = false
  if (activeId == channelId.value) return
  emit('handleChannel', activeId)
  emit('update:channelId', activeId)
}

const openPopover = () => {
  popoverOpen.value = isGt1.value
}

// const init = (current: TypeSelectIem) => {
//   currentItem.logo = current.logo
//   currentItem.name = current.name
//   currentItem.id = current.id ?? 0
// }


// watch(() => props.list, () => {
//   let current = props.list[0]
//   init(current)

// }, { immediate: true })


const currentItem = computed(() => {

  if (channelId.value) {
    return props.list.find(it => it.id == channelId.value) ?? props.list[0]
  } else {
    return props.list[0]
  }

})



</script>
<template>

  <ChannelItem v-bind="{ ...currentItem }" :loading="loading" @click="openPopover" id="auto-trigger" class="">
    <template #suffix v-if="isGt1">
      <ion-icon slot="icon-only" :class="['arrow', { 'rotate-180': popoverOpen }, theme]"
        src="/first/svg/assets/arrow.svg" />

    </template>
  </ChannelItem>

  <ion-popover v-if="isGt1" mode="md" side="bottom" alignment="start" trigger="auto-trigger"
    @didDismiss="popoverOpen = false" :dismiss-on-select="true">
    <ion-content :class="['select-list', newSkin]">
      <template v-for="it in list" :key="it.name">
        <ChannelItem v-bind="{ name: it.name, logo: it.logo, id: it.id }" @click="() => changeSelect(it.id!)" />
      </template>
    </ion-content>
  </ion-popover>



</template>

<style scoped lang="less">
ion-popover {
  --width: 7.0625rem;
}

ion-icon.arrow {
  .font-size(--font-size-14);
  .color-text-100();


}

ion-icon.arrow.amber-purple {

  color: var(--text-color-light-purple-2-100)
}

ion-icon.rotate-180 {
  transform: rotateX(180deg)
}





:deep(.select-list) {
  .item-wrap {
    &:nth-child(2n) {
      .bg-300();
    }

    &:first-child {
      border-radius: .375rem .375rem 0 0;
    }

    &:last-child {
      border-radius: 0 0 .375rem .375rem;
    }
  }


}

.new-skin-symbol {
  ion-icon.arrow {
    font-size: var(--ep-font-size-m, 0.875rem);
    color: var(--ep-color-text-highlight-white);
    font-weight: var(--ep-font-weight-medium, 500);

    .arrow {
      color: var(--ep-color-icon-weaker);
      font-size: var(--ep-font-size-m, 0.875rem);
    }

  }


}

:deep(.select-list.new-skin-symbol) {
  .item-wrap {
    &:nth-child(2n) {
      background: var(--ep-color-background-fill-surface-raised-L1);
    }

    &:nth-child(2n+1) {
      background: var(--ep-color-background-fill-surface-raised-L2);
    }


  }


}
</style>
