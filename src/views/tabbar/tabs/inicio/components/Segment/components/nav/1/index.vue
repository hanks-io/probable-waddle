<template>
  <ion-segment-button
    v-for="item in tabs"
    :class="tabValue == String(item.id) ? 'active' : ''"
    :value="String(item.id)"
    :key="item.code"
    :disabled="disableTab"
    @click="$emit('handleClick', item)"
  >
    <div class="type-box">
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
    </div>
    <div class="label-box">
      <ion-label class="label">{{ item.name }}</ion-label>
      <ion-label class="sub-label">{{ item.total }} games</ion-label>
    </div>
  </ion-segment-button>
</template>

<script setup lang="ts">
import { IonSegmentButton, IonLabel } from '@ionic/vue';
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
