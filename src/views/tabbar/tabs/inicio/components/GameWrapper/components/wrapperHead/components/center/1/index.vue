<template>
  <ion-badge class="total">{{ props.total }}</ion-badge>
</template>

<script setup lang="ts">
  import { IonBadge } from '@ionic/vue';

  
  const props = defineProps({
    total: { type: Number, required: true },
  })
</script>