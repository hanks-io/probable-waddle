<!-- 主页面 -->
<template>
  <ion-page v-if="!isNewPage">
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
        <div class="mr-9 relative">
          <Segment id="stickyElement" :sticky="sticky" v-model="tabValue" :top="segmentTop"
            @segmentChange="tabChange" />
          <div class="find absolute top-0 -right-7 h-full flex items-center pl-10 pr-[.3125rem]">
            <ion-icon class="text-[2rem]" src="/first/svg/find.svg" @click="navigateToSearch" />
          </div>
        </div>
        <!-- 内容 -->
        <GameWrapper
          :gameList="showGameList"
          :watchBuoy="watchBuoy"
          :componentList="gameWrapperComponentOptions.list"
          v-bind="gameWrapperComponentOptions.options"
        />
        <div class="watermark pt-4 pb-8 mt-5 px-3">
          <ion-icon class="text-[23rem] absolute left-0 top-[-26px] z-[-9]" style="color:var(--telegram-bg)"
            icon="/first/svg/telegram.svg" />
          <!-- 三方合作 -->
          <PartView />
          <!-- 分割线 -->
          <div class="line h-[1px] mx-[.9375rem]" />
          <!-- App安装导航 -->
          <AppInstall id="app-install-bar" v-if="!isApp" />
        </div>
        <!-- 充值平台 -->
        <div class="payment-partner">
          <ion-img class="w-full" :src="paymentPartnerPic" />
        </div>
        <!-- 底部文案 -->
        <FooterContent />
        <!-- 底部导航栏高度 -->
        <div :style="`height: calc(${tabBarHeight}px + 3.5rem)`" />
        <!-- 浮动的回到顶部按钮 -->
        <div
          class="to-top-box fixed flex flex-col items-center right-4 z-50 px-2.5 pt-[.1875rem] pb-[.3125rem] rounded-[.25rem]"
          v-show="showBackToTop" :style="`bottom: calc(${tabBarHeight}px + 2rem)`" @click="topHandle">
          <ion-icon class="to-top text-2xl" src="/first/svg/to-top.svg" />
          <span class="text-xs -mt-1.5 to-top-text">TOP</span>
        </div>
        <!-- 客服按钮 -->
        <div class="fixed left-2 z-50" :style="`bottom: calc(${tabBarHeight}px + 1.75rem)`" @click="goToCustomer">
          <div class="support flex items-center justify-center rounded-full h-[3.25rem] w-[3.25rem]">
            <ion-icon class="h-[2.375rem] w-[2.375rem]" src="/first/svg/support.svg" />
          </div>
          <RipplePoint v-show="showUnRead" size="0.5rem" class="top-0 right-[-0.5rem]" />
        </div>
        <!-- 红包雨 -->
        <RedPacket />
      </ion-content>
    </div>
  </ion-page>
  <NewPage v-else />
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonHeader, IonImg } from '@ionic/vue'
import RechargeBonus from '@/views/tabbar/tabs/inicio/components/RechargeBonus/index.vue'
import FooterContent from '../components/FooterContent/first/index.vue'
import PopularView from '../components/PopularView/first/index.vue'
import MarqueeView from '../components/MarqueeView/first/index.vue'
import ActivityBar from '../components/ActivityBar/first/index.vue'
import AppInstall from '../components/AppInstall/6/index.vue'
import SwiperView from '../components/SwiperView/first/index.vue'
import SportView from '../components/SportView/first/index.vue'
import HeaderBar from '../components/HeaderBar/first/index.vue'
import RedPacket from '../components/RedPacket/first/index.vue'
import SortView from '../components/SortView/first/index.vue'
import PartView from '../components/PartView/first/index.vue'
import Segment from '../components/Segment/first/index.vue'
import PwaView from '@/pwa/HeaderBar/First.vue'
import RipplePoint from '@/components/HotPoint/ripplePoint.vue'
import vIntersectionDirective from '@/directives/intersection';
import useInicioLogic from '../logic'
import NewPage from './index-new.vue'
import { getTheme } from '@/theme/hooks'
import GameWrapper from '@/views/tabbar/tabs/inicio/components/GameWrapper/index.vue'
import { useConfiguration } from '@/hooks/useLoadComponent';

const isNewPage = ref(false)
// index-new.vue 还有调用一次useInicioLogic，  加这个防止多次调用useInicioLogic， 里面的watch和onMounted会多次执行
const getLogicData = () => {
  const { newSkin } = getTheme()
  if (newSkin) {
    isNewPage.value = true
    return {}
  }
  isNewPage.value = false
  return useInicioLogic()
}

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
} = getLogicData()

const segmentTop = ref('0')
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
              componentId: 2,
            },
            {
              componentName: 'tabbar_inicio_GameWrapper_WrapperHead_center',
              componentId: 2,
            },
            {
              componentName: 'tabbar_inicio_GameWrapper_WrapperHead_end',
              componentId: 1,
              layoutType: 'layout1',
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
ion-popover {
  --width: fit-content;
  --backdrop-opacity: 0;
}

ion-popover::part(backdrop) {
  background-color: rgb(246, 247, 249);
}

ion-popover::part(content) {
  border: 1px solid #293548
}

ion-item.swiper {
  --border-radius: 14px;
  --min-height: 9.375rem;
  --background: transparent;
  --padding-end: .75rem;
  --padding-start: .75rem;
  --padding-top: .75rem;
  --inner-padding-end: 0;
}

ion-segment {
  /* 设置导航标签背景色 */
  --background: #101629;
}

ion-segment-button {
  /* 取消导航标签按钮默认外边距 */
  margin-top: 0;
  margin-bottom: 0;
}

ion-segment-button ion-img {
  /* 取消导航标签图标与标签之间的默认边距 */
  margin-top: 4px;
}

ion-segment-button ion-label {
  /* 取消导航标签的标签与指示器之间的边距 */
  text-transform: capitalize;
  /* 首字母大写 */
  margin-top: 0;
  margin-bottom: 4px;
}

ion-segment-button.ios::part(indicator) {
  /* 设置导航标签指示器样式 */
  padding-inline: 0;
}

.line-clamp-2 leading-4 {
  /* 设置文本文字按单词换行并居中 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  text-align: center;
}

ion-thumbnail {
  /* 设置缩略图样式 */
  --border-radius: 14px;
}

ion-item {
  --inner-border-width: 0;
}

div.card-box {
  width: calc(33.333333% - .5rem);
}

div.watermark {
  position: relative;
  z-index: 9;
  overflow: hidden;
  background-color: var(--color-bg-200);
}

div.payment-partner {
  background: var(--color-card-bg-400);
}

div.line {
  background: var(--line-color);
}

div.support {
  background: var(--color-button-bg-support-bg);
}

div.to-top-box {
  background: var(--color-button-bg-gray);
}

ion-icon.to-top {
  color: var(--color-primary-800);
}

span.to-top-text {
  color: var(--float-black-button-color);
}

div.find {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0), var(--color-bg-300) 50%)
}

div.find ion-icon {
  color: var(--color-primary-800);

}
</style>
