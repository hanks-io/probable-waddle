<template>
  <ion-menu-toggle v-for="item in list" class="activity-box" :key="item.id" @click="handleClick(item)">
    <ProgressiveImages class="activity-img" :src="item.image"/>
    <ion-label class="label">{{ item.showName }}</ion-label>
  </ion-menu-toggle>
</template>


<script setup lang="ts">
import { IonMenuToggle, IonLabel } from '@ionic/vue';
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