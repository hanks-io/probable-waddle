<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton
} from "@ionic/vue";

import useLogic from "../logic";
import useRegRew18Logic from "@/views/registerReward/style_18/registerReward_18";
import AbRenderImg from "@/components/AbImage/AbRenderImg.vue";
import bot1Img from "@/assets/img/registerReward/style_18/bot1.png";
import bot2Img from "@/assets/img/registerReward/style_18/bot2.png";
import NavigationBar from "@/components/NavigationBar/index.vue";

const {
  navigate,
  isSpinning,
  isStart,
  startCallback,
  endCallback,
  currentRegionCode,
  deviceTypes,
  isNotWinner,
  luckyRef,
} = useLogic();

const { getRegisterRewardInfo, buttons, blocks, prizes, multiple } = useRegRew18Logic();

const route = useRoute();
const userStore = useUserStore();

watch(() => route.path, (newPath) => {
  if (newPath == "/subscribeReward") {
    getRegisterRewardInfo();
  }
}, { immediate: true });


onMounted(async () => {
  await userStore.setUser();
  isNotWinner.value = !userStore.user?.canApplyRegisterReward;
});

</script>

<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="$t('registerReward.000001')">
      <template #start>
        <ion-button mode="md" class="nav-btn" fill="clear" @click="navigate">
          <ion-icon class="back" src="/svg/arrow_left.svg" />
        </ion-button>
      </template>
    </NavigationBar>

    <ion-content class="registration-bonus">
      <div :class="[{ 'spinning': isSpinning }]">

      </div>
      <div class="lucky-Whee-area">
        <div :class="['lighter', { 'lighter-animation': isStart }]"></div>
        <div :class="['lighter-2', { 'lighter-2-animation': isStart }]"></div>
        <div class="pointer-area">
          <img src="@/assets/img/registerReward/style_18/pointer.png" alt="">
        </div>


        <div class="lucky-Whee-content">
          <LuckyWheel ref="luckyRef" width="18.4375rem" height="18.4375rem" :blocks="blocks" :prizes="prizes"
                      :buttons="buttons"
                      :defaultConfig="{ offsetDegree: -22, speed: 10, accelerationTime: 1800, decelerationTime: 3000 }"
                      @start="startCallback" @end="endCallback" />
        </div>
      </div>

      <div class="registerReward-img-area">
        <AbRenderImg class="bot-img" :src="bot1Img"></AbRenderImg>
        <AbRenderImg class="bot-img2" :src="bot2Img">
          <div class="content-wrapper">
            <div class="title-text">
              {{ $t("registerReward.000004") }}
            </div>
            <ul class="content">
              <li>1: {{ currentRegionCode === "BR" ? $t("registerReward.000005") : $t("registerReward.000021") }}</li>
              <li>2: {{ $t("registerReward.000006", { deviceType: deviceTypes }) }}</li>
              <li>3: {{ $t("registerReward.000007", { multiple: multiple }) }}</li>
              <li>4: {{ $t("registerReward.000008") }}</li>
            </ul>
          </div>
        </AbRenderImg>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="less">
ion-button {
  --padding-start: 0.875rem;
  --padding-end: 0.875rem;
  margin-top: 0;
  margin-bottom: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  --color: var(--ep-color-text-default, var(--color-toolbar-text, var(--text-color-white-100)));
}

.nav-btn {
  height: 3.125rem;
}

ion-header ion-toolbar {
  --background: #262624;
  box-shadow: 0px 4px 28.4px 0px #0000001A;
}

.arrow-left {
  font-size: 20px;
  cursor: pointer;
  margin-top: 10px;
}

.registerReward-title {
  color: #ffff;
}

.registration-bonus {
  --background: url('@/assets/img/registerReward/style_18/content-bg.png') no-repeat center center / cover;
  --offset-bottom: 3.125rem !important;
}


.spinning {
  animation: spin 8s linear infinite;
  /* 动画 */
  animation-fill-mode: forwards
}

.lucky-Whee-area {
  width: 21.875rem;
  height: 21.875rem;
  margin: 2.625rem auto 0;
  position: relative;
  background: url('@/assets/img/registerReward/style_18/border.png') no-repeat center center / 100% 100%;

  .lucky-Whee-content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18.25rem;
    height: 18.25rem;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .pointer-area {
    width: 2.875rem;
    height: 5.3125rem;
    position: absolute;
    top: 0.875rem;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
  }

  .lighter {
    position: absolute;
    width: 18.25rem;
    height: 18.25rem;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 50%;
    background: url('@/assets/img/registerReward/style_18/guangxiao1.png') no-repeat center center / 100% 100%;
    opacity: 0;
    z-index: -10;
  }

  .lighter-animation {
    z-index: 10;
    animation: lighter .5s;
  }

  .lighter-2 {

    position: absolute;
    width: 18.25rem;
    height: 18.25rem;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 50%;
    background: url('@/assets/img/registerReward/style_18/guangquan1.png') no-repeat center center / 100% 100%;
    z-index: -10;
  }
}

.lighter-2-animation {
  animation: lighter .5s;
  animation-delay: 0.1s;
}

.registerReward-img-area {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;


  .bot-img {
    width: 23.375rem;
    height: 5.28125rem;
    margin-top: -3.8rem;
    background-size: 100% 100% !important;
  }

  .bot-img2 {
    margin-top: -0.0625rem;
    width: 23.375rem;
    background-size: 100% 100% !important;
    height: calc(100vh - 29.1rem);
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .content-wrapper {
    max-width: 100%;
    padding-left: 2.8125rem;
    padding-right: 2.8125rem;
    font-family: Inter;

    .title-text {
      margin-left: 0.625rem;
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }

    .content {
      font-size: 0.75rem;
      padding: 0 0.375rem;
    }

  }
}


.light-img {
  width: 19.5625rem;
  height: 19.5625rem;
  position: absolute;
  bottom: 0;
  left: 0;
  top: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  transform-origin: center;
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

.footer {
  width: 24.375rem;
  height: 5rem;
  background: #262624;
  border-top: 1px solid #292D36;
  box-shadow: none;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
    /* 起始位置 */
  }

  to {
    transform: rotate(360deg);
    /* 结束位置 */
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

@keyframes lighter {
  0% {
    transform: scale(0.3);
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

@keyframes lighter-2 {
  0% {
    transform: scale(.8);
  }

  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}
</style>
