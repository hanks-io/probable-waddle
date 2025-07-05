<template>
  <div class="px-[.5625rem] mt-2.5 text-xs" v-if="showContent">
    <ion-row>
      <ion-col size="6">
        <!-- 营销图片1 -->
        <ion-row class="h-[3.125rem]">
          <img v-if="promotionalOne.content" class="w-full h-full rounded-[.625rem]"
            @click="promotionalClick(promotionalOne)" :src="promotionalOne?.content" />
          <img v-else class="w-full h-full rounded-[.625rem]" @click="jumpPage({}, 0)"
            src="/images/activity2-1.png" />
        </ion-row>
        <!-- 营销图片2 -->
        <ion-row class="h-[3.125rem] mt-[0.4375rem]">
          <img v-if="promotionalTwo.content" class="w-full h-full rounded-[.625rem]"
            @click="promotionalClick(promotionalTwo)" :src="promotionalTwo?.content" />
          <img v-else class="w-full h-full rounded-[.625rem]" @click="jumpPage({}, 1)" 
            src="/images/activity2-2.png" />
        </ion-row>
      </ion-col>
      <!-- 营销图片3 -->
      <ion-col size="6" class="h-[6.75rem]">
        <img v-if="promotionalThree.content" class="w-full h-full rounded-[.625rem]"
          @click="promotionalClick(promotionalThree)" :src="promotionalThree?.content" />
        <img v-else class="w-full h-full rounded-[.625rem]" @click="jumpPage({}, 2)"
          src="/images/activity2-3.png" />
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