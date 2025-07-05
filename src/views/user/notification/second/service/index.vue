<!-- 在线客服 -->
<template>
  <ion-content>
    <!-- 24小时在线客服 -->
    <div class="w-full flex-between items-start board">
      <div class="mt-[1.279375rem]">
        <div class="flexBox small-text-white cust-time">
          <ion-icon class="text-[1rem] mr-[0.14125rem]" src="/second/svg/user/cust-time.svg" />
          {{ $t('viewsUser.onlineDate') }}
        </div>
        <div class="cust-tips mb-[1.0875rem]">{{ $t('viewsUser.onlineCust') }}</div>
        <div class="cust-msg small-text-white pl-[0.375rem]">{{ $t('viewsUser.custServiceTips') }}</div>
      </div>
      <div class="h-full m-w-[8.6875rem] flexBox flex-col">
        <img class="w-[6.75rem] h-[9.4375rem] mt-[0.75rem]" src="/second/user/service-people.png" />
        <ion-button class="cust-btn" v-show="!!onlineService.length" @click="onlineServiceHandle">
          {{ $t('viewsUser.contactCustService') }}
        </ion-button>
      </div>
    </div>
    <!-- IM客服 -->
    <div v-show="showIMServiceList" class="w-full my-[1.781875rem] px-[0.75rem]">
      <ion-segment v-if="false" ref="segment" mode="md" :scrollable="true" v-model="segmentValue">
        <ion-segment-button :value="item.id" v-for="item in segmentList" :key="item.id">
          {{item.type}}
        </ion-segment-button>
      </ion-segment>
      <!-- 客服列表 -->
      <div class="service-item flex-between" v-for="(item,index) in imServiceList" :key="index">
        <img class="w-[2.5rem] h-[2.5rem]" :src="getIcon(item)" />
        <div class="w-full px-[0.8125rem] flex flex-col justify-center item-message">
          <p class="font-weight-medium middle-text-white">{{ item.nickname }}</p>
          <p class="small-text-white break-all message-bottom">{{ item.account }}</p>
        </div>
        <ion-button @click="imServiceHandle(item)" class="cust-btn">
          {{ $t('viewsUser.contactCustService') }}
        </ion-button>
      </div>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { useService } from '@/views/user/notification/hooks/serviceLogic'
import { IonContent, IonImg, IonButton, IonSegment, IonSegmentButton, IonIcon } from '@ionic/vue';


const {
  segmentValue,
  serviceConfig,
  segmentList,
  onlineService,
  imServiceList,
  showIMServiceList,
  onlineServiceHandle,
  imServiceHandle,
  getIcon
} = useService();

</script>

<style scoped lang="less">

/* 底板 */
.board {
  // height: 10.2181rem;
  padding: 0 1.75rem 0 .9375rem;
  .cust-time {
    color: var(--accent-color-green);
  }
  .cust-tips {
    font-size: var(--font-size-24);
    font-weight: 600;
    color: #BDB8E1;
    line-height: 2.25rem;
  }
  .cust-msg {
    max-width: 12.125rem;
    color: #686299;
    border-left: .125rem solid var(--theme-color);
  }
  ion-button.cust-btn {
    min-height: 0;
    min-width: 8.6875rem;
    --color: var(--service-btn-color);
    --background: linear-gradient(180deg, #5A25E9 0%, #3f3d42 100%);
    --border-radius: var(--rounded-large);
    margin: -1.625rem 0 0 0;
  }
}

ion-button.cust-btn::part(native) {
  font-size: var(--font-size-14);
  font-weight: 600;
  line-height: 1.3125rem;
  box-shadow: none;
  padding: .4688rem .9375rem;
}

.service-item {
  padding: .875rem .875rem .875rem .8125rem;
  background: var(--service-item-bg);
  margin-bottom: 0.75rem;
  border-radius: var(--rounded-large);
  .item-message {
    color: #BDB8E1;
    .message-bottom {
      color: #686299;
    }
  }
  ion-button.cust-btn {
    margin: 0;
    min-height: 0;
    --color: #BDB8E1;
    --border-radius: var(--rounded-large);
    --background: var(--color-bg-100);
    white-space: nowrap;
    position: relative;
    z-index: 10;
    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: linear-gradient(180deg, #5A25E9 0%, #7E45D2 100%);
      z-index: -1;
      border-radius: var(--rounded-large);
    }
    &::part(native) { 
      padding: .4688rem .9375rem;
      background-clip: padding-box;
      border: 1px solid transparent;
    }
  }
}

ion-button.cust-btn {
  --background-hover: var(--message-button-bg-color-tint);
  --background-activated: var(--message-button-bg-color-shade);
  --background-focused: var(--message-button-bg-color-shade);
}

ion-segment-button {
  --color: #9BA7BE;
  --color-checked: #FFF;
  --indicator-color: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
  text-transform: none;
}

ion-segment {
  border-bottom: 1px solid #1A233E;
}

.skin-tips-color {
  color: var(--my-card-detail-color);
}
</style>
