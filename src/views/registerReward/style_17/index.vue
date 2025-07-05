<!--
注册赠送 17-19-20皮肤公用
-->
<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton
} from "@ionic/vue";

import useLogic from "../logic";
import useRegRewLogic from "@/views/registerReward/style_17/registerReward_17";
import AbRenderImg from "@/components/AbImage/AbRenderImg.vue";
import NavigationBar from "@/components/NavigationBar/index.vue";
import { getImageUrl } from "@/utils";

const {
  navigate,
  isSpinning,
  isStart,
  startCallback,
  endCallback,
  currentRegionCode,
  deviceTypes,
  isNotWinner,
  luckyRef
} = useLogic();

const { getRegisterRewardInfo, buttons, blocks, prizes, multiple } = useRegRewLogic();

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
        <div class="pointer-area">
          <img src="@/assets/img/registerReward/style_17/pointer.png" alt="">
        </div>


        <div class="lucky-Whee-content">
          <LuckyWheel ref="luckyRef" width="19.875rem" height="19.875rem" :blocks="blocks" :prizes="prizes"
                      :buttons="buttons"
                      :defaultConfig="{ offsetDegree: -22, speed: 10, accelerationTime: 1800, decelerationTime: 3000 }"
                      @start="startCallback" @end="endCallback" />
        </div>
      </div>

      <div class="registerReward-img-area">
        <div class="bot-img">
          <AbRenderImg class="icon-gl" :src="getImageUrl('img/registerReward/style_17/gold-left.png')" />
          <AbRenderImg class="icon-gr" :src="getImageUrl('img/registerReward/style_17/gold-right.png')" />
        </div>
        <div class="bot-img2">
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
        </div>
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
  --background: url('@/assets/img/registerReward/style_17/content-bg.png') no-repeat center center / cover;
}


.spinning {
  animation: spin 8s linear infinite;
  /* 动画 */
  animation-fill-mode: forwards
}

.lucky-Whee-area {
  width: 21.875rem;
  height: 21.875rem;
  margin: 0 auto 0;
  position: relative;

  .lucky-Whee-content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 19.875rem;
    height: 19.875rem;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .pointer-area {
    width: 8.95625rem;
    height: 5.44375rem;
    position: absolute;
    top: 7rem;
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
    background: url('@/assets/img/registerReward/style_17/guangxiao1.png') no-repeat center center / 100% 100%;
    opacity: 0;
    z-index: -10;
  }

  .lighter-animation {
    z-index: 10;
    animation: lighter .5s;
  }
}

.registerReward-img-area {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;


  .bot-img {
    width: 100%;
    height: 4rem;
    margin-top: -1.125rem;
    position: relative;

    .icon-gl {
      position: absolute;
      background-size: 100% 100% !important;
      width: 11.375rem;
      height: 7.625rem;
      top: -56px;
      z-index: 2;
    }
    .icon-gr {
      position: absolute;
      background-size: 100% 100% !important;
      width: 7.1875rem;
      height: 5rem;
      right: 20px;
      top: -30px;
    }
  }

  .bot-img2 {
    max-height: calc(100vh - 29.1rem);
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: calc(0.625rem + env(safe-area-inset-bottom));

    border-radius: 1.25rem;
    border: 0.125rem solid var(--ep-color-text-brand-primary);
    background: linear-gradient(1deg, var(--ep-color-background-fill-gradients-secondary-a) 0.65%, var(--ep-color-background-fill-gradients-secondary-b) 99.42%);
  }

  .content-wrapper {
    width: 21.25rem;
    padding: 1.6875rem 1.1875rem 1.4375rem 1.1875rem;
    margin: 0 auto;

    .title-text {
      margin-bottom: 1.4375rem;
      text-align: center;
      -webkit-text-stroke-width: 0.0625rem;
      -webkit-text-stroke-color: var(--ep-color-border-brand);
      font-family: Inter;
      font-size: 1.25rem;
      font-style: normal;
      font-weight: 700;
      line-height: 1.25rem;
      text-transform: uppercase;

      background: linear-gradient(180deg, #DDFEFD 0%, #FFFEFA 49.5%, #DDFEFD 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .content {
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 0.875rem;
      color: var(--ep-color-text-weak);
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
