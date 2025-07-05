<template>
  <div class="wrapper">
    <ion-segment mode="ios" scrollable :disabled="disabledClick" @mousedown="mousedownEvent" @mouseup="mouseupEvent" @mouseleave="mouseupEvent" @mousemove="mousemoveEvent">
      <ion-segment-button v-for="(item, i) in promotionalList" :class="`item-${i}`" :value="item" :key="item" @click="jumpPage(item, i)">
        <ProgressiveImages
          :src="item.imageUrl"
          :errorImage="loadImage.activity[i]"
        />
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script setup lang="ts">
import { IonSegment, IonSegmentButton } from "@ionic/vue";
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'

import useActivityBarLogic from "@/views/tabbar/tabs/inicio/components/ActivityBar/logic";
import useHorizontalMove from '@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar4/useHorizontalMove';

const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  }
})

const { 
  jumpPage,
  promotionalList,
} = useActivityBarLogic();

const {
  disabledClick,
  mousedownEvent,
  mouseupEvent,
  mousemoveEvent
} = useHorizontalMove();

</script>

<style scoped lang="less">
.wrapper {
  padding-inline: 0.9375rem;
  margin-block-start: 0.625rem;

  ion-segment {
    --background: transparent;
    height: 3.125rem;
    gap: 0.375rem;
    border-radius: 0;

    &.ios {
      ion-segment-button {
        --border-radius: 1.25rem;
        --indicator-color: transparent;
        --color: transparent;
        --color-checked: transparent;
        --padding-start: 0;
        --padding-end: 0;
        --padding-top: 0;
        --padding-bottom: 0;
        text-transform: capitalize;
        margin-top: 0;
        margin-bottom: 0;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        width: 9.375rem;
        border-radius: 0.625rem;
        overflow: hidden;

        .img {
          width: 100%;
        }
      }
    }
  }
}
</style>
