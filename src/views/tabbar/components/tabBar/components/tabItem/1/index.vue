<template>
  <div :tab="item.tab" :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']" @click="navigator(item.route)">
    <ion-icon class="tab-icon" :src="loadImage.icon1(item.tab)" />
    <ion-label class="tab-label">{{ $t(item.text) }}</ion-label>
    <HotPoint :isShow="item.point" :class="`point-${index}`" classNames="a" />
  </div>
</template>

<script setup lang="ts">
import { IonLabel, IonIcon } from "@ionic/vue";
import HotPoint from "@/components/HotPoint/index.vue";

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
  }
})

</script>

<style lang="less" scoped>
@import './index.less';
</style>