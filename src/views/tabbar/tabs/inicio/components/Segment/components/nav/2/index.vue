<template>
  <ion-segment-button
    v-for="item in tabs"
    :key="item.code"
    :class="tabValue == String(item.id) ? 'active' : ''"
    :value="String(item.id)"
    :disabled="disableTab"
    @click="$emit('handleClick', item)"
  >
    <div class="btn-border">
      <div class="btn-wall">
        <GradientSVG v-if="item.code === 'ONE_API_HOT'" class="type-icon" :src="loadImage.image(item.code)" styleId="paint0_linear_679_214">
          <template #default>
            <svg class="svg-wall">
              <defs>
                <linearGradient id="paint0_linear_679_214" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E64021"/>
                  <stop offset="1" stop-color="#E64021"/>
                </linearGradient>
              </defs>
            </svg>
          </template>
          </GradientSVG>
        <i v-else class="type-img" :style="loadImage.icon1(item.code)"/>
        <div class="label-box">
          <ion-label class="sub-label">games</ion-label>
          <div class="label-box-inner">
            <ion-icon class="label-icon" :src="loadImage.icon" />
            <ion-label class="label">{{ item.total }}</ion-label>
          </div>
        </div>
      </div>
    </div>
  </ion-segment-button>
</template>

<script setup lang="ts">
import { IonSegmentButton, IonLabel, IonIcon } from '@ionic/vue';
import GradientSVG from '@/components/GradientSVG/index.vue'


const props = defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  tabValue: {
    type: String,
    default: ''
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
  }
})

const emits = defineEmits(['handleClick'])

</script>

<style lang="less" scoped>
@import './index.less';
</style>
