<script setup lang="ts">
import { tenantReportTimeList } from '@/utils/reportTime'
import {
  IonIcon,
  IonRow,
  IonCol,
  IonPopover
} from "@ionic/vue";
import { caretDown } from "ionicons/icons";
import { formatMoneyToShow, } from "@/utils/custom";
import { getTheme } from '@/theme/hooks'
const { skin } = getTheme()
const classNameMap = {
  default: 'flex-end',
}
const emit = defineEmits<{
  (e: 'timeChange', time: string): void
  (e: 'update:changeTime', time: string): void
}>()
const changeTime = defineModel<string>('changeTime', { required: true })
const tenantStore = useTenantStore();
const { t } = useI18n();
// 当前商户报表查询时间列表
const currentTimeList = computed(() => tenantReportTimeList(tenantStore.tenantInfo?.reportTimeRange));
const currentClassName = computed(() => {
  if (currentTimeList.value.length) return 'flex-between'
  if (skin in classNameMap) return classNameMap[skin as keyof typeof classNameMap];
  return 'flex-start'
})

export type TimeItemType = ReturnType<typeof tenantReportTimeList>[0]
const isPopoverVisible = ref(false);                            // 时间选择弹窗是否显示
withDefaults(defineProps<{
  totalAmount: string
  totalText: string
  size?: string,
  iconPath?: string

}
>(), {
  totalAmount: '0',
  size: '3'
});

/**
 * @description 弹出层关闭事件
 */
const dismissHandle = () => {
  isPopoverVisible.value = false;
}
const timeChange = (item: TimeItemType) => {

  isPopoverVisible.value = false;
  emit('update:changeTime', item.name)
  emit('timeChange', item.name)
}
</script>
<template>

  <div :class="['top-area', currentClassName]">
    <template v-if="currentTimeList.length">
      <div class="time-filter-wrap flex-between" :class="{ active: isPopoverVisible }" @click="isPopoverVisible = true"
        id="time-popover-button">
        <div class="time"> {{ $t(`date.${changeTime}`) }}</div>

        <ion-icon :src="iconPath" class="report-select-icon" v-if="iconPath" />
        <ion-icon :icon="caretDown" class="report-select-icon" v-else />
      </div>

      <!-- 时间下拉弹出层 -->
      <ion-popover mode="md" class="time-popover" trigger="time-popover-button" :isOpen="isPopoverVisible"
        @didDismiss="dismissHandle" :showBackdrop="false">
        <ion-row class="report-select-row">
          <ion-col :size="size" class="select-col" v-for="item in currentTimeList" :key="item.value"
            @click="timeChange(item)">
            <div class="item" :class="{ active: changeTime == item.name }">
              {{ $t(`date.${item.name}`) }}
            </div>
          </ion-col>
        </ion-row>
      </ion-popover>



    </template>
    <div class="total-area">
      {{ totalText }}:
      <span class="currency">{{ formatMoneyToShow(totalAmount) }}</span>


    </div>

  </div>


</template>

<style scoped lang="less">
#recharge-record-default-topArea-index {
  .style(@bg: transparent, @itemBg: transparent, @iconColor: var(--color-text-gray-100), @currencyColor: --color-currency, @borederColor: --color-text-gray-200, @activeBorederColor: --color-text-gray-100, @color: --color-text-gray-100, @popoverColor: --color-text-gray-200, @popoverActiveBg: --theme-color-gradient-100, @popoverBg: --color-bg-200, 
  @popoverActiveColor: --color-text-white-100,
  
  ) {
    .top-area {
      margin-bottom: .625rem;

      .time-filter-wrap {
        height: 2rem;
        color: var(@color);
        padding: 0 0.25rem 0 0.5rem;
        border: 1px solid var(@borederColor);
        line-height: 2rem;
        border-radius: var(--rounded-small);
        box-sizing: border-box;
        white-space: nowrap;
        font-size: 1rem;
        cursor: pointer;
        background: @bg;

        .time {
          margin-right: 0.25rem;
          font-size: .75rem;
          font-weight: var(--font-weight-bold);

        }

        .report-select-icon {
          color: @iconColor;
         
        }


      }

      .active {
        border-color: var(@activeBorederColor);

        .report-select-icon {
          transform: rotate(180deg);
        }
      }



      .total-area {
        font-size: .75rem;
        font-weight: var(--font-weight-bold);

        .currency {
          color: var(@currencyColor);
          font-weight: var(--font-weight-bold);
        }

      }


    }

    ion-icon {
      transition: transform 0.1s linear;
    }

    .time-popover {
      --width: 22.875rem;

      --offset-y: 2.5rem;
    }

    .report-select-row {
      text-align: center;
      font-size: .75rem;
      width: 100%;
      padding: 0.375rem 0.625rem;
      background: var(@popoverBg);

      .select-col {
       margin-right: 0.625rem;
      }
      
      .item {
        color: var(@popoverColor);
        border: 1px solid var(--color-line);
        height: 2.5rem;
        border-radius: .375rem;
        line-height: 2.5rem;
        padding: 0 .25rem;
        box-sizing: border-box;
        white-space: nowrap;
        background: @itemBg;
        cursor: pointer;
        width: 5.625rem;

      }

      .active {
        background: var(@popoverActiveBg);
        color: var(@popoverActiveColor);
        font-weight: var(--font-weight-bold);
        border: none;
      }
    }

  }

  .totalColor(@color: --color-text-100) {
    .top-area {
      .total-area {
        color: var(@color);



      }
    }
  }

}

#recharge-record-default-topArea-index.style(@currencyColor: --color-success, @color: --color-text-100);

.green-default,
.green-v01,
.green-v02 {
  #recharge-record-default-topArea-index.style(@currencyColor: --color-success, @borederColor: --color-line);
}
.auroral-yellow {
  #recharge-record-default-topArea-index.style(@popoverActiveBg:--theme-color-800, @popoverActiveColor: --color-text-black-100);
}

.amber-purple {

  #recharge-record-default-topArea-index.style(@borederColor: --text-color-light-purple-2-100, @activeBorederColor: --text-color-light-purple-1-100, @color: --text-color-light-purple-1-100, @popoverColor: --text-color-light-purple-2-100, @popoverActiveBg: --color-bg-100);
  #recharge-record-default-topArea-index.totalColor(@color: --text-color-light-purple-2-100);


}

.green-dark {
  #recharge-record-default-topArea-index.style(@bg: #262624, @iconColor: #fff, @color: --theme-color-800, @popoverColor: --color-text-80, @popoverActiveBg: --color-bg-100, @popoverActiveColor: --theme-color-800, @currencyColor: --theme-color-800);

}

.yellow-dark {
  #recharge-record-default-topArea-index.style(@bg: #262624, @iconColor: #fff, @color: --color-text-100, @popoverColor: --color-text-80, @popoverActiveBg: --color-bg-100, @popoverActiveColor: --theme-color-800, @currencyColor: --theme-color-800)
}

.purple-light {
  #recharge-record-default-topArea-index.style(@bg: #e0d0ff, @iconColor: var(--text-color-black-40), @color: --text-color-black-80, @popoverColor: --text-color-black-80, @popoverBg: --color-bg-500, @popoverActiveBg: --color-bg-100, @itemBg: var(--color-bg-100), @popoverActiveColor: --theme-color-800, @currencyColor: --theme-color-800);
  #recharge-record-default-topArea-index.totalColor();
}

.new-skin-symbol {
  #recharge-record-default-topArea-index.style(@bg: var(--ep-color-background-fill-surface-raised-L1), @iconColor: var(--ep-color-text-default), @color: --ep-color-text-default,
   @popoverColor: --ep-color-text-weaker, @popoverBg: --ep-color-background-fill-surface-raised-L1,@itemBg: var(--ep-color-background-fill-surface-raised-L2),
   @popoverActiveBg: --ep-color-background-fill-surface-raised-L2, @popoverActiveColor: --ep-color-text-selected, @currencyColor: --ep-color-text-warning);
  #recharge-record-default-topArea-index.totalColor(@color: --ep-color-text-default);
  .top-area {
    margin-top: 1.4375rem;
    .time-filter-wrap {
      border-radius: var(--ep-border-radius-s);
      font-size: var(--ep-font-size-l);
      .time {
        font-size: var(--ep-font-size-s);
        font-weight: var(--ep-font-weight-bold);
      }
    }
    .total-area {
         font-size: var(--ep-font-size-s);
         font-weight: var(--ep-font-weight-regular);
         text-align: right;
      .currency {
         font-weight: var(--ep-font-weight-bold);
      }
    }
  }
  .report-select-row {
      font-size: var(--ep-font-size-s);
    .item {
      border-radius: var(--ep-border-radius-m);
      font-weight: var(--ep-font-weight-medium);
    }
    .active {
     font-weight: var(--ep-font-weight-bold);
    }
  }
}

</style>
