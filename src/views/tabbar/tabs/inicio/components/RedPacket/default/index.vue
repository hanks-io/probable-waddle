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
  <component :is="currentModel" :activityId="activityId" :openRedModel="openRedModel"  @closeModel="closeModel" />
</template>

<script setup lang="ts">
import RedPacketRain from './RedPacketRain.vue'
import useLogic from '../logic'
import { useModelComponents } from '@/views/tabbar/tabs/inicio/components/RedPacket/useModelComponents'

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
