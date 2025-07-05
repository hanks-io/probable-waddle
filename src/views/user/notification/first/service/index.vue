<!-- 在线客服 -->
<template>
  <ion-content>
    <!-- 24小时在线客服 -->
    <div class="w-full flex items-start board">
      <img class="w-[8rem] h-[9.4375rem] pt-[0.40625rem] pl-[1.25rem]" src="/first/user/service-people.png" />
      <div class="online-service flex flex-col w-full">
        <div class="online-info">
          <span>{{ $t('viewsUser.onlineCust') }}</span>
          <span class="online-date">{{ $t('viewsUser.onlineDate') }}</span>
        </div>
        <p class="small-text-white my-1 skin-tips-color">{{ $t('viewsUser.custServiceTips') }}</p>
        <ion-button class="cust-btn" v-show="!!onlineService.length" @click="onlineServiceHandle">
          {{ $t('viewsUser.contactCustService') }}
        </ion-button>
      </div>
    </div>
    <!-- IM客服 -->
    <div v-show="showIMServiceList" class="w-full">
      <ion-segment v-if="false" ref="segment" mode="md" :scrollable="true" v-model="segmentValue">
        <ion-segment-button :value="item.id" v-for="item in segmentList" :key="item.id">
          {{item.type}}
        </ion-segment-button>
      </ion-segment>
      <!-- 客服列表 -->
      <div class="m-[0.75rem]">
        <div class="service-item flex-between" v-for="(item,index) in imServiceList" :key="index">
          <img class="w-[2.5rem] h-[2.5rem]" :src="getIcon(item)" />
          <div class="w-full px-3 flex flex-col justify-center">
            <p class="font-weight-medium middle-text-white">{{ item.nickname }}</p>
            <p class="small-text-white break-all">{{ item.account }}</p>
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
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { useService } from '@/views/user/notification/hooks/serviceLogic'
import { IonContent, IonButton, IonSegment, IonSegmentButton } from '@ionic/vue';

// 当前客服右边背景图片
const bgThemeMap: Record<string, string> = {
  'phantom-blue': 'yellow-dark',
  'neo-blue': 'yellow-dark',
  'mystlight-blue': 'yellow-dark',
  'midnight-purple': 'yellow-dark',
  'goldshine-green': 'yellow-dark',
};

const currentCustBg = computed(() => {
  const { skin, theme } = getTheme();
  const bgTheme = bgThemeMap[theme] || theme;
  return `url(/${skin}/user/${bgTheme}-service-bg.png)`;
});

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
  height: 10.25rem;
  background: v-bind(currentCustBg) no-repeat;
  background-size: 100%, auto, contain;
}

.online-service ion-button,
.service-item ion-button {
  min-height: 0;
  --color: var(--service-btn-color);
  --background: var(--service-btn-bg);
  --border-radius: 0.25rem;
  font-weight: 700;
  box-shadow: none;
  --background-focused-opacity: 1;
  --background-hover-opacity: 1;
  --background-activated-opacity: 1;
  --background-focused: var(--message-button-bg-color-shade);
  --background-hover: var(--message-button-bg-color-tint);
  --background-activated: var(--message-button-bg-color-shade);
}

.online-service {
  padding: .875rem 1rem 0;
  .online-info { 
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    color: var(--color-text-100);
    .online-date {
      color: var(--color-warning);
    }
  }
  ion-button {
    width: 14.25rem;
  }
}

.online-service ion-button::part(native) {
  font-size: 0.75rem;
  height: 2rem;
}

.service-item {
  padding: .875rem .75rem;
  background: var(--service-item-bg);
  margin-bottom: .625rem;
  border-radius: 0.375rem;
}

.service-item ion-button::part(native) {
  font-size: 0.75rem;
  height: 1.875rem;
  box-shadow: none;
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

.new-skin-symbol {
  @import '@/views/user/notification/first/styles/service/theme-style.less';
}
</style>
