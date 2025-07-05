<template>
  <div class="text-xs" v-if="showContent">
    <ion-col>
      <!-- 营销图片1 -->
      <ion-row class="h-[4.375rem]">
        <img 
          v-if="promotionalOne.content"
          class="w-full h-full rounded-[.625rem]" 
          @click="promotionalClick(promotionalOne)"
          :src="promotionalOne?.content" 
        />
        <img 
          v-else
          class="w-full h-full rounded-[.625rem]" 
          @click="jumpPage({}, 0)"
          src="/images/activity1.png" 
        />
      </ion-row>
      <!-- 营销图片2 -->
      <ion-row class="h-[4.375rem] mt-[0.625rem]">
        <img
          v-if="promotionalTwo.content"
          class="w-full h-full rounded-[.625rem]"
          @click="promotionalClick(promotionalTwo)" 
          :src="promotionalTwo?.content" 
        />
        <img 
          v-else 
          class="w-full h-full rounded-[.625rem]"
          @click="jumpPage({}, 1)" 
          src="/images/activity11.png" 
        />
      </ion-row>
      <!-- 营销图片3 -->
      <ion-row class="h-[4.375rem] mt-[0.625rem]">
        <img 
          v-if="promotionalThree.content" 
          class="w-full h-full rounded-[.625rem]"
          @click="promotionalClick(promotionalThree)" 
          :src="promotionalThree?.content" 
        />
        <img 
          v-else
          class="w-full h-full rounded-[.625rem]"
          @click="jumpPage({}, 2)"
          src="/images/activity111.png" 
        />
      </ion-row>
    </ion-col>
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
    padding: unset;
    margin: unset;
  }
</style>