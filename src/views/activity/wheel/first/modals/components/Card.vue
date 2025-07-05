<!-- 奖品集卡 -->
<template>
  <div class="flex-1 flex items-center">
    <div class="w-[4.375rem] h-[5.625rem] flex flex-col rounded-[.3125rem]" :style="cordStyle">
      <div class="flex-1 flex items-center justify-center">
        <span class="card-name text-4xl font-black" :style="nameStyle">{{ name }}</span>
      </div>
      <div class="h-5 flex items-center justify-center">
        <span class="text-bas font-black" :style="strokeStyle">x{{ amount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" >
defineProps({
  strokeStyle: { type: Object, required: true },  // 边框样式
  cordStyle: { type: Object, required: true },    // 卡片样式
  nameStyle: { type: Object, required: true },    // 名称样式
  amount: { type: Number, required: true },       // 数量
  name: { type: String, required: true },         // 名称
})
</script>

<style scoped>
.card-name {
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px  1px 0 #fff, 1px  1px 0 #fff;
}
</style>