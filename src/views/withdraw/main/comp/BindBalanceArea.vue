<script setup lang="ts">
import { formatMoneyToShow, moneyConvertToClient } from '@/utils/custom'
import { IonIcon } from '@ionic/vue';
import { withdrawGetUserFlowApi } from '@/api/assets/index'
import { delay } from "@/utils/delay";
import { useBetAmount } from '@/views/withdraw/main/hooks/useBetAmount'
const amount = reactive({
  balance: 0,
  betAmount: 0
})
const completed = reactive({
  balance: false,
  betAmount: false
})

/**
 * @description 接口调用-获取用户财务信息
 * @param isEmitter 是否触发事件
 */
const incrementAmount = async (userAmount: number, type: 'balance' | 'betAmount') => {
  amount[type] = 0
  const increment = userAmount / 20000;      // 根据总的增加量动态调整每次增加的数值
  while (amount[type] < userAmount / 100) {
    await delay(1);
    amount[type] += increment;
  }
  amount[type] = userAmount / 100;
  completed[type] = false;

}
const getUserAssets = async () => {
  let userBalance = 0
  completed.balance = true;
  const res = await useUserStore().setAssets();
  userBalance = res?.balance || 0;
  if (!userBalance) return completed.balance = false;;
  incrementAmount(userBalance, 'balance')
}

const getUserFlow = async () => {
  completed.betAmount = true
  const res = await withdrawGetUserFlowApi()
  const unfinished = useBetAmount(res)
  if (!unfinished) return completed.betAmount = false
  incrementAmount(unfinished, 'betAmount')

}
completed.balance = true
completed.betAmount = true

const emit = defineEmits<{
  (e: 'recordHandle'): void
}>()

const props = defineProps<{
  isHideAuditRecords: boolean
  betAmount: number
  balance: number
}
>()
const recordHandle = () => {
  emit('recordHandle')
}
const refreshBalance = async () => {

  console.log(props.balance, 'balance')
  incrementAmount(props.balance * 100, 'balance')
}
const refreshBetAmount = async () => {
  incrementAmount(props.betAmount * 100, 'betAmount')
}
const stopBalance = watchEffect(() => {
  if (!props.balance) {
    setTimeout(() => {
      completed.balance = false
    }, 1000)
    return
  }
  refreshBalance()
  stopBalance()

}, { flush: 'post' })
const stopBetAmount = watchEffect(() => {
  if (!props.betAmount) {
    setTimeout(() => {
      completed.betAmount = false
    }, 1000)
    return

  }
  refreshBetAmount()
  stopBetAmount()
}, { flush: 'post' })






</script>
<template>
  <div class="balance-area">
    <div class="balance-wrap">

      <ion-icon class="icon-color refresh-icon rotate-[30deg]" :class="{ 'animate-refresh': completed.balance }"
        @click="getUserAssets" src="/first/svg/perfil/refresh.svg" />


      <p class="balance-content">
        {{ $t('depositWithdrawal.000035') }}</p>
      <p class="balance-amount"> {{ formatMoneyToShow(amount.balance ?? 0) }}</p>

    </div>
    <!-- 有效投注剩余未调接口 -->
    <div class="balance-wrap">

      <ion-icon class="icon-color refresh-icon rotate-[30deg]" src="/first/svg/perfil/refresh.svg"
        :class="{ 'animate-refresh': completed.betAmount }" @click="getUserFlow" />

      <div>
        <p class="balance-content">{{ $t('depositWithdrawal.000016') }}</p>
        <p class="balance-amount"> {{ formatMoneyToShow(amount.betAmount ?? 0) }}</p>
        <p class="detail" @click="recordHandle()" v-if="!isHideAuditRecords">
          <span>{{ $t('viewsAssets.viewDetail') }}</span>
          <span class="detail-icon"><ion-icon src="/first/svg/agent/agent-detail-icon.svg" /></span>
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
#withdraw-main-balanceArea-new-index {

  .style(@shadowColor: --ep-color-background-fill-glow-primary-opacity-40,
    @bg: --ep-color-background-fill-surface-lowered,
    @iconColor: --ep-color-icon-brand-primary,
    @balanceColor: --ep-color-text-warning,
    @detailIconColor: --ep-color-icon-info,
    @detailColor: --ep-color-text-info,
    @textColor: --ep-color-text-default,
    @useRgba: false) {
    .balance-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 22.875rem;
      gap: .875rem;
      margin: 0 auto;

      .balance-wrap {
        width: 11rem;
        height: 5.5rem;
        text-align: left;
        padding: 1.3125rem 1.125rem;
        box-shadow: inset 0 0 0.625rem 0 if(var(@useRgba), rgba(var(@shadowColor), 0.4), var(@shadowColor));
        border-radius: 0.875rem;

        position: relative;
        background: var(@bg);


        .icon-color {
          position: absolute;
          right: 0.625rem;
          top: 0.625rem;
          color: var(@iconColor);

        }

        .balance-content {
          font-size: var(--ep-font-size-s, 0.75rem);
          color: var(@textColor);
        }

        .balance-amount {
          color: var(@balanceColor);
          font-size: var(--ep-font-size-m, .875rem);
        }

        .detail {
          position: absolute;
          right: 0.43rem;
          color: var(@detailColor);
          font-size: var(--ep-font-size-xs, .625rem);
          cursor: pointer;

          .detail-icon {
            color: var(@detailIconColor);
          }
        }
      }

    }
  }
}

.new-skin-symbol {
  #withdraw-main-balanceArea-new-index.style();
}


.auroral-yellow,
.forest-green,
.green-default,
.purple-light,
.green-dark,
.yellow-dark {
  #withdraw-main-balanceArea-new-index.style(@shadowColor: --theme-color-800,
    @bg: --color-bg-400,
    @iconColor: --theme-color-800,
    @balanceColor: --color-currency,
    @detailIconColor: --accent-color-blue,
    @detailColor: --accent-color-blue,
    @textColor: --color-text-100,
    @useRgba: true);
}

.blue-default {
  #withdraw-main-balanceArea-new-index.style(@shadowColor: --theme-color-800,
    @bg: --color-bg-400,
    @iconColor: --theme-color-500,
    @balanceColor: --color-currency,
    @detailIconColor: --accent-color-blue,
    @detailColor: --accent-color-blue,
    @textColor: --color-text-100,
    @useRgba: true);
}

.amber-purple {
  #withdraw-main-balanceArea-new-index.style(@shadowColor: --theme-color-800,
    @bg: --color-bg-400,
    @iconColor: --theme-color-800,
    @balanceColor: --color-currency,
    @detailIconColor: --theme-color-800,
    @detailColor: --theme-color-800,
    @textColor: --color-text-100,
    @useRgba: true);
}
</style>
