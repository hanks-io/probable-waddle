<!-- 奖品集卡 -->
<template>
  <div class="flex-1 flex flex-col items-center justify-center">
    <ion-img class="w-[6.875rem]" src="/svg/activity/wheel_goldCoins.svg"/>
    <span class="gold-count text-xl font-black text-[#D434CD] mt-2.5">{{ convertMoneyToShow(amount) }}</span>
  </div>
</template>

<script setup lang="ts">
import { IonImg } from '@ionic/vue';
import { convertMoneyToShow } from '@/utils/custom'

defineProps({
  amount: { type: Number, required: true }, // 金额
})
</script>

<style scoped>
.gold-count {
  text-shadow: -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px  1px 0 #FFF, 1px  1px 0 #FFF
}
</style>
