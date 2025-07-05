<script setup lang="ts">
import { IonModal, IonImg } from '@ionic/vue';
import FacebookTip from './FacebookTip.vue';
const emit = defineEmits(['closeFacebookTipModal'])
let props = withDefaults(defineProps<{
  visible: boolean
}
>(), {

});

const closeFacebookTipModal = () => {
  emit('closeFacebookTipModal')

}



</script>
<template>
  <ion-modal mode="md" :isOpen="visible" id="modal-facebook-tip" @didDidDismiss="closeFacebookTipModal">
    <FacebookTip @closeFacebookTipModal="closeFacebookTipModal" />
  </ion-modal>
</template>

<style scoped lang="less"></style>
