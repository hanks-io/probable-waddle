<script setup lang="ts">
import AmountBtn from './AmountBtn.vue'
import AmountBtnDefault from './AmountBtnDefault.vue'
import { getTheme } from '@/theme/hooks'
const { theme, skin } = getTheme()
export interface AmountBtnItem {
  amount: number
  rate?: number
}
const emit = defineEmits<{
  (e: 'amountHandle', amount: number): void
}>()
let props = defineProps<{
  amountBtnList: AmountBtnItem[],
  amountInput: number | string
  isVirtualCurrency: boolean
}
>()

const currentComp = computed(() => {
  return skin === 'default' ? AmountBtnDefault : AmountBtn
})

const classNames = computed(() => {
  return `${skin === 'default' ? 'default' : 'first'}-btn-list-wrap`
})

const amountHandle = (item: AmountBtnItem) => {
  if (item.amount === props.amountInput) return
  emit('amountHandle', item.amount)
}

</script>
<template>
  <div class="flex-between" :class="[theme, classNames]">
    <template v-for="item in amountBtnList">
      <currentComp v-bind="{ ...item, isActive: item.amount == amountInput, isVirtualCurrency }" @click="() => amountHandle(item)" />
    </template>

    <div class="placeholder-btn"></div>

  </div>

</template>

<style scoped lang="less">
.first-btn-list-wrap {
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-content: space-between;
  gap: .625rem;
  margin-bottom: .625rem;

}

.default-btn-list-wrap {
  width: 100%;
  flex-wrap: wrap;
  align-content: space-between;
  gap: .625rem;
  margin-bottom: .625rem;
}
.placeholder-btn{
  flex: 0 0 calc(33.333% - (2/3 * .625rem));
}

</style>
