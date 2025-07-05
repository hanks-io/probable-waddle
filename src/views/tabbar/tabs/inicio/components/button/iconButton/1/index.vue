<template>
  <CButton class="icon-btn" :style="btnStyle" @click="handleClick">
    <ion-icon class="icon" :style="iconStyle" slot="icon-only" :src="loadImage.icon1" />
  </CButton>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import CButton from '@/views/tabbar/tabs/inicio/components/button/index.vue'

const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  },
  btnStyle: {
    type: Object,
    default: () => ({})
  },
  iconStyle: {
    type: Object,
    default: () => ({})
  },
  eventKey: {
    type: String,
    required: true
  }
})

const handleClick = inject(props.eventKey)
</script>

<style lang="less" scoped>
@import './index.less';
</style>