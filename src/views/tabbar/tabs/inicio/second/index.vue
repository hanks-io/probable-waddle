<!-- 主页面 -->
<template>
  <ion-page>
    <div class="ion-page">
      <ion-header mode="ios" class="ion-no-border">
        <!-- PWA信息栏 -->
        <PwaView v-if="pwaBarVisible" />
    
        <!-- 顶部导航栏 -->
        <HeaderBar />
      </ion-header>
      <!-- 页面主内容 -->
      <ion-content ref="contentRef" class="rounded-t main-content relative" style="z-index:20;" scrollEvents
        @ionScroll="handleContentScroll">
        <!-- 轮播图 -->
        <SwiperView class="px-3" :key="swiperKey" @contextmenu.prevent />
        <!-- 活动栏 -->
        <ActivityBar @contextmenu.prevent />
        <!-- 广播(跑马灯) -->
        <MarqueeView />
        <!-- 导航标签 -->
        <div class="relative">
          <Segment id="stickyElement" :sticky="sticky" v-model="tabValue"
            @segmentChange="tabChange" />
        </div>
        <!-- 内容 -->
        <GameWrapper
          :gameList="showGameList"
          :watchBuoy="watchBuoy"
          :componentList="gameWrapperComponentOptions.list"
          v-bind="gameWrapperComponentOptions.options"
        />
        <div class="watermark px-[1.25rem] pt-[1.25rem] mt-7">
          <!-- 三方合作 -->
          <PartView />
          <!-- App安装导航 -->
          <AppInstall id="app-install-bar" v-if="!isApp" />
        </div>
        <!-- 底部文案 -->
        <FooterContent />
        <!-- 底部导航栏高度 -->
        <div :style="`height: calc(${tabBarHeight}px )`" />
        <!-- 浮动的回到顶部按钮 -->
        <div
          class="to-top-box fixed flex flex-col items-center right-4 z-50 px-2.5 pt-[.1875rem] pb-[.3125rem] rounded-[.25rem]"
          v-show="showBackToTop" :style="`bottom: calc(${tabBarHeight}px + 2rem)`" @click="topHandle">
          <ion-icon class="to-top text-2xl" src="/first/svg/to-top.svg" />
          <span class="text-xs -mt-1.5 to-top-text">TOP</span>
        </div>
        <!-- 客服按钮 -->
        <div class="fixed left-2 z-50" :style="`bottom: calc(${tabBarHeight}px + 1.75rem)`" @click="goToCustomer">
          <div class="support flex items-center justify-center h-[3rem] w-[3rem]"><ion-icon
              class="h-[2.375rem] w-[2.375rem]" src="/svg/serivce.svg" /></div>
          <RipplePoint v-show="showUnRead" size="0.5rem" class="-top-[0.5rem] right-[-0.5rem]" />
        </div>
        <!-- 红包雨 -->
        <RedPacket />
      </ion-content>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonHeader, IonImg } from '@ionic/vue'
import RechargeBonus from '@/views/tabbar/tabs/inicio/components/RechargeBonus/index.vue'
import FooterContent from '../components/FooterContent/second/index.vue'
import PopularView from '../components/PopularView/first/index.vue'
import MarqueeView from '../components/MarqueeView/second/index.vue'
import ActivityBar from '../components/ActivityBar/second/index.vue'
import AppInstall from '../components/AppInstall/second/index.vue'
import SwiperView from '../components/SwiperView/first/index.vue'
import SportView from '../components/SportView/first/index.vue'
import HeaderBar from '../components/HeaderBar/second/index.vue'
import RedPacket from '../components/RedPacket/first/index.vue'
import SortView from '../components/SortView/second/index.vue'
import PartView from '../components/PartView/second/index.vue'
import Segment from '../components/Segment/second/index.vue'
import PwaView from '@/pwa/HeaderBar/First.vue'
import RipplePoint from '@/components/HotPoint/ripplePoint.vue'
import vIntersectionDirective from '@/directives/intersection';
import useInicioLogic from '../logic'
import GameWrapper from '@/views/tabbar/tabs/inicio/components/GameWrapper/index.vue'
import { useConfiguration } from '@/hooks/useLoadComponent';


const {
  watchBuoy,
  swiperKey,
  contentRef,
  tabValue,
  sticky,
  pwaBarVisible,
  popularPlatform,
  isApp,
  showBackToTop,
  showUnRead,
  tabBarHeight,
  paymentPartnerPic,
  isShowSportsGames,
  handleContentScroll,
  tabChange,
  touchStartHandle,
  topHandle,
  goToCustomer,
  navigateToSearch,
} = useInicioLogic()

const gameStore = useGameStore()
const showGameList = computed(() => gameStore.allGameList)
const gameWrapperOptions = {
  componentName: 'tabbar_inicio_GameWrapper',
  componentId: 1,
  gameWrapperOptions: {
    titleType: '2',
    headType: '1',
    style1: {
      size: 6,
      row: 2,
      hotSize: 9,
      hotRow: 3,
    },
    style2: {
      size: 6,
      row: 2,
      hotSize: 9,
      hotRow: 3,
    },
    style3: {
      size: 6,
      row: 2,
      hotSize: 9,
      hotRow: 3,
    }
  },
  children: [
    {
      componentName: 'tabbar_inicio_GameWrapper_Wrapper',
      componentId: 2,
      children: [
        {
          componentName: 'tabbar_inicio_GameWrapper_WrapperHead',
          componentId: 1,
          style: {
            marginTop: '1.75rem',
            marginBottom: '0.9375rem'
          },
          children: [
            {
              componentName: 'tabbar_inicio_GameWrapper_WrapperHead_start',
              componentId: 3,
              styleId: 'svg-theme-color2',
            },
            {
              componentName: 'tabbar_inicio_GameWrapper_WrapperHead_center',
              componentId: 2,
            },
            {
              componentName: 'tabbar_inicio_GameWrapper_WrapperHead_end',
              componentId: 1,
              layoutType: 'layout2',
              imageList: [
                {
                  name: 'icon',
                  id: 2,
                }
              ]
            }
          ]
        }
      ]
    },
  ]
}

const {
  createComponent
} = useConfiguration();
const gameWrapperComponentOptions = computed(() => {
  const { children, ...options } = gameWrapperOptions;
  return {
    options,
    list: createComponent(children),
  };
});

</script>

<style scoped>
div.watermark {
  position: relative;
  z-index: 9;
  overflow: hidden;
  background-color: var(--bg-inicio-watermark);
}

div.support {
  border-radius: 1rem;
  background: var(--bg-inicio-float-btn1);
}

div.to-top-box {
  background: var(--bg-inicio-float-btn2);
}

ion-icon.to-top {
  color: var(--color-theme-base);
}

span.to-top-text {
  color: var(--color-base);
}
</style>
