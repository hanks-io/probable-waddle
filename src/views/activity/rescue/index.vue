<template>
  <ion-page>
    <ion-content>
      <component :is="template" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import useLogic from './logic';
const { useComponents } = useLogic();
const template = useComponents();
</script>
