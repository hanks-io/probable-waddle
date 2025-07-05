<script setup lang="ts">

import ContentTop from './ContentTop.vue';
import { IonContent, IonFooter, IonToolbar, IonImg, IonIcon, IonTabButton, IonLabel, IonTabBar, IonHeader } from '@ionic/vue';
import First from './first.vue';

import useTemplateLogic from '@/download/useTemplateLogic';
const {
  template
} = useTemplateLogic();
const emit = defineEmits(["checkHandle"])

const checkHandle = () => {
  emit("checkHandle")
}

</script>


<template>
  <First>
    <template #contentTopFour>
      <ContentTop :template="template" @checkHandle="checkHandle" templateName="four" />
    </template>
  </First>

</template>



<style scoped></style>
