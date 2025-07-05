<template>
  <ion-segment-button
    v-for="item in tabs"
    :key="item.code"
    :class="[tabValue == String(item.id) ? 'active' : '', 'init-segment']"
    :value="String(item.id)"
    :disabled="disableTab"
    @click="$emit('handleClick', item)"
  >
    <div class="btn-wall">
      <progressiveImages v-if="item.code === 'ONE_API_HOT'" class="hot-img" :src="loadImage.hot"/>
      <i v-else class="type-img" :style="loadImage.icon1(item.code)"/>
      <ion-label class="label ellipsis">{{ item[labelKey] }}</ion-label>
    </div>
  </ion-segment-button>
</template>

<script setup lang="ts">
import { IonSegmentButton, IonLabel, IonIcon } from '@ionic/vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';

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
