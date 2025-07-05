<script setup lang="ts">
import { IonInput } from '@ionic/vue'

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

    <ion-input type="text" v-model="paybetAddress" mode="md" readonly clear-input />



  </div>
</template>

<style scoped lang="less">
#withdraw-main-first-wallet-default-index {
  .style(@labelColor: --color-text-gray-100,  @inputColor: --color-text-white-100) {
    .wallet-wrap {

      margin: 0.6rem 0 0.75rem;

      .wallet-info-wrap {
        height: 1.625rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .625rem;

        .label {
          line-height: 21px;
          font-size: .75rem;
          font-weight: var(--font-weight-bold);
          color: var(@labelColor);
        }

        .wallet-hall {
          height: 1.625rem;
          padding: 0 .625rem;
          font-size: .875rem;
          line-height: 1.625rem;
          text-align: center;
          border: .0625rem solid var(--theme-color-800);
          border-radius: var(--rounded-small);
          cursor: pointer;
          color: #fff;
        }
      }

      ion-input {
        --color: var(@inputColor);
        --border-color: var(--color-line);
        font-size: var(--font-size-14);
        font-weight: var(--font-weight-bold);
        height: 2.5rem;
        border-bottom-width: 1px;
        border-color: var(--color-line);
      




      }


    }
  }
}


.blue-default, .amber-purple, .forest-green, .green-default {
  #withdraw-main-first-wallet-default-index.style()
}

.auroral-yellow{
  #withdraw-main-first-wallet-default-index.style()
}
</style>
