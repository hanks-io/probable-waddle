<template>
  <li :class="['card-button', layoutType]" @click="navigator(tab.route)" >
    <ion-label class="label">
      {{ tab.name }}
    </ion-label>
    <ProgressiveImages class="icon" :src="loadImage?.icon1(tab.tab)"/>
  </li>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import useNavigator from '@/views/tabbar/components/tabBar/useNavigator'


const props = defineProps({
  tab: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  loadImage: {
    type: Object,
    default: () => ({})
  },
  layoutType: {
    type: String,
    default: 'layout1'
  }
})

const { navigator } = useNavigator()

</script>

<style scoped lang="less">
@import './index.less';
</style>