<template>
  <ion-tab-bar v-show="currentRouteShowTab" class="tab-bar" v-resize-directive="getElement">
    <div class="inner-wrap">
      <template v-for="(item, i) in tabList">
        <div v-if="item.slot" :key="'slot' + i" :tab="item.tab" :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']">
          <ion-buttons @click="showMenu">
            <ion-icon class="tab-img" :src="route.name === item.tab ? `/svg/tabbar/${item.tab}2-1.svg` : '/svg/menu1.svg'" />
          </ion-buttons>
          <ion-label class="tab-label">{{ $t(item.text) }}</ion-label>
        </div>
        <div v-else :key="i" :tab="item.tab" :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']" @click="navigator(item.route)">
          <div v-if="i === 2" class="flexible-img">
            <ion-icon :src="`/svg/tabbar/${item.tab}2-1.svg`" />
          </div>
          <ion-icon
            v-else
            :class="[i === 0 ? 'svg-with-gaps' : '', 'tab-img']"
            :src="route.name === item.tab ? `/svg/tabbar/${item.tab}2-1.svg` : `/svg/tabbar/${item.tab}2.svg`"
          />
          <ion-label :class="[i === 2 ? 'flexible-label' : 'tab-label']">{{ $t(item.text) }}</ion-label>
          <HotPoint :isShow="item.point" :class="`point-${i}`" classNames="a" />
        </div>
      </template>
    </div>
  </ion-tab-bar>
</template>

<script setup lang="ts">
import { IonTabBar, IonLabel, IonIcon, IonButtons } from "@ionic/vue";
import useTabLogic from "@/views/tabbar/components/tabBar/logic";
import HotPoint from "@/components/HotPoint/index.vue";
import vResizeDirective from "@/directives/resize";

const route = useRoute();
const elementStore = useElementStore(); // 元素信息
const { tabList, navigator, showMenu, currentRouteShowTab } = useTabLogic({ tabTextMaps: ['main.inicio', 'main.promo', 'main.invite', 'main.perfil',  'main.menu'] });

function getElement(elRef?: { target: { offsetHeight: number } }) {
  const { offsetHeight } = elRef?.target ?? {};
  if (offsetHeight) {
    elementStore.setTabBarHeight(offsetHeight);
  }
}

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
