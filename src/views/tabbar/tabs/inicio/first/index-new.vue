<!-- 主页面 -->
<template>
  <ion-page ref="mainPageRef" class="main-page" v-bind="pageComponentOptions.options">
    <ion-header mode="ios" class="ion-no-border">
      <component v-for="component in pageComponentOptions.list[0].list" :key="component.key" :is="component.component" v-bind="component.options" />
    </ion-header>
    <!-- 页面主内容 -->
    <ion-content
      ref="contentRef"
      class="rounded-t main-content relative"
      style="z-index:20;"
      scrollEvents
      v-bind="pageComponentOptions.list[1].options"
      @ionScroll="handleContentScroll"
    >
     
      <template v-for="component in pageComponentOptions.list[1].list" :key="component.key">
        <component
          v-if="component.componentName === 'tabbar_inicio_Segment'"
          :is="component.component"
          v-bind="component.options" 
          id="stickyElement" 
          ref="segmentRef"
          class="segment-c"
          :sticky="sticky"
          :bottom="stickySegmentBottom"
          v-model="tabValue"
          :height="segmentHeight"
          @segmentChange="tabChange"
          @tabChange="tabChange1"
        />
        <template v-else-if="component.componentName === 'tabbar_inicio_GameWrapper'">
          <component
            :gameList="showGameList"
            :is="component.component"
            :watchBuoy="watchBuoy"
            v-bind="component.options"
          />
        </template>
        <component v-else :is="component.component" v-bind="component.options" @contextmenu.prevent />
      </template>
      <!-- 红包雨 -->
      <RedPacket />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonHeader } from '@ionic/vue'
import RechargeBonus from '@/views/tabbar/tabs/inicio/components/RechargeBonus/index.vue'
import RedPacket from '../components/RedPacket/first/index.vue'
import useInicioLogic from '../logic'
import useComponents from "../useComponents";

const {
  pageComponentOptions,
} = useComponents();


const {
  watchBuoy,
  tabChange1,
  segmentRef,
  mainPageRef,
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

<style scoped lang="less">
@import './index.less';
</style>
