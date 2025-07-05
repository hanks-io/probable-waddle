<!-- 首页红包雨活动弹窗 -->
<template>
  <!-- 红包雨图标 -->
  <RedPacketRain 
    @close="closeRedPacketRain"
    @openModel="openRedPacketModel" 
    :activityId="activityId"
    v-if="showRedPacketRain"
  />
  <!-- 红包雨详情弹窗 -->
  <component :is="currentModel"  :activityId="activityId" :openRedModel="openRedModel"  @closeModel="closeModel"/>
  <!-- <RedPacketModel :activityId="activityId" :openRedModel="openRedModel"  @closeModel="closeModel" /> -->
</template>

<script setup lang="ts">
import RedPacketRain from '@/views/tabbar/tabs/inicio/components/RedPacket/default/RedPacketRain.vue'
import { useModelComponents } from '@/views/tabbar/tabs/inicio/components/RedPacket/useModelComponents'
import useLogic from '../logic'


const currentModel = useModelComponents();
const { 
  showRedPacketRain,
  activityId,
  openRedModel,
  closeRedPacketRain,
  openRedPacketModel,
  closeModel
} = useLogic()
</script>
