<script setup lang="ts">
defineProps<{
  digit: number | string
}>()
</script>
<template>
  <div class="ball-wrap">
    {{ digit }}
  </div>
</template>

<style scoped lang="less">
#activity-luckyBet-ball-style_0 {
  .style(@color: --color-text-80, @border-color: --accent-color-red) {
    .ball-wrap {
      width: 1.375rem;
      height: 1.375rem;
      border-radius: 50%;
      border: 1px solid var(@border-color);
      background: linear-gradient(145.95deg, #F16B51 20.81%, #68190B 82.66%);
      box-shadow: 0px 0px 2.3px 2px #0000001F inset;
      box-sizing: border-box;
      text-align: center;
      color: var(@color);
      font-size: var(--ep-font-size-m, 1.25rem);
      font-weight: var(--ep-font-weight-bold, 700);
    }
  }
}
.green-dark,
.yellow-dark {
  #activity-luckyBet-ball-style_0.style();
}

.purple-light {
  #activity-luckyBet-ball-style_0.style(@color: --text-color-white-100);
}
.amber-purple{
  #activity-luckyBet-ball-style_0.style(@color: --text-color-white-100);
}
.blue-default{
  #activity-luckyBet-ball-style_0.style(@color: --text-color-white-100);
}
.green-default, .forest-green, .auroral-yellow{
  #activity-luckyBet-ball-style_0.style(@color: --color-text-white-100);
}

.new-skin-symbol {
  #activity-luckyBet-ball-style_0.style(@color: --ep-color-text-highlight-white, @border-color: --ep-color-icon-danger);
  
}
</style>
