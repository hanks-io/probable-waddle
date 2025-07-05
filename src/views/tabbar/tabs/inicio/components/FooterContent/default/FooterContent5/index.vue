<!-- 底部文案 -->
<template>
  <div class="footer-container">
    <div class="logo-box">
      <div class="logo-box-inner">
        <ion-img class="logo" :src="appLogo" />
        <div
          class="age"
          @mousedown="startPress"
          @mouseup="endPress"
          @mouseleave="endPress"
          @touchstart.passive="startPress"
          @touchend="endPress"
          @touchcancel="endPress"
          @touchmove.passive="endPress"
        >
          <ion-icon icon="/svg/age.svg"></ion-icon>
        </div>
      </div>
      <p class="intro">©2025 {{ merchanName }} {{ $t('subtitle.rightsReserved') }}</p>
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <div v-for="(item, index) in dateList" :key="index">
        <p class="text">{{ item }}</p>
      </div>
      <span v-if="showMark" class="version">{{ browser + getBuildVersion() }}</span>

      <LanguageSelectionBox class="language-selection-box" />

      <PartView class="social-content" :gamePlatform="false" :paymentPlatform="false"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonImg, IonIcon } from '@ionic/vue';
  import PartView from '@/views/tabbar/tabs/inicio/components/PartView/default/PartView5/index.vue'
  import LanguageSelectionBox from '@/views/tabbar/components/DrawerLeft/default/DrawerLeft6/languageSelectionBox.vue';
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
  } = useFooterContentLogic();

</script>

<style lang="less" scoped>
@import './index.less';
</style>
