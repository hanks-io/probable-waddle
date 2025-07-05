<script setup lang="ts">
import Ellipsis from '@/components/Ellipsis.vue'
import { getTheme } from '@/theme/hooks'
import {
  IonIcon,
} from '@ionic/vue'
import { alertCircleOutline } from "ionicons/icons";

const { theme } = getTheme()
defineProps<{
  isParticipate: boolean
  limitPlatformList: string[]
  withdrawFlowStr: string
}
>()
</script>
<template>


  <!-- 提现打码提示 -->


  <div v-if="withdrawFlowStr" class="tips ">
    <ion-icon class="alert" :src="alertCircleOutline" />
    <span class="ml-1">{{ withdrawFlowStr }}</span>
  </div>


  <!-- 游戏平台限制提示 -->
  <div v-if="isParticipate && limitPlatformList?.length" class="label">
    <Ellipsis :textContent="`${$t('viewsTabbar.restrictedPlatform')}:  ${limitPlatformList?.toString()}`" />
  </div>


</template>

<style scoped lang="less">
#recharge-main-default-tabDefault-index {
  .style(@color: --color-text-white-100) {

    .tips {
      line-height: 1.375rem;
      font-size: .75rem;
      margin-top: .5625rem;
      color: var(@color);

      .alert {
        font-size: 1.375rem;
        vertical-align: middle;
      }
    }

    .label {
      margin-top: .5625rem;
      color: var(@color);
    }

  }
}

#recharge-main-default-tabDefault-index.style();



.green-default,
.green-v01, .green-v02, .forest-green {
  #recharge-main-default-tabDefault-index.style(@color: --color-text-gray-100);
}



.amber-purple {
  #recharge-main-default-tabDefault-index.style(@color: --text-color-light-purple-1-100);
}
.auroral-yellow {
  #recharge-main-default-tabDefault-index.style(@color: --color-text-gray-200);
}

</style>
