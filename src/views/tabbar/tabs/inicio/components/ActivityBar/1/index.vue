<template>
  <div class="wrapper">
    <ProgressiveImages
      v-for="(item, i) in promotionalList"
      :class="[`item-${i}`, 'item-image']"
      :key="item"
      :src="item.imageUrl"
      :errorImage="loadImage.activity[i]"
      @click="jumpPage(item, i)"
    />
  </div>
</template>

<script setup lang="ts">
import useActivityBarLogic from "@/views/tabbar/tabs/inicio/components/ActivityBar/logic";
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'

const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  }
})

const { 
  jumpPage,
  promotionalList,
} = useActivityBarLogic();

</script>

<style scoped lang="less">
@import './index.less';
</style>
