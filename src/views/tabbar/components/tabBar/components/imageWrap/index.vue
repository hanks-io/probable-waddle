<template>
  <ion-tab-bar v-show="currentRouteShowTab" class="tab-bar" ref="tabBarRef" v-bind="$attrs">
    <div class="inner-wrap" :style="{...wrapStyle, backgroundImage: `url(${loadImage.bgImg})`}">
      <template v-for="(item, i) in tabList">
        <component v-if="i === 2" :item="item" :index="i" :navigator="navigator" :key="item.text" :is="flexibleTabComponent.component" v-bind="flexibleTabComponent.options" />
        <component v-else :item="item" :index="i" :navigator="navigator" :key="item.text" :is="tabComponent.component" v-bind="tabComponent.options" />
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
  },
  loadImage: {
    type: Object,
    default: () => ({})
  }
})

const flexibleTabComponent = computed(() => {
  return props.componentList.find(item => item.componentName === 'tabbar_tabBar_flexibleTab');
});

const tabComponent = computed(() => {
  return props.componentList.find(item => item.componentName !== 'tabbar_tabBar_flexibleTab');
});

const { tabList, navigator, tabBarRef, currentRouteShowTab } = useTabLogic(props);


</script>

<style lang="less" scoped>
@import "./index.less";
</style>
