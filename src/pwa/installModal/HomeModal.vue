<script setup lang="ts">
import InstallModal from '../comp/InstallModal.vue';
import InstallProgress from '../comp/InstallProgress.vue';
import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
import { IonButton } from '@ionic/vue';
const appStore = useAppStore(); // 用户store
const {  isShowGuidePwa} = toRefs(appStore)
defineProps<{
   visible: boolean
}
>()
const {
   pullUpPWA,
  installStatus,

  installProgress,
} = usePwaLogic();

const closeModal = () => {
   appStore.isShowGuidePwa = false;
}

</script>
<template>
   <InstallModal :visible="visible" type="home-pwa" :isShowGuidePwa="isShowGuidePwa" @closeModal='closeModal'
    >
      <template #actionArea>

         <InstallProgress :value="installProgress" v-if="installStatus === 'Installing'" />
         <ion-button mode="md" class="flex-1 text-white w-60" shape="round" @click="pullUpPWA"
            v-if="installStatus === 'Installed'">
            {{ $t('label.launchApp') }}
         </ion-button>
      </template>



   </InstallModal>
</template>

<style scoped lang="less"></style>
