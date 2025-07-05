<template>
  <div
    :class="['btn-wall', tab.code === 'ONE_API_HOT' ? 'hot-btn' : '']"
    :style="tab.code === 'ONE_API_HOT' ? `background-image: url(${loadImage.icon3})` : ''"
  >
    <div class="img-box">
      <template v-if="tab.code === 'ONE_API_HOT'">
        <GradientSVG v-for="i in 2" :key="i" :class="['hot-img', `hot-img-${i}`]" :src="loadImage.icon2" :styleId="`hot_gradient_${i}`">
          <template #default>
            <svg class="svg-wall">
              <defs>
                <linearGradient id="hot_gradient_1" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E64021"/>
                  <stop offset="1" stop-color="#E64021"/>
                </linearGradient>
                <linearGradient id="hot_gradient_2" x1="0.200195" y1="10" x2="15.8001" y2="10" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#82EEFE"/>
                  <stop offset="0.25" stop-color="#193555"/>
                  <stop offset="0.524038" stop-color="#82EEFE"/>
                  <stop offset="0.774038" stop-color="#193555"/>
                  <stop offset="1" stop-color="#82EEFE"/>
                </linearGradient>
              </defs>
            </svg>
          </template>
        </GradientSVG>
      </template>
      <i v-else class="type-img" :style="loadImage.icon1(tab.code)"/>
    </div>
    <div class="label-box">
      <ion-label class="label ellipsis">{{ tab[labelKey] }}</ion-label>
      <ion-label class="sub-label">{{ tab.total }} games</ion-label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import GradientSVG from '@/components/GradientSVG/index.vue';


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
