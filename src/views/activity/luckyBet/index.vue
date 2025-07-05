<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { useComponents } from '@/views/activity/luckyBet/logic';

const template = useComponents();
</script>
<template>
  <ion-page>
    <ion-content>
      <component :is="template" />
    </ion-content>
  </ion-page>
</template>
