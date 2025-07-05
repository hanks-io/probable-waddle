<template>
  <ion-tab-bar v-show="currentRouteShowTab" class="tab-bar" ref="tabBarRef">
    <div class="inner-wrap">
      <div
        v-for="(item, i) in tabList"
        :key="i"
        :tab="item.tab"
        :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']"
        @click="navigator(item.route)"
      >
        <div class="active-block" />
        <ion-icon class="tab-img" :src="route.name === item.tab ? `/svg/tabbar/${item.tab}11.svg` : `/svg/tabbar/${item.tab}1.svg`" />
        <ion-label class="tab-text">{{ $t(item.text) }}</ion-label>
        <HotPoint :isShow="item.point" :class="`point-${i}`" classNames="a"/>
      </div>
    </div>
  </ion-tab-bar>
</template>

<script setup lang="ts">
  import { IonTabBar, IonLabel, IonIcon } from "@ionic/vue";
  import useTabLogic from "@/views/tabbar/components/tabBar/logic";
  import HotPoint from "@/components/HotPoint/index.vue";
  import vResizeDirective from '@/directives/resize';

  const route = useRoute();
  const { tabList, navigator, tabBarRef, currentRouteShowTab } = useTabLogic();

</script>

<style lang="less" scoped>
</style>
