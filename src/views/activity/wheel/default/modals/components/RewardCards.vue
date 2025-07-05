<template>
  <div class="card-wrap">
    <div class="card" :style="setCardStyle(`prop_${item.name}`, 'small')" v-for="(item,index) in rewardCards"
         :key="index">
      <div class="card-top">
        <span class="card-name" :style="setCardNameStyle(`prop_${item.name}`)">{{ item.name.charAt(0) }}</span>
      </div>
      <div class="card-bot">
        <span class="span-cls" :style="setAccountStroke(`prop_${item.name}`, '.75rem')">x{{ item.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { setCardStyle, setCardNameStyle, setAccountStroke } from "../../hooks/setStyle";

defineProps({
  rewardCards: { type: Array as () => Record<string, any>[], required: true }  // 弹窗显示状态
});

</script>

<style lang="less" scoped>
.card-wrap {
  .flex-around();
  padding: 0 0.5rem;
}

.card-name {
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
}

.card {
  width: 3.875rem;
  height: 5rem;
  display: flex;
  flex-direction: column;
  border-radius: .3125rem;

  .card-top {
    flex: 1;
    .flex-center();
  }

  .card-bot {
    height: 1rem;
    .flex-center();

    .span-cls {
      font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
    }
  }
}
</style>