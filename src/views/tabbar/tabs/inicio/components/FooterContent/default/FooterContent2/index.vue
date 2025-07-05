<!-- 底部文案 -->
<template>
<div>
<!-- 分割线 -->
<div class="divider h-[0.0625rem] w-[22.5rem] ml-[.9375rem] bg-[#303C59] mt-[0.9375rem]" />
   <div class="footer-container px-[.9375rem] pt-[1.0625rem]">
    <!-- 内容区域 -->
    <div class="mb-[.875rem] mt-[.625rem]">
      <div v-for="(item,index) in dateList" :key="index">
        <p class="text-sub text-[.6875rem] min-h-[1.25rem] leading-[1.25rem] text-[#899FBE]">{{ item }}</p>
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
  startPress,
  endPress,
  getBuildVersion,
} = useFooterContentLogic();
</script>

<style lang="less" scoped> 
.divider {
  background-color: var(--line-color); 
}
ion-col {
  padding-inline-start: 0;
  padding-inline-end: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.green-default {
  .footer-container {
    .text {
      color: var(--color-text-gray-100);
    }
    .text-sub {
      color: var(--color-text-gray-200);
    }
  }
}

.version{
  color: var(--color-text-second);
}
</style>
