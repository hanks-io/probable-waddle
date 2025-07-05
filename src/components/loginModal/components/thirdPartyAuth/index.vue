<!-- 第三方登录 -->
<template>
  <div v-if="thirdPartyLoginTypes.length" class="wrapper">
    <!-- 分割线 -->
    <div class="divider-wrapper">
      <div class="line" />
      <span class="text">{{ 'OR' }}</span>
      <div class="line" />
    </div>
    <!-- 图标 -->
    <div class="icon-wrapper">
      <ion-icon class="icon" style="color: black" :src="`/first/svg/login/${item.item}.svg`"
        v-for="item in thirdPartyLoginTypes" :key="item.item" @click="thirdPartyLoginHandle(item)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import useThirdPartyAuthLogic from "@/components/loginModal/thirdPartyAuthLogic";

const {
  thirdPartyLoginTypes,
  thirdPartyLoginHandle,
} = useThirdPartyAuthLogic();
</script>

<style scoped lang="less">
.wrapper {
  padding: 3rem 0;
  text-align: center;

  .divider-wrapper {
    .flex-center();
    width: 100%;
    padding: 0.625rem 0;

    .line {
      width: 100%;
      height: 0.0625rem;
      background-color: var(--ep-color-border-default, var(--color-line));
    }
    .text {
      color: var(--ep-color-text-weak, var(--color-text-40));
      font-size: var(--ep-font-size-s, 0.75rem);
      padding: 0 0.625rem;
    }
  }

  .icon-wrapper {
    .flex-center();
    width: 100%;
    margin-top: 0.25rem;
    margin-bottom: 0.625rem;

    .icon {
      width: 3rem;
      height: 3rem;
      margin: 0 0.75rem;
      color: var(--ep-color-icon-default, var(--color-text-primary));
    }
  }
}
</style>
