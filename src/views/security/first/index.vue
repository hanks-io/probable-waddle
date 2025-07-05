<!-- 安全中心 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('label.securityCenter')" />
    <ion-content class="common-ion-content">
      <!-- 基础信息 -->
      <div class="w-full card-bg-gradient mb-[1rem] py-[0.75rem]">
        <ion-item 
          :detail="item.canBind"
          lines="none"
          v-for="item in basicList" 
          :key="item.icon"
          @click="basicNavigate(item)"
        >
          <ion-icon class="w-[1.5rem] mx-2.5" :src="`/svg/security/${item.icon}.svg`" />
          <ion-label class="item-name">{{ $t(item.name) }}</ion-label>
          <ion-label class="text-end item-info max-w-[60%]" slot="end">
            {{ item.info || $t('status.unbound') }}
          </ion-label>
        </ion-item>
      </div>
      <!-- 安全信息 -->
      <div class="w-full card-bg-gradient mb-[1rem] py-[0.75rem]">
        <ion-item 
          lines="none"
          v-for="item in safeList" 
          :key="item.icon"
          @click="safeNavigate(item)"
          :detail="(item.icon === 'password' && allowChangePw) || (item.icon === 'assetsPassword' && !isAssetPassword)"
        >
          <ion-icon class="w-[1.5rem] mx-2.5" :src="`/svg/security/${item.icon}.svg`" />
          <ion-label class="item-name">{{ item.name }}</ion-label>
          <ion-label class="text-end item-info" slot="end">{{ $t(`status.${item.info}`) }}</ion-label>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useSecurityLogic } from '@/views/security/hooks/securityLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonIcon } from '@ionic/vue';

import NavigationBar from '@/components/NavigationBar/index.vue'
const {
  isAssetPassword,
  allowChangePw,
  basicList,
  safeList,
  basicNavigate,
  safeNavigate,
} = useSecurityLogic();

</script>

<style scoped lang="less">
@import '@/views/security/first/styles/base-index.less';

.new-skin-symbol {
  @import '@/views/security/first/styles/theme-style.less';
}
</style>
