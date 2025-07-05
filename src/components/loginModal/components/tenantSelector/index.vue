<!-- 商户选择器（仅本地开发用, 不需要做逻辑样式分离） -->
<template>
  <div class="h-[4.375rem]" v-if="showTenants">
    <ion-select label-placement="stacked" interface="popover" v-model="tenantId" :placeholder="$t('label.tenantID')"
      @ion-change="tenantChangeHandle">
      <ion-select-option v-for="item in tenants" :key="item.id" :value="item.id">
        {{ item.name }}
      </ion-select-option>
    </ion-select>
  </div>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption } from '@ionic/vue';
import { isProd } from "@/utils/app";

const appStore = useAppStore(); // 全局store
const tenantStore = useTenantStore(); // 商户store

const tenants = ref<any[]>([]); // 商户列表


const tenantId = computed(() => tenantStore.tenantId); // 商户ID
const showTenants = computed(() => !isProd() && !tenantStore.domainInfo && tenantStore.tenants.length);// 是否显示商户选择器

/**
 * @description 商户切换事件
 */
async function tenantChangeHandle(event: any) {
  tenantStore.setTenantId(event.detail.value);
  await tenantStore.resetTenantInfo();
  const tenantInfo = await tenantStore.getTenantInfo();
  if (tenantInfo?.language) appStore.setLocale(tenantInfo.language);
}

onBeforeMount(async () => {
  tenants.value = await tenantStore.getTenants(); // 获取商户列表
})

</script>

<style scoped lang="less">
ion-select {
  --padding-top: 0px;
  --padding-bottom: 0px;
  --padding-start: 10px;
  --padding-end: 10px;
  --placeholder-color: var(--color-text-input-placeholder);
  --placeholder-opacity: 1;
  border: 1px solid var(--line-color);
  border-radius: 10px;
  font-size: 0.75rem;
  min-height: 40px;
}
</style>
