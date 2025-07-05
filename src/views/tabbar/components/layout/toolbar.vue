<template>
  <ion-toolbar class="toolbar" v-bind="$attrs">
    <component v-for="item in componentList" :key="item.key" :is="item.component" v-bind="item.options" />
  </ion-toolbar>
</template>

<script setup lang="ts">
import { IonToolbar } from '@ionic/vue';

const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  }
})

</script>

<style lang="less" scoped>
.toolbar {
  --padding-start: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-end: 0;
  --background: var(--header-dynamic-bg, var(--ep-color-background-fill-top-nav-primary));
}

.border-top {
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.0625rem;
    background: var(--border-color);
  }
}
</style>