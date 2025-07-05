<template>
  <div :class="['logo-wrap', layoutType]">
    <ProgressiveImages class="logo" :src="appLogo" />
  </div>
</template>

<script setup lang="ts">
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import { useTenantStore } from '@/store/tenant';

const tenantStore = useTenantStore();

const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout2'
  }
})

const appLogo = computed(() => tenantStore.tenantInfo?.logo); 
</script>

<style lang="less" scoped>
@import './index.less';
</style>