<!-- 奖品弹窗 -->
<template>
  <ion-modal id="modal-reward" :is-open="modalVisible" @didDismiss="modalClocehandle" :backdrop-dismiss="false" :enter-animation="enterAnimation" :leave-animation="leaveAnimation">
    <div class="reward-card flex flex-col items-center relative z-[-2] pb-4">
      <!-- 闪光背景 -->
      <div class="light w-[16.875rem] h-[16.875rem] absolute z-[-1] top-[50%] left-[50%]">
        <ion-icon class="w-[16.875rem] h-[16.875rem]" src="/svg/activity/reward_card.svg"/>
      </div>
      <span class="card-title mt-4" :text="$t('activity.justGotIt')">{{ $t('activity.justGotIt') }}</span>
      <!-- 关闭按钮 -->
      <ion-icon class="absolute top-2 right-2 text-2xl" :icon="close" @click="modalClocehandle"/>
      <!-- 奖品-现金 -->
      <Gold :amount="currentPrize.amount" v-if="currentPrize.type=='goldCoins'"/>
      <!-- 奖品-集卡 -->
      <Card :cordStyle="setCardStyle(currentPrize.type)" :nameStyle="setCardNameStyle(currentPrize.type)" :strokeStyle="setAccountStroke(currentPrize.type)" :amount="currentPrize.amount " :name="currentPrize.type.replace('prop_','')" v-else/>
      <div class="button h-[2.1875rem] w-[10rem] flex items-center justify-center rounded-[.3125rem]" :class="{on: confirmClick}" @click="confirmHandle">
        <ion-label class="text-sm">{{ $t('activity.redPacket10') }}</ion-label>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { close } from 'ionicons/icons';
import { IonIcon, IonModal, IonLabel, createAnimation } from '@ionic/vue';
import { setCardStyle, setCardNameStyle, setAccountStroke } from '../hooks/setStyle';
import Card from './components/Card.vue';
import Gold from './components/Gold.vue';
import useRewardModalLogic from '../../rewardModalLogic';

defineProps({
  modalVisible: { type: Boolean, required: true },  // 弹窗显示状态
  currentPrize: { type: Object, required: true },   // 当前奖品
})

const emit = defineEmits(['visibleChange'])

const {
  confirmClick,
    modalDuration,
    enterAnimation,
    leaveAnimation,
    confirmHandle,
    modalClocehandle,
} = useRewardModalLogic({ emit })

</script>

<style scoped>
ion-modal#modal-reward .button.on {
  animation: buttonAnimation 250ms;
}

ion-modal#modal-reward {
  --width: fit-content;     /* 宽度由内容撑开 */
  --height: fit-content;	  /* 高度由内容撑开 */
  --border-radius: 1.25rem;
}

ion-modal#modal-reward::part(content) {
  box-shadow: none !important;
}

ion-modal .reward-card {
  width: 13.9375rem;
  height: 16.875rem;
  background: radial-gradient(50% 50% at 50% 50%, #E53EFF 0%, #6D1AD4 100%);
  animation: cardAnimation 250ms linear 4;
}

ion-modal .reward-card .light {
  transform: translate(-50%, -50%);
}

ion-modal .reward-card .light ion-icon {
  animation: apertureAnimation 3s linear infinite;
}


ion-modal .reward-card .card-title {
  color: transparent;
  font-size: 1.5625em;
  font-weight: 900;
  text-shadow: 0px 2px 0px #945B1A;
  font-size: 1.25rem;
}

ion-modal .reward-card .card-title::before {
  content: attr(text);
  position: absolute;
  z-index: 10;
  background: linear-gradient(90deg, #FCDA36 0%, #F9FD5B 25.52%, #FCDA36 50.83%, #F9FD5B 77.87%, #FCDA36 100%);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-shadow: none;
}

div.button {
  background: linear-gradient(31.96deg, #AD65ED 1.88%, #E693F9 100%);
  box-shadow: 0px 2px 2px 0px #FFFFFF66 inset, 0px -2px 2px 0px #FFFFFF66 inset;
}

@keyframes apertureAnimation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes cardAnimation {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(-1);
  }
  100% {
    transform: scaleX(1);
  }
}

@keyframes buttonAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>
