<template>
  <ion-icon
    class="icon-age"
    :src="iconUrl"
    @mousedown="startPress"
    @mouseup="endPress"
    @mouseleave="endPress"
    @touchstart.passive="startPress"
    @touchend="endPress"
    @touchcancel="endPress"
    @touchmove.passive="endPress"
  />
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import useAge18Logic from './logic';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  loadImage: {
    type: Object,
    default: () => ({}),
  },
});


const {
  iconUrl,
  endPress,
  startPress,
} = useAge18Logic(props);
</script>

<style scoped lang="less">
@import './index.less';
</style>
