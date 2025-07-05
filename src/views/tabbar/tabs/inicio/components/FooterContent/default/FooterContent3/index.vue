<!-- 底部文案 -->
<template>
  <div class="footer-container px-[.9375rem] pt-[1.57rem] pb-[0.9506rem] w-[22.5rem] mx-auto">
    <!-- 内容区域 -->
    <div class="content mb-[1.5106rem] mt-[.625rem]">
      <p v-for="(item, index) in dateList" :key="index"
        class="text text-[.6875rem] min-h-[1.25rem] leading-[1.25rem]">{{ item }}</p>
    </div>
    <!-- 底部商户信息 -->
    <div class="intro text-[.6875rem] min-h-[1.25rem] leading-[1.25rem]  text-center" @mousedown="startPress"
      @mouseup="endPress" @mouseleave="endPress" @touchstart.passive="startPress" @touchend="endPress"
      @touchcancel="endPress" @touchmove.passive="endPress"
    >
      <p>©2025 {{ merchanName }} {{ $t('subtitle.rightsReserved') }}
        <span class="text font-black text-sm">{{ $t('viewsTabbar.footerBar1') }}</span>
      </p>
      <!-- 版本号 -->
      <div class="version flex justify-around" v-if="showMark">
        <span class="ml-2 text-[0.625rem] text-center">{{ browser + getBuildVersion() }}</span>
        <span class="ml-2 text-[0.625rem] text-center">{{ origin }}</span>
        <span class="ml-2 text-[0.625rem] text-center">{{ webPushRegId }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import useFooterContentLogic from '@/views/tabbar/tabs/inicio/components/FooterContent/logic';

  const {
    merchanName,
    dateList,
    browser,
    showMark,
    origin,
    startPress,
    endPress,
    getBuildVersion,
    webPushRegId,
  } = useFooterContentLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
