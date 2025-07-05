<template>
  <ion-modal id="mineralStyle2AvailableModal" ref="modal" :initial-breakpoint="1" :is-open="visible" :backdrop-dismiss="false">
    <div class="availabled-content p-[1.5rem]">
      <!-- 活动名称 -->
      <div class="availabled-activity-name text-center">{{ activityName }}</div>
      <!-- 奖励图片 -->
      <div class="w-full flex-center">
        <img class="w-[15rem] h-[15rem]" src="/images/activity/mineral/mineral_style2_availabled_reward.png" alt="">
      </div>
      <!-- 奖励金额 -->
      <div class="w-full mt-[0.5rem] flex items-end justify-center">
        <div class="reward-color activity-text-gradient text-[2rem] mb-[0.0625rem] mr-[0.75rem]">X</div>
        <div class="reward-color activity-text-gradient text-[2.5rem]">
          {{ formatMoneyToShow(availabledRewardCount) }}
        </div>
      </div>
      <!-- 奖励信息 -->
      <div class="mineral-style2-reward-info text-center" v-html="availabledRewardCount ? $t('viewsActivity.activityList05', { amount: merchantCy + formatMoneyToShow(availabledRewardCount) }) : $t('activity.redPacket12')"></div>
      <!-- 确定按钮 -->
      <div class="mt-[2rem] w-full">
        <ion-button @click="confirmarClick" class="w-full mineral-style2-confirmar-btn h-[3rem]">
          {{ $t('activity.redPacket10') }}
        </ion-button>
      </div>
    </div>
    <!-- 退出按钮 -->
    <ion-icon class="absolute right-[0.75rem] top-[0.75rem] close-btn" :icon="close" @click="confirmarClick" />
  </ion-modal>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons'
import { IonModal, IonButton, IonIcon } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { useMineralStyle2AvailabledLogic } from '@/views/activity/mineral/hooks/mineralStyle2AvailabledLogic'

const props = defineProps({
  activityName: { type: String, required: true },
  availabledRewardCount: { type: [String, Number], default: 0 }
})

const emit = defineEmits(["closeAvailableModal"]);

const {
  visible,
  merchantCy,
  confirmarClick
} = useMineralStyle2AvailabledLogic({ emit });

</script>

<style scoped lang="less">
ion-modal {
  --width: fit-content;
  --height: fit-content;
  background: rgba(23, 26, 34, 0.75);
}

.availabled-content {
  width: 20.5rem;
  border-radius: 1rem;
  background: #0E0E0F;
  .availabled-activity-name {
    color: #FFF;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
  }
}

@font-face {
  font-family: 'MoneyFont';
  src: url('@/assets/fonts/numbersAndLetters.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}


.reward-color {
  font-family: 'MoneyFont';
  font-weight: 500;
  background: linear-gradient(180deg, #50FE93 0%, #00A53F 100%);
  -webkit-text-stroke-width: .0513rem;
  font-style: normal;
  -webkit-text-stroke-color: #c4edc4;
}

.mineral-style2-reward-info {
  color: #616D93;
  font-size: 1rem;
  line-height: 1.25rem;
}

.mineral-style2-confirmar-btn {
  min-height: 0;
  --border-radius: .25rem;
  --color: #FFF;
  --background: linear-gradient(0deg, #C08505 0%, #FFD272 100%);
  --background-hover: none;
  --background-activated: linear-gradient(0deg, #d9b468 0%, #edca7d 100%);
  --background-focused: linear-gradient(0deg, #d9b468 0%, #edca7d 100%);
}

.close-btn {
 width: 1.25rem;
 height: 1.25rem;
}
</style>
