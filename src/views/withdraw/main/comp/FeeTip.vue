<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { getTheme } from '@/theme/hooks';
import { formatMoneyToShow } from '@/utils/custom'

const { theme } = getTheme();
const emit = defineEmits([])
let props = withDefaults(defineProps<{
  amountInput: string
  merchantCy: string
  rateValue: number
  remind: string
}
>(), {

});
</script>
<template>
  <p :class="['fee-wrap', theme]" v-if="amountInput">
    <ion-icon class="balance-fee" src="/first/svg/assets/warning.svg" />
    <span class="fee">{{ $t('viewsAssets.handlingFee') }}:
      <span class="handling-fee">
        {{ merchantCy }}{{ formatMoneyToShow(rateValue) }}
      </span>
    </span>
  </p>
  <p :class="['remind', { 'null-amount': !amountInput }, theme]" v-html="remind" v-if='remind'> </p>
</template>

<style scoped lang="less">
.fee-wrap {
  padding-bottom: .75rem;
  .dynamic-font(@color: --color-text-40);
  line-height: 18px;

  .fee {
    .dynamic-font(@color: --color-text-40);

  }

  ion-icon.balance-fee {
    .dynamic-font(@color: --color-text-40);
    margin-right: .1875rem;

  }


  .handling-fee {
    .dynamic-font(@color: --color-text-100);
    margin-right: .1875rem;

  }

}

.remind {
  .dynamic-font(@color: --color-text-40);
  line-height: 18px;
  margin-left: .75rem;
  padding-bottom: .75rem;
}

.null-amount {
  margin-top: .5625rem;
}



.fee-wrap.purple-light {
  .fee {
    .dynamic-font(@color: --color-text-80);
  }

  ion-icon.balance-fee {
    .dynamic-font(@color: --color-text-80);
    margin-right: .1875rem;
  }
}

.remind.purple-light {
  .dynamic-font(@color: --color-text-80);
}

#withdraw-main-feeTip-new-index {
  .style() {
    .fee-wrap {
      padding-bottom: .75rem;
      line-height: 18px;
      font-size: var(--ep-font-size-s, .75rem);
      .fee {
        color: var(--ep-color-text-weaker);

      }

      ion-icon.balance-fee {
      
        color: var(--ep-color-icon-weaker);
        margin-right: .1875rem;

      }


      .handling-fee {
        color: var(--ep-color-text-default);
        margin-right: .1875rem;

      }

    }

    .remind {
      color: var(--ep-color-text-default);
      line-height: 18px;
      margin-left: .75rem;
      padding-bottom: .75rem;
    }

    .null-amount {
      margin-top: .5625rem;
    }

  }
}
.new-skin-symbol{
  #withdraw-main-feeTip-new-index.style();
}
</style>
