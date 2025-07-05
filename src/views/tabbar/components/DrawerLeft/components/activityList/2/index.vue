<template>
  <ion-menu-toggle v-for="item in list" class="activity-box" :key="item.id">
    <ProgressiveImages class="activity-img" :src="item.image" @click="handleClick(item)"/>
  </ion-menu-toggle>
</template>


<script setup lang="ts">
import { IonMenuToggle } from '@ionic/vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'

defineProps({
  list: {
    type: Array,
    default: () => []
  },
  handleClick: {
    type: Function,
    default: () => {}
  }
})
</script>

<style scoped lang="less">
@import './index.less';
</style>
