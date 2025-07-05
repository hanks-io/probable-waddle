<!-- 在线客服 -->
<template>
  <ion-content>
    <!-- 24小时在线客服 -->
    <div class="board">
      <ion-img src="/icons/customer_service.png" ></ion-img>
      <div class="online-service">
        <p class="online-text">{{ $t('viewsUser.onlineCustService') }}</p>
        <p class="cust-service-tips">{{ $t('viewsUser.custServiceTips') }}</p>
        <ion-button class="cust-btn" v-show="!!onlineService.length" @click="onlineServiceHandle">
          {{ $t('viewsUser.contactCustService') }}
        </ion-button>
      </div>
    </div>
    <!-- IM客服 -->
    <div v-show="showIMServiceList" class="bottom">
      <ion-segment v-if="false" ref="segment" mode="md" :scrollable="true" v-model="segmentValue">
        <ion-segment-button :value="item.id" v-for="item in segmentList" :key="item.id">
          {{item.type}}
        </ion-segment-button>
      </ion-segment>
      <!-- 客服列表 -->
      <div class="list">
        <div class="service-item" v-for="item in imServiceList">
          <img :src="getIcon(item)" />
          <div class="middle">
            <p class="item-nickname">{{ item.nickname }}</p>
            <p class="item-account">{{ item.account }}</p>
          </div>
          <ion-button @click="imServiceHandle(item)" class="cust-btn">
            {{ $t('viewsUser.contactCustService') }}
          </ion-button>
        </div>
      </div>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { useService } from '@/views/user/notification/hooks/serviceLogic'
import { IonContent, IonImg, IonButton, IonSegment, IonSegmentButton } from '@ionic/vue';

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
  @import '@/views/user/notification/default/styles/service/base.less';
  @import '@/views/user/notification/default/styles/service/theme-style.less';

  #user-notification-default-service-index.style();

  .blue-default {
    #user-notification-default-service-index.style(
      --color-bg-200,
      --color-bg-200,
      --theme-color-gradient-100,
      --service-customer-btn-focused-bgc,
      --theme-color-gradient-100,
      --service-customer-btn-focused-bgc,
      --color-text-white-100,
      --color-text-gray-300,
      --color-text-white-100,
      --color-text-gray-200
    );
  }

  .green-default {
    #user-notification-default-service-index.style(
      --color-bg-200,
      --color-bg-200,
      --theme-color-gradient-100,
      --service-customer-btn-focused-bgc,
      --service-customer-btn-hover-bgc,
      --service-customer-btn-focused-bgc,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200
    );
  }

  .amber-purple {
    #user-notification-default-service-index.style(
      --color-bg-200,
      --color-bg-200,
      --theme-color-800,
      --service-customer-btn-focused-bgc,
      --service-customer-btn-hover-bgc,
      --service-customer-btn-focused-bgc,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100
    );
  }

  .forest-green {
    #user-notification-default-service-index.style(
      --color-bg-200,
      --color-bg-200,
      --theme-color-gradient-100,
      --service-customer-btn-focused-bgc,
      --service-customer-btn-hover-bgc,
      --service-customer-btn-focused-bgc,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200
    )
  }

  .auroral-yellow {

    #user-notification-default-service-index.style(
      @notification-default-service-index-03: --theme-color-800;
      @notification-default-service-index-11: --agent-btn-color;
      @notification-default-service-index-08: --color-text-gray-200;
      
    )
  }
</style>
