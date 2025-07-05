<!-- 返水活动记录 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('viewsActivity.rebateRatio')" :backRebate="backRebate" />
    <ion-content>
      <!-- 顶部筛选模块 -->
      <div class="filter">
        <div ref="scrollSelectionRef" class="warpper">
          <!-- 游戏类型选择 -->
          <div class="game-type-selector" @click="gameTypeSelectHandle">
            <div class="report-selected">{{ $t(`sort.${gameType}`) }}</div>
              <ion-icon :icon="'/first/svg/select-icon.svg'" :class="gameVisible ? 'on' : ''"/>
              <ion-popover mode="md" trigger="statement-trigger" :isOpen="gameVisible" @didDismiss="dismissHandle" size="cover">
                <ion-row>
                  <ion-col size="3" class="select-col" v-for="(item, index) in gameTypes" :key="index" :value="item" @click="selectedType(item)">
                    <p :class="item == gameType ? 'report-selected-item' : 'report-select-item'" >{{  $t(`sort.${item}`) }}</p>
                  </ion-col>
                </ion-row>
              </ion-popover>
          </div>
          <!-- 游戏平台选择 -->
          <div class="platform-selector" @click="platformSelectHandle">
          <div class="report-selected">{{ platformName }}</div>
            <ion-icon :icon="'/first/svg/select-icon.svg'" :class="platformVisible ? 'on' : ''"/>
              <ion-popover mode="md" trigger="statement-trigger" :isOpen="platformVisible" @didDismiss="dismissHandle" size="cover">
                <ion-row>
                  <ion-col size="3" :class="item.isTrue ? 'lang-col' : ''"  class="select-col" v-for="(item, index) in platformList" :key="index"  :value="item.name" @click="selectedPlatformType(item.name)">
                    <p :class="item.name == platformName ? 'report-selected-item' : 'report-select-item'">{{ item.name }}</p>
                  </ion-col>
                </ion-row>
              </ion-popover>
          </div>
          <!-- 右侧显示 -->
          <ion-label class="report-title">{{ $t('activity.agent34') }}</ion-label>
          <ion-label class="report-title">{{ $t('viewsActivity.rebateRatio') }}</ion-label>
        </div>
      </div>
      <!-- 弹出层参照 -->
      <div id="statement-trigger" class="w-full"/>
      <!-- 空列表状态提示 -->
      <div class="empty-box" v-if="!loading && !rebateList.length">
        <Empty />
      </div>
      <!-- 列表 -->
      <div v-for="(item, i) in rebateList" :key="item.platformId">
        <ion-item class="list-item" lines="none">
          <ion-row>
            <p class="game-type">{{ $t(`sort.${gameType}`) }}</p>
            <p class="platform">{{ platformName }}</p>
            <p class="amount">{{ convertMoneyToShow(item.conditionAmount) }}</p>
            <p class="rate">{{ convertRatioToShow(item.rewardAmount) }}%</p>
          </ion-row>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonPopover, IonCol, IonRow, IonItem, IonLabel } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import Empty from '@/components/Empty/index.vue'
import { convertMoneyToShow, convertRatioToShow } from '@/utils/custom'
import useRecordLogic from '../recordLogic';

const {
  loading,
  rebateList,
  gameTypes,
  platformList,
  scrollSelectionRef,
  gameVisible,
  gameType,
  platformName,
  platformVisible,
  backRebate,
  dismissHandle,
  gameTypeSelectHandle,
  platformSelectHandle,
  selectedType,
  selectedPlatformType,
} = useRecordLogic();

</script>

<style scoped lang="less">

ion-content {
  --padding-top: 1rem;
  --padding-bottom: 1rem;
  --padding-start: 1rem;
  --padding-end: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.filter {
  margin-block: 0.625rem;
  .warpper {
    .flexBox();
    font-size: 0.75rem;
    line-height: 1rem;
  }
  .platform-selector,
  .game-type-selector {
    .flexBox();
    height: 2rem;
    flex: 1 1 0%;
    padding-inline: 0.625rem;
    margin-right: 0.625rem;
    border-radius: var(--ep-border-radius-s, var(--rounded-small));
    background: var(--ep-color-background-fill-surface-raised-L1, var(--color-agent-select-bg));
    .report-selected {
      margin-right: 0.5rem;
    }
  }
}

ion-popover ion-row {
  padding: 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
  border-radius: var(--ep-border-radius-m, var(--rounded-middle));
  background: var(--ep-color-background-fill-surface-raised-L1, var(--color-agent-board-bg));
  p {
    .flex-center();
    height: 2.5rem;
    padding-inline: 0.25rem;
    border-radius: var(--ep-border-radius-m, var(--rounded-middle));
  }
}

ion-label.report-title {
  flex: 1 1 0%;
  width: 4.5rem;
  text-align: center;
  color: var(--ep-color-text-default, var(--color-text-100));
  font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
}

div.empty-box {
  .flex-center();
}

ion-item::part(native) {
  /* 插槽slot内容样式 */
  padding-inline-start: 0;
  padding-inline-end: 0;
  --ion-safe-area-right: 0;
}

ion-item.list-item {
  margin-top: 0.75rem;
  --background: var(--ep-color-background-fill-surface-raised-L1, var(--color-bg-200));
  font-size: .625rem;
  border-radius: var(--ep-border-radius-m, var(--rounded-small));
  ion-row {
    width: 100%;
    text-align: center;
    color: var(--ep-color-text-default, var(--color-text-80));
    .game-type {
      flex: 1 1 0%;
    }
    .platform {
      flex: 1 1 0%;
      margin-inline: 0.75rem;
    }
    .amount {
      width: 4.5rem;
      color: var(--ep-color-text-warning, var(--color-currency));
    }
    .rate {
      width: 4.5rem;
      margin-left: 0.75rem;
    }
  }
}

ion-popover {
  --backdrop-opacity: 0;
}

ion-popover ion-button {
  margin-top: 0;
  margin-bottom: 0;
}

ion-popover ion-button::part(native) {
  --padding-start: .375rem;
  --padding-end: .375rem;
  --padding-top: 0;
  --padding-bottom: 0;
}

ion-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--ep-color-icon-weaker, var(--color-text-80));
  transition: transform .1s linear;
}

ion-icon.on {
  transform: rotate(180deg);
}

ion-col.select-col {
  line-height: 0.75rem;
  padding: 0 0.3125rem 0.3125rem 0; 
}

ion-col.select-col:nth-child(4),
ion-col.select-col:nth-child(4n) {
  padding: 0 0 0.3125rem 0;
}

ion-col.lang-col {
  font-size: 0.5rem;
}
</style>
