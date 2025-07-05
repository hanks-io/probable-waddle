<!-- 奖品弹窗 -->
<template>
  <ion-modal id="modal-reward" :is-open="modalVisible" :backdrop-dismiss="false" :enter-animation="enterAnimation" :leave-animation="leaveAnimation">
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

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/wheel/default/style/Reward/base-reward.less";
  // @import "@/views/activity/wheel/default/style/Reward/theme-style.less";

  // #activity-wheel-default-modals-rewardModal.style();

  // .blue-default {
  //   #activity-wheel-default-modals-rewardModal.style();
  // }

  // .green-default {
  //   #activity-wheel-default-modals-rewardModal.style();
  // }
  
  // .amber-purple {
  //   #activity-wheel-default-modals-rewardModal.style();
  // }
</style>
