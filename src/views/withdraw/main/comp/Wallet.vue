<script setup lang="ts">

import Input from '@/components/first/Input/index.vue'
const emit = defineEmits<{
  (e: 'enterWallet'): void
}>()

let props = withDefaults(defineProps<{

  paybetAddress: string

}>(), {});
const paybetAddress = ref('')

const stop = watchEffect(() => {
  paybetAddress.value = props.paybetAddress
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="wallet-wrap">
    <div class="wallet-info-wrap">
      <div class="label">
        {{ $t('viewsAssets.000003') }}
      </div>

      <div class="wallet-hall" @click="emit('enterWallet')">
        {{ $t('viewsAssets.000002') }}
      </div>
    </div>

    <div class="input-area">
      <Input v-model="paybetAddress" type='text' mode="ios" :readOnly="true" />
    </div>

  </div>
</template>

<style scoped lang="less">
#withdraw-main-first-wallet--index {

  .style(@labelColor: --color-text-100, @hallColor: #FEB805 ) {
    .wallet-wrap {
      padding: 0 0.75rem;
      margin: 0.6rem 0 0.75rem;
      .wallet-info-wrap {
        width: 22.875rem;
        height: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;

        .label {
          line-height: 1.3125rem;
          font-size: .75rem;
          font-weight: var(--font-weight-bold);
          color: var(@labelColor);
        }
      }
      .wallet-hall {
        height: 1.5rem;
        padding: 0 .625rem;
        font-size: .875rem;
        line-height: 24px;
        text-align: center;
        border: .0625rem solid @hallColor;
        border-radius: var(--rounded-small);
        cursor: pointer;
        color: @hallColor;
      }
    }
    .input-area{
      width: 22.875rem;
      .bg-400();

    }
  }


}


.yellow-dark,
.green-dark,
.amber-purple {
  #withdraw-main-first-wallet--index.style()
}

.purple-light {
  #withdraw-main-first-wallet--index.style(@hallColor: #6526db)
}



</style>
