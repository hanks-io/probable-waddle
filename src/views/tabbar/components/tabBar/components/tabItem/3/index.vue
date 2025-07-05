<template>
  <div v-if="hideTab" :tab="item.tab" :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']" @click="navigator(item.route)">
    <div class="active-block" />
    <ProgressiveImages
      class="tab-img"
      :src="loadImage.icon1(item.tab)"
    />
    <ion-label class="tab-label">{{ $t(item.text) }}</ion-label>
    <HotPoint :isShow="item.point" :class="`point-${index}`" classNames="a" />
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from "@ionic/vue";
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

const hideTab = computed(() => {
  const { flexibleTabPosition, item } = props;
  return flexibleTabPosition !== item.tab || !showBackToTop.value || flexibleTabPosition !== route.name
})

const { showBackToTop } = useTab(props)
</script>

<style lang="less" scoped>
@import './index.less';
</style>