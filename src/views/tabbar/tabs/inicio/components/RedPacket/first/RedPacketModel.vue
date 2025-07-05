<template>
<div>
    <ion-modal ref="modal" :is-open="visible" :backdrop-dismiss="false">
    <!-- 开采页面 -->
        <div 
            class="bg-[#1b0e0f] z-50 w-[20rem] overflow-hidden rounded-[.625rem] absolute top-[50%] left-[50%] packet-model flex flex-col items-center"
        >   
            <ion-img class="w-full h-[14.5rem]" src="/images/packet-bg.jpg" />
            <!-- 开采按钮 -->
            <div v-if="showEnd && showReceiveBtn" class="mining-btn text-[#fff] text-[0.875rem] w-[17.5rem] h-[2.1875rem] mt-[-1.25rem] text-center" :class="received ? 'shiny' : 'dis-color'"  @click="rewardModalHandle">
                {{ joinBtnText }}
            </div>
            <!-- 开启倒计时按钮内容 -->
            <div v-if="!showEnd && showReceiveBtn" class="mining-btn w-[17.5rem] text-[#fff] h-[2.1875rem] text-[0.875rem] mt-[-1.25rem] text-center dis-color">{{ $t('activity.redPacket4', { time: countdownTime}) }}</div>
            <!-- 活动提示 -->
            <div class="w-[17.5rem] leading-[1rem] text-[0.875rem] text-[#FBA531] my-[0.625rem]">{{ $t('viewsTabbar.mineText1', { times: activityTimes, money: formatMoneyToShow(maxAmount) }) }}</div>
            <!-- 活动开启时间 -->
            <div ref="scrollEl" class="w-[17.5rem] h-[3.1875rem] mine-time py-[.0625rem] text-[#FBA531] flex mb-[.625rem] overflow-y-auto">
                <div class="h-[1.0625rem] w-[33%] text-center" v-for="(item,index) in mineTime" :key="index" :class="{ 'text-[#5D4547]': item.isDis }">{{ item.text }}</div>
            </div>
            <!-- 底部活动规则 -->
            <div 
                class="text-[.625rem] text-[#5D4547] text-left w-[17.5rem] mb-[1.2rem]"
                :class="isIpad ? 'footer-rule' : ''"
            >
                <div v-for="(item,index) in activityRule" :key="index">{{ item.text }}</div>
            </div>
            <!-- 底部png图片 -->
            <ion-img class="w-full h-[2.5rem] absolute bottom-0 left-0" src="/images/packet-bpttom.png" />
            <!-- 活动名称 -->
            <div class="absolute top-[0.3125rem] text-[#fff] w-full text-center text-[1.25rem] font-bold activity-name">{{ activityName }}</div>
            <!-- 右上角退出按钮 -->
            <ion-icon class="absolute right-[0.25rem] text-[#fff] top-[0.3125rem] text-[1.875rem]" :icon="close" @click="closeModelClick" />
        </div>
    </ion-modal>
</div>
</template>


<script setup lang="ts">
import { close } from 'ionicons/icons';
import { IonModal, IonImg, IonIcon } from '@ionic/vue';
import { formatMoneyToShow } from '@/utils/custom'

import useRedPacketRainModelLogic from '../redPacketModelLogic';

const props = defineProps({
  activityId: {
      type: [ String,Number],
      required: true
  },
  openRedModel: {
      type: Boolean,
      default: false
  }
})

const emit = defineEmits(['closeModel']);

const {
  visible,
  scrollEl,
  showEnd,
  received,
  countdownTime,
  maxAmount,
  mineTime,
  activityRule,
  activityName,
  isIpad,
  activityTimes,
  closeModelClick,
  rewardModalHandle,
  joinBtnText,
  showReceiveBtn,
} = useRedPacketRainModelLogic({props, emit});
</script>

<style scoped>
.packet-model {
    transform: translate(-50%,-50%);
}

.mining-btn {
    background: var(--color-primary-btn-active);
    line-height: 2.1875rem;
    border-radius: var(--rounded-small);
    font-weight: var(--font-weight-bold);
}

.dis-color {
    background: var(--color-primary-btn-disable);
    color: var(--color-primary-btn-text-disable);
}

.mine-time {
    border: 1px solid #FF9141;
    border-radius: 0.625rem;
    flex-wrap: wrap;
    font-size: .75rem;
    align-content: start;
}

.mine-item {
    width: 33%;
    text-align: center;
}

.shiny {
    position: relative;
    overflow: hidden;
}
.shiny {
    position: relative;
    overflow: hidden;
}

.shiny::before {
  content: '';
  animation: shiny 4s ease-in-out infinite;
  background: var(--color-text-100);;
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px
}

@keyframes shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }
  80% {
    opacity: 0.5;
    transform: scale(0) rotate(45deg);
  }
  81% {
    opacity: 1;
    transform: scale(4) rotate(45deg);
  }
  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}

.activity-name {
    text-shadow: 2px 2px #7a5f1b;
}

.alert-main {
    position: fixed; 
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;    
}

.alert-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
}

.footer-rule {
    height: 3.125rem;
    margin-bottom: 1.6rem;
    overflow-y: auto;
}
.new-skin-symbol .mining-btn{
    background: var(--ep-dynamic-primary);
    color: var(--ep-color-text-default);
}

.new-skin-symbol .dis-color {
    background: var(--ep-color-background-fill-active-disabled);
}
</style>
