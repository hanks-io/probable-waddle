<template>
  <div class="service-wrapper" @click="goToCustomer">
    <div class="icon-wrapper">
      <ion-icon class="icon" :src="loadImage.icon1"/>
    </div>
    <ion-label class="label">{{ $t('main.suporte') }}</ion-label>
    <div class="scroll-wrapper" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
      <SocialMedia />
    </div>
    <NumberPoint v-if="unReadCount" class="point" :count="unReadCount"/>
  </div>
</template>


<script setup lang="ts">
import { IonIcon, IonLabel } from '@ionic/vue';
import NumberPoint from '@/components/HotPoint/numberPoint.vue'
import SocialMedia from '@/views/tabbar/tabs/inicio/components/PartView/components/socialMedia/1/index.vue'
import useLogic from '@/views/tabbar/components/DrawerLeft/components/customerService/logic'
import useCustomDraggable from '@/hooks/useCustomDraggable';


const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({}),
  },
})
const { unReadCount, goToCustomer } = useLogic();

const {
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove
} = useCustomDraggable();

</script>

<style scoped lang="less">
@import './index.less';
</style>
