<template>
  <ion-buttons class="menu-btn" slot="start" @click="menuHandle">
    <ion-icon :class="['menu-icon', drawerLeftIsOpen ? '' : 'close']" :src="loadImage.icon1" />
  </ion-buttons>
</template>

<script setup lang="ts">
import { IonButtons, IonIcon } from '@ionic/vue';
import useMenuLogic from './logic';


const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  }
})

const {
  menuHandle,
  drawerLeftIsOpen,
} = useMenuLogic();
</script>

<style lang="less" scoped>
.menu-btn {
  padding:0 1.0625rem;

  .menu-icon {
    font-size: 1rem;
    color: var(--ep-color-icon-default);

    &.close {
      transform: rotate(180deg);
    }
  }
}
</style>