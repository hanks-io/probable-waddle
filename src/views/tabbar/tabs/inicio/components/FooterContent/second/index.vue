<!-- 底部文案 -->
<template>
  <div class="footer-content px-[.9375rem] py-10">
    <!-- 标题 -->
    <div class="label">
      <span class="title">{{ merchanName }}</span>
      <ion-icon class="age-18 text-4xl flex-shrink-0" src="/svg/age18.svg" @mousedown="startPress" @mouseup="endPress"
        @mouseleave="endPress" @touchstart.passive="startPress" @touchend="endPress" @touchcancel="endPress"
        @touchmove.passive="endPress" />
    </div>
    <!-- 内容区域 -->
    <div class="content mt-[.75rem]">
      <div v-for="(item, index) in dateList" :key="index">
        <p class="min-h-[1.25rem] leading-[1.25rem]">{{ item }}</p>
      </div>

      <p class="sub mt-4">
        ©2025 {{ merchanName }} {{ $t('subtitle.rightsReserved') }}.
      </p>
    </div>
    <!-- 标记 -->
    <div class="content h-8 flex justify-around">
      <span v-if="showMark">{{ os }} {{ browser }} {{ sd }}</span>
      <span v-if="showMark">{{ getBuildVersion() }}</span>
      <span v-if="showMark">{{ origin }}</span>
      <span v-if="showMark">{{ webPushRegId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import useFooterContentLogic from '../logic';

const { os, sd, browser, merchanName, dateList, showMark, origin, startPress, endPress, getBuildVersion, webPushRegId } = useFooterContentLogic();
</script>

<style scoped lang="less">
ion-col {
  padding-inline-start: 0;
  padding-inline-end: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-family: Nunito;
    font-size: 2rem;
    line-height: 1;
    font-weight: 900;
    background: var(--footer-title-color);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    /* 使用这两个属性来将渐变应用到文字 */
  }

  .sub {
    color: var(--footer-sub-color);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.5;
  }
}


ion-icon.age-18 {}

div.content {
  color: var(--footer-content-color);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5;
}
</style>
