<template>
  <div class="total" @click="pageJumps">
    <ion-label class="label">{{ $t(`sort.ALL`) }}</ion-label>
    <ion-label class="number">({{ total }})</ion-label>
  </div>
</template>

<script setup lang="ts">
  import { IonLabel } from '@ionic/vue';

  const { total, pageJumps } = inject('headerInject') as any;
</script>

<style lang="less" scoped>
@import './index.less';
</style>