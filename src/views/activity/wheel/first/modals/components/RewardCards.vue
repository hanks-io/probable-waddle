<template>
  <div class="flex justify-around px-1">
    <div class="w-[3.875rem] h-[5rem] flex flex-col rounded-[.3125rem]" :style="setCardStyle(`prop_${item.name}`, 'small')" v-for="(item,index) in rewardCards" :key="index">
      <div class="flex-1 flex items-center justify-center">
        <span class="card-name text-4xl font-black" :style="setCardNameStyle(`prop_${item.name}`)">{{ item.name.charAt(0) }}</span>
      </div>
      <div class="h-4 flex items-center justify-center">
        <span class="font-black" :style="setAccountStroke(`prop_${item.name}`, '.75rem')">x{{ item.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { setCardStyle, setCardNameStyle, setAccountStroke } from '../../hooks/setStyle';

defineProps({
  rewardCards: { type: Array as () => Record<string, any>[], required: true },  // 弹窗显示状态
})

</script>

<style scoped>
.card-name {
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px  1px 0 #fff, 1px  1px 0 #fff;
}
</style>