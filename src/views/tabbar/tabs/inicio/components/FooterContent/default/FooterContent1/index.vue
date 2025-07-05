<!-- 底部文案 -->
<template>
  <div class="tabbar-tabs-inicio-components-FooterContent-default-index">
    <!-- 分割线 -->
    <div class="divider" />
    <div class="footer-container">
      <!-- 标题 -->
      <div class="title">
        {{ merchanName }}
      </div>
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
        <div class="flex justify-around" v-if="showMark">
          <span class="version">{{ browser + getBuildVersion() }}</span>
          <span class="version">{{ origin }}</span>
          <span class="version">{{ webPushRegId }}</span>
        </div>

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
