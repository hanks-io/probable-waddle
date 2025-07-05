<script setup lang="ts">

import SelectItem from './assets/SelectItem.vue'
import { IonIcon, IonPopover, IonContent } from '@ionic/vue'
export interface TypeSelectIem {
  name: string,
  logo?: string
  id?: number
}
const emit = defineEmits<{
  (e: 'handleSelect', id: number): void
}>()
let props = withDefaults(defineProps<{
  list: TypeSelectIem[],

}
>(), {

});



const popoverOpen = ref(false)
const isGt1 = computed(() => props.list.length > 1)

const currentItem = reactive<TypeSelectIem>({
  name: '',
  logo: '',
  id: 0
})


const changeSelect = (item: TypeSelectIem) => {
  popoverOpen.value = false
  if (item.id == currentItem.id) return
  init(item)
  emit('handleSelect', item.id!)
}

const openPopover = () => {
  popoverOpen.value = isGt1.value
}

const init = (current: TypeSelectIem) => {
  currentItem.logo = current.logo
  currentItem.name = current.name
  currentItem.id = current.id ?? 0
}


watch(() => props.list, () => {
  let current = props.list[0]
  init(current)

}, { immediate: true })





</script>
<template>

  <SelectItem v-bind="{ ...currentItem }" @click="openPopover" id="auto-trigger" class="rounded-middle">
    <template #suffix v-if="isGt1">
      <ion-icon slot="icon-only" :class="['arrow', { 'rotate-180': popoverOpen }]" src="/first/svg/assets/arrow.svg" />

    </template>
  </SelectItem>

  <ion-popover v-if="isGt1" mode="md" side="bottom" alignment="start" trigger="auto-trigger"
    @didDismiss="popoverOpen = false" :dismiss-on-select="true">
    <ion-content class="select-list">
      <template v-for="it in list" :key="it.name">
        <SelectItem v-bind="{ name: it.name, logo: it.logo, id: it.id }" @click="() => changeSelect(it)" />
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

ion-icon.rotate-180 {
  transform: rotateX(180deg)
}





:deep(.select-list) {
  .item-wrap {
    &:nth-child(2n) {
      .bg-300();
    }

    &:first-child {
      border-radius: var(--rounded-middle) var(--rounded-middle) 0 0;
    }

    &:last-child {
      border-radius: 0 0 var(--rounded-middle) var(--rounded-middle);
    }
  }


}
</style>
