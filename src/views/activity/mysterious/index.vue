<!-- 神秘彩金 -->
<template>
  <ion-page>
    <ion-content>
      <component :is="template" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue'
import { useComponents } from '@/views/activity/mysterious/logic';
const template = useComponents();
</script>
