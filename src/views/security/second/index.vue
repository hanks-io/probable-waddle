<!-- 安全中心 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t('label.securityCenter') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="common-ion-content">
      <!-- 基础信息 -->
      <div class="w-full rounded-lg card-bg-gradient mb-[1rem] py-[0.75rem]">
        <ion-item 
          :detail="item.canBind"
          lines="none"
          v-for="item in basicList" 
          :key="item.icon"
          @click="basicNavigate(item)"
        >
          <ion-icon class="w-[1.5rem] mx-2.5" :src="`/svg/security/${item.icon}.svg`" />
          <ion-label class="item-name">{{ $t(item.name) }}</ion-label>
          <ion-label class="text-end item-info max-w-[50%]" slot="end">
            {{ item.info || $t('status.unbound') }}
          </ion-label>
        </ion-item>
      </div>
      <!-- 安全信息 -->
      <div class="w-full rounded-lg card-bg-gradient mb-[1rem] py-[0.75rem]">
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
import BackButton from '@/components/BackButton.vue';

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
ion-item {
  --min-height: 0;
  --padding-end: 0;
  --padding-top: .75rem;
  --padding-bottom: .75rem;
  --padding-start: 0;
  --background: transparent;
}

ion-item::part(detail-icon) {
  font-size: 0.875rem;
  color: var(--my-card-detail-color);
}

ion-item {
  ion-icon {
    color: var(--security-item-icon-color);
  }
  ion-label {
    font-size: var(--font-size-12) !important;
    line-height: 1.125rem;
    margin: 0;
  }
  ion-label.item-name {
    color: #686299;
    font-weight: var(--font-weight-medium) ;
  }
  ion-label.item-info {
    color: #BDB8E1;
  }
}

.card-bg-gradient {
  background: var(--my-card-bg-gradient);
}

.amber-purple body div#app ion-router-outlet > div.ion-page::before {
  z-index: 10;
  pointer-events: none;
}
</style>
