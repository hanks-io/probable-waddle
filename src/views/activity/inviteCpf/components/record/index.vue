<!-- CPF 邀请活动 邀请记录 -->
<template>
  <ion-page>
    <ion-content>
      <component :is="currentCpfRecordVue" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts" >
import { IonPage, IonContent } from '@ionic/vue'
import { useComponents } from '@/views/activity/inviteCpf/hooks/inviteCpfRecord';
const currentCpfRecordVue = useComponents();
</script>
