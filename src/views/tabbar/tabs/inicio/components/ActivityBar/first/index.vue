<template>
  <div class="px-[.375rem] mt-2.5 text-xs" v-if="showContent">
    <ion-row>
      <!-- 营销图片1 -->
      <ion-col size="4" class="h-[4.875rem]">
        <img v-if="promotionalOne.content" @click="promotionalClick(promotionalOne)" class="w-full h-full rounded-[.625rem]" :src="promotionalOne?.content" />
        <div 
          v-else 
          @click="jumpPage({}, 1)"
          class="text recharge relative h-full rounded-[.625rem] text-[#6E3D03] flex flex-col justify-center items-center"
          :style="`background-image: url(${rechargeBg})`"
        >
          <p class="absolute top-2 text-sm leading-none" :text="$t('viewsTabbar.activityBar1')">
            {{ $t('viewsTabbar.activityBar1') }}
          </p>
          <p class="absolute top-[1.375rem] text-sm leading-none" :text="`${$t('viewsTabbar.activityBar2')} ${merchantCy} ${conditionAmount}`">
            {{ `${$t('viewsTabbar.activityBar2')} ${merchantCy} ${conditionAmount}` }}
          </p>
        </div>
      </ion-col>
      <!-- 营销图片2 -->
      <ion-col size="4" class="h-[4.875rem]">
        <img v-if="promotionalTwo.content" @click="promotionalClick(promotionalTwo)" class="w-full h-full rounded-[.625rem]" :src="promotionalTwo?.content" />
        <div
          v-else
          @click="jumpPage({}, 0)" 
          class="text agent relative h-full rounded-[.625rem] flex flex-col justify-center items-center"
          :style="`background-image: url(${agentBg})`"
        >
          <p class="absolute top-2 text-sm leading-none px-1" :text="$t('viewsTabbar.activityBar5')">
            {{ $t('viewsTabbar.activityBar5') }}
          </p>
        </div>
      </ion-col>
      <!-- 营销图片3 -->
      <ion-col size="4" class="h-[4.875rem]">
        <img v-if="promotionalThree.content" class="w-full h-full rounded-[.625rem]" @click="promotionalClick(promotionalThree)" :src="promotionalThree?.content" />
        <div 
          v-else 
          @click="jumpPage({}, 2)" 
          class="text activity relative h-full rounded-[.625rem] flex flex-col justify-center items-center"
          :style="`background-image: url(${activityBg})`"
        >
          <ion-img class="arrow absolute w-[1.875rem] bottom-2.5 right-0" src="/images/arrow.png" />
          <p class="absolute top-2 text-sm leading-none" :text="$t('viewsTabbar.activityBar4')">
            {{ $t('viewsTabbar.activityBar4') }}
          </p>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/store/tenant';
import router from '@/router';
import { computed } from 'vue';
import useActivityBarLogic from '../logic';
import { IonRow, IonCol, IonImg } from '@ionic/vue';

const { 
  conditionAmount, 
  merchantCy, 
  promotionalOne,
  promotionalTwo,
  promotionalThree,
  showContent,
  promotionalClick,
  navigate,
  jumpPage, 
} = useActivityBarLogic();

const tenantStore = useTenantStore();
const agentBg = computed(() => `/first/images/bg-agent-${tenantStore.themeConfig.theme}.jpg`);
const rechargeBg = computed(() => `/first/images/bg-recharge-${tenantStore.themeConfig.theme}.jpg`);
const activityBg = computed(() => `/first/images/bg-activity-${tenantStore.themeConfig.theme}.jpg`);

</script>

<style scoped lang="less">
ion-col {
  padding-inline-start: .375rem;
  padding-inline-end: .375rem;
  padding-top: 0;
  padding-bottom: 0;
}

ion-col div.recharge {
  
  background-repeat: no-repeat;
  background-size:cover
}

ion-col div.agent {
  background-repeat: no-repeat;
  background-size:cover
}

ion-col div.activity {
  background-repeat: no-repeat;
  background-size:cover
}

ion-col div.text p {
  text-align: center;
  position: absolute;
  font-family: "Changa One";
  color: var(--color-text-dark-30);
}

ion-col div.recharge p {
  letter-spacing: -0.04rem;
}

ion-col div.recharge p::before {
  letter-spacing: -0.04rem;
}

ion-col div.agent p::before {
  padding: 0 .25rem;
}

ion-col div.text p::before {
  content: attr(text);
  position: absolute;
  top: -.125rem;
  left: 0;
  background: linear-gradient(180deg, #FEF0D6 8.33%, #FFF 24.67%, #FFE0A7 41%, #FFE7BB 57.33%, #FFF 73.67%, #FFE1A7 90%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.activity-bar {
  margin-top: .625rem;
}
</style>
