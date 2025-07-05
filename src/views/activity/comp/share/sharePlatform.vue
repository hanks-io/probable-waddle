<!-- 分享平台列表 -->
<script setup lang="ts" name="sharePlatform">
import { IonIcon, IonSegment, IonSegmentButton } from "@ionic/vue";
import iconShare from "@/assets/img/promotion/icon-share.svg";
import { useSharePlatformLogic } from "@/views/activity/comp/share/useSharePlatformLogic";

const {
  shareValue,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove,
  segmentList,
  disableTab,
  shareHandle,
  shareOtherPlatform
} = useSharePlatformLogic();

</script>

<template>
  <div class="share-platform-list">
    <ion-segment ref="segment" mode="ios" :scrollable="true" v-model="shareValue" @mousedown="handleMouseDown"
                 @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
      <ion-segment-button v-for="item in segmentList" :value="item.type" :key="item.type" :disabled="disableTab"
                          @click="shareHandle(item.type)">
        <ion-icon :src="item.icon" :class="`icon-${item.name}`" />
      </ion-segment-button>
    </ion-segment>
    <div class="divder"></div>
    <ion-icon class="icon-share" :icon="iconShare" @click="shareOtherPlatform"></ion-icon>
  </div>
</template>

<style scoped lang="less">
.share-platform-list {
  width: 100%;
  height: 2.5rem;
  .flex-center();
  flex: 1;

  ion-segment {
    display: flex;
    --background: transparent;
    border-radius: 0;
  }

  ion-segment-button.ios {
    --border-radius: .375rem;
    --background: transparent;
    --indicator-color: transparent;
    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 0;
    --padding-bottom: 0;
    --indicator-box-shadow: none;
    text-transform: capitalize;
    min-width: 2.5rem;
    min-height: 2.5rem;
    max-height: 2.5rem;
    margin: 0 .375rem;

    &:first-child {
      margin-left: 0;
    }

    ion-icon {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  ion-segment-button.segment-button-disabled {
    opacity: 1;
  }

  .divder {
    width: 0.0625rem;
    height: 2.5rem;
    margin-left: 0.3125rem;
    border-right: 1px solid var(--ep-color-border-default, #242B42);
  }

  .icon-share {
    min-width: 2.5rem;
    height: 2.5rem;
    color: var(--ep-color-icon-brand-primary, #0A77DA);
    margin-left: 0.625rem;
  }

}
</style>