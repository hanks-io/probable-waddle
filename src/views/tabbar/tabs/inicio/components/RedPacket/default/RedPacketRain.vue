<template>
  <!-- 首页红包雨内容 -->
  <div v-if="ifDefaultImg" class="fixed w-[6.875rem] z-40 right-[0.625rem] h-[6.875rem]" :style="`bottom: calc(${tabBarHeight}px + env(safe-area-inset-bottom) + 5.25rem)`" v-show="showRedPacket">
    <div class="w-full h-full flex justify-center items-center" :class="{ 'redPacketGet': showAnimation }">
      <!-- 红包雨图片 -->
      <progressiveImages class="packet-img1" :src="bgUrl" @click="clickPacket" />
      <!-- 红包雨活动倒计时 -->
      <div class="text-[#FFF268] absolute font-black" :class="['timeNum'+ifDefaultIndex]"
        @click="clickPacket">{{ countdownTime }}</div>
    </div>
  </div>
  <div v-else class="fixed w-[6.25rem] z-40 right-[1rem] h-[6.5rem]" :style="`bottom: calc(${tabBarHeight}px + 5.25rem)`" v-show="showRedPacket">
    <div class="w-full h-[6.25rem] flex justify-center items-center" :class="{ 'redPacketGet': showAnimation }">
      <!-- 红包雨图片 -->
      <progressiveImages class="packet-img2" :src="bgUrl" @click="clickPacket" />
      <!-- 红包雨活动名称 -->
      <div v-if="bgUrl == '/icons/minecart.png'" class="minecart-text absolute font-bold top-[1.0625rem] right-0 text-[0.75rem] w-[5.0625rem] text-center leading-[0.75rem]"
         @click="clickPacket">{{ activityName }}</div>
      <!-- 红包雨活动倒计时 -->
      <div class="minecart-time absolute font-bold bottom-[0.9375rem] left-[1.375rem] text-[0.75rem]"
        @click="clickPacket">{{ countdownTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import progressiveImages from '@/components/GameCard/progressiveImages.vue';
import useRedPacketRainLogic from '../redPacketRainLogic';
const props = defineProps({
  activityId: {
    type: [String, Number],
    required: true
  },
})

const emit = defineEmits(['close', 'openModel']);

const {
  activityName,
  showRedPacket,
  countdownTime,
  showAnimation,
  clickPacket,
  tabBarHeight,
  bgUrl,
  ifDefaultImg,
  ifDefaultIndex
} = useRedPacketRainLogic({props, emit});
</script>

<style lang="less" scoped>
.packet-model {
  transform: translate(-50%, -50%);
}

.packet-img1 {
  width: 0;
  
  &.good-img {
    width: 6.875rem;
    height: 6.875rem;
  }
}

.packet-img2 {
  width: 0;

  &.good-img {
    width: 100%;
    height: 5.25rem;
  }
}

.mining-btn {
  background: linear-gradient(to bottom, #E89B00, #FF9141);
  line-height: 2.1875rem;
  border-radius: 0.3rem;
}

.dis-color {
  background: #4A4A4A;
  color: #A1A1A1;
}

.mine-time {
  border: 1px solid #FF9141;
  border-radius: 0.625rem;
  flex-wrap: wrap;
  font-size: .75rem;
}

.mine-item {
  width: 33%;
  text-align: center;
}

.shiny {
  position: relative;
  overflow: hidden;
}

.shiny::before {
  content: '';
  animation: shiny 5s ease-in-out infinite;
  background: white;
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

.minecart-text,
.minecart-time {
  text-shadow: 1px 1px #7a5f1b;
  color: #fff;
}
.timeNum1 {
  font-size: 1.25rem;
  left: 50%;
  transform: translateX(-50%) scale(0.62);
  bottom: 3%;
}
.timeNum2 {
  font-size: 1.5rem;
  left: 49%;
  transform: translateX(-47%) scale(0.62);
  bottom: 35%;
}
.timeNum3 {
  font-size: 1.4906rem;
  left: 50%;
  transform: translateX(-50%) scale(0.62);
  bottom: 12%;
}
.timeNum4 {
  font-size: 1.5rem;
  left: 50%;
  transform: translateX(-50%) scale(0.62);
  bottom: 43%;
}
.timeNum5 {
  font-size: 1.25rem;
  left: 50%;
  transform: translateX(-50%) scale(0.62);
  bottom: 4%;
}
.timeNum6 {
  font-size: 1.5rem;
  left: 50%;
  transform: translateX(-50%) scale(0.62);
  bottom: 0;
}
.timeNum7 {
  font-size: 1.25rem;
  left: 50%;
  transform: translateX(-49%) scale(0.62);
  bottom: 46%;
}
.timeNum8 {
  font-size: 1.375rem;
  left:50%;
  transform: translateX(-42%) scale(0.62);
  bottom: 27%;
}
.timeNum9 {
  font-size: 1.5rem;
  left: 50%;
  bottom: 18%;
  transform: translateX(-50%) rotate(-1.12deg) scale(0.62);
}
.timeNum10 {
  font-size: 1.375rem;
  left: 50%;
  transform: translateX(-50%) scale(0.62);
  bottom: 20%;
}
.minecart-text {
  transform: rotate(22deg);
}

.activity-name {
  text-shadow: 2px 2px #7a5f1b;
}

.minecart-content {
  transform: translate(-50%, -50%);
}

/* 红包抖动效果 */
.redPacketGet {
  animation-name: redPacketShake;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes redPacketShake {
  0% {}

  30% {
    scale: 1.1;
    transform: rotate(0deg);
  }

  40% {
    transform: rotate(-15deg);
  }

  50% {
    transform: rotate(0deg);
  }

  60% {
    transform: rotate(-15deg);
  }

  70% {
    transform: rotate(0deg);
    scale: 1.1;
  }

  100% {
    scale: 1;
  }
}
</style>
