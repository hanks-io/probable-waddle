<script setup lang="ts">
import {
  IonIcon,
  IonImg
} from '@ionic/vue'
import { timeOutline } from 'ionicons/icons'
import { formatMoneyToShow } from '@/utils/custom'
import { copy } from '@/hooks/Copy';
import useCalcAssetStatusInfo from '@/hooks/useCalcAssetStatusInfo'
import QrCodeComponent from 'qrcode.vue';
import { remToPx } from '@/hooks/RemToPx';
const { t } = useI18n() // 国际化
const props = defineProps<{
  orderNo: '',
  QRCode: string
  expireTime: number
  createTime: string
  amount: string
  merchantCy: string
}>();
const filterQRCode = computed(() => `QR${props.QRCode.slice(-11)}`)
const payStatus = ref('BE_PAID') // 充值状态
const countdown = ref<string[]>([])
const calcStatus = useCalcAssetStatusInfo([], ['MANUALLY-END', 'TIMEOUT', 'CANCEL', 'LIMIT_EXCEEED'])

const orderList = computed(() => [
  {
    name: `${t(`rechargeQR.000006`)}`,
    value: t(`status.${payStatus.value}`),
    statusColor: calcStatus(payStatus.value)
  },
  {
    name: `${t(`rechargeQR.000007`)}`,
    value: props.createTime,

  },
  {
    name: `${t(`rechargeQR.000008`)}`,
    value: props.orderNo,
    isCopy: true
  }
])

let timer: any = null // Add timer variable to store timeout reference
let timing = false // 定时器计算状态

const updateCountdown = (val: number) => {
  console.log(val, 'expireTime');
  if (timing) return
  timing = true

  if (val > 0) {
    payStatus.value = 'BE_PAID'
    const hours = Math.floor(val / 3600)
    const minutes = Math.floor((val % 3600) / 60)
    const remainingSeconds = val % 60
    countdown.value = [
      ...[hours, minutes, remainingSeconds].map(num => num.toString().padStart(2, '0'))
    ]
    timer = setTimeout(() => {
      timing = false
      updateCountdown(val - 1)
    }, 1000)
  } else {
    countdown.value = []
    payStatus.value = 'TIMEOUT'
    clearTimeout(timer)
    timing = true
  }
}

onMounted(() => {
  updateCountdown(props.expireTime)
})


onUnmounted(() => {
  console.log(timer, 'expireTime');
  timing = true
  if (timer) {
    clearTimeout(timer) // Clear any pending timeout
    timer = null
  }
})

</script>


<template>
  <div class="recharge-qr-code-content">
  
    <ul class="recharge-qr-code-detail">
      <li v-for="i in 3">
        <span class="dotted"></span> {{ $t(`rechargeQR.00000${i}`) }}
      </li>
    </ul>
    <div class="qr-area">
      <div class="amount">
        <span class="symbol">{{ merchantCy }}</span>
        <span class="amount-num">{{ formatMoneyToShow(Number(amount), 2) }}</span>
        <ion-icon class="copy-icon" src="/first/svg/assets/copy.svg" @click="copy(amount)"></ion-icon>

      </div>
      <div class="qr-code">
        <QrCodeComponent :value="QRCode" :size="remToPx(9.375)" :margin="2" :color="`#000000`" :bgColor="`#FFFFFF`" />
      </div>
      <div class="qr-btn" @click="copy(QRCode)">
        {{ $t(`rechargeQR.000009`) }}
      </div>
      <div class="qr-code-info">
        <span> {{ $t(`rechargeQR.000005`) }}</span>
        <span class="code">{{ filterQRCode }}</span>
        <ion-icon class="copy-icon" src="/first/svg/assets/copy.svg" @click="copy(QRCode)"></ion-icon>
      </div>
      <div class="count-down" v-if="countdown.length > 0">
        <ion-icon class="time-icon" :icon="timeOutline"></ion-icon>
        <span class="count-down-text"> {{ $t(`rechargeQR.000004`) }}:</span>
        <div class="count-down-time">
          <span class="hour">{{ countdown[0] }}h</span>
          <span class="minute">{{ countdown[1] }}m</span>
          <span class="second">{{ countdown[2] }}s</span>
        </div>

      </div>

    </div>
    <ul class="recharge-order-detail">
      <li v-for="item in orderList">
        <span class='left'> {{ item.name }}</span>
        <span class="right" :style="{ color: item.statusColor }">{{ item.value }}
          <ion-icon class="copy-icon ml-1" src="/first/svg/assets/copy.svg" v-if="item.isCopy"
            @click="copy(item.value)"></ion-icon>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
#recharge-qr-code-index {

  .style(@btnColor: --text-color-black-100, @descColor: --color-text-40,
    @timeColor: --color-text-80, @timeIconColor: --color-text-40,
    @rightColor: --color-text-80, @copyIconColor: --theme-color-700,
    @amountColor: --accent-color-orange, @tipColor: --accent-color-blue,
    @codeColor: --color-text-80, @btnBg:--theme-color-800, @leftColor: --color-text-40, @countDownColor: --color-text-40) {
    .recharge-qr-code-content {
      width: 21.25rem;
      margin: 0 auto;

      .copy-icon {
        font-size: 1rem;
        color: var(@copyIconColor);
        cursor: pointer;
      }

 

      .recharge-qr-code-detail {
        margin-top: 1.3125rem;

        li {
          color: var(@descColor);
          font-size: var(--ep-font-size-s, 0.75rem);
          line-height: 1.125rem;
          font-weight: var(--ep-font-weight-regular, 400);
          margin-bottom: 1.125rem;

          .dotted {
            width: .375rem;
            height: .375rem;
            border-radius: var(--ep-border-radius-xs, 0.125rem);
            background: var(@descColor);
            margin-right: .1875rem;
            margin-top: .25rem;
            display: inline-block;
          }

          &:last-child {
            color: var(@tipColor);

            .dotted {
              background: var(@tipColor);
            }
          }
        }

      }

      .qr-area {
        width: 13.625rem;
        margin: 1.25rem auto;
        text-align: center;
        font-size: var(--ep-font-size-s, 0.75rem);

        .amount {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--ep-font-weight-bold, 700);
          font-size: var(--ep-font-size-xl, 1.125rem);
          line-height: 1.75rem;
          color: var(@amountColor);

          .amount-num {
            margin: 0 .1875rem;
          }
        }

        .qr-code {
          width: 9.375rem;
          height: 9.375rem;
          margin: .5rem auto;
        }

        .qr-btn {
          width: 166px;
          height: 50px;
          border-radius: var(--ep-border-radius-s, 4px);
          background: var(@btnBg);
          color: var(@btnColor);
          line-height: 50px;
          font-size: var(--ep-font-size-m, 0.875rem);
          font-weight: var(--ep-font-weight-bold, 700);
          margin: 0 auto;
          cursor: pointer;

        }

        .qr-code-info {
          width: 18.75rem;
          display: flex;
          align-items: center;
          margin: 1.25rem 0;
          color: var(@codeColor);

          .code {
            margin: 0 .1875rem;

          }
        }

        .count-down {
          color: var(@countDownColor);
          display: flex;
          align-items: center;
          justify-content: center;

          .time-icon {
            font-size: var(--ep-font-size-l, 1rem);
            color: var(@timeIconColor);
          }

          .count-down-text,
          .minute {
            margin: 0 .1875rem;
          }

          .count-down-time {
            color: var(@timeColor);
          }
        }

      }

      .recharge-order-detail {
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: .625rem;

          font-size: var(--ep-font-size-s, 0.75rem);
          line-height: 1.125rem;
          font-weight: var(--ep-font-weight-regular, 400);

          .left {
            color: var(@leftColor);
          }

          .right {
            color: var(@rightColor);
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }

}

.yellow-dark {
  #recharge-qr-code-index.style()
}

.green-dark {
  #recharge-qr-code-index.style(@btnColor: --text-color-white-100)
}

.purple-light {
  #recharge-qr-code-index.style(@btnColor: --text-color-white-100, @descColor: --color-text-100, @timeColor: --color-text-100, @timeIconColor: --color-text-100)
}

.amber-purple {
  #recharge-qr-code-index.style(@btnColor: --text-color-white-100, @descColor: --text-color-light-purple-2-100, @timeColor: --text-color-light-purple-1-100, @rightColor: --text-color-light-purple-1-100)
}

.green-default {
  #recharge-qr-code-index.style(@btnColor: --text-color-white-100, @copyIconColor: --accent-color-yellow, @amountColor: --accent-color-yellow)
}

.blue-default {
  #recharge-qr-code-index.style(@btnColor: --text-color-white-100, @tipColor: --theme-color-500, @copyIconColor: --accent-color-orange, @amountColor: --accent-color-yellow, @rightColor: --color-text-100, @codeColor:--color-text-40)
}

.forest-green {
  #recharge-qr-code-index.style(@btnColor: --text-color-white-100,  @descColor: --color-text-gray-700, @tipColor:  --accent-color-yellow, @copyIconColor: --accent-color-yellow, @amountColor: --accent-color-yellow, @rightColor: --color-text-100, @codeColor:--color-text-gray-700)
}

.auroral-yellow {
  #recharge-qr-code-index.style(@btnColor: --color-text-black-100, @descColor: --color-text-gray-200, @tipColor:  --accent-color-yellow, @copyIconColor: --accent-color-yellow-1, @amountColor: --accent-color-yellow-1, @rightColor: --color-text-100, @codeColor:--color-text-gray-200)
}

.new-skin-symbol {
  #recharge-qr-code-index.style(
    @descColor: --ep-color-text-default,
    @tipColor: --ep-color-text-info,
    @amountColor: --ep-color-text-warning,
    @copyIconColor:--ep-color-icon-highlight,
    @btnBg:--ep-color-background-fill-active-active,
    @timeColor: --ep-color-text-default, @timeIconColor: --ep-color-icon-weaker,
    @rightColor: --ep-color-text-default,
    @leftColor:--ep-color-text-weaker,
    @codeColor:--ep-color-text-default,
    @countDownColor:--ep-color-text-weaker,
    @btnColor:--ep-color-text-inverse
  );
}

// --color-text-gray-700
</style>

