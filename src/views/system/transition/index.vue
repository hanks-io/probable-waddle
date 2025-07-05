<!-- 过渡页 -->
<template>
  <ion-page>
    <ion-content>
      <div class="h-full flex flex-col items-center justify-center">
        <ion-spinner name="crescent" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { nextTick, watch, computed } from 'vue';
import { useTenantStore } from '@/store/tenant';
import { useStatusStore } from '@/store/status';
import { onBeforeRouteLeave } from 'vue-router';
import { useActivityStore } from '@/store/activity';
import { IonPage, IonContent, IonSpinner, IonImg } from '@ionic/vue';
import router from '@/router';
const tenantStore = useTenantStore();     // 租户信息
const statusStore = useStatusStore();     // 状态store
const activityStore = useActivityStore(); // 活动store

let interval: NodeJS.Timeout;

// 监听路由变化
watch(() => router.currentRoute.value.path, (path: String) => {
  if (path.includes('register')) {
    nextTick(() => {
      statusStore.setRedirectRoute('register')
      statusStore.isRegisterPage = true
      router.replace('/main/inicio');
    });
  }
  else if (path.includes('login')) {
    nextTick(() => {
      statusStore.setRedirectRoute('login')
      router.replace('/main/inicio');
    });
  } else if (path.includes('Redeem')) {
    nextTick(() => {
      activityStore.pageType = 4;
      router.replace(`/main/promo`);
    });
  } else if (path.includes('transition')) {
    nextTick(() => {
      interval = setInterval(() => {   // 返回上一页为空路由则一秒后再次返回上一页
        router.back();
      }, 1000);
    });
  } else {
    clearInterval(interval);
  }
}, { immediate: true });

/*
 * 生命周期: 页面销毁前
*/
onBeforeRouteLeave(() => {
  clearInterval(interval);  // 离开页面清除定时器(返回上一页不是空路由则清除定时器)
});
</script>

<style scoped></style>
