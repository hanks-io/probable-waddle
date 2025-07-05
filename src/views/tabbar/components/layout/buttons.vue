<template>
  <ion-buttons v-bind="$attrs">
    <component v-for="item in componentList" :key="item.key" :is="item.component" v-bind="item.options" />
  </ion-buttons>
</template>

<script setup lang="ts">
import { IonButtons } from '@ionic/vue';

const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  }
})

</script>