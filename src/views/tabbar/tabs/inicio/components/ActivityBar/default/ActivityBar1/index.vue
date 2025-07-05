<template>
  <div class="px-[.5625rem] mt-2.5 text-xs" v-if="showContent">
    <ion-row class="px-[.1875rem]">
      <!-- 营销图片2 -->
      <ion-col size="6" class="h-[3.125rem]">
        <img v-if="promotionalTwo.content" class="w-full h-full rounded-[.625rem]" @click="promotionalClick(promotionalTwo)" :src="promotionalTwo?.content" />
        <div v-else @click="jumpPage({}, 1)" class="recharge relative h-full rounded-[.625rem] flex flex-col justify-center pl-2.5 text-[#6E3D03]">
          <ion-img class="absolute w-[1.625rem] -left-3" src="/images/coin.png" />
          <ion-img class="absolute w-[5.25rem] bottom-0 right-0 rounded-ee-[.625rem] overflow-hidden opacity-30" src="/images/money.png" />
          <div class="absolute">
            <p class="text-[.6875rem]">{{ $t('viewsTabbar.activityBar1') }}</p>
            <p class="font-bold text-xs">{{ $t('viewsTabbar.activityBar2') }} {{ merchantCy }} <span class="text-base">{{ `${conditionAmount}` }}</span></p>
          </div>
        </div>
      </ion-col>
      <!-- 营销图片3 -->
      <ion-col size="6" class="h-[3.125rem]">
        <img v-if="promotionalThree.content" class="w-full h-full rounded-[.625rem]" @click="promotionalClick(promotionalThree)" :src="promotionalThree?.content" />
        <div v-else @click="jumpPage({}, 2)" class="activity relative h-full rounded-[.625rem] flex flex-col justify-center pl-2.5 text-white">
          <ion-img class="absolute w-[3.4375rem] -right-2" src="/images/prize-parachute.png" />
          <div class="absolute">
            <p class="text-[.6875rem]">{{ $t('viewsTabbar.activityBar3') }}</p>
            <p class="font-bold text-xs leading-6">{{ $t('viewsTabbar.activityBar4') }}</p>
          </div>
        </div>
      </ion-col>
    </ion-row>
    <!-- 营销图片1 -->
    <ion-row class="px-[.375rem] mt-1.5" >
      <ion-col size="12" class="h-[3.125rem]" v-if="promotionalOne.content">
        <img class="w-full h-full rounded-[.625rem]" @click="promotionalClick(promotionalOne)" :src="promotionalOne?.content" />
      </ion-col>
      <ion-col v-else @click="jumpPage({}, 0)" class="agent relative h-[3.125rem] rounded-[.625rem] flex items-center justify-center">
        <ion-img class="absolute w-[6.75rem] bottom-0 left-0" src="/images/tiger.png" />
        <ion-img class="absolute w-[4.5rem] -bottom-[1px] right-3" src="/images/rabbit.png" />
        <ion-img class="arrow absolute w-[1.875rem] right-0" src="/images/arrow.png" />
        <p class="absolute w-[11.625rem] left-3 text-[.9375rem] leading-[1.125rem] font-extrabold" :text="$t('viewsTabbar.activityBar5')">{{ $t('viewsTabbar.activityBar5') }}</p>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { IonRow, IonCol, IonImg } from '@ionic/vue';
import useActivityBarLogic from '@/views/tabbar/tabs/inicio/components/ActivityBar/logic';
import router from '@/router';

const { 
  conditionAmount, 
  merchantCy,
  promotionalOne,
  promotionalTwo,
  promotionalThree,
  showContent,
  promotionalClick,
  navigate,
  jumpPage
} 
= useActivityBarLogic();

</script>

<style scoped>
ion-col {
  padding-inline-start: .1875rem;
  padding-inline-end: .1875rem;
  padding-top: 0;
  padding-bottom: 0;
}

ion-col div.recharge {
  background: linear-gradient(90deg, #FFDC62 0%, #FFB448 100%);
}

ion-col div.activity {
  background: linear-gradient(90deg, #C85FFB 0%, #73A4F7 100%);
}

ion-col.agent {
  background: linear-gradient(90deg, #E34A22 0%, #FF8B3D 40%, #FF8B3D 59.5%, #E34A22 100%);
}

ion-col.agent p {
  position: relative;
  color: #D53D03;
}

ion-col.agent p::before {
  content: attr(text);
  /* 获取标签中text属性为显示内容 */
  position: absolute;
  top: -.125rem;
  left: 0;
  z-index: 10;
  background: linear-gradient(180deg, #FEF0D6 16.5%, #FFFFFF 23.44%, #FFE0A7 44.27%, #FFE7BB 58.63%, #FFFFFF 70.4%, #FFE1A7 90%);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  text-shadow: none;
}

.arrow {
  animation: arrow 1s infinite;
}

@keyframes arrow {
  0% {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-5px);
  }
}
</style>
