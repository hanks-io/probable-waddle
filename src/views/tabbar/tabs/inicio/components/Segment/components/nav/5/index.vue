<template>
  <div class="btn-wall">
    <div class="btn-bg" />
    <ion-label class="label">{{ tab[labelKey] }}</ion-label>
    <i class="type-img" :style="loadImage.icon1(tab.code)"/>
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';


const props = defineProps({
  tab: {
    type: Object,
    default: () => ({})
  },
  disableTab: {
    type: Boolean,
    default: false
  },
  loadImage: {
    type: Object,
    default: () => ({})
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  componentList: {
    type: Array,
    default: () => []
  },
})

const emits = defineEmits(['handleClick'])

</script>

<style lang="less" scoped>
@import './index.less';
</style>
