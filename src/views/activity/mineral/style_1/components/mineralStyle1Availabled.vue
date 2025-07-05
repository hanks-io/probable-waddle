<template>
  <ion-modal id="mineralStyle1AvailableModal" ref="modal" :initial-breakpoint="1" :is-open="visible" :backdrop-dismiss="false">
    <ion-content scrollY="true">
      <!-- 领取标题 -->
      <div class="mt-[5.125rem] text-center modal-tips">{{ $t('activity.mysterious05') }}</div>
      <!-- 领取图片 -->
      <div class="available-img-box w-full h-[25.6875rem] relative">
        <!-- 背景光束 -->
        <img class="w-full h-full rotate-beam" src="/images/activity/mineral/rotatingBeam.png" alt="">
        <!-- 光晕 -->
        <img class="halo absolute top-[-1.125rem] left-[-1.125rem] z-10" src="/images/activity/mineral/halo.png" alt="">
        <!-- 星星 -->
        <img class="available-start1 absolute top-[5.2rem] left-[2.8rem] z-20" src="/images/activity/mineral/available_start1.png" alt="">
        <img class="available-start2 absolute top-[5.2rem] left-[2.8rem] z-20" src="/images/activity/mineral/available_start2.png" alt="">
        <img class="available-start3 absolute top-[5.2rem] left-[2.8rem] z-20" src="/images/activity/mineral/available_start3.png" alt="">
        <!-- 奖励砖石 -->
        <img class="reward-diamonds absolute top-[34%] left-[35%] z-30" src="/images/activity/mineral/reward_diamonds.png" alt="">
        <!-- 可领取金额 -->
        <div class="reward-money w-full text-center absolute bottom-[30%] z-30">
          <span class="reward-money-x">X </span>
          <span class="reward-money-color"> {{ availabledRewardCount }}</span>
        </div>
      </div>
      <!-- 奖励信息 -->
      <div class="reward-info text-center mt-[1.125rem] pb-[6.5rem]" v-html="availabledRewardCount ? $t('viewsActivity.activityList05', { amount: merchantCy + formatMoneyToShow(availabledRewardCount) }) : $t('activity.redPacket12')"></div>
      <!-- 确定按钮 -->
      <div class="w-full pl-[1.875rem] pr-[1.25rem] pb-[2.125rem]">
        <ion-button @click="confirmarClick" class="confirmar-btn w-full">{{ $t('activity.redPacket10') }}</ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonToolbar, IonHeader, IonContent, IonTitle, IonButton, IonModal, IonIcon } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { useMineralStyle1AvailabledLogic } from '@/views/activity/mineral/hooks/mineralStyle1AvailabledLogic'
import NavigationBar from '@/components/NavigationBar/index.vue'

const props = defineProps({
  activityName: { type: String, required: true },
  availabledRewardCount: { type: [String, Number], default: 0 }
})

const emit = defineEmits(["closeAvailableModal"]);

const {
  visible,
  merchantCy,
  confirmarClick
} = useMineralStyle1AvailabledLogic({ emit });

</script>

<style scoped lang="less">
ion-modal {
  --max-width: 486px;
  --height: 100%;
  background: rgba(9, 14, 33, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

ion-content {
  --background: transparent;
  font-family: 'Prompt' !important;
}

.modal-tips {
  font-size: 2.5rem;
  line-height: 2.5rem;
  font-weight: 900;
  background: linear-gradient(90deg, #ECA326 0%, #9E2326 51.24%, #1659E6 75.54%);
  -webkit-text-stroke-width: .1313rem;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: normal;
  -webkit-text-stroke-color: #eed3a5;
  text-transform: uppercase;
}

.available-img-box {
  .rotate-beam {
    z-index: 1;
    animation: rotateAnimation 14s linear infinite;
  }

  .available-start1,
  .available-start2,
  .available-start3 {
    widows: 19.421rem;
    height: 15.3514rem;
    animation: starAnimation 3s ease-in-out infinite;
  }

  .available-start2 {
    animation: starAnimation 4s ease-in-out infinite;
  }

  .available-start3 {
    animation: starAnimation 5s ease-in-out infinite;
  }

  .halo {
    max-width: 27.5rem !important;
    height: 27.5rem;
  }

  .reward-diamonds {
    width: 7.9638rem;
    height: 7.9638rem;
  }

  .reward-money {
    .reward-money-color,
    .reward-money-x {
      background: linear-gradient(180deg, #FFB54C -9.75%, #FFF2BF 93.46%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .reward-money-x {
      font-size: 24px;
      font-weight: 700;
    }

    .reward-money-color {
      font-size: 2rem;
      font-weight: 900;
    }
  }
}

.reward-info {
  color: #95A9D3;
  font-size: .75rem;
  :deep(span) {
    color: #23DB8C;
  }
}

ion-button.confirmar-btn {
  min-height: 0;
  height: 2.5rem;
  --background: linear-gradient(90deg, #E5C72B 0%, #A94B53 74.8%);
  --color: #fff;
  --border-radius: .5rem;
  --background-activated: none;
  --background-focused: none;
  --background-hover: none;
}

@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);  /* 起始角度 */
  }
  100% {
    transform: rotate(360deg); /* 结束角度 */
  }
}

@keyframes starAnimation {
  0% {
    opacity: 0; /* 初始时不可见 */
  }
  50% {
    opacity: 1; /* 中途时完全可见 */
  }
  100% {
    opacity: 0; /* 结束时不可见 */
  }
}
</style>
