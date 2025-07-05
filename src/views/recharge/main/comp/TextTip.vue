<script setup lang="ts">
import Ellipsis from '@/components/Ellipsis.vue'
import {
  IonIcon,
} from '@ionic/vue'

defineProps<{
  isParticipate: boolean
  description: string
  limitPlatformList: string[]
  withdrawFlowStr: string
}
>()
</script>
<template>
  <div class="flex-start tip-wrap ">
    <ion-icon class="mr-0.5  mt-0.5" src="/first/svg/assets/warning.svg"
      v-if="!isParticipate ? (description || withdrawFlowStr) : (limitPlatformList?.length)" />
    <!-- 提现打码提示 -->

    <div>
      <p v-if="withdrawFlowStr">
        {{ withdrawFlowStr }}
      </p>
      <p v-if="!isParticipate">{{ description }}</p>
      <!-- 游戏平台限制提示 -->
      <div v-if="isParticipate && limitPlatformList?.length" class="platform">

        <Ellipsis :textContent="`${$t('viewsTabbar.restrictedPlatform')}:  ${limitPlatformList?.toString()}`" />
      </div>

    </div>
  </div>


</template>

<style scoped lang="less">
#recharge-main-first-tip--index {
  .style(@fontColor: --color-text-40, ) {
    .tip-wrap {

      .bg-300();

      .dynamic-font(@color: @fontColor, @fontSize: --font-size-12);
      line-height: 1.125rem;
      align-items: flex-start !important;
      overflow: hidden;



      ion-icon {
        .dynamic-font(@color: @fontColor, @fontSize: --font-size-14);

      }

      .platform {
        width: 22.125rem;
      }
    }
  }
}

.green-dark,
.yellow-dark {
  #recharge-main-first-tip--index.style();

  .wallet-wrap {
    #recharge-main-first-tip--index.style(--accent-color-red);
  }
}


.purple-light {
  #recharge-main-first-tip--index.style(--color-text-80);

  .wallet-wrap {
    #recharge-main-first-tip--index.style(--accent-color-red);
  }
}

.amber-purple {
  #recharge-main-first-tip--index.style(--text-color-light-purple-1-100);

  .wallet-wrap {
    #recharge-main-first-tip--index.style(--accent-color-red);
  }
}

#recharge-main-first-tip-new-index {
  .style() {
    .tip-wrap {
       font-size: var(--ep-font-size-s, .75rem);
       color:var(--ep-color-text-info);
      box-sizing: border-box;
      line-height: 1.125rem;
      align-items: flex-start !important;
      overflow: hidden;



      ion-icon {
        font-size: var(--ep-font-size-m, .875rem);
        color:var(--ep-color-icon-info);
        font-weight: var(--ep-font-weight-bold, 700);
      }

      .platform {
        width: 22.125rem;
      }
    }
  }

}
.new-skin-symbol {
  #recharge-main-first-tip-new-index.style();
}
</style>
