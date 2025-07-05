<template>
  <!-- 主页面 -->
  <ion-page id="inicio">
    <ion-header mode="ios" class="ion-no-border">
      <!-- PWA信息栏 -->
      <component :is="pwaViewComponent" v-if="pwaBarVisible" />
      <!-- 顶部导航栏 -->
      <component :is="headerBarComponent" />
    </ion-header>
    <!-- 页面主内容 -->
    <ion-content ref="contentRef" class="relative rounded-t main-content" style="z-index: 20" scrollEvents
      @ionScroll="handleContentScroll">
      <div class="order-container">
        <!-- 轮播图 -->
        <SwiperView class="swiper-c" :key="swiperKey" @contextmenu.prevent />
        <!-- 活动栏 -->
        <component class="activity-c" :is="activityComponent" @contextmenu.prevent />
        <!-- 广播(跑马灯) -->
        <component class="marquee-c" :is="marqueeComponent" />

        <!-- 导航标签 -->
        <div id="game-buoy" />
        <component v-if="showBonusPool(1)" class="bonus-pool-c" :is="bonusPoolComponent" />
        <component :is="segmentComponent" id="stickyElement" ref="segmentRef" class="segment-c sticky" :sticky="sticky"
          :bottom="stickySegmentBottom" v-model="tabValue" :height="segmentHeight" @segmentChange="tabChange"
          @tabChange="tabChange1" />
        <!-- 内容 -->
        <div class="game-c">
          <component :is="gameTabComponent" :platformId="tabValue" @tabChange="tabChange1" />
          <div class="platform-game-c min-h-[20.9375rem]">
            <component v-if="showBonusPool(2)" class="bonus-pool-c" :is="bonusPoolComponent" />
            <PGameWrapper v-for="(item, i) in showGameList"
              v-intersection-directive="{ observerOptions: { rootMargin: '0px', threshold: 0.5 }, cb: watchBuoy, index: i, tabKey: item.id }"
              :style="`order:${i * 2}`" class="game-wrapper-c" :key="String(item.id) + i" v-bind="{
                ...forTabValueOptions(item),
              }" />
          </div>
        </div>
        <!-- App安装导航 -->
        <component class="app-install-c" :is="appInstallComponent" id="app-install-bar" v-if="!isApp" />
        <!-- 三方合作 -->
        <component class="apart-view-c" :is="partViewComponent" />
        <component class="game-class-c" :is="gameClassComponent" />
        <!-- 底部文案 -->
        <component class="footer-content-c" :is="footerContentComponent" />
      </div>

      <!-- 底部导航栏高度 -->
      <div :style="`height: calc(${tabBarHeight}px + 3.5rem)`" />
      <!-- 固定客服按钮 -->
      <component :is="customerServiceButtonComponent" :showUnRead="showUnRead"
        :style="`bottom: calc(${tabBarHeight}px + env(safe-area-inset-bottom) + 0.75rem)`" />
      <!-- 浮动的回到顶部按钮 -->
      <component :is="toTopButtonComponent" v-show="showBackToTop"
        :style="`bottom: calc(${tabBarHeight}px + env(safe-area-inset-bottom) + 1rem)`" @click="topHandle" />
      <!-- 红包雨 -->
      <RedPacket />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonHeader } from "@ionic/vue";
import PGameWrapper from '@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapper/1/index.vue';
import SwiperView from "../components/SwiperView/1/index.vue";
import RedPacket from "../components/RedPacket/default/index.vue";
import useComponents from "../useComponents";
import useInicioLogic from "../logic";
import RechargeBonus from '@/views/tabbar/tabs/inicio/components/RechargeBonus/index.vue'
import vIntersectionDirective from '@/directives/intersection';

const {
  themeConfig,
  themeHomeType,
  gameTabComponent,
  marqueeComponent,
  pwaViewComponent,
  segmentComponent,
  partViewComponent,
  activityComponent,
  headerBarComponent,
  gameClassComponent,
  bonusPoolComponent,
  appInstallComponent,
  toTopButtonComponent,
  footerContentComponent,
  customerServiceButtonComponent,
} = useComponents();


const {
  watchBuoy,
  tabChange1,
  segmentRef,
  showGameList,
  showBackToTop,
  forTabValueOptions,
  stickySegmentBottom,
  showBonusPool,
  tabBarHeight,
  swiperKey,
  contentRef,
  segmentHeight,
  tabValue,
  sticky,
  pwaBarVisible,
  isApp,
  showUnRead,
  handleContentScroll,
  tabChange,
  touchStartHandle,
  topHandle,
} = useInicioLogic();

</script>

<style lang="less" scoped>
@import './index.less';
</style>
