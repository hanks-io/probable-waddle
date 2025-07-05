<!-- 佣金领取规则弹窗 -->
<template>
  <div class="warpper">
    <div class="content">
      <p class="title">{{ $t('toggle.receiveRuleTitle') }}</p>
      <div class="ruleText">
        <p>{{ $t('toggle.receiveRule01', { time: config?.commissionDistributeTime }) }}</p>
        <p>{{ $t('toggle.receiveRule02') }}</p>
        <p>{{ $t('toggle.receiveRule03') }}</p>
      </div>
      <div class="btn">
        <Button @click="closeModal">{{ $t('toggle.receiveRule04') }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"> 
import Button from '@/components/first/Button/index.vue';
import useLogic from './logic';

const { closeModal, config } = useLogic();

</script>

<style scoped lang="less">
@import "./styles/index.less";
</style>
