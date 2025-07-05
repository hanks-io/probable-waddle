<template>
  <div class="total" @click="headerProps.categoryHandle">
    <ion-label class="label">{{ $t(`sort.ALL`) }}</ion-label>
    <ion-label class="number">{{ props.total }}</ion-label>
  </div>
</template>

<script setup lang="ts">
  import { IonLabel } from '@ionic/vue';

  const props = defineProps({
    total: { type: Number, required: true },
  })

  const headerProps = inject('headerProps');
</script>

<style lang="less" scoped>
@import './index.less';
</style>