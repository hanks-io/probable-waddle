<template>
  <ion-modal id="receivedModal" ref="modal" :is-open="visible" :backdrop-dismiss="false">
    <div class="w-full h-full overflow-y-auto overflow-x-hidden">
      <!-- 领取动画图片 -->
      <div class="received-model-img w-full mt-[3.0625rem] h-[30rem] pt-[2.3825rem] flex flex-col items-center">
        <div class="w-[22.219375rem] h-[4.755rem] relative">
          <img class="w-full h-full" src="/images/sign/received-ribbon.png" />
          <div class="ribbon-text absolute left-[50%] top-[24%]">{{ $t('activity.getPrize') }}</div>
        </div>
        <img class="mt-[7.353125rem] w-[7.96375rem] h-[7.96375rem] z-20" :src="receivedInfo?.receiveImg" />
        <img 
          v-for="(item,index) in starNumber" 
          :key="index" 
          class="w-[1.9375rem] h-[1.9375rem] z-30 absolute star-animation" 
          :class="`received-star${index + 1}`" 
          src="/images/sign/received-star.png"
          :style="{ animationDelay: `${index * 0.2}s` }"
        />
      </div>
      <!-- 可领取金额 -->
      <div class="received-money-style02 ">
        <div class="received-money text-gradient">
          <span class="received-addition">+ </span> {{ formatMoneyToShow(receivedInfo.successReward) }}
        </div>
        <div  class="received-extra">{{ $t('viewsAssets.Extra') }} {{ `+${formatMoneyToShow(receivedInfo.extraReward)}` }}</div>
      </div>
      <!-- 知道了按钮 -->
      <div class="sign-btn  mt-[2.3rem]" @click="receivedCloseBtn">
        {{ $t('activity.unmetButton') }}
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { SignItem } from '@/views/activity/sign/hooks/data'
import { useReceivedModalLogic } from '@/views/activity/sign/hooks/receivedModalLogic'

const emit = defineEmits(["closeReceived"]); // 定义传递事件方法: 注册
const props = defineProps<{
  receivedInfo: SignItem;
}>();

const {
  visible,
  starNumber,
  receivedCloseBtn
} = useReceivedModalLogic({ emit });
</script>

<style scoped lang="less">
  @import "@/views/activity/sign/components/second/style/receivedModal/base.less";
</style>
