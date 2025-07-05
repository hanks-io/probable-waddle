<template>
  <div :class="['logo-container', layoutType]">
    <lazyImages class="logo" :src="appLogo" />
  </div>
</template>

<script setup lang="ts">
import lazyImages from '@/components/GameCard/lazyImages.vue'
import { useTenantStore } from '@/store/tenant';


const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout1',
  },
});


const tenantStore = useTenantStore();	// 租户信息
const appLogo = computed(() => tenantStore.tenantInfo?.logo);
</script>

<style scoped lang="less">
@import './index.less';
</style>