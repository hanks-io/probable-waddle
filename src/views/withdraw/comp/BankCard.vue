<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { CardInfo } from '@/views/withdraw/type'
import { getImageUrl } from '@/utils/url'
import { maskModelNumber } from '@/utils/custom'
const router = useRouter()
withDefaults(defineProps<{
  cardInfo?: CardInfo
  type?: 'info' | 'action'
  relatedCode?: string
}
>(), {
  type: 'info'
});
const gotoBind = () => {
  router.push("/withdrawalBindAccount")

}
</script>
<template>
  <div :class="['bank-card-wrap', { active: cardInfo?.relatedCode === relatedCode }, {action: type === 'action'}]">
    <template v-if="type === 'info'">
      <div class="card-info">
        <img :src="cardInfo?.icon" alt="bank logo" class="bank-logo">
        <div class="bank-info">
          <p class="bank-name">{{ cardInfo?.name }}</p>
          <p class="bank-account">{{ maskModelNumber(cardInfo?.BANKACCOUNT) }}</p>
        </div>
      </div>

      <slot name="action"></slot>

    </template>
    <template v-else>
      <div class="add" @click="gotoBind">
        <ion-icon slot="icon-only" class="append-icon" :src="getImageUrl('svg/append.svg')" />
        {{ $t('viewsAssets.addAccount') }}
      </div>
    </template>
  </div>

</template>
<style scoped lang="less">
#withdraw-main-BankCard-new-index {

  .style(@cardBg: --ep-color-background-fill-surface-raised-L1,
    @cardBorder: --ep-color-border-default,
    @cardNameColor: --ep-color-text-default,
    @cardAccountColor: --ep-color-text-weaker,
    @appendIconColor: --ep-color-text-info,
    @appendTextColor: --ep-color-text-info,
    @activeBorderColor: --ep-color-border-selected) {
    .bank-card-wrap {
      width: 22.875rem;
      height: 3.75rem;
      margin: 0 auto;
      box-sizing: border-box;
      background: var(@cardBg);
      border-radius: var(--ep-border-radius-m, .375rem);
      border: 1px solid var(@cardBorder);
      display: flex;
      align-items: center;
      justify-content: space-between;
       padding: 0 .625rem;
      margin-bottom: .75rem;
       cursor: pointer;
      .card-info {
        display: flex;
        align-items: center;

        .bank-logo {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: block;
          margin-right: .375rem;
        }

        .bank-info {
          font-size: var(--ep-font-size-m, 0.875rem);
          

          .bank-name {
            color: var(@cardNameColor);
            line-height: 1.25rem;
            font-weight: var(--ep-font-weight-medium, 500);
          }

          .bank-account {
            color: var(@cardAccountColor);
            line-height: 1.125rem;
            font-size: var(--ep-font-size-s, .75rem);
          }

        }
      }

      .add {
        width: 100%;
        color: var(@appendTextColor);
        font-size: var(--ep-font-size-s, 0.75rem);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: .25rem;

        .append-icon {
          color: var(@appendIconColor);
        }
      }





    }
    .active{
      border-color: var( @activeBorderColor);
    }
    .bank-card-wrap.action{
      border-color: var(@cardBorder);
    }

  }



}






.new-skin-symbol {
  #withdraw-main-BankCard-new-index.style();
}

.amber-purple,
.auroral-yellow,

.blue-default,
.purple-light,
.green-dark,
.yellow-dark {
  #withdraw-main-BankCard-new-index.style(@cardBg: --color-bg-200,
    @cardBorder: --color-line,
    @cardNameColor: --color-text-100,
    @cardAccountColor: --color-text-40,
    @appendIconColor: --theme-color-800,
    @appendTextColor: --theme-color-800,
    @activeBorderColor: --theme-color-800);
}
.green-default,
.forest-green{
  #withdraw-main-BankCard-new-index.style(@cardBg: --color-bg-200,
    @cardBorder: --color-line,
    @cardNameColor: --color-text-100,
    @cardAccountColor: --color-text-40,
    @appendIconColor: --color-text-white-100,
    @appendTextColor: --color-text-white-100,
    @activeBorderColor: --color-text-gray-200);
}
</style>
