<template>
  <div v-show="currentRouteShowTab" ref="tabBarRef" class="tabbar-MainPage-components-Tabs-Tabs1-index">
    <ion-tab-bar>
      <div class="tab-btn" v-for="(item, i) in tabList" :key="item.route" :tab="item.tab"
        @click="navigator(item.route)">
        <ion-icon :class="['tab-img', route.name == item.tab ? 'on' : '']"
          :src="`/svg/tabbar/${item.tab}.svg`" />
        <ion-label :class="['label', route.name == item.tab ? 'active' : '']">
          {{ $t(item.text) }}
        </ion-label>
        <HotPoint :isShow="item.point" :class="`point-${i}`" classNames="a"/>
      </div>
    </ion-tab-bar>
  </div>
</template>
<script setup lang="ts">
  import { IonTabBar, IonLabel, IonIcon } from "@ionic/vue";
  import useTabLogic from "@/views/tabbar/components/tabBar/logic";
  import HotPoint from "@/components/HotPoint/index.vue";

  const route = useRoute();

  const { tabBarRef, tabList, navigator, currentRouteShowTab } = useTabLogic();

</script>
<style lang="less" scoped>
@import './index.less';
</style>
