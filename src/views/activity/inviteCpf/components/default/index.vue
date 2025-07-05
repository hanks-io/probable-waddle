<!-- CPF 邀请活动 跟随皮肤 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName">
      <template #end>
        <ion-icon @click="router.push(`/activity/${activityType}/record/${id}@${defStyle}`)"
          class="text-[1.875rem] default-invite-cpf-record mr-[1.25rem]"
          src="/svg/inviteCpf/invite-cpf-default-record.svg" />
      </template>
    </NavigationBar>
    <ion-content>
      <div class="w-full h-full relative">
        <!-- 顶部图片 -->
        <div class="default-invite-cpf-top-bg w-full h-[15.1875rem] relative">
          <img class="absolute bottom-0 left-[45%] w-[3.264375rem] z-10 h-[4.033125rem] penguin-img"
            :src="currentTopPng1" />
          <div @click="copyClick" class="share-btn-area">
            <div class="share-btn">
              <ion-icon class="share-icon" :src="getImageUrl('svg/invite-cpf-share.svg')" />
            </div>
          </div>

        </div>
        <!-- 分享内容提示 -->
        <div class="cpf-share-content mt-[1.875rem] text-center">
          {{ $t('activity.cpfShareBtn') }}
        </div>
        <!-- 可领取金额 -->
        <div class="w-full mt-[1rem] px-[0.75rem]">
          <div class="default-invite-cpf-claim relative">
            <div class="top-line absolute top-0 left-0 w-full"></div>
            <div class="bottom-line absolute bottom-0 left-0 w-full"></div>
            <div class="text-center default-invite-cpf-reward-amount-tips">{{ $t('activity.vip37') }}</div>
            <div class="text-center default-invite-cpf-reward-amount">
              {{ merchantCy }} {{ formatMoneyToShow(availableMoney) }}
            </div>
          </div>
        </div>
        <!-- 活动规则 -->
        <div class="default-invite-cpf-rule">
          <div class="keep-space default-invite-cpf-rule-content">
            <div class="mb-3 text-[0.75rem]" v-for="(item, index) in activityRule" :key="index">
              {{ item }}
            </div>
          </div>
        </div>
        <!-- 底部领取按钮 -->
        <div class="default-invite-cpf-footer fixed bottom-0 w-full h-[5rem]">
          <ion-button class="default-available-btn w-full" :class="{ 'default-disabled-btn': !isAvailable }"
            :disabled="!isAvailable" @click="availableClick">
            {{ $t('activity.common001') }} {{ $t('activity.agent11') }}
          </ion-button>
        </div>
      </div>
    </ion-content>
    <!-- 分享弹窗 -->
    <ShareModal v-if="openShareModal" @closeShare="closeShareModalFun" />
  </ion-page>
</template>

<script setup lang="ts">
import router from '@/router'
import { computed } from 'vue';
import { getTheme } from '@/theme/hooks'
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue'
import { formatMoneyToShow } from '@/utils/custom'
import { getCustomerActivityId } from '@/utils/custom'
import { useInviteCpfLogic } from '@/views/activity/inviteCpf/hooks/inviteCpfLogic'
import NavigationBar from '@/components/NavigationBar/index.vue'
import ShareModal from '../modal/shareModal.vue'
import { getImageUrl } from '@/utils'

const { id, defStyle, activityType } = getCustomerActivityId();

const currentTopPng1 = computed(() => {
  return `/images/inviteCpf/yellow-dark-invite-cpf-top1.png`
})



const {
  activityName,
  activityRule,
  merchantCy,
  openShareModal,
  availableMoney,
  isAvailable,
  closeShareModalFun,
  copyClick,
  availableClick
} = useInviteCpfLogic();
</script>

<style scoped lang="less">
@import '@/views/activity/inviteCpf/components/default/styles/base-index.less';
@import '@/views/activity/inviteCpf/components/default/styles/theme-style.less';

#activity-inviteCpf-components-default-index.style();

.share-btn-area {
  position: absolute;
  bottom: 0;
  right: 50%;
  width: 4.75rem;
  height: 3rem;
  border-radius: 999px;
  transform: translate(50%, 50%);
  border: 4px solid #1B1B19;


  z-index: 10;

  .share-btn {
    width: 100%;
    height: 100%;
    background: #77BB1E;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: -3px -4px 7px 0px rgba(255, 255, 255, 0.15) inset;
    .share-icon{
     font-size: 32px;
     
    }
  }
}


.default-invite-cpf-top-bg {
  background: url('/images/inviteCpf/yellow-dark-invite-cpf-top.png') no-repeat;
  background-size: 100% 100%;
}

.yellow-dark {
  #activity-inviteCpf-components-default-index.style(--color-bg-300,
    --text-color-white-100,
    --accent-color-green,
    linear-gradient(90deg, rgba(0, 0, 0, 0.00) 5%, rgba(0, 0, 0, 0.27) 35%, rgba(0, 0, 0, 0.27) 64.95%, rgba(0, 0, 0, 0.00) 95%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.42) 50.5%, rgba(255, 255, 255, 0.00) 100%),
    --invite-cpf-reward-amount-text-color,
    --theme-color-800,
    --text-color-white-40,
    --color-bg-200,
    --invite-cpf-footer-top-line,
    --theme-color-800,
    --color-text-black-100,
    --color-primary-btn-load,
    --color-primary-btn-text-disable);
}

.green-dark {
  #activity-inviteCpf-components-default-index.style(--color-bg-300,
    --text-color-white-100,
    --accent-color-green,
    linear-gradient(90deg, rgba(0, 0, 0, 0.00) 5%, rgba(0, 0, 0, 0.27) 35%, rgba(0, 0, 0, 0.27) 64.95%, rgba(0, 0, 0, 0.00) 95%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.42) 50.5%, rgba(255, 255, 255, 0.00) 100%),
    --invite-cpf-reward-amount-text-color,
    --accent-color-orange,
    --text-color-white-40,
    --color-bg-200,
    --invite-cpf-footer-top-line,
    --theme-color-800,
    --text-color-white-100,
    --color-primary-btn-disable,
    --color-primary-btn-text-disable)
}

.purple-light {
  #activity-inviteCpf-components-default-index.style(--color-bg-300,
    --text-color-white-100,
    --accent-color-green,
    linear-gradient(90deg, rgba(0, 0, 0, 0.00) 5%, rgba(204, 178, 255, 0.27) 35%, rgba(204, 178, 255, 0.27) 64.95%, rgba(0, 0, 0, 0.00) 95%),
    linear-gradient(90deg, rgba(204, 178, 255, 0) 0%, rgba(204, 178, 255, 0.42) 50.5%, rgba(204, 178, 255, 0) 100%),
    --invite-cpf-reward-amount-text-color,
    --accent-color-orange,
    --text-color-black-80,
    --color-bg-200,
    --invite-cpf-footer-top-line,
    --theme-color-800,
    --text-color-white-100,
    --color-primary-btn-disable,
    --color-primary-btn-text-disable)
}

.amber-purple {
  #activity-inviteCpf-components-default-index.style(--color-bg-300,
    --color-text-gray-100,
    --default-invite-share-text,
    linear-gradient(90deg, rgba(0, 0, 0, 0.00) 5%, rgba(0, 0, 0, 0.27) 35%, rgba(0, 0, 0, 0.27) 64.95%, rgba(0, 0, 0, 0.00) 95%),
    linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.42) 50.5%, rgba(255, 255, 255, 0) 100%),
    --invite-cpf-reward-amount-text-color,
    --accent-color-yellow,
    --color-text-gray-200,
    --color-bg-200,
    --invite-cpf-footer-top-line,
    --theme-color-gradient-100,
    --text-color-white-100,
    --gradients-disabled-btn-bg,
    --color-text-gray-100)
}

.blue-default {
  #activity-inviteCpf-components-default-index.style(--color-bg-400,
    --color-text-white-100,
    --mlm-agent-team-text-color,
    linear-gradient(90deg, rgba(0, 0, 0, 0.00) 5%, rgba(0, 0, 0, 0.27) 35%, rgba(0, 0, 0, 0.27) 64.95%, rgba(0, 0, 0, 0.00) 95%),
    linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.42) 50.5%, rgba(255, 255, 255, 0) 100%),
    --invite-cpf-reward-amount-text-color,
    --accent-color-orange,
    --text-color-white-40,
    --invite-cpf-footer-bg-color,
    --invite-cpf-footer-top-line,
    --mlm-agent-home-invite-btn-color,
    --color-text-white-100,
    --color-primary-btn-disable,
    --color-primary-btn-text-disable)
}

.auroral-yellow {
  #activity-inviteCpf-components-default-index.style(@activity-inviteCpf-components-default-index-14: --color-text-black-100;
  )
}

.forest-green {
  #activity-inviteCpf-components-default-index.style(--color-bg-300,
    --color-text-white-100,
    --mlm-agent-team-text-color,
    linear-gradient(90deg, rgba(0, 0, 0, 0.00) 5%, rgba(0, 0, 0, 0.27) 35%, rgba(0, 0, 0, 0.27) 64.95%, rgba(0, 0, 0, 0.00) 95%),
    linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.42) 50.5%, rgba(255, 255, 255, 0) 100%),
    --invite-cpf-reward-amount-text-color,
    --color-warning,
    --text-color2,
    --color-bg-200,
    --invite-cpf-footer-top-line,
    --theme-color-gradient-100,
    --color-text-white-100,
    --agent-disabled-btn-bgc,
    --color-text-white-40)
}

.green-default {
  #activity-inviteCpf-components-default-index.style(--color-bg-300,
    --color-text-gray-100,
    --mlm-agent-team-text-color,
    linear-gradient(90deg, rgba(0, 0, 0, 0.00) 5%, rgba(0, 0, 0, 0.27) 35%, rgba(0, 0, 0, 0.27) 64.95%, rgba(0, 0, 0, 0.00) 95%),
    linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.42) 50.5%, rgba(0, 0, 0, 0) 100%),
    --invite-cpf-reward-amount-text-color,
    --color-warning,
    --color-text-gray-200,
    --color-bg-200,
    --invite-cpf-footer-top-line,
    --theme-color-gradient-100,
    --color-text-white-100,
    --theme-color-gradient-500,
    --color-text-gray-100)
}

.new-skin-symbol {
  #activity-inviteCpf-components-default-index.style(@activity-inviteCpf-components-default-index-01: --ep-color-background-fill-body-default;
    @activity-inviteCpf-components-default-index-02: --ep-color-icon-default;
    @activity-inviteCpf-components-default-index-03: --ep-color-text-success;
    @activity-inviteCpf-components-default-index-04: linear-gradient(90deg, rgba(255, 255, 255, 0) 5%, var(--ep-color-background-fill-glow-primary-opacity-100) 40%, rgba(255, 255, 255, 0) 95%);
    @activity-inviteCpf-components-default-index-05: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--ep-color-background-fill-glow-primary-opacity-40) 50.5%, rgba(255, 255, 255, 0) 100%);
    @activity-inviteCpf-components-default-index-06: --ep-color-text-default;
    @activity-inviteCpf-components-default-index-07: --ep-color-text-warning;
    @activity-inviteCpf-components-default-index-08: --ep-color-text-weaker;
    @activity-inviteCpf-components-default-index-09: --ep-color-background-fill-surface-raised-L1;
    @activity-inviteCpf-components-default-index-10: --ep-color-border-default;
    @activity-inviteCpf-components-default-index-11: --ep-dynamic-primary;
    @activity-inviteCpf-components-default-index-12: --ep-color-text-inverse;
    @activity-inviteCpf-components-default-index-13: --ep-color-background-fill-active-disabled;
    @activity-inviteCpf-components-default-index-14: --ep-color-text-inverse-disabled;
  )
}

.new-skin-symbol {
  @import '@/views/activity/inviteCpf/components/default/styles/base-phantom.less';
}
</style>
