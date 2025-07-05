<template>
  <ion-item lines="none" class="rebate-item" :key="item.platformId" button detail v-if="maxRebateRate">
    <div class="rebate-content">
      <div class="top-rebate">
        <div class="top-rebate-left">
          <div class="platform">
            <ion-icon :src="item.logo" />
            <p class="rebate-ratio">{{ $t("activity.agent34") }}</p>
            <p class="valid-bet"> {{ formatMoneyToShow(validBet) }} </p>
          </div>
        </div>
        <div class="top-rebate-right">
          <span class="rebate-ratio" style="text-shadow: none; font-size: 0.625rem">{{ $t("viewsActivity.rebateRatio") }}</span>
          <span class="rate" style="text-shadow: none; font-size: 0.625rem">{{ rebateRate }}%</span>
        </div>
      </div>
      <div class="bottom-rebate">
        <div class="bottom-rebate-left">
          <p>
            {{ upgrade ? $t("viewsActivity.betTips", { betMoney: formatMoneyToShow(upgrade - validBet), rate: nextRebateRate }) : $t("viewsActivity.maxLevel") + " 100%" }}
          </p>
        </div>
        <div class="bottom-rebate-right">
          <span class="rebate-ratio" style="text-shadow: none; font-size: 0.625rem">{{ $t("label.collectable") }}</span>
          <span class="rate" style="text-shadow: none; font-size: 0.625rem">{{ formatMoneyToShow(availableRebate) }}</span>
        </div>
      </div>
      <ion-progress-bar :value="upgrade ? validBet / upgrade : 1" />
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { formatMoneyToShow } from "@/utils/custom";
import { IonItem, IonIcon, IonProgressBar } from "@ionic/vue";
import useRebateItemLogic from "../../rebateItemLogic";

const props = defineProps({
  item: { type: Object, required: true },
  gameType: { type: String, required: true },
});

const { validBet, rebateRate, upgrade, nextRebateRate, availableRebate, maxRebateRate } = useRebateItemLogic({ props });
</script>

<style scoped lang="less">

.rebate-item {
  margin-bottom: 0.625rem;
  font-size: var(--ep-font-size-xs, 0.62rem);
}

ion-item.rebate-item {
  --detail-icon-opacity: 1;
  --detail-icon-font-size: 1rem;
  --detail-icon-color: var(--ep-color-text-weaker, var(--color-text-40));
  --background: var(--ep-color-background-fill-surface-raised-L1, var(--color-bg-200));
  --min-height: 3.75rem;
  --height: 3.75rem;
  --max-height: 3.75rem;
  border-radius: var(--ep-border-radius-m, 0.625rem);
}

ion-item.rebate-item::part(native) {
  /* 插槽slot内容样式 */
  padding-inline-start: 0.4rem;
  --inner-padding-end: 0;
}

ion-item::part(detail-icon) {
  margin-inline-end: 0;
}

.rebate-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.top-rebate {
  .flex-around();
  padding: 0.0625rem 0;
  .top-rebate-left {
    position: relative;
    flex: 1;
    .flexBox();
    .platform {
      .flexBox();
      ion-icon {
        color: var(--ep-color-text-weaker, var(--color-icon-platform-rebate));
        font-size: 1.5rem;
        line-height: 2rem;
      }
    }
    .valid-bet {
      font-size: var(--ep-font-size-xs, 0.625rem);
      line-height: 1.5;
      font-weight: var(--ep-font-weight-medium, 400);
      color: var(--ep-color-text-default, var(--color-text-100));
    }
  }
  .top-rebate-right {
    .flex-between();
    text-align: right;
    padding-right: 5px;
    max-width: 7.5rem;
    .rate {
      font-size: var(--ep-font-size-xs, 0.625rem);
      line-height: 1.5;
      font-weight: var(--ep-font-weight-medium, 400);
      color: var(--ep-color-text-default, var(--color-text-100));
    }
  }
}

.bottom-rebate {
  .flex-between();
  padding: 0.0625rem 0;
  .bottom-rebate-left {
    flex: 1;
    position: relative;
    margin-left: 1.625rem;
    p {
      text-align: left;
      color: var(--ep-color-text-weaker, var(--color-text-80));
      font-size: var(--ep-font-size-xs, 0.625rem);
    }
  }
  .bottom-rebate-right {
    .flex-between();
    text-align: right;
    padding-right: 0.3125rem;
    max-width: 7.5rem;
    .rate {
      font-size: var(--ep-font-size-xs, 0.625rem);
      line-height: 1.5;
      font-weight: var(--ep-font-weight-medium, 400);
      color: var(--ep-color-text-warning, var(--color-currency));
    }
  }
}

ion-progress-bar {
  height: 0.25rem;
  width: 6.875rem;
  margin: 0.375rem 0;
  margin-left: 1.625rem;
  border-radius: var(--ep-border-radius-l, 0.8125rem);
  --background: var(--ep-color-background-fill-body-default, var(--color-progress-bg));
  --progress-background: var(--ep-color-icon-brand-primary, var(--color-progress-bar));
}

.rebate-ratio {
  margin-inline: 0.125rem;
  text-align: left;
  color: var(--ep-color-text-weaker, var(--color-rebate-title));
}
</style>
