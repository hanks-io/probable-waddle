<script setup lang="ts">
const emit = defineEmits(['pathToDetail'])
let props = withDefaults(defineProps<{
  receivedTitle: string,
  receivedAmount: string,
  isShowDetail: boolean,
  rewardAmountTitle: string,
  rewardAmount: string,
  merchantCy: string,

}
>(), {

});
</script>
<template>
  <div class="comission-amount-wrap">


    <div class="amount-item">
      <div class="title">{{ $t(receivedTitle) }}</div>
      <div class="amount"><span>{{ merchantCy }}</span>{{ rewardAmount}}</div>
    </div>
    <div class="line-box">
      <div class="line"></div>
    </div>
    <div class="amount-item">
      <div class="title">{{ $t(rewardAmountTitle) }}</div>
      <div class="flex-between">
        <div class="amount">
          <span>{{ merchantCy }}</span>{{ receivedAmount}}
        </div>
        <span class="detail" v-if="isShowDetail" @click="emit('pathToDetail')">{{ $t('activity.agent28') }}</span>
      </div>
    </div>


  </div>



</template>

<style scoped lang="less">
#activity-commission-amount-comp {

  .style(@bg: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.27) 35%, rgba(0, 0, 0, 0.27) 64.95%, rgba(0, 0, 0, 0) 100%),
    @titleColor: rgba(255, 255, 255, 0.8), @amountColor: #FFD90B, @detailColor: rgba(255, 255, 255, 0.4), 
    @detailTextColor: #32BAFA
    ) {
    .comission-amount-wrap {
      margin: 1rem;
      border-width: 1px 0px 1px 0px;
      border-style: solid;
      padding: .5625rem 0;
      min-height: 3.5625rem;
      width: calc(100% - 2.25rem);
      border-image-source: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(223, 197, 122, 0.42) 50.5%, rgba(0, 0, 0, 0) 100%);
      border-image-slice: 1;
      background: @bg;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .line-box {
        height: 1.625rem;
        width: 1.25rem;

        .line {
          width: 0.0625rem;
          height: 100%;
          background: #A7A7A7;
          transform: translateX(0.75rem) rotate(30deg);
          transform-origin: 100% 0;
        }
      }

      .amount-item {
        width: 10.3125rem;

        .title {
          font-size: .625rem;
          color: @titleColor;
          line-height: 16px;
        }

        .amount {
          color: @amountColor;
          font-weight: 500;
          font-size: 1rem;
          line-height: 1.5rem;
        }

        .detail {
          color: @detailTextColor;
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 0.5rem;
          cursor: pointer;
          &::after {
            content: ' >';
            margin-left: 0.4rem;
            color: @detailColor;
          }
        }
      }
    }

  }
}

.blue-default,
.green-default,
.green-dark,
.forest-green,
.yellow-dark,
.amber-purple, 
.auroral-yellow {
  #activity-commission-amount-comp.style()
}

.purple-light {
  #activity-commission-amount-comp.style(@bg: linear-gradient(90deg, rgba(187, 151, 255, 0) 0%, #BB97FF 35%, rgba(187, 151, 255, 0.27) 64.95%, rgba(187, 151, 255, 0) 100%),
    @detailColor: #403D4F, @titleColor: #403D4F, @amountColor: #FF3C0B, )
}

.style_1 {
  #activity-commission-amount-comp.style(@bg: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.27) 35%, rgba(0, 0, 0, 0.27) 64.95%, rgba(0, 0, 0, 0) 100%),
    @detailColor:  rgba(255, 255, 255, 0.4), @titleColor: rgba(255, 255, 255, 0.80), @amountColor: #FFD90B, )
}

.new-skin-symbol {

  #activity-commission-amount-comp.style(
    @bg:linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(255, 255, 255, 0.10) 35%, rgba(255, 255, 255, 0.10) 64.95%, rgba(0, 0, 0, 0.00) 100%),
    @detailColor:  var(--ep-color-text-info),
     @titleColor: var(--ep-color-text-weaker), 
     @amountColor: var(--ep-color-text-warning), 
     @detailTextColor: var(--ep-color-text-info)
  );
  
  .comission-amount-wrap {
        .amount-item {
          .title {
            font-size: var(--ep-font-size-xs);
            font-weight: var(--ep-font-weight-regular);
          }
  
          .amount {
            font-weight: var(--ep-font-weight-medium);
            font-size: var(--ep-font-size-l);
          }
  
          .detail {
            font-size: var(--ep-font-size-s);
            font-weight: var(--ep-font-weight-medium);
          }
        }
      }
}

</style>
