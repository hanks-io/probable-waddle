<template>
  <ion-header class="ion-no-border fixed z-30">
    <ion-toolbar mode="md">
      <BackButton class="ml-2" slot="start" />
      <ion-title class="ps-0">
        <ion-row class="items-center">
          <ion-label class="piece-header-text">{{ headerText }}</ion-label>
        </ion-row>
      </ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">

import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRow,
  IonLabel
} from '@ionic/vue';

import BackButton from '@/components/BackButton.vue';

const { headerText = '' } = defineProps<{ headerText: string }>()

</script>

<style lang="less" scoped>
.piece-header-text {
  font-weight: var(--ep-font-weight-medium);
}

ion-header {
  ion-toolbar {
    --background: var(--ep-neutral-gray-gray-L03);
  }
}
</style>
