<!-- 兑换码活动 -->
<template>
  <div :class="$attrs.class" :style="$attrs.style">
    <div class="rounded-[0.625rem] overflow-hidden mt-[0.625rem]">
      <img v-show="imgUrl" class="w-full h-[7.5rem]" :src="imgUrl" @click="onImgClick"></img>
    </div>
    <p class=" text-base font-bold mt-[1.875rem] text-[--color-text-basic]">{{ $t('activity.redeem1') }}</p>
    <div class="flex justify-center items-center px-[0.625rem] py-[0.25rem] my-5 w-full h-[3rem] border border-[--color-border-input-basic] rounded-md inputBg">
      <ion-input class="h-[2.375rem] text-sm" ref="inputRef" mode="ios" :placeholder="t('activity.redeem1')" v-model.trim="redeemCode" type="text" :minlength="5" :maxlength="12" clearInput></ion-input>
    </div>
    <div>
      <ion-button class="redemption text-[--color-text-btn-basic]" @click="redemptionHandle">{{ $t('activity.redeem2') }}</ion-button>
    </div>
    <component :is="partViewComponent" :gamePlatform="false" :paymentPlatform="false"></component>
    <div class="redeem-description text-xs pt-[1.875rem] mb-10">
      <p class="keep-space">{{ description }}</p>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { IonInput, IonButton } from '@ionic/vue';
  import useLogic from '../logic';
  import useComponents from '@/views/tabbar/tabs/inicio/useComponents'

  defineOptions({
    inheritAttrs: false
  })

  const {
    inputRef,
    redeemCode,
    description,
    imgUrl,
    redemptionHandle,
    t,
    onImgClick,
  } = useLogic();

  const {
    partViewComponent
  } = useComponents();

</script>
  
<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/redeem/default/style/base-index.less";
  @import "@/views/activity/redeem/default/style/theme-style.less";

  #activity-redeem-default-index.style();

  .blue-default {
    #activity-redeem-default-index.style(
      --color-text-white-40,
      --color-text-white-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --color-text-white-100,
      --color-text-white-100,
      --color-border-600,
      --color-text-white-100,
      --text-color-white-40
    );
  }

  .green-default {
    #activity-redeem-default-index.style(
      --color-text-gray-200,
      --color-text-white-100,
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --color-text-gray-100,
      --color-text-gray-100,
      --color-line,
      --color-text-white-100,
      --color-text-gray-200
    );
  }

  .forest-green {
    #activity-redeem-default-index.style(
      @redeem-default-index-09 : --color-text-gray-200,
      @redeem-default-index-10 : --color-bg-400,
    );
  }

  .amber-purple {
    #activity-redeem-default-index.style(
      --text-color-light-purple-2-100,
      --text-color-white-100,
      --segment-gradients-purple,
      --segment-gradients-purple,
      --text-color-light-purple-1-100,
      --text-color-light-purple-1-100,
      --line-color,
      --text-color-white-100,
      --text-color-light-purple-2-100
    );
  }

  .auroral-yellow {
    #activity-redeem-default-index.style(
      @redeem-default-index-03: --theme-color-800,
      @redeem-default-index-05: --agent-btn-color,
    );
  }
</style>