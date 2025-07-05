<template>
  <ion-tab-bar v-show="currentRouteShowTab" class="tab-bar" ref="tabBarRef">
    <div class="inner-wrap" :style="wrapStyle">
      <template v-for="(item, i) in tabList" :key="item.tab">
        <template v-for="cItem in componentList" :key="cItem.key">
          <component
            :item="item"
            :index="i"
            :navigator="navigator"
            :is="cItem.component"
            v-bind="cItem.options"
          />
        </template>
      </template>
    </div>
  </ion-tab-bar>
</template>

<script setup lang="ts">
import { IonTabBar, IonLabel, IonIcon } from "@ionic/vue";
import useTabLogic from "@/views/tabbar/components/tabBar/logic";


const props = defineProps({
  tabTextMaps: {
    type: Array,
    default: () => []
  },
  componentList: {
    type: Array,
    default: () => []
  },
  wrapStyle: {
    type: Object,
    default: () => ({})
  }
})

const { tabList, navigator, tabBarRef, currentRouteShowTab } = useTabLogic(props);

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
