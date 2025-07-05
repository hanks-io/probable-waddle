<template>
  <div class="piece-lucky-draw">
    <div class="piece-lucky-draw--tab">
      <div class="piece-lucky-draw--tab__item" :class="{ 'active': item.value === recordValue }"
        v-for="(item, index) in recordTabs" :key="item.value" @click="switchRecord(item.value, index)">{{
          item.label }}
      </div>
    </div>
    <div class="piece-lucky-draw--content">
      <div class="piece-lucky-draw--record__header">
        <span v-for="item in recordHeader" :key="item" class="piece-lucky-draw--record__header__item">{{ item }}</span>
      </div>
      <div class="piece-lucky-draw--record__content" :class="{ 'scrollbar': recordValue === 'myReference' }">
        <div class="piece-lucky-draw--record__item scroll-box" v-show="recordValue === 'report'"
          :style="{ animationDuration: `${scrollDuration}s` }">
          <div class="piece-lucky-draw--record__value" v-for="item in cashAwards" :key="item.userId">
            <div class="value-item">
              <p class="user-id-item">{{ encryptionText(item.userId) }}</p>
            </div>
            <div class="value-item">{{ $t('activity.justGotIt') }}</div>
            <div class="value-item">
              <p class="amount-item">
                +{{ convertMoneyToShow(item.amount) }}
                <span v-if="tenantInfo?.merchantCy">{{ tenantInfo?.merchantCy }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="piece-lucky-draw--record__item" v-show="recordValue === 'myReference'">
          <div class="piece-lucky-draw--record__value" v-for="item in cashHelps" :key="item.userId">
            <div class="value-item">
              <p class="user-id-item">{{ encryptionText(item.userId) }}</p>
            </div>
            <div class="value-item">
              <p class="amount-item">
                +{{ convertMoneyToShow(item.helpAmount ?? 0) }}
                <span v-if="tenantInfo?.merchantCy">{{ tenantInfo?.merchantCy }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { encryptionText } from '@/utils';
import { useI18n } from "@/hooks/useI18n";
import { convertMoneyToShow } from '@/utils/custom';

const { t } = useI18n()
const props = defineProps<{
  modelValue: number
  cashAwards: any[]
  cashHelps: any[]
  tenantInfo: any
  scrollDuration: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()


const recordValue = shallowRef('report')
const activeIndex = shallowRef(0)

const recordTabs = [{
  label: t('main.report'),
  value: 'report'
}, {
  label: t('main.myReference'),
  value: 'myReference'
}]

const recordHeader = computed(() => recordValue.value === 'report' ? [t('activity.agent31'), t('sort.000003'), t('activity.rewardLabel')] : [t('activity.agent31'), t('activity.rewardLabel')])

const switchRecord = (value: string, index: number) => {
  recordValue.value = value
  activeIndex.value = index
  emit('update:modelValue', index)
}

</script>

<style lang="less" scoped>
.piece-lucky-draw {
  margin: 0 0.75rem;
  padding: 1.25rem 0.75rem 0 0.75rem;
  border-radius: var(--ep-border-radius-m);
  background: var(--ep-color-background-fill-surface-raised-L1);

  .piece-lucky-draw--tab {
    position: relative;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--ep-color-background-fill-body-default);
    border-radius: var(--ep-border-radius-m);
    padding: 0.1875rem;
    cursor: pointer;

    .piece-lucky-draw--tab__item {
      font-size: var(--ep-font-size-m);
      color: var(--ep-color-text-weaker);
      padding: 0.5rem 0;
      flex: 1;
      text-align: center;
      line-height: 1;
      z-index: 2;

      &.active {
        color: var(--ep-color-text-default);
        background-color: var(--ep-color-background-fill-surface-raised-L1);
        border-radius: var(--ep-border-radius-s);
      }
    }
  }

  .piece-lucky-draw--content {
    .piece-lucky-draw--record__header {
      display: flex;
      padding: 0.5rem 0;
      background-color: var(--ep-color-background-fill-surface-raised-L2);
      justify-content: space-between;
      align-items: center;
      border-radius: var(--ep-border-radius-m);
      color: var(--ep-color-text-weaker);
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-regular);

      .piece-lucky-draw--record__header__item {
        flex: 1;
        text-align: center;
      }
    }
  }

  .piece-lucky-draw--record__content {
    height: 10rem;
    overflow: hidden;

    &.scrollbar {
      overflow: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .piece-lucky-draw--record__item {
      font-size: var(--ep-font-size-xs);
      font-weight: var(--ep-font-weight-regular);
      color: var(--ep-color-text-default);


      .piece-lucky-draw--record__value {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;

        .value-item {
          flex: 1;
          text-align: center;

          .amount-item {
            color: var(--ep-color-text-success);
            padding-left: 1rem;
          }
        }
      }
    }
  }
}

.scroll-box {
  animation: scrollAnimation linear infinite;
  animation-fill-mode: both;
}


@keyframes scrollAnimation {

  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  99.99% {
    transform: translate3d(0, -20%, 0);
  }
}
</style>
