<template>
  <div class="wrapper" v-if="showContent">
    <ion-segment mode="ios" scrollable :disabled="disabledClick" @mousedown="mousedownEvent" @mouseup="mouseupEvent" @mouseleave="mouseupEvent" @mousemove="mousemoveEvent">
      <ion-segment-button v-for="(item, i) in promotionalList" :value="item" :key="item" @click="jumpPage(item, i)">
        <ion-img class="img" :src="item.imageUrl" @ionError="(ev) => loadLocalImage(ev, i)" />
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script setup lang="ts">
import { IonSegment, IonSegmentButton, IonImg } from "@ionic/vue";
import useActivityBarLogic from "@/views/tabbar/tabs/inicio/components/ActivityBar/logic";
import useHorizontalMove from '@/views/tabbar/tabs/inicio/components/ActivityBar/default/ActivityBar4/useHorizontalMove';
import { useEventPromotion } from '@/hooks/useLoadComponent';
import router from "@/router";

const { 
  jumpPage,
  showContent,
  promotionalList,
  promotionalClick,
} = useActivityBarLogic();

const {
  disabledClick,
  mousedownEvent,
  mouseupEvent,
  mousemoveEvent
} = useHorizontalMove();

const { loadLocalImage } = useEventPromotion();
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
