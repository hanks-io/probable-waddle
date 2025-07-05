<!-- 批量优惠领取弹窗 -->
<template>
  <div class="warpper">
    <!-- 金币动画 -->
    <div v-show="!showReward" class="gold-coin-container" ref="coinContainer"></div>
    <div class="content">
      <!-- 宝箱等待开启动画 -->
      <div v-show="!isOpen" class="wait">
        <ion-img class="aperture1" src="/svg/bonusModal/light1.png" @ionImgDidLoad="ionImgDidLoad"></ion-img>
        <div class="box-wait">
          <div class="btn-open" @click="openHandle">{{ $t('activity.bathReward03') }}</div>
          <div class="text-warpper">
            <p class="title">{{ $t('activity.bathReward01') }}</p>
            <p class="description">{{ customRemark || $t('activity.bathReward02') }}</p>
          </div>
        </div>
      </div>
      <!-- 宝箱开启动画 -->
      <div v-show="isOpen" class="open">
        <div class="box-open" @animationend="boxOpenAnimationEnd">
          <ion-img v-show="showReward" class="aperture2" src="/svg/bonusModal/light2.png" @ionImgDidLoad="ionImgDidLoad"></ion-img>
          <div v-show="showReward" class="text-warpper">
            <p class="title">{{ $t('activity.bathReward05') }}</p>
            <p class="reward">+{{ merchantCy }} {{ convertMoneyToShow(rewardAmount) }}</p>
          </div>
          <div v-show="showReward" class="btn-receive" @click="receiveHandle">{{ $t('activity.bathReward04') }}</div>
        </div>
      </div>
    </div>
  </div> 
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IonImg, modalController } from "@ionic/vue";
import { batchDiscountReceiveApi } from "@/api/activity";
import { convertMoneyToShow } from "@/utils/custom";
import { useThrottleFn } from '@vueuse/core'
import { showToast } from "@/utils/toast";
import { useI18n } from '@/hooks/useI18n';

const props = defineProps<{data: any}>()

const tenantStore = useTenantStore();
const userStore = useUserStore();
const { t } = useI18n();

const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 商户币种
const coinContainer = ref<Element | null>(null); // 金币容器
const isOpen = ref(false); // 是否开启宝箱
const showReward = ref(false); // 是否显示奖励
const customRemark = ref(props.data.appRemark); // 自定义备注
const rewardAmount = ref(props.data.amount); // 奖励金额

function createCoinBox() {
  const coin = document.createElement('div');
  coin.style.rotate = `${Math.random() * 360}deg`;
  coin.classList.add('coins-ani');
  return coin;
}

function startCoinAnimation() {
  const visualWidth = window.innerWidth;
  const visualHeight = window.innerHeight;

  setInterval(async () => {
    const startPositionLeft = Math.random() * (visualWidth - 50); // 防止超出视口
    const endPositionTop = visualHeight;
    const endPositionLeft = startPositionLeft - 100 + Math.random() * 500;
    const duration = visualHeight * 3 + Math.random();
    const coin = createCoinBox();
    coin.style.left = `${startPositionLeft}px`;
    coin.style.top = `0px`;
    coinContainer.value?.appendChild(coin);

    // 使用 CSS 动画实现金币掉落效果
    coin.animate(
      [
        { top: '0px', left: `${startPositionLeft}px` },
        { top: `${endPositionTop}px`, left: `${endPositionLeft}px` }
      ],
      {
        duration: duration,
        easing: 'linear',
        fill: 'forwards'
      }
    ).onfinish = function () {
      coin.remove();
    };
  }, 100);
}

// 图片预加载
async function preloadImage() {
  // 使用 import 动态加载图片
  const imageModule = await import('/svg/bonusModal/open-ani.png');
  const img = new Image();
  img.src = imageModule.default;
  img.onload = () => {
    console.error('preload image success');
  };

  img.onerror = () => {
    console.error('Failed to preload image');
  };
}

// 宝箱开启动画播放完成
const boxOpenAnimationEnd = () => {
  // showReward.value = true;
  // console.error('宝箱开启动画播放完成');
}

// 图片加载成功
const ionImgDidLoad = (e: CustomEvent) => {
  const img = e.target as HTMLIonImgElement;
  img.style.opacity = '1';
}

// 开启宝箱
const openHandle = async () => {
    isOpen.value = true;
    const boxOpen = document.querySelector('.box-open') as HTMLElement;
    boxOpen.style.animationPlayState = 'running';
    setTimeout(() => {
      showReward.value = true;
    }, 500);
    setTimeout(() => {
      boxOpen.style.animationPlayState = 'paused';
    }, 1450);
}

// 领取彩金
const receiveHandle = useThrottleFn(async () => {
  try {
    const res = await batchDiscountReceiveApi({
      orderNo: props.data.orderNo,
      batchNo: props.data.batchNo,
    });
    if ( res?.status === "SUCCESS" ) {
      userStore.getAssets();
    }
    else {
      showToast(t('activity.bathReward06'));
    }
    
  } catch (error) {
    console.error(error);
  } finally {
    userStore.setBatchDiscountList(props.data.orderNo);
    const modal = await modalController.getTop();
    modal?.dismiss();
  }
}, 1000);

onMounted(() => {
    startCoinAnimation();
    preloadImage();
})

</script>

<style lang="less" scoped>
:global(ion-modal#bonusModal::part(content)) {
  --height: 100%;
  --max-width: 486px;
}

.main-text {
  color: #F8FF7A;
  text-align: center;
  text-shadow: 2px 0 0 #d72f2f,/* 右 */
  0 2px 0 #d72f2f,/* 下 */
  -2px 0 0 #d72f2f, /* 左 */
  0 -2px 0 #d72f2f, /* 上 */
  2px 2px 0 #d72f2f,/* 右下 */
  -2px 2px 0 #d72f2f,/* 左下 */
  2px -2px 0 #d72f2f,/* 右上 */
  -2px -2px 0 #d72f2f; /* 左上 */
  text-transform: uppercase;
}

.warpper {
  width: 100%;
  height: 100%;
  font-family: Inter;
  // background: rgba(0, 0, 0, 0.2);
  .flex-center();
}

.gold-coin-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 禁止用户交互 */
  overflow: hidden;
}

.content {
  width: 100%;
  height: 100%;
  .flex-center();
}

.btn-base {
  width: 10.25rem;
  height: 2.75rem;
  position: absolute;
  background: url("/svg/bonusModal/button.svg") no-repeat;
  background-size: 100% 100%;
  color: #854A08;
  text-align: center;
  text-shadow: 0.0313rem 0.0313rem 0rem rgba(255, 255, 255, 0.25);
  font-size: 1rem;
  font-style: normal;
  font-weight: 900;
  line-height: 2.75rem;
  text-transform: uppercase;
}

.wait {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  text-align: center;
  ion-img.aperture1 {
    opacity: 0;
    width: 23.6875rem;
    height:  23.6875rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    transform-origin: center;
    animation: aperture 10s linear infinite;
  }
  .box-wait {
    width: 9.5rem;
    height: 11.0313rem;
    background: url("/svg/bonusModal/wait-ani.png") no-repeat;
    background-size: 133rem 11.0313rem;
    animation: box-wait 1s steps(14) infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    .flex-center();
    .btn-open {
      .btn-base();
      margin-top: 15.625rem;
    }
    .text-warpper {
      width: 100%;
      margin-bottom: 18.75rem;
      padding: 0 1rem;
      max-width: 24.375rem;
      min-width: 24.375rem;
      .title {
        text-align: center;
        // text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
        font-size: 2.375rem;
        font-style: normal;
        font-weight: 900;
        line-height: 1.5;
        text-transform: uppercase;

        background: linear-gradient(180deg, #F0E96F -9.75%, #D9C14C 93.50%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .description {
        color: #FFF;
        text-align: center;
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        text-transform: uppercase;
      }
    }
  }
}
.open {
  width: 24.375rem;
  height: 24.375rem;
  position: relative;
  .box-open {
    width: 28rem;
    height: 28rem;
    background: url("/svg/bonusModal/open-ani.png") no-repeat;
    background-size: 112rem 168rem;
    animation: box-open-x 0.25s steps(4) 6, box-open-y 1.5s steps(6) 1;
    animation-play-state: paused;
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    .flex-center();
    ion-img.aperture2 {
      opacity: 0;
      width: 23.6875rem;
      height:  23.6875rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(0deg);
      transform-origin: center;
      animation: aperture 10s linear infinite;
    }
    .btn-receive {
      .btn-base();
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: 7.5rem;
    }
    .text-warpper {
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        .main-text();
        font-size: 1.125rem;
        font-style: normal;
        font-weight: 900;
        line-height: 1.5;
      }
      .reward {
        .main-text();
        font-size: 2.375rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2.5;
      }
    }
  }
}

:deep(.coins-ani) {
  background-image: url("/svg/bonusModal/coins-ani.png");
  background-size: 25rem 5rem;
  width: 5rem;
  height: 5rem;
  background-repeat: no-repeat;
  animation: coin-rotate 0.5s steps(5) infinite;
  position: absolute;
}

// 金币旋转动画
@keyframes coin-rotate {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -25rem 0;
  }
}

// 光圈旋转动画
@keyframes aperture {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

// 宝箱等待动画
@keyframes box-wait {
  from { 
    background-position: 0 0; 
  }
  to { 
    background-position: -133rem 0; 
  }
}

@keyframes box-open-x {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: -112rem; /* 动画结束的位置 */
  }
}

@keyframes box-open-y {
  from {
    background-position-y: 0;
  }
  to {
    background-position-y: -168rem; /* 动画结束的位置 */
  }
}
</style>
