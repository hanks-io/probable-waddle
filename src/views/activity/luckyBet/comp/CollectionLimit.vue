<script setup lang="ts">
import type { limitLevelType } from '@/views/activity/luckyBet/type';
import { receiveCountTypeList } from '@/views/activity/luckyBet/type';
const props = defineProps<{
  receiveCountType: string
  limitLevelList: limitLevelType[]
}>()
const isFixedCount = computed(() => props.receiveCountType === receiveCountTypeList[2])
</script>

<template>
  <div class="collection-limit-wrap">
    <div class="top-text">
      <div class="title">{{ $t('luckyBetSlip.000019') }}</div>
      <div class="header-text">
        <div>{{ receiveCountType }}</div>
        <div>{{ $t('luckyBetSlip.000020') }}</div>
      </div>
    </div>
    <div class="list-area">
      <ul class="inner">
        <li v-for="item in limitLevelList" :key="item.uuid">
          <div class="condition-amount item"><span v-if="!isFixedCount">&ge;</span>{{ item.conditionAmount }}</div>
          <div class="reward-amount item">{{ item.rewardAmount }}</div>
        </li>

      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
#activity-luckyBet-collection-limit {
  .style(@bgColor: --color-bg-200, @color: --color-text-100, @headerColor: --color-text-40, @innerBgColor: --color-bg-300) {
    .collection-limit-wrap {
      width: 22.875rem;
      background: var(@bgColor);
      box-sizing: border-box;

      .top-text {
        color: var(@color);
        padding: 1.125rem;
        box-sizing: border-box;

        .title {

          line-height: 1.3125rem;
          font-size: .875rem;
          font-weight: 700;
        }

        .header-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(@headerColor);
          font-size: .75rem;
          line-height: 1.125rem;
          margin-top: .875rem;
        }

      }

      .list-area {
        width: 22.875rem;
        padding: 0 .625rem .75rem .625rem;
        background: var(@bgColor);
        box-sizing: border-box;

        .inner {
          padding: .25rem .5rem;
          box-sizing: border-box;
          background: var(@innerBgColor);
          border-radius: .375rem;

          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 2.625rem;
            height: 2.625rem;
            color: var(@headerColor);

            .item {
              text-align: center;
              font-size: .875rem;
            }

            .condition-amount {
              flex: 7 1 0%;
              text-align: left;
              padding-left: 1rem;
              box-sizing: border-box;
            }

            .reward-amount {
              flex: 3 1 0%;
              font-weight: 700;
              color: var(@color);
            }

            &:not(:last-child) {
              border-bottom: 1px solid var(--line-color);
            }
          }
        }
      }

    }
  }
}

html {
  #activity-luckyBet-collection-limit.style();
}

.new-skin-symbol {
  #activity-luckyBet-collection-limit.style(@bgColor: --ep-color-background-fill-surface-raised-L1,
    @color: --ep-color-text-default,
    @headerColor: --ep-color-text-weaker,
    @innerBgColor: --ep-color-background-fill-body-default);

  .collection-limit-wrap {
    border-radius: var(--ep-border-radius-m);

    .top-text {
      .title {
        font-size: var(--ep-font-size-m);
        font-weight: var(--ep-font-weight-bold);
      }

      .header-text {
        font-size: var(--ep-font-size-s);
        font-weight: var(--ep-font-weight-regular);
      }
    }

    .list-area {
      .inner {
        border-radius: var(--ep-border-radius-m);

        li {
          .item {
            font-size: var(--ep-font-size-s);
            font-weight: var(--ep-font-weight-medium);
          }

          .reward-amount {
            font-weight: var(--ep-font-weight-bold);
          }
        }
      }
    }

  }
}
</style>
