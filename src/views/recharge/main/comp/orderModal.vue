<script setup lang="ts">
import { IonModal, IonIcon, IonLabel } from '@ionic/vue';
import { getImageUrl } from '@/utils/url'
import { copy } from '@/hooks/Copy';
import QrCodeComponent from 'qrcode.vue';
import { remToPx } from '@/hooks/RemToPx';
import { formatMoneyToShow, convertMoneyToShow } from '@/utils';
import QRCode from 'qrcode';
import Uploader from '@/components/uploader/index.vue'
import { continuePayHandle, confirmTransferOrder } from '@/views/recharge/main/hooks/usePay'
import PreviewModal from '@/components/previewModal/index.vue'
import { REAL_NAME_LEN } from '@/views/withdraw/constant';
import Input from "@/components/first/Input/index.vue";
const { t } = useI18n();
const rechargeStore = useRechargeStore()
const tenantStore = useTenantStore()
const { orderInfo, transferConfig } = toRefs(rechargeStore)
const ratio = ref(0)
const qrDataUrl = ref('')
const previewImage = ref(null);
const countdown = ref<string[]>([])
const payAgainStatus = ['NOT_ARRIVED', 'BE_PAID'];         // 可继续支付状态
const successStatus = ['SUCCESS', 'PAID', 'HAVE_ARRIVED'];                  // 成功状态
const failStatus = ['MANUALLY-END', 'TIMEOUT', 'CANCEL', 'LIMIT_EXCEEED'];  // 失败状态
const legalTender = computed(() => tenantStore.tenantInfo?.legalTender);
defineProps<{
  isOpen: boolean
  merchantCy?: string
  isVirtualCurrency: boolean
}
>()

const emit = defineEmits<{
  (e: 'paySuccessCb', orderInfo: any): void

}>()
const isPayAgain = computed(() => payAgainStatus.includes(orderInfo.value.status))
const isShowUpload = computed(() => orderInfo.value.isTransfer && isPayAgain.value)
const isShowName = computed(() => orderInfo.value.isTransfer && isPayAgain.value &&  (transferConfig.value.transferNameRequired === "ON" || transferConfig.value.showTransferName === "ON"))
const statusInfo = computed(() => {
  const statusMap = {
    success: {
      status: 'success',
      text: t('depositWithdrawal.000020'),
      iconPath: '/first/svg/assets/success.svg'
    },
    fail: {
      status: 'fail',
      text: t(`status.${orderInfo.value.status}`),
      iconPath: '/first/svg/assets/fail.svg'
    },
    waiting: {
      status: 'waiting',
      text: t('depositWithdrawal.000002'),
      iconPath: `${getImageUrl('svg/waiting.svg')}`
    },
    pending: {
      status: 'waiting',
      text: t(`status.${orderInfo.value.status}`),
      iconPath: `${getImageUrl('svg/waiting.svg')}`
    },
  }

  if (successStatus.includes(orderInfo.value.status)) {
    return statusMap.success
  }

  if (failStatus.includes(orderInfo.value.status)) {
    return statusMap.fail
  }
  if (isPayAgain.value) {
    return statusMap.waiting
  }
  return statusMap.pending
})

const confirmBtnText = computed(() => orderInfo.value.isTransfer ? t('status.CONFIRM-TRANSFER') : t('label.continuePay'))
const didDismiss = () => {
  rechargeStore.isOpenOrderModal = false
}
const generateQrCode = async () => {
  // 1. 生成二维码数据URL
  if (!orderInfo.value.qrCodeUrl) return
  qrDataUrl.value = await QRCode.toDataURL(orderInfo.value.qrCodeUrl, {
    width: 100,                  // 宽度
    margin: 2,                   // 边距
    color: {
      dark: '#000',           // 二维码颜色
      light: '#fff'           // 背景色
    }
  });

}

let timer: any = null // Add timer variable to store timeout reference
let timing = false // 定时器计算状态

const updateCountdown = (val: number) => {
  if (timing) return
  timing = true

  if (val > 0) {

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
    if (isPayAgain.value) {
      rechargeStore.orderInfo.status = 'TIMEOUT'
    }
    clearTimeout(timer)
    timing = true
  }
}

const downloadQRCode = () => {
  const filename = `${orderInfo.value.transferCompany}-qrcode.png`;  // 下载文件名

  const link = document.createElement('a');
  link.href = qrDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}
const onUploadSuccess = (files) => {
  console.log('上传成功:', files[0]?.response?.urls[0]);
  rechargeStore.orderInfo.voucher = files[0]?.response?.urls[0]
};

const onUploadError = (error) => {
  console.error('上传失败:', error);

};
const confirmHandle = async () => {
  const actionMap = {
    'TRANSFER': confirmTransferOrder,
    'continuePay': continuePayHandle
  }
  const key = orderInfo.value.isTransfer ? 'TRANSFER' : 'continuePay'
  const isSuccess = await actionMap[key]()
  if (isSuccess) {
    rechargeStore.isOpenOrderModal = false
    emit('paySuccessCb', orderInfo.value)
  }

}

onMounted(async () => {
  updateCountdown(orderInfo.value.expireTime)
  ratio.value = await useCalcRealCurrencyRatio()
  generateQrCode()
})

onUnmounted(() => {

  timing = true
  if (timer) {
    clearTimeout(timer) // Clear any pending timeout
    timer = null
  }
})
// waiting   'label.continuePay'
</script>
<template>
  <ion-modal id="modal-assets-order" :is-open="isOpen" @didDismiss="didDismiss">
    <div class="transfer-wrap ">
      <div class="title-wrap">
        <ion-label class="title">{{ $t('depositWithdrawal.000001') }}</ion-label>
        <ion-icon slot="icon-only" class="close" src="/first/svg/login/close.svg" @click="didDismiss" />
      </div>

      <div :class="['status', statusInfo.status]">

        <ion-icon :class="['applying', `${statusInfo.status}-icon`]" :src="statusInfo.iconPath" />
      </div>
      <div class="stats-text-area">
        <div :class="[`${statusInfo.status}-text`]">
          {{ statusInfo.text }}
        </div>
        <div class="waiting-text-desc" v-if="isPayAgain">
          <span class="count-down-text"> {{ $t(`rechargeQR.000004`) }}:</span>
          <div class="count-down-time">
            <span class="hour">{{ countdown[0] }}h</span>
            <span class="minute">{{ countdown[1] }}m</span>
            <span class="second">{{ countdown[2] }}s</span>
          </div>


        </div>

      </div>
      <div class="amount-area">
        <img :src="getImageUrl('img/virtualCurrency.png')" v-if="isVirtualCurrency">
        <div class="amount">{{ convertMoneyToShow(orderInfo.amount) }} <span v-if="!isVirtualCurrency">{{ legalTender
        }}</span></div>
      </div>
      <div class="amount-desc" v-if="isVirtualCurrency">
       
        <div class="ratio">  <img :src="getImageUrl('img/virtualCurrency.png')" v-if="isVirtualCurrency"> <span> 1 =</span> <span>{{ formatMoneyToShow(ratio) }}</span> <span>{{ legalTender }}</span></div>
      </div>
      <div class="line"></div>
      <ul class="order-info">
        <li v-if="orderInfo.transferRealName">
          <span class="sub-text">{{ $t("depositWithdrawal.000005") }}</span>
          <div class="right-area">
            <span class="text">{{ orderInfo.transferRealName }}</span>
            <ion-icon class="copy-icon" :src="getImageUrl('img/common/copy.svg')" @click="copy(orderInfo.transferRealName)" />
          </div>

        </li>
        <li v-if="orderInfo.transferAccount">
          <span class="sub-text">{{ $t("depositWithdrawal.000006") }}</span>
          <div class="right-area">
            <span class="text">{{ orderInfo.transferAccount }}</span>
            <ion-icon class="copy-icon" :src="getImageUrl('img/common/copy.svg')" @click="copy(orderInfo.transferAccount)" />
          </div>
        </li>
        <li v-if="orderInfo.transferCompany">
          <span class="sub-text">{{ $t("depositWithdrawal.000007") }}</span>
          <div class="right-area">
            <ion-icon class="bank-icon" :src="getImageUrl('svg/bankCard.svg')" />
            <span class="text">{{ orderInfo.transferCompany }}</span>

            <ion-icon class="copy-icon" :src="getImageUrl('img/common/copy.svg')" @click="copy(orderInfo.transferCompany)" />
          </div>
        </li>
        <li v-if="orderInfo.payTypeName">
          <span class="sub-text">{{ $t("viewsAssets.transactionType") }}</span>
          <span class="text">{{ orderInfo.payTypeName }}</span>
        </li>
        <li v-if="orderInfo.qrCodeUrl">
          <span class="sub-text">{{ $t("depositWithdrawal.000009") }}</span>
          <div class="right-area qr-code-area">
            <div @click="downloadQRCode" class="download-qrcode">{{ $t("viewsSystem.downloads") }}</div>
            <img :src="qrDataUrl" class="qr-code-img" />
            <!-- <QrCodeComponent :value="orderInfo.qrCodeUrl" :size="remToPx(6.25)" :margin="2" :color="`#000000`"
              :bgColor="`#FFFFFF`" /> -->
          </div>


        </li>
        <li>
          <span class="sub-text">{{ $t("depositWithdrawal.000010") }}</span>
          <span class="text">{{ orderInfo.createTime }}</span>
        </li>
        <li v-if="orderInfo.payerRealName">
          <span class="sub-text">{{ $t("depositWithdrawal.000033") }}</span>
          <span class="text">{{ orderInfo.payerRealName }}</span>
        </li>
        <li v-if="orderInfo.transferVoucher">
          <span class="sub-text"></span>
          <div class="voucher-img-wrap" @click="previewImage = orderInfo.transferVoucher">
            <img :src="orderInfo.transferVoucher" class="voucher-img" />
          </div>
        </li>
        <li>
          <span class="sub-text">{{ $t("depositWithdrawal.000011") }}</span>
          <div class="right-area">
            <span class="text">{{ orderInfo.orderNo }}</span>
            <ion-icon class="copy-icon" :src="getImageUrl('img/common/copy.svg')" @click="copy(orderInfo.orderNo)" />
          </div>

        </li>


      </ul>
      <div class="line"></div>
      <div class="real-name-area" v-if="isShowName">
        <div class="desc-text">{{ $t('depositWithdrawal.000031') }}</div>
        <div class="input-area">
          <Input v-model.trim="orderInfo.payerName" type="realName" :noTrim="true" bgColor="--color-bg-400"
            :placeholder="$t('hint.realName')" :error-text="$t('hint.correctInformation')" :maxlength="REAL_NAME_LEN"
            :clear="true" required />
        </div>
      </div>

      <div class="upload-wrap" v-if="isShowUpload">
        <div class="title">{{ $t('depositWithdrawal.000021') }}<span class="asterisk">*</span></div>
        <div class="upload-area">
          <uploader @success="onUploadSuccess" @error="onUploadError" :maxCount="1" />
          <div class="rules">
            <p>{{ $t('depositWithdrawal.000022') }}</p>
            <p>{{ $t('depositWithdrawal.000023') }}</p>
            <p>{{ $t('depositWithdrawal.000024') }}</p>
          </div>
        </div>

      </div>
      <div class="btn-warp" v-if="isPayAgain">
        <div class="cancel-btn btn" @click="didDismiss">{{ $t('label.cancelOrder') }}</div>
        <div class="confirm-btn btn" @click="confirmHandle">{{ confirmBtnText }}</div>
      </div>
    </div>
    <PreviewModal :previewImage="previewImage" @closePreviewModal="previewImage = null" />
  </ion-modal>

</template>

<style scoped lang="less">
#recharge-main-transfer-index {

  .style(@bgColor: --ep-color-background-fill-body-default,
    @titleColor: --ep-color-text-default,
    @closeColor: --ep-color-icon-default,
    @successIconColor: --ep-color-icon-success,
    @successTextColor: --ep-color-text-success,
    @failIconColor: --ep-color-icon-danger,
    @failTextColor: --ep-color-text-danger,
    @waitingIconColor: --ep-color-icon-warning,
    @waitingTextColor: --ep-color-text-danger,
    @countdownColor: --ep-color-text-danger,
    @weakerText: --ep-color-text-weaker,
    @amountColor: --ep-color-text-default,
    @lineColor: --ep-color-border-default,
    @textColor: --ep-color-text-default,
    @copyIconColor: --ep-color-icon-highlight,
    @downloadBorderColor: --ep-color-border-warning,
    @uploadBgColor: --ep-color-background-fill-surface-raised-L2,
    @cancelBtnBg: --ep-color-background-fill-surface-raised-L1,
    @cancelBtnColor: --ep-color-text-default,
    @confirmBtnBg: --ep-color-background-fill-active-primary,
    @confirmBtnColor: --ep-color-text-inverse,

  ) {
    #modal-assets-order {
      --height: auto;
    }

    .transfer-wrap {
      width: 22.875rem;
      background: var(@bgColor);
      box-sizing: border-box;
      margin: auto;
      padding: 1.0625rem .75rem 1.5rem;
      border-radius: var(--ep-border-radius-surface-small, 0.75rem);
      text-align: center;

      .title-wrap {
        display: flex;
        align-items: center;

        .title {
          flex: 1;
          color: var(@titleColor);
          font-size: var(--ep-font-size-xl, 1.125rem);
          font-weight: var(--ep-font-weight-medium, 600);
          line-height: 1.75rem;
        }

        .close {
          color: var(@closeColor);
        }
      }


      .status {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;

        .applying {
          font-size: 1.25rem;
          // margin-left: 1.2rem;
          // margin-top: .625rem;

        }

        .waiting-icon {
          margin-top: -0.5rem;
          margin-left: .75rem;

        }
      }

      .success {
        background: var(@successIconColor);
      }

      .fail {
        background: var(@failIconColor);
      }

      .waiting {
        background: var(@waitingIconColor);
      }

      .stats-text-area {
        font-size: var(--ep-font-size-s, .75rem);
        text-align: center;
        margin: 8px auto;
        line-height: 1.5;

        .waiting-text {
          color: var(@waitingTextColor);
        }

        .success-text {
          color: var(@successTextColor);
        }

        .fail-text {
          color: var(@failTextColor);
        }


        .waiting-text-desc {
          color: var(@weakerText);
          display: flex;
          justify-content: center;
          align-self: center;
          gap: .4375rem;

          .count-down-time {
            color: var(@countdownColor);
          }
        }
      }

      .amount-area {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto .75rem;

        img {
          width: 1.25rem;
          height: 1.25rem;
          display: block;
        }

        .amount {
          color: var(@amountColor);
          font-size: var(--ep-font-size-xl, 1.125rem);
          font-weight: var(--ep-font-weight-bold, 600);
          line-height: 1.75rem;
          margin-left: .25rem;
        }
      }

      .amount-desc {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto .75rem;
        width: 7.5rem;

        img {
          width: 1.25rem;
          height: 1.25rem;
          display: block;
        }



        .ratio {
          height: 1.375rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: var(--ep-font-size-s, .75rem);
          text-align: center;
          color: var(@amountColor);
          border: 1px solid var(@lineColor);
          padding: 0 .625rem;
          

          img {
            width: 1rem;
            height: 1rem;
            display: block;
            margin-right: .25rem;
          }
        }
      }

      .line {
        width: 100%;

        border: 1px dashed var(@lineColor);
      }

      .order-info {
        font-size: var(--ep-font-size-s, 0.75rem);
        margin: 4px auto;

        li {
          display: flex;
          justify-content: space-between;
          margin-bottom: .25rem;

          .sub-text {
            color: var(@weakerText);

          }

          .text {
            color: var(@textColor)
          }

          .right-area {
            display: flex;
            align-items: center;
            gap: .4375rem;
          }

          .copy-icon {
            font-size: var(--ep-font-size-l, 1rem);
            color: var(@copyIconColor);
          }

          .download-qrcode {
            height: 1.5rem;
            line-height: 1.5rem;
            padding: 0 .4375rem;
            border: 1px solid var(@downloadBorderColor);
            border-radius: var(--ep-border-radius-m, .375rem);
            color: var(@waitingTextColor);
            cursor: pointer;
          }

          .qr-code-img {
            width: 6.25rem;
            height: 6.25rem;
            display: block;
            border-radius: var(--ep-border-radius-m, .375rem);
          }

          .bank-icon {
            font-size: var(--ep-font-size-l, 1rem);
          }

          .voucher-img-wrap {
            width: 6.25rem;
            height: 6.25rem;
            border-radius: var(--ep-border-radius-m, .375rem);
            overflow: hidden;
            border: 1px solid var(@lineColor);

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }




      }

      .real-name-area {
        margin-top: .75rem;

        .desc-text {
          text-align: left;
          color: var(@textColor);
          font-size: var(--ep-font-size-s, 0.75rem);
        }

        .input-area {
          text-align: left;
          margin-top: .5rem;
          width: 100%;
          height: 2.8125rem;
        }
      }

      .upload-wrap {
        margin-top: 1.125rem;
        text-align: left;

        .title {
          color: var(@titleColor);
          font-size: var(--ep-font-size-s, .75rem);
          font-weight: var(--ep-font-weight-bold, 700);
          line-height: 1.75rem;

          .asterisk {
            color: var(@failIconColor);
            margin-left: .25rem;

          }
        }

        .upload-area {
          display: flex;
          justify-content: start;
          align-items: center;
          margin-top: .625rem;
          gap: .625rem;


          .rules {

            p {
              color: var(@weakerText);
              font-size: var(--ep-font-size-xs, .625rem);
              line-height: 1.125rem;

            }
          }

        }



      }

      .btn-warp {
        display: flex;
        justify-content: space-between;
        align-self: center;
        margin-top: 1.125rem;

        .btn {
          width: 10.375rem;
          height: 3rem;
          line-height: 3rem;
          text-align: center;
          font-size: var(--ep-font-size-m, .875rem);
          font-weight: var(--ep-font-weight-bold, 700);
          cursor: pointer;
          border-radius: var(--ep-border-radius-m, .375rem);
        }

        .cancel-btn {
          color: var(@cancelBtnColor);
          background: var(@cancelBtnBg);
        }

        .confirm-btn {
          color: var(@confirmBtnColor);
          background: var(@confirmBtnBg);
        }
      }


    }
  }
}

.new-skin-symbol {
  #recharge-main-transfer-index.style()
}

.green-dark,
.yellow-dark,
.blue-default {
  #recharge-main-transfer-index.style(@bgColor: --color-bg-200,
    @titleColor: --color-text-100,
    @closeColor: --color-text-100,
    @successIconColor: --color-success,
    @successTextColor: --color-success,
    @failIconColor: --color-danger,
    @failTextColor: --color-danger,
    @waitingIconColor: --color-warning,
    @waitingTextColor: --color-warning,
    @countdownColor: --color-danger,
    @weakerText: --color-text-40,
    @amountColor: --color-text-100,
    @lineColor: --color-line,
    @copyIconColor: --theme-color-800,
    @downloadBorderColor: --color-warning,
    @uploadBgColor: --color-bg-200,
    @cancelBtnBg: --color-bg-100,
    @confirmBtnBg: --theme-color-800,
    @cancelBtnColor: --color-text-100,
    @confirmBtnColor: --text-color-black-100,
    @textColor: --color-text-100,

  )
}

.auroral-yellow {
  #recharge-main-transfer-index.style(@bgColor: --color-bg-200,
    @titleColor: --color-text-100,
    @closeColor: --color-text-100,
    @successIconColor: --color-success,
    @successTextColor: --color-success,
    @failIconColor: --color-danger,
    @failTextColor: --color-danger,
    @waitingIconColor: --color-warning,
    @waitingTextColor: --color-warning,
    @countdownColor: --color-danger,
    @weakerText: --color-text-40,
    @amountColor: --color-text-100,
    @lineColor: --color-line,
    @copyIconColor: --theme-color-800,
    @downloadBorderColor: --color-warning,
    @uploadBgColor: --color-bg-200,
    @cancelBtnBg: --color-bg-100,
    @confirmBtnBg: --theme-color-800,
    @cancelBtnColor: --color-text-100,
    @confirmBtnColor: --color-text-black-100,
    @textColor: --color-text-100,

  )
}

.green-default,
.forest-green {
  #recharge-main-transfer-index.style(@bgColor: --color-bg-200,
    @titleColor: --color-text-100,
    @closeColor: --color-text-40,
    @successIconColor: --color-success,
    @successTextColor: --color-success,
    @failIconColor: --color-danger,
    @failTextColor: --color-danger,
    @waitingIconColor: --accent-color-orange-1,
    @waitingTextColor: --accent-color-orange-1,
    @countdownColor: --color-danger,
    @weakerText: --color-text-40,
    @amountColor: --color-text-100,
    @lineColor: --color-line,
    @copyIconColor: --accent-color-yellow,
    @downloadBorderColor: --accent-color-orange-1,
    @uploadBgColor: --color-bg-200,
    @cancelBtnBg: --color-bg-100,
    @confirmBtnBg: --theme-color-gradient-100,
    @cancelBtnColor: --color-text-100,
    @confirmBtnColor: --text-color-white-100,
    @textColor: --color-text-100,

  )
}

.amber-purple {
  #recharge-main-transfer-index.style(@bgColor: --color-bg-200,
    @titleColor: --color-text-100,
    @closeColor: --color-text-100,
    @successIconColor: --color-success,
    @successTextColor: --color-success,
    @failIconColor: --color-danger,
    @failTextColor: --color-danger,
    @waitingIconColor: --color-warning,
    @waitingTextColor: --color-warning,
    @countdownColor: --color-danger,
    @weakerText: --color-text-40,
    @amountColor: --color-text-100,
    @lineColor: --color-line,
    @copyIconColor: --color-warning,
    @downloadBorderColor: --color-warning,
    @uploadBgColor: --color-bg-200,
    @cancelBtnBg: --color-bg-100,
    @confirmBtnBg: --theme-color-gradient-100,
    @cancelBtnColor: --color-text-100,
    @confirmBtnColor: --text-color-white-100,
    @textColor: --color-text-100,

  )
}

.purple-light {
  #recharge-main-transfer-index.style(@bgColor: --color-bg-200,
    @titleColor: --color-text-100,
    @closeColor: --color-text-100,
    @successIconColor: --color-success,
    @successTextColor: --color-success,
    @failIconColor: --color-danger,
    @failTextColor: --color-danger,
    @waitingIconColor: --color-warning,
    @waitingTextColor: --color-warning,
    @countdownColor: --color-danger,
    @weakerText: --color-text-40,
    @amountColor: --color-text-100,
    @lineColor: --color-line,
    @copyIconColor: --theme-color-800,
    @downloadBorderColor: --color-warning,
    @uploadBgColor: --color-bg-300,
    @cancelBtnBg: --color-bg-400,
    @confirmBtnBg: --theme-color-800,
    @cancelBtnColor: --color-text-100,
    @confirmBtnColor: --text-color-white-100,
    @textColor: --color-text-100,

  )
}
</style>
