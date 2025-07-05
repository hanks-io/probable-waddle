<template>
  <ion-page>
    <ion-content>
      <div class="content h-full mt-2.5 text-center px-2.5">
        <ion-img src="/images/restricted.png"/>
        <p class="text-lg font-black mt-10">{{ $t('tip.accessRestricted') }}</p>
        <p class="text-sm mt-5">{{ $t('tip.restrictedTips') }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { nextTick, onMounted } from 'vue';
import { useTenantStore } from '@/store/tenant';
import { IonPage, IonContent, IonImg } from '@ionic/vue';

const router = useRouter();           // 路由实例
const tenantStore = useTenantStore(); // 商户Store

onMounted(() => {
  nextTick(async () => {
    const tenantInfo = await tenantStore.resetTenantInfo();
    if (tenantInfo) {
      router.replace('/launch');
    }
  });
});
</script>

<style scoped>
.content {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>