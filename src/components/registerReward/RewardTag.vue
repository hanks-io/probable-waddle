<!-- 注册赠送奖励显示金额标签 -->
<template>
  <div v-if="showTag">
    <div class="tag" :style="{ minWidth: tagWidth, minHeight: tagHeight, borderRadius }">
      <div class="merchantCy" :style="{ fontSize, lineHeight, width: merchantCyWidth }">
        <ion-img v-if="isVirtualCurrency" src="/images/activity/coin.webp" />
        <span v-else>{{ merchantCy }}</span>
      </div>
      <div class="reward-amount" :style="{ fontSize, lineHeight, padding: rewardAmountPading }">{{ `+${rewardAmount}` }}</div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { IonImg } from '@ionic/vue';
import { computed } from 'vue';
import { useTenantStore } from '@/store/tenant';

const props = withDefaults(defineProps<{
  size?: 'small' | 'large'
}>(), {
  size: 'small'
});

const sizeMap = {
  small: { 
    width: '3rem',
    height: '0.8125rem',
    fontSize: '0.625rem',
    borderRadius: '0.375rem 0.125rem 0.375rem 0.125rem',
    merchantCyWidth: '1.5rem',
    rewardAmountPading: '0 0.3125rem'
  },
  large: {
    width: '6rem',
    height: '1.625rem',
    fontSize: '1.125rem',
    borderRadius: '0.75rem 0.25rem 0.75rem 0.25rem',
    merchantCyWidth: '3rem',
    rewardAmountPading: '0 0.625rem'
  },
}

const tagWidth = computed(() => sizeMap[props.size]?.width)
const tagHeight = computed(() => sizeMap[props.size]?.height)
const fontSize = computed(() => sizeMap[props.size]?.fontSize)
const lineHeight = computed(() => sizeMap[props.size]?.height)
const borderRadius = computed(() => sizeMap[props.size]?.borderRadius)
const merchantCyWidth = computed(() => sizeMap[props.size]?.merchantCyWidth)
const rewardAmountPading = computed(() => sizeMap[props.size]?.rewardAmountPading)
const showTag = computed(() => useTenantStore().tenantInfo?.rewardSwitch && parseFloat(useTenantStore().tenantInfo?.buttonShowAmount))
const merchantCy = computed(() => useTenantStore().tenantInfo?.merchantCy)
const isVirtualCurrency = computed(() => useTenantStore().isVirtualCurrency)
const rewardAmount = computed(() => useTenantStore().tenantInfo?.buttonShowAmount)
</script>

<style scoped lang="less">

.tag {
  border: 0.0625rem solid #FFF781;
  display: flex;
  overflow: hidden;
}

.text-base {
  font-family: Roboto;
  font-style: italic;
  font-weight: 900;
  line-height: normal;
  text-align: center;
  color: #FDE077;
}

.merchantCy {
  .flex-center();
  .text-base();
  background: linear-gradient(90deg, #7F0671 -0.29%, #4C08B2 100%);
  ion-img {
    width: 0.625rem;
  }
}

.reward-amount {
  .text-base();
  padding: 0 0.625rem;
  background: linear-gradient(90deg, #B32344 0%, #EA355F 100%);
  flex: 1;
  white-space: nowrap;
}
</style>
