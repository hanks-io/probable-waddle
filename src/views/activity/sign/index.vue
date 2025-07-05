<!-- 签到活动 -->
<template>
  <ion-page>
    <ion-content>
      <component :is="currentSignVue" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts" >
import { IonPage, IonContent } from '@ionic/vue'
import { useComponents } from '@/views/activity/sign/hooks/signLogic';
const currentSignVue = useComponents();
</script>
