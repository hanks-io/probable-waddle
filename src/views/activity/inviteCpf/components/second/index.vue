<!-- CPF 邀请活动 皮肤2 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName">
      <template #end>
        <ion-icon @click="router.push(`/activity/${activityType}/record/${id}@${defStyle}`)" class="text-[1.25rem] invite-cpf-record mr-[1.25rem]" src="/svg/inviteCpf/invite-cpf-record.svg" />
      </template>
    </NavigationBar>
    <ion-content>
      <section>
        <div class="w-full h-full pb-[7.5rem] relative">
          <!-- 顶部图片 -->
          <div class="w-full h-[18rem] invite-cpf-top-bg"></div>
          <!-- 可领取金额 -->
          <div class="invite-cpf-available flex-center">
            <div class="available-box flexBox px-[1rem]">
              <img class="w-[2rem] h-[1.39125rem] mr-[0.6875rem]" src="/images/inviteCpf/invite-cpf-style2-money.png" alt="">
              <div class="flex justify-center items-baseline">
                <div class="mr-[0.5rem] available-merchantCy">{{ merchantCy }}</div>
                <div class="available-money">{{ formatMoneyToShow(availableMoney) }}</div>
              </div>
            </div>
          </div>
          <!-- 复制分享按钮 -->
          <div class="w-full px-[1.9375rem] mt-[1.5rem]">
            <ion-button class="cpf-copy-button h-[3rem] font-medium" @click="copyClick">
              <ion-icon class="text-[1.5rem] mr-[0.5rem]" src="/svg/inviteCpf/share-icon.svg" />
              {{ $t('activity.cpfShareBtn') }}
            </ion-button>
          </div>
          <!-- 活动规则 -->
          <div class="mt-[1.5rem]">
            <!-- 规则标题 -->
            <div class="flex-center">
              <img class="w-[3.77875rem] h-[0.75rem]" src="/images/inviteCpf/invite-cpf-explanation-style2.png" alt="" />
              <div class="mx-[0.5rem] invite-cpf-rule-title font-medium">{{ $t('activity.appreciation13') }}</div>
              <img class="w-[3.77875rem] h-[0.75rem] rotate-180" src="/images/inviteCpf/invite-cpf-explanation-style2.png" alt="" />
            </div>
            <!-- 规则内容 -->
            <div class="px-[1.5rem] mt-[0.75rem]">
              <div class="w-full invite-cpf-rule-content keep-space px-[0.9375rem] py-[0.75rem]">
                <div  class="mb-3 text-[0.75rem]" v-for="(item, index) in activityRule"  :key="index">
                   {{ item }}
                </div>
              </div>
            </div>
          </div>
          <!-- 领取按钮 -->
          <div class="invite-cpf-footer fixed w-full h-[5rem]">
            <ion-button class="available-btn w-full h-[3.0625rem] font-bold m-0" :class="{ 'disabled-btn': !isAvailable }" :disabled="!isAvailable" @click="availableClick">
              {{ $t('activity.common001') }}{{ $t('activity.agent11') }}
            </ion-button>
          </div>
        </div>
      </section>
      <!-- 分享弹窗 -->
      <ShareModal v-if="openShareModal" @closeShare="closeShareModalFun"></ShareModal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import router from '@/router'
import { formatMoneyToShow } from '@/utils/custom'
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue'
import { useInviteCpfLogic } from '@/views/activity/inviteCpf/hooks/inviteCpfLogic'
import NavigationBar from '@/components/NavigationBar/index.vue'
import ShareModal from '../modal/shareModal.vue'
import { getCustomerActivityId } from '@/utils/custom'

const { id,defStyle, activityType } = getCustomerActivityId();

const {
  activityName,
  activityRule,
  isToken,
  activityFinished,
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
  .invite-cpf-record {
    color: var(--invite-cpf-record-icon);
  }
  
  @import '@/views/activity/inviteCpf/components/second/styles/base-index.less';
</style>
