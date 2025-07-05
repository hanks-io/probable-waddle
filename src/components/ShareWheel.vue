<template>
  <div class="h-full flex justify-center pt-14">
    <div class="wheel-box w-[24.375rem] relative">
      <ion-icon class="absolute text-3xl opacity-40 top-20 right-11" :icon="closeCircleOutline" @click="closeModal"/>
      <!-- 光圈 -->
      <div class="absolute m-auto top-0 left-0 right-0 bottom-0 -z-10">
        <Image class="aperture mt-20" src="/images/activity/share_aperture.webp"/>
      </div>
      <!-- 闪烁灯 -->
      <Image class="wheel-light w-[14rem] absolute left-[5rem] top-[12.75rem] z-20" :style="`animation-duration: ${tempo}ms`" src="/images/activity/share_light.webp"/>
      <!-- 指针 -->
      <div class="h-[13.75rem] flex flex-col justify-end items-center"><img class="mr-0.5 mb-[-1.275rem] w-[4.5rem] z-30" src="/images/activity/pointer.webp"/></div>
      <!-- 转盘 -->
      <div class="relative flex justify-center mr-1 z-10">
        <LuckyWheel ref="luckyRef" :blocks="blocks" width="12rem" height="12rem"
          :prizes="prizes" :buttons="buttons"
          @start="startCallback" @end="endCallback"
        />
        <!-- 转盘开始按钮 -->
        <img class="wheel-start w-14 absolute top-1/2 -translate-y-1/2" :class="{on: startClick}" :src="Start"/>
      </div>
      <!-- 横幅 -->
      <img class="wheel-banner absolute left-0 top-56 w-full z-30" :src="Banner"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/store/app';
import { modalController, IonIcon } from '@ionic/vue';
import { closeCircleOutline } from 'ionicons/icons';
import Start from '/images/activity/share_start.webp';
import Banner from '/images/activity/share_banner.webp';
import Image from '@/components/Image.vue';

const luckyRef = ref();	          // 抽奖组件实例
const tempo = ref(3000);          // 抽奖灯闪烁节奏
const confirmClick = ref(false);  // 确定按钮点击状态
const startClick = ref(false);    // 开始抽奖按钮点击状态

const blocks:any[] = []

const prizes = [
  { fonts: [{ text: '0', top: '10%' }], background: '#EE4639' },
  { fonts: [{ text: '1', top: '10%' }], background: '#1D9554' },
  { fonts: [{ text: '2', top: '10%' }], background: '#EE4639' },
  { fonts: [{ text: '3', top: '10%' }], background: '#1D9554'},
  { fonts: [{ text: '4', top: '10%' }], background: '#EE4639' },
  { fonts: [{ text: '5', top: '10%' }], background: '#1D9554'},
  { fonts: [{ text: '0', top: '10%' }], background: '#EE4639' },
  { fonts: [{ text: '1', top: '10%' }], background: '#1D9554'}
]
const buttons = [{
  radius: '50%',
}]

/**
 * @description 抽奖闪烁灯加速
 */
 function acceleration() {
  let multiplier = 1;
  function decreaseTempo() {
    if (tempo.value > 100) {
      tempo.value -= 10 * multiplier;
      multiplier += 0.5;
      setTimeout(decreaseTempo, 80);
    } else {
      tempo.value = 100;
    }
  }
  decreaseTempo();
}

/**
 * @description 抽奖闪烁灯减速
 */
function deceleration() {
  let multiplier = 1;
  function increaseTempo() {
    if (tempo.value < 3000) {
      tempo.value += 10 * multiplier;
      multiplier += 0.5;
      setTimeout(increaseTempo, 100);
    } else {
      tempo.value = 3000;
    }
  }
  increaseTempo();
}

/**
 * @description 点击抽奖按钮会触发star回调
 */
 function startCallback () {
  startClick.value = true;                      // 开始按钮点击状态
  setTimeout(() => {
    startClick.value = false;
  }, 250)
  luckyRef.value.play()                         // 调用抽奖组件的play方法开始游戏
  acceleration();                               // 加速
  setTimeout(() => {                            // 模拟调用接口异步抽奖
    deceleration();                             // 减速
    const index = Math.floor(Math.random() * 6) // 假设后端返回的中奖索引是0
    luckyRef.value.stop(index)                  // 调用stop停止旋转并传递中奖索引
  }, 5000)
}

/**
 * @description 抽奖结束会触发end回调
 * @param prize 中奖信息
 */
function endCallback (prize: any) {
  console.log(prize)
}

/**
 * @description 关闭模态框
 */
function closeModal() {
  modalController.dismiss();
  useAppStore().modalVisible = false;
}
</script>

<style scoped>
.wheel-box {
  background: url('/images/activity/share_bg.webp') no-repeat;
  background-size: 100%;
}

.aperture {
  animation: apertureAnimation 20s linear infinite;
}

.wheel-start {
  pointer-events: none;
}

.wheel-start.on {
  animation: buttonAnimation 250ms;
}

.wheel-light {
  animation-name: lightAnimation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  pointer-events: none;
}

.wheel-banner {
  pointer-events: none;
}

@keyframes apertureAnimation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes buttonAnimation {
  0% {
    transform: scale(1) translate(0, -50%);
  }
  50% {
    transform: scale(1.1) translate(0, -50%);
  }
  100% {
    transform: scale(1) translate(0, -50%);
  }
}

@keyframes lightAnimation {
  0% {
    transform: rotate(0deg);
  }
  49.99% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(22.5deg);
  }
  99.99% {
    transform: rotate(22.5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>