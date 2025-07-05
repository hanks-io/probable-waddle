<!-- 安全中心 -->
<template>
  <ion-page>
    <ion-header>
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-title>{{ $t('label.securityCenter') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- 基础信息 -->
      <div class="security-item">
        <ion-item 
          class="text-xs" 
          :detail="item.canBind"
          :lines="index == basicList.length - 1 ? 'none' : 'inset'" 
          v-for="(item, index) in basicList" 
          :key="item.icon"
          @click="basicNavigate(item)"
        >
          <ion-icon class="security-item-right-color" :src="`/svg/security/${item.icon}.svg`" />
          <ion-label>{{ $t(item.name) }}</ion-label>
          <ion-label class="security-item-right-color" slot="end">
            {{ item.info || $t('status.unbound')}}
          </ion-label>
        </ion-item>
      </div>
      <!-- 安全信息 -->
      <div class="security-item">
        <ion-item 
          :lines="index == safeList.length - 1 ? 'none' : 'inset'"
          v-for="(item, index) in safeList" 
          :key="item.icon" 
          @click="safeNavigate(item)"
          :detail="(item.icon === 'password' && allowChangePw) || (item.icon === 'assetsPassword' && !isAssetPassword)"
        >
          <ion-icon class="security-item-right-color" :src="`/svg/security/${item.icon}.svg`" />
          <ion-label>{{ item.name }}</ion-label>
          <ion-label class="security-item-right-color" slot="end">{{ $t(`status.${item.info}`) }}</ion-label>
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
@import '@/views/security/default/styles/index-base.less' ;
@import '@/views/security/default/styles/theme-style.less' ;
#security-default-index.style();
.blue-default {
  #security-default-index.style();
}
.green-default,
.forest-green {
  #security-default-index.style(
    --color-line,
    --color-text-gray-100,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-100,
    --color-text-gray-200
  );
}
.amber-purple {
  #security-default-index.style(
    --color-line,
    --color-text-gray-100,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-100,
    --color-text-gray-200
  );
}
.auroral-yellow {
  #security-default-index.style(
    @Index06:--color-text-gray-200,
  );
}
</style>
