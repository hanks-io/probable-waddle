<script setup lang="ts">
import { copy } from "@/hooks/Copy";
import {
  IonIcon,
} from "@ionic/vue";
import { getImageUrl } from '@/utils/url'
import { convertMoneyToShow } from "@/utils/custom";
import { getLocalTime } from "@/utils/date";

export interface RecordItem {
  name: string,
  time: string,
  orderNo: string,
  amount: string | number
  statusColor: string,
  status: string,
  realCurrency: string | number


}
const tenantStore = useTenantStore();

const emit = defineEmits<{
  (e: 'detailHandle', orderNo: any): void

}>()
withDefaults(defineProps<{
  recordList: any[],
  copyIconPath?: string
}
>(), {
  copyIconPath: '/svg/copy.svg'
})
const detailHandle = (orderNo: number) => {
  emit('detailHandle', orderNo)
}

const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);  // 租户信息
const legalTender = computed(() => tenantStore.tenantInfo?.legalTender);  // 法币符号
const { isVirtualCurrency } = toRefs(tenantStore)
// useGetRealCurrency
</script>
<template>
  <div class="record-wrap" v-for="item in recordList" :key="item.orderNo" @click="detailHandle(item.orderNo)">
    <div class="flex-between top">
      <p>{{ item.name }}</p>
      <div class="amount-wrap"><span v-if="!isVirtualCurrency">{{ merchantCy }}</span>
        <img :src="getImageUrl('img/virtualCurrency.png')" v-else class="virtual-currency-icon">
        <p>{{
          convertMoneyToShow(item.amount) }}</p>
      </div>
    </div>
    <div class="flex-between middle">
      <p>{{ getLocalTime(item.time, 'YYYY-MM-DD HH:mm:ss') }}</p>
      <p v-if="isVirtualCurrency" class="virtual-currency-amount">
        <ion-icon slot="icon-only" :src="getImageUrl('svg/approximatelyEqual.svg')" class="amount-icon" />
        {{ convertMoneyToShow(item.realCurrency) }} {{  legalTender}}
      </p>

    </div>
    <div class="flex-between bottom">
      <p class="flex-between">{{ item.orderNo }}<ion-icon class="copy" :src="copyIconPath"
          @click.stop="copy(item.orderNo)" />
      </p>
      <span :style="{ color: item.statusColor }">{{ item.status }} </span>
    </div>
  </div>

</template>

<style scoped lang="less">
#recharge-record-default-recordList-index {
  .style(@bg: --color-bg-200, @color: --color-text-gray-300, @topColor: --color-text-white-100, @copyIconSize: 1.8rem, @middleMB: 0.375rem, @bottomLH: 1.8125rem) {
    .record-wrap {
      width: 22.875rem;
      background: var(@bg);
      border-radius: var(--rounded-middle);
      margin-bottom: 1rem;
      padding: 0.5625rem 0.625rem 0.5rem 0.625rem;
      box-sizing: border-box;
      cursor: pointer;

      .top {
        color: var(@topColor);
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-14);
        margin: 0;
        line-height: 1.3125rem;
        margin-bottom: 1rem;
        .amount-wrap{
          display: flex;
          align-items: center;
          gap: .125rem;
        }

        .virtual-currency-icon {
          width: 1.25rem;
          height: 1.25rem;
          display: block;

        }
      }


      .middle {
        margin-bottom: @middleMB;
        line-height: 1.125rem;
        color: var(@color);

        .virtual-currency-amount {
          display: flex;
          align-items: center;
          gap: .125rem;
        }
      }

      .bottom {
        line-height: @bottomLH;
        color: var(@color);

        span {
          font-size: var(--font-size-10);
        }
      }

      ion-icon.copy {

        font-size: @copyIconSize;
        vertical-align: middle;
        margin-left: .1875rem;
        cursor: pointer;
      }

    }

  }

}

#recharge-record-default-recordList-index.style();

.green-default,
.green-v01,
.green-v02 {
  #recharge-record-default-recordList-index.style(@bg: --color-bg-400, @color: --color-text-gray-200, @topColor: --color-text-gray-100);
}

.forest-green {
  #recharge-record-default-recordList-index.style(@color: --color-text-gray-200);
}

.auroral-yellow {
  #recharge-record-default-recordList-index.style(@color: --color-text-gray-200);
}

.amber-purple {
  .default {
    #recharge-record-default-recordList-index.style(@color: --text-color-light-purple-2-100, @topColor: --text-color-light-purple-1-100);
  }

  .second {
    #recharge-record-default-recordList-index.style(@color: --color-text-80, @topColor: --color-text-100, @copyIconSize: 1.125rem, @middleMB: 0, @bottomLH: 1.125rem);
  }

}

.green-dark,
.yellow-dark {
  #recharge-record-default-recordList-index.style(@color: --color-text-40, @topColor: --color-text-100, @copyIconSize: 1.125rem, @middleMB: 0, @bottomLH: 1.125rem);
}

.purple-light {
  #recharge-record-default-recordList-index.style(@color: --color-text-80, @topColor: --color-text-100, @copyIconSize: 1.125rem, @middleMB: 0, @bottomLH: 1.125rem);
}



.new-skin-symbol {
  #recharge-record-default-recordList-index.style(
    @bg: --ep-color-background-fill-surface-raised-L1,
    @topColor: --ep-color-text-default,
    @color: --ep-color-text-weaker,
    @copyIconSize: 1.125rem,
    @middleMB: 0.2188rem,
    @bottomLH: 1.125rem,
    );
    .record-wrap {
         border-radius: var(--ep-border-radius-m);
          .top {
            font-weight: var(--ep-font-weight-medium);
            font-size: var(--ep-font-size-s);
            margin-bottom: 0.7813rem;
          }
    
          .bottom {
            font-weight: var(--ep-font-weight-regular);
            font-size: var(--ep-font-size-s);
            span{
              font-size: var(--ep-font-size-s);
            }
          }
        }
  }

</style>
