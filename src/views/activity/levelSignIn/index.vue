<!-- 签到奖励 -->
<template>
  <ion-page>
    <ion-content>
      <component :is="template" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { useComponents } from '@/views/activity/levelSignIn/logic';
const template = useComponents();
</script>
