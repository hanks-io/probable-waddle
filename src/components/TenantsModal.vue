<template>
  <!-- 选择商户弹窗 -->
  <ion-modal id="modal-tenants" :is-open="visible" :backdrop-dismiss="false">
    <h5 class="text-center">{{ $t('viewsTabbar.selectMerchant') }}</h5>
    <div class="h-full overflow-y-auto">
      <ion-list lines="none">
        <ion-item button mode="md" v-for="item in tenants" :key="item.id" @click="selectTenantHandle(item.id)">
          <ion-label>{{ item.name }}</ion-label>
        </ion-item>
      </ion-list>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonList, IonItem, IonLabel } from '@ionic/vue';

const emit = defineEmits(['tenantChange'])

interface Props {
  visible: boolean;  // 是否显示弹窗
  tenants: any[];    // 商户列表
}

defineProps<Props>()

/**
 * 选择商户
 */
const selectTenantHandle = (tenantId: number) => {
  emit('tenantChange', tenantId.toString())
}

</script>

<style scoped>
ion-modal#modal-tenants {
  --width: fit-content;
  --min-width: 250px;
  --max-height: 60vh;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}
</style>
