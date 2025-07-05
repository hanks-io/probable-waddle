<template>
  <div class="content rounded-[.625rem] mx-[.975rem]">
    <ion-row class="h-[3.125rem] mt-1.5">
      <ion-col class="h-full rounded-[.625rem] flex items-center justify-center">
        <div class="flex-1">
          <p class="text-[.625rem] leading-none mb-1.5">{{ $t('viewsTabbar.chatBar1') }}</p>
          <p class="text-[.5rem] leading-none text-[#86888D]">{{ $t('viewsTabbar.chatBar2') }}</p>
        </div>
        <ion-item class="submit text-[16px] drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)]">
          <ion-button class="text-[0.7rem] w-[5rem] text-white capitalize" mode="md" type="submit" fill="clear" @click="onlineServiceHandle">{{ $t('viewsUser.contactCustService') }}</ion-button>
        </ion-item>
        <ion-icon class="bg-[#202940] text-xl p-1 rounded-[.3125rem] ml-2.5"  :icon="showIMService ? chevronUp : chevronDown" @click="showIMService = !showIMService"/>
      </ion-col>
    </ion-row>
    <!-- IM客服列表 -->
    <ion-row v-show="showIMService" class="border-t border-[#303C59]">
      <ion-col>
        <div v-for="item in imServiceList" class="flex items-center justify-between text-[0.6875rem] my-[5px]">
          <span class="text-[#9BA7BE]">{{ item.type }}</span>
          <span class="text-[#1680DC]" @click="imServiceHandle(item)">{{ item.account }}</span>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from 'vue'
import { chevronDown, chevronUp } from 'ionicons/icons';
import { IonRow, IonCol, IonItem, IonButton, IonIcon } from '@ionic/vue'
import type { CustomerServiceModel, CustomerServiceItem } from '@/api/normal/model';
import { useTenantStore } from '@/store/tenant';
import { detectPlatform, getRandomValue } from '@/utils/custom';
import { DeviceType } from '@/enums/common';
import { useRoute } from 'vue-router';
import { openUrl } from '@/utils/app';

const tenantStore = useTenantStore(); // 租户状态管理
const route = useRoute();             // 路由实例

const serviceConfig = ref<CustomerServiceModel | null>(null);     // 客服配置
const onlineService = computed(() => serviceConfig.value?.onlineServices ?? []); // 在线客服
const imServiceList = computed(() => serviceConfig.value?.services?.sort((a, b)=> b.sort - a.sort)); // IM客服
const showIMService = ref(false); // 是否显示IM客服

// 更新页面数据
watch(() => route.fullPath, async () => {
  if (route.path === '/main/inicio') {
    serviceConfig.value = await tenantStore.getCustomerService();
  }
}, { immediate: true })

// 联系在线客服
function onlineServiceHandle() {
  if (onlineService.value.length) {
    const index = getRandomValue(0, onlineService.value.length - 1)
    const link = onlineService.value[index].link;
    openUrl(link)
  }
}

// 联系IM客服
function imServiceHandle(config: CustomerServiceItem) {
  const device = detectPlatform()
  let link = '';
  switch (device) {
    case DeviceType.IOS:
      link = config.iosUrl;
      break;
    case DeviceType.Android:
      link = config.androidUrl;
      break;
    case DeviceType.PC:
      link = config.pcUrl;
      break;
  }
  openUrl(link)
}

</script>

<style scoped>
.content {
  background: linear-gradient(90deg, #202940 0%, #131A2C 100%);
  padding-inline-start: .5rem;
  padding-inline-end: .5rem;
  padding-top: 0;
  padding-bottom: 0;
}

ion-item {
  --inner-min-width: 0px; /* 最小宽度 */
  --min-height: 0;
  --background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --inner-padding-end: 0;
  --inner-border-width: 0;
  --border-radius: .9375rem;
}

ion-item ion-button::part(native) {
  --padding-start: .5rem;
  --padding-end: .5rem;
}
ion-button.capitalize { 
  white-space: normal;
}
</style>
