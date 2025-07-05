<template>
  <ion-badge mode="ios" color="danger" class="number-point">
    {{ `${count > 99 ? `+99` : count  }` }}
  </ion-badge>
</template>
<script setup lang="ts">
import { IonBadge } from '@ionic/vue';

const props = defineProps({
  count: { type: Number, default: 0 },
});
</script>

<style scoped lang="less">
.number-point {
  color: #fff;
  font-size: 0.625rem;
  line-height: 0.625rem;
  --padding-start: 0.3125rem;
  --padding-end: 0.3125rem;
}
</style>
