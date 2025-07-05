<template>
  <div v-if="flexibleTabPosition === item.tab && showBackToTop && route.name === item.tab" :tab="item.tab" :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']" @click="scrollToTop">
    <div class="active-block" />
    <ProgressiveImages
      class="tab-img"
      :src="loadImage.icon1"
    />
    <ion-label class="tab-label">top</ion-label>
    <HotPoint :isShow="item.point" :class="`point-${index}`" classNames="a" />
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from "@ionic/vue";
import { useRoute } from 'vue-router';
import HotPoint from "@/components/HotPoint/index.vue";
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import useTab from '@/views/tabbar/components/tabBar/components/flexibleTab/useTab';


const route = useRoute();

const props = defineProps({
  loadImage: {
    type: Object,
    default: () => { icon1: () => {} }
  },
  item: {
    type: Object,
    default: () => {}
  },
  index: {
    type: Number,
    default: 0
  },
  navigator: {
    type: Function,
    default: () => {}
  },
  flexibleTabPosition: {
    type: String,
    default: ''
  }
})

const { showBackToTop, scrollToTop } = useTab(props)

</script>

<style lang="less" scoped>
@import 'src/views/tabbar/components/tabBar/components/tabItem/3/index.less';
</style>