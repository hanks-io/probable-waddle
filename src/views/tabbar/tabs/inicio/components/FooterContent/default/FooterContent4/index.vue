<!-- 底部文案 -->
<template>
  <div class="footer-container">
    <ion-img class="logo"  :src="appLogo" />
      <!-- 内容区域 -->
      <div class="content">
        <div v-for="(item, index) in dateList" :key="index">
          <p class="text">{{ item }}</p>
        </div>
      </div>
      <!-- 底部商户信息 -->
      <div class="intro" @mousedown="startPress"
        @mouseup="endPress" @mouseleave="endPress" @touchstart.passive="startPress" @touchend="endPress"
        @touchcancel="endPress" @touchmove.passive="endPress">
        <p>©2025 {{ merchanName }} {{ $t('subtitle.rightsReserved') }}
          <span class="text">{{ $t('viewsTabbar.footerBar1') }}</span>
        </p>
        <!-- 版本号 -->
        <span v-if="showMark" class="version">{{ browser + getBuildVersion() }}</span>
        <span v-if="showMark" class="version">{{ webPushRegId }}</span>
      </div>
    </div>
</template>

<script setup lang="ts">
  import { IonImg } from '@ionic/vue';
  import useFooterContentLogic from '@/views/tabbar/tabs/inicio/components/FooterContent/logic';

  const {
    appLogo,
    merchanName,
    dateList,
    browser,
    showMark,
    startPress,
    endPress,
    getBuildVersion,
    webPushRegId,
  } = useFooterContentLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
