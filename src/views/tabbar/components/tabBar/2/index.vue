<template>
  <ion-tab-bar v-show="currentRouteShowTab" class="tab-bar" ref="tabBarRef">
    <div class="inner-wrap">
      <div v-for="(item, i) in tabList" :key="i" :tab="item.tab" :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']" @click="navigator(item.route)">
        <component v-if="i === 2 && componentList.length > 0" class="flexible-img" :is="componentList[0].component" v-bind="componentList[0].options" :label="$t(item.text)"/>
        <ion-icon v-else-if="route.name === item.tab" class="tab-icon" :src="loadImage.icon(item.tab)" />
        <GradientSVG v-else class="tab-icon" :src="loadImage.icon(item.tab)" :styleId="`tab-theme-color${svgId}`">
          <template #default>
            <svg class="svg-wall">
              <defs>
                <linearGradient id="tab-theme-color1" x1="13.0001" y1="3.45947" x2="13.0001" y2="21.4907" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#A6A296"/>
                  <stop offset="1" stop-color="#615749"/>
                </linearGradient>
                <linearGradient id="tab-theme-color2" x1="12.5" y1="8.21054" x2="12.5" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#969CA6"/>
                  <stop offset="1" stop-color="#495161"/>
                </linearGradient>
              </defs>
            </svg>
          </template>
        </GradientSVG>
        <ion-label v-if="i !== 2" class="tab-label">{{ $t(item.text) }}</ion-label>
        <HotPoint :isShow="item.point" :class="`point-${i}`" classNames="a" />
      </div>
    </div>
  </ion-tab-bar>
</template>

<script setup lang="ts">
import { IonTabBar, IonLabel, IonIcon } from "@ionic/vue";
import useTabLogic from "@/views/tabbar/components/tabBar/logic";
import HotPoint from "@/components/HotPoint/index.vue";
import GradientSVG from '@/components/GradientSVG/index.vue';

const props = defineProps({
  svgId: {
    type: String,
    default: ''
  },
  componentList: {
    type: Array,
    default: () => []
  },
  loadImage: {
    type: Object,
    default: () => { icon: () => {} }
  }
})

const route = useRoute();
const { tabList, navigator, tabBarRef, currentRouteShowTab } = useTabLogic();

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
