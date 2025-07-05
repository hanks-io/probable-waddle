<template>
  <CButton class="search" buttonType="text" @click="navigateToSearch">
    <ion-icon class="search-icon" slot="icon-only" :src="loadImage.search" />
  </CButton>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import CButton from '@/views/tabbar/tabs/inicio/components/button/index.vue';

import useSearchButtonLogic from './logic';


const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({}),
  },
})

const {
  navigateToSearch
} = useSearchButtonLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>