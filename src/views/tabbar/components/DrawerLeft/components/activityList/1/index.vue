<template>
  <ion-menu-toggle v-for="item in list" :class="['activity-box', layoutType]" :key="item.id" @click="handleClick(item)">
    <ProgressiveImages class="activity-img" :src="item.logoSrc"/>
    <ion-label class="label ellipsis">{{ item.shortName }}</ion-label>
  </ion-menu-toggle>
</template>


<script setup lang="ts">
import { IonMenuToggle, IonLabel } from '@ionic/vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  handleClick: {
    type: Function,
    default: () => {}
  },
  layoutType: {
    type: String,
    default: 'layout1'
  }
})

</script>

<style scoped lang="less">
@import './index.less';
</style>