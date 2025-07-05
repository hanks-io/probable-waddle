<!-- 幸运转盘 -->
<template>
  <ion-page>
    <ion-content>
      <component :is="template" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useComponents } from '@/views/activity/wheel/logic';
import { IonPage, IonContent } from '@ionic/vue';
const template = useComponents();
</script>
