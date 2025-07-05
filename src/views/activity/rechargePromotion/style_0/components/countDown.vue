<template>
  <div 
    class="count-down-item mr-[0.625rem] relative" 
    :class="{ 'over-count-down': !isStartTime }"
    v-for="(item, index) in overCountDownList" 
    :key="index"
  >
    <div class="count-down-item-content w-full h-full py-[0.25rem] flex flex-col items-center justify-around">
      <div class="count-down-value">{{ handleTimeShow(item.value) }}</div>
      <div class="count-down-name uppercase">{{ $t(`${item.name}`) }}</div>
    </div>
    <!-- 底部线条 -->
    <div class="count-down-footer-line absolute bottom-0 left-[50%]"></div>
  </div>
</template>

<script setup lang="ts">
import { rechargeBonusModel } from '@/api/activity/model'
import { useCountDownLogic } from '@/views/activity/rechargePromotion/hooks/countDownLogic'

const props = defineProps<{
  activityDetail: rechargeBonusModel;
}>();

const {
  isStartTime,
  overCountDownList,
  handleTimeShow
} = useCountDownLogic(props);
</script>

<style scoped lang="less">
@import "@/views/activity/rechargePromotion/style_0/style/countDown/base-index.less";
@import "@/views/activity/rechargePromotion/style_0/style/countDown/theme-style.less";

#activity-rechargePromotion-components-countDown-index.style();

.blue-default {
  #activity-rechargePromotion-components-countDown-index.style();
}

.green-default {
  #activity-rechargePromotion-components-countDown-index.style(
    linear-gradient(180deg, #FED85A -20.45%, #498200 100%),
    #FFF,
    #FFDD34,
    linear-gradient(180deg, #FFF -20.45%, #283127 100%),
    #FFF,
    #FFF,
  );
}

.forest-green {
  #activity-rechargePromotion-components-countDown-index.style(
    linear-gradient(180deg, #00E599 -20.45%, #004D33 100%),
    #FFF,
    #00E599,
    linear-gradient(180deg, #FFF -20.45%, #283127 100%),
    #FFF,
    #FFFFFF,
  );
}

.amber-purple {
  #activity-rechargePromotion-components-countDown-index.style(
    linear-gradient(180deg, #ACA5D9 -20.45%, #302D53 100%),
    #FFFFFF,
    #ACA5D9,
    linear-gradient(180deg, #FFF -20.45%, #292929 100%),
    #FFFFFF,
    #FFFFFF,
  );
}

.yellow-dark,
.auroral-yellow {
  #activity-rechargePromotion-components-countDown-index.style(
    linear-gradient(180deg, #FFD599 -20.45%, #995900 100%),
    #FFFFFF,
    #FFD599,
    linear-gradient(180deg, #FFF -20.45%, #283127 100%),
    #FFFFFF,
    #FFFFFF,
  )
}

.green-dark {
  #activity-rechargePromotion-components-countDown-index.style(
    linear-gradient(180deg, #AAF17E -20.45%, #0E6500 100%),
    #FFFFFF,
    #8FE759,
    linear-gradient(180deg, #FFF -20.45%, #283127 100%),
    #FFFFFF,
    #FFFFFF,
  );
}

.purple-light {
  #activity-rechargePromotion-components-countDown-index.style(
    linear-gradient(180deg, #BC9BFF -20.45%, #8D51FC 100%),
    #FFFFFF,
    #BEACFF,
    linear-gradient(180deg, #FFF -20.45%, #283127 100%),
    #FFFFFF,
    #FFFFFF,
  );
}

.new-skin-symbol {
  @import "@/views/activity/rechargePromotion/style_0/style/countDown/new-base-index.less";
}
</style>

