<template>
  <ion-tab-bar v-show="currentRouteShowTab" class="tab-bar" v-resize-directive="getElement">
    <div class="inner-wrap">
      <div v-for="(item, i) in tabList" :key="i" :tab="item.tab" :class="[route.name === item.tab ? 'active-tab' : '', 'tab-btn']" @click="navigator(item.route)">
        <div v-if="i === 2" class="flexible-img">
          <ion-icon class="flexible-img-backdrop" :src="`/svg/tabbar/${item.tab}3.svg`" />
          <ion-icon class="flexible-img-ring" :src="`/svg/tabbar/${item.tab}3-1.svg`" />
          <ProgressiveImages
            class="flexible-img-main"
            :src="`/icons/tabbar/${item.tab}3.png`"
          />
        </div>
        <ProgressiveImages
          v-else
          class="tab-img"
          :src="`/icons/tabbar/${item.tab}3.png`"
        />
        <ion-label :class="[i === 2 ? 'flexible-label' : 'tab-label']">{{ $t(item.text) }}</ion-label>
        <HotPoint :isShow="item.point" :class="`point-${i}`" classNames="a" />
      </div>
    </div>
  </ion-tab-bar>
</template>

<script setup lang="ts">
import { IonTabBar, IonLabel, IonIcon, IonButtons, menuController } from "@ionic/vue";
import useTabLogic from "@/views/tabbar/components/tabBar/logic";
import HotPoint from "@/components/HotPoint/index.vue";
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import vResizeDirective from "@/directives/resize";



const route = useRoute();
const elementStore = useElementStore(); // 元素信息
const { tabList, navigator, currentRouteShowTab } = useTabLogic({ tabTextMaps: ['main.inicio', 'main.promo', 'main.invite', 'main.withdraw',  'main.perfil'] });

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
