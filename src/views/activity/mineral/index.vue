<!-- 红包雨/神秘矿场活动 -->
<template>
  <ion-page>
    <ion-content>
      <component :is="currentSignVue" />
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts" >
import { IonPage, IonContent } from '@ionic/vue'
import { useComponents } from '@/views/activity/mineral/logic';
const currentSignVue = useComponents();
</script>
