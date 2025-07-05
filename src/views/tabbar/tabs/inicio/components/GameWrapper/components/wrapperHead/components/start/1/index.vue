<template>
  <div class="logo-c">
    <GradientSVG :src="sortLogoSrc" class="logo" :styleId="props.type === 'POPULAR' ? 'hot-svg-color1' : styleId">
      <template v-if="props.type === 'POPULAR'" #default>
        <svg class="svg-wall">
          <defs>
            <linearGradient id="hot-svg-color1" x1="9.06836" y1="0" x2="9.06836" y2="18" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E64021"/>
              <stop offset="1" stop-color="#E64021"/>
            </linearGradient>
          </defs>
        </svg>
      </template>
    </GradientSVG>
    <ion-label v-if="titleType === '1'" class="label">{{ $t(`sort.${props.type}`) }}</ion-label>
    <ion-label v-if="titleType === '2'" class="label">{{ props.platformInfo.name + " " + $t(`sort.${props.type}`) }}</ion-label>
  </div>
</template>

<script setup lang="ts">
  import { IonLabel } from '@ionic/vue';
  import GradientSVG from '@/components/GradientSVG/index.vue';

  const props = defineProps({
    titleType: { type: String, default: '1' },
    type: { type: String, required: true },
    platformInfo: { type: Object, required: true },
    sortLogoSrc: { type: String, required: true },
    styleId: { type: String, default: '' },
  })

</script>

<style lang="less" scoped>
@import './index.less';
</style>