<!-- 底部文案 -->
<template>
   <div class="footer-content px-[.9375rem] pt-10">
    <!-- 标题 -->
    <span class="title flex justify-center items-center text-center text-[2rem] leading-tight">
      {{ merchanName }}
    </span>
    <span class="sub flex justify-center items-center text-xs">
      ©2025 {{ merchanName }} {{ $t('subtitle.rightsReserved') }}.
    </span>
    <div class="text-center mt-5">
      <ion-icon class="age-18 text-4xl" src="/first/svg/age18.svg" @mousedown="startPress" @mouseup="endPress" @mouseleave="endPress" @touchstart.passive="startPress" @touchend="endPress" @touchcancel="endPress" @touchmove.passive="endPress"/>
    </div>
    <!-- 内容区域 -->
    <div class="content mt-[.75rem]">
      <div v-for="(item,index) in dateList" :key="index">
        <p class="text-[.6875rem] min-h-[1.25rem] leading-[1.25rem]">{{ item }}</p>
      </div>
    </div>
    <!-- 标记 -->
    <div class="content h-8 text-[.5rem] flex justify-around">
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

<style scoped>
ion-col {
  padding-inline-start: 0;
  padding-inline-end: 0;
  padding-top: 0;
  padding-bottom: 0;
}

span.title {
  font-family: 'Archivo Black', sans-serif;
  background: var(--footer-title-color);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; /* 使用这两个属性来将渐变应用到文字 */
}

span.sub {
  color: var(--footer-sub-color);
}

ion-icon.age-18 {
  color: var(--color-svg-500);
}

div.content {
  color: var(--footer-content-color);
}
</style>
