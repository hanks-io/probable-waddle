<template>
  <div class="activity-bar px-[.375rem] text-xs">
    <ion-row>
      <!-- 营销图片1 -->
      <ion-col size="4" class="h-[4.875rem] flex-center">
        <img v-if="promotionalOne.content" @click="promotionalClick(promotionalOne)" class="w-[7rem] h-full rounded-[.625rem]" :src="promotionalOne?.content" />
        <img v-else @click="jumpPage({}, 1)" :src="rechargeBg" alt="" class="w-[7rem] h-full rounded-[.625rem]" />
      </ion-col>
      <ion-col size="4" class="h-[4.875rem] flex-center">
        <img v-if="promotionalTwo.content" @click="promotionalClick(promotionalTwo)" class="w-[7rem] h-full rounded-[.375rem]" :src="promotionalTwo?.content" />
        <img v-else @click="jumpPage({}, 0)" :src="agentBg" alt="" class="w-[7rem] h-full rounded-[.375rem]" />
      </ion-col>
      <ion-col size="4" class="h-[4.875rem] flex-center">
        <img v-if="promotionalThree.content" class="w-[7rem] h-full rounded-[0.375rem]" @click="promotionalClick(promotionalThree)" :src="promotionalThree?.content" />
        <img v-else @click="jumpPage({}, 2)" class="w-[7rem] h-full rounded-[0.375rem]" :src="activityBg" />
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonRow, IonCol, IonImg } from "@ionic/vue";
import useActivityBarLogic from "../logic";
import router from "@/router";

const { 
  conditionAmount, 
  merchantCy, 
  promotionalOne,
  promotionalTwo,
  promotionalThree,
  promotionalClick,
  navigate,
  jumpPage
  } = useActivityBarLogic();

const tenantStore = useTenantStore();
const agentBg = computed(() => `/first/images/bg-agent-${tenantStore.themeConfig.theme}.jpg`);
const rechargeBg = computed(() => `/first/images/bg-recharge-${tenantStore.themeConfig.theme}.jpg`);
const activityBg = computed(() => `/first/images/bg-activity-${tenantStore.themeConfig.theme}.jpg`);
</script>

<style scoped lang="less">
.activity-bar {
  margin-top: 1rem;
}
</style>
