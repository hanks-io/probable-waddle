<template>
  <ion-tab-bar v-show="currentRouteShowTab" class="tab-bar" ref="tabBarRef">
    <div class="inner-wrap">
      <div v-for="(item, i) in tabList" :key="i" :tab="item.tab" :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']" @click="navigator(item.route)">
        <ion-icon class="tab-icon" :src="loadImage.icon(item.tab)" />
        <ion-label class="tab-label">{{ $t(item.text) }}</ion-label>
        <HotPoint :isShow="item.point" :class="`point-${i}`" classNames="a" />
      </div>
    </div>
  </ion-tab-bar>
</template>

<script setup lang="ts">
import { IonTabBar, IonLabel, IonIcon } from "@ionic/vue";
import useTabLogic from "@/views/tabbar/components/tabBar/logic";
import HotPoint from "@/components/HotPoint/index.vue";


const props = defineProps({
  loadImage: {
    type: Object,
    default: () => { icon: () => {} }
  }
})

const route = useRoute();
const { tabList, navigator, tabBarRef, currentRouteShowTab } = useTabLogic({ tabTextMaps: ['main.inicio', 'main.promo', 'main.invite', 'main.withdraw',  'main.perfil'] });

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
