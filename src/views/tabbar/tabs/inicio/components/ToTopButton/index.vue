<template>
  <div v-show="showBackToTop" :class="['to-top-box', className]" :style="elStyle" @click="scrollToTop">
    <i v-if="needIconWall" class="icon-wall">
      <ion-icon class="to-top" :src="loadImage.toTop" />
    </i>
    <ion-icon v-else class="to-top" :src="loadImage.toTop" />
    <ion-label v-if="needText" class="to-top-text">TOP</ion-label>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel } from "@ionic/vue";
import useToTopButtonLogic from './logic';
const props = defineProps({
  type: {
    type: Number,
    default: 2,
  },
  loadImage: {
    type: Object,
    default: () => ({}),
  },
  needText: {
    type: Boolean,
    default: true,
  },
})

const { 
  elStyle,
  className,
  scrollToTop,
  needIconWall,
  showBackToTop,
} = useToTopButtonLogic(props);

</script>

<style lang="less" scoped>
  @import './index.less';
</style>