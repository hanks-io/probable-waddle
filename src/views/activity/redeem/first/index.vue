<!-- 兑换码活动 -->
<template>
  <div :class="$attrs.class" :style="$attrs.style">
    <div class="top-banner">
      <ion-img v-show="imgUrl" :src="imgUrl" @click="onImgClick"></ion-img>
    </div>
    <Input class="code-input" ref="inputRef" :placeholder="t('activity.redeem1')" bgColor="--color-redeem-input-bg"
      v-model="redeemCode" type="text" :minlength="5" :maxlength="12" clearInput></Input>
    <div class="btn-warpper">
      <Button @click="redemptionHandle">{{ $t('activity.redeem2') }}</Button>
    </div>
    <PartView :gamePlatform="false" :paymentPlatform="false"></PartView>
    <div class="rule-text">
      <p class="keep-space">{{ description }}</p>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import PartView from '@/views/tabbar/tabs/inicio/components/PartView/first/index.vue';
  import { IonImg } from '@ionic/vue';
  import Input from '@/components/first/Input/index.vue'
  import Button from '@/components/first/Button/index.vue'
  import useLogic from '../logic';

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
  
  </script>
  
  <style scoped lang="less">

  .top-banner {
    overflow: hidden;
    margin-top: 0.625rem;
    margin-bottom: 1rem;
    border-radius: var(--ep-border-radius-l, var(--rounded-large));
  }

  .code-input {
    height: 2.875rem;
    margin-bottom: 1.5rem;
  }

  .btn-warpper {
    margin-bottom: 0.75rem;
  }

  .rule-text {
    padding-top: 1.875rem;
    margin-bottom: 2.5rem;
    color: var(--ep-color-text-weaker, var(--color-activity-rule));
    font-size: var(--ep-font-size-s, 0.75rem);
    line-height: 1rem;
  }
  </style>
