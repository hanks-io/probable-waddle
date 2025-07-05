<!-- 资金订单弹窗 -->
<template>
  <ion-modal id="modal-assets-order" :class="theme" :is-open="modelValue" @didDismiss="closeHandle">
    <div class="modal-content">
      <div class="text-center">
        <ion-icon class="close absolute text-3xl top-5 right-5" :icon="close" @click="closeHandle" />
        <p class="text-lg mb-5 leading-[1.875rem] title">{{ type === 'recharge' ? $t('viewsAssets.RechargeDetails') :
          $t('viewsAssets.withdrawalDetails') }}</p>
        <!-- 订单状态 -->
        <div class="h-[3.4375rem] w-[3.4375rem] rounded-full mx-auto iconSuccess" :style="{ background: statusColor }"
          v-if="success.includes(`${status}`)">
          <ion-icon class="text-[2rem] mt-3" src="/first/svg/assets/success.svg" />
        </div>
        <div class="h-[3.4375rem] w-[3.4375rem] rounded-full mx-auto iconFail" :style="{ background: statusColor }"
          v-else-if="fail.includes(`${status}`)">
          <ion-icon class="text-[1.4375rem] mt-4" src="/first/svg/assets/fail.svg" />
        </div>
        <div class="h-[3.4375rem] w-[3.4375rem] rounded-full mx-auto iconApplying" :style="{ background: statusColor }"
          v-else>
          <ion-icon class="text-[1.3125rem] mt-2.5 ml-3" src="/first/svg/assets/applying.svg" />
        </div>
        <p class="text-xs mt-2.5 statusBottomText" :style="{ color: statusColor }" :class="statusShow">{{ statusText }}
        </p>
        <!-- 倒计时 -->
        <p class='mt-2 countdown-wrap' v-if="countdown">{{ $t('viewsAssets.pleaseOn') }}<span class="countdown">{{
          countdown }}s</span>{{
              cdText }}</p>
        <p class="text-lg font-bold amount">{{ merchantCy }} {{
          convertMoneyToShow(amount) }}</p>
      </div>
      <!-- 订单详情 -->
      <div class="detail text-xs border-t border-dashed leading-6 pt-2.5">
        <template v-for="item of data" :key="item.name">
          <div class="flex justify-between items-center pb-2.5" v-if="item.value">
            <p class="name flex-1 mr-[2rem]">{{ item.name }}</p>
            <p class="text-right">{{ item.value }}</p>
            <ion-icon class="copy text-sm ml-1" :src="getImageUrl('img/common/copy.svg')" v-if="item.copy" @click="copy(item.value)" />
          </div>
        </template>

      </div>
      <!-- 订单操作 -->
      <div class="flex justify-between" v-if="cancelText && confirmText">
        <Button class="text-sm mr-[.3125rem]" height="3.125rem" background="var(--color-button-bg-gray)"
          :style="btnColor" @click="cancelHandle" classType="raised">{{ cancelText }}</Button>
        <Button class="text-sm ml-[.3125rem]" height="3.125rem" @click="confirmHandle">{{ confirmText }}</Button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { t } from '@/i18n';
import { copy } from '@/hooks/Copy';
import { close } from 'ionicons/icons';
import { IonModal, IonIcon } from '@ionic/vue';
import { success, fail } from '@/common/data';
import { convertMoneyToShow } from '@/utils/custom'
import { useTenantStore } from '@/store/tenant';
import Button from '@/components/first/Button/index.vue';
import useGetDarkBtnTextColor from '@/hooks/useGetDarkBtnTextColor'
import { getTheme } from '@/theme/hooks'
import { getImageUrl } from "@/utils";


const { theme } = getTheme()
const tenantStore = useTenantStore();
const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const btnColor = useGetDarkBtnTextColor()

interface Props {
  modelValue?: boolean
  type?: string
  status?: string
  amount: number
  data: Record<string, any>[]
  cancelText?: string
  confirmText?: string
  countdown?: string
  countdownText?: string
}

const props = defineProps<Props>()
const statusShow = ref('')
const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 商户币种
// 倒计时文本
const cdText = computed(() => props.countdownText ?? `${t('viewsAssets.CompleteRecharge')}`)
const statusText = computed(() => {
  if (props.type === 'recharge') {
    if (success.includes(`${props.status}`)) {
      return t(`status.${props.status}`)
    } else if (fail.includes(`${props.status}`)) {
      return t(`status.${props.status}`)
    } else {
      return t(`status.${props.status}`)
    }
  } else {
    if (success.includes(`${props.status}`)) {
      return t('status.success')
    } else if (fail.includes(`${props.status}`)) {
      return t(`status.${props.status}`)
    } else {
      return t('viewsAssets.inWithdrawal')
    }
  }
})

const statusColor = computed(() => {
  if (success.includes(`${props.status}`)) {
    statusShow.value = 'success'
    return 'var(--color-success)'
  } else if (fail.includes(`${props.status}`)) {
    statusShow.value = 'fail'
    return 'var(--color-danger)'
  } else {
    statusShow.value = 'applying'
    return 'var(--color-warning)'
  }
})

/**
 * @description 关闭弹窗
 */
function closeHandle() {
  emit('update:modelValue', false)
}

/**
 * @description 取消按钮点击事件
 */
function cancelHandle() {
  emit('cancel')
  emit('update:modelValue', false)
}

/**
 * @description 确认按钮点击事件
 */
function confirmHandle() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped lang="less">
ion-modal#modal-assets-order {
  --min-width: 0;
  --width: fit-content;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: none;

}

#comp-assets-order-modal-index {

  .style(@bg: --color-bg-300,
    @copyColor: --color-primary-700,
    @iconCloseColor: --color-text-100,
    @color: --color-text-100,
    @detailColor: --color-text-100,
    @nameColor: --color-text-40,
    @detailBorderColor: --color-line) {


    .modal-content {
      width: 22.5rem;
      padding: 1.25rem .625rem;
      background: var(@bg);
      position: relative;

      .text-center {
        color: var(@color);

        ion-icon.close {
          color: var(@iconCloseColor);
        }

        .amount {
          margin-bottom: .75rem;
        }



      }

      .detail {
        border-color: var(@detailBorderColor);
        color: var(@detailColor);

        .name {
          color: var(@nameColor);
        }

        ion-icon.copy {
          color: var(@copyColor);
        }

      }

      .countdown {
        color: var(--color-danger);
        margin: 0 .1875rem;
      }

      .countdown-wrap {
        font-size: var(--font-size-14);
      }


    }



  }



}




#comp-assets-order-modal-index.style();

.blue-default {
  #comp-assets-order-modal-index.style(@bg: --color-bg-200, @color: --color-text-gray-100, @detailColor: --color-text-gray-300, @nameColor: --color-text-gray-300, @copyColor: --color-text-gray-300);
}

.green-defatult,
.green-v01,
.green-v02 {
  #comp-assets-order-modal-index.style(@bg: --color-bg-400, @color: --color-text-gray-100, @detailColor: --color-text-gray-200, @nameColor: --color-text-gray-200, @copyColor: --color-text-gray-200);
}

.amber-purple {
  #comp-assets-order-modal-index.style(@copyColor: --accent-color-yellow-1, @color: --text-color-light-purple-1-100, @detailColor: --text-color-light-purple-1-100, @nameColor: --text-color-light-purple-2-100);
}

.auroral-yellow {
  #comp-assets-order-modal-index.style(@bg: --color-bg-200, @copyColor: --accent-color-yellow-1, @nameColor: --color-text-gray-200);
}

.new-skin-symbol {
  #comp-assets-order-modal-index.style(@bg: --ep-color-background-fill-body-default,
    @color: --ep-color-text-default,
    @detailColor: --ep-color-text-default,
    @nameColor: --ep-color-text-weaker,
    @copyColor: --ep-color-icon-highlight,
    @detailBorderColor: --ep-color-border-default,
    @iconCloseColor: --ep-color-icon-default
    );

  p.amount {
    color: var(--ep-color-text-default);
    font-weight: var(--ep-font-weight-bold);
    font-size: var(--ep-font-size-xl);
  }

  .iconSuccess {
    background: var(--ep-color-icon-success) !important;
  }

  .iconFail {
    background: var(--ep-color-icon-danger) !important;
  }

  .iconApplying {
    background: var(--ep-color-icon-warning) !important;
  }

  p.success {
    color: var(--ep-color-text-success) !important;
  }

  p.fail {
    color: var(--ep-color-text-danger) !important;
  }

  p.applying {
    color: var(--ep-color-text-warning) !important;
  }

  .modal-content {

    .title,
    .close {
      font-weight: var(--ep-font-weight-medium);
      font-size: var(--ep-font-size-xl);
    }

    .close {
      font-size: var(--ep-font-size-xxl);
    }

    .detail {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-regular);
    }

    .statusBottomText {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-regular);
      color: var(--ep-color-border-danger);
    }

    .countdown-wrap {
      font-size: var(--ep-font-size-m);
    }
  }
}
</style>
