<template>
  <div class="logo-c">
    <ion-icon :src="iconPath" :class="[iconType === 'POPULAR' ? 'hot-logo' : '', 'logo']" />
    <ion-label class="label">{{ title }}</ion-label>
  </div>
</template>

<script setup lang="ts">
  import { IonLabel, IonIcon } from '@ionic/vue';

  const { title, iconPath, iconType  } = inject('headerInject') as any;

</script>

<style lang="less" scoped>
@import './index.less';
</style>