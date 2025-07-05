<!-- 首页充值酬宾图标 -->
<template>
  <div 
    v-if="countDownTimeStr && showRechargeHomePng" 
    class="fixed right-[0.625rem] z-40" 
    :class="{ rechargeBonusGet: showRechargeBonusGet }" 
    :style="`bottom: calc(${tabBarHeight}px + env(safe-area-inset-bottom) + 14.875rem)`"
  >
    <!-- 首页图片 -->
    <progressiveImages 
      class="packet-img1" 
      @click="rechargeBonusImgClick"
      :src="rechargeBonusImg"  
    />
    <!-- 倒计时 -->
    <div class="recharge-bonus-times absolute" :class="['recharge-bonus-times' + rechargeBonusImgIdx]">
      {{ countDownTimeStr }}
    </div>
  </div>
</template>

<script setup lang="ts">
import progressiveImages from '@/components/GameCard/progressiveImages.vue';
import { useRechargePromotionLogic } from '@/views/tabbar/tabs/inicio/components/RechargeBonus/logic'

const {
  countDownTimeStr,
  rechargeBonusImg,
  rechargeBonusImgIdx,
  showRechargeHomePng,
  showRechargeBonusGet,
  tabBarHeight,
  rechargeBonusImgClick
} = useRechargePromotionLogic();
</script>

<style scoped lang="less">
.recharge-bonus-times {
  font-family: Inter;
  font-size: .75rem;
  line-height: 100%;
  font-weight: 900;
  color: #FFF268;
  bottom: 15%;
  left: 15%;
}

.new-skin-symbol {
  .recharge-bonus-times {
    font-size: var(--ep-font-size-s);
    line-height: 100%;
    font-weight: var(--ep-values-900);
    color: var(--ep-color-text-highlight);
  }

  .recharge-bonus-times7 {
    font-size: 0.6875rem;
  }
}

.packet-img1 {
  width: 0;
  &.good-img {
    width: 6.875rem;
    height: 6.875rem;
  }
}

.recharge-bonus-times2 {
  bottom: 18%;
  left: 17%;
}

.recharge-bonus-times3 {
  bottom: 22%;
  left: 17%;
}

.recharge-bonus-times4 {
  bottom: -4%;
  left: 15%;
}

.recharge-bonus-times5 {
  bottom: -8%;
  left: 14%;
}

.recharge-bonus-times6 {
  bottom: -9%;
  left: 16%;
}

.recharge-bonus-times7 {
  font-size: .6875rem;
  bottom: 13%;
  left: 30%;
}

.recharge-bonus-times8 {
  bottom: 22%;
  left: 16%;
}

.recharge-bonus-times9 {
  bottom: 31%;
  left: 16%;
}

.recharge-bonus-times10 {
  bottom: 19%;
  left: 19%;
}

.rechargeBonusGet {
  animation-name: rechargeBonuShake;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes rechargeBonuShake {
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
