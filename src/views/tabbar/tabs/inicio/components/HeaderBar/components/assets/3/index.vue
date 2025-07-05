<template>
  <div v-if="userId" :class="['assets-box', layoutType]" v-bind="$attrs">
    <ProgressiveImages v-if="loadImage.icon2" class="assets-img" :src="loadImage.icon2"/>
    <div class="assets-box-info">
      <div class="assets-box-info-inner">
        <ion-label class="currency" :style="currencyStyle">{{ merchantCy }}</ion-label>
        <ion-label class="assets-box-number" :style="numberStyle">{{ asset }}</ion-label>
      </div>
      <ion-label class="assets-box-intro">{{ $t("label.balance") }}</ion-label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import useAssetsLogic from '../logic';


const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  },
  loadImage: {
    type: Object,
    default: () => ({})
  },
  currencyStyle: {
    type: Object,
    default: () => ({})
  },
  numberStyle: {
    type: Object,
    default: () => ({})
  },
  layoutType: {
    type: String,
    default: 'layout1'
  }
})


const {
  asset,
  userId,
  merchantCy,
} = useAssetsLogic(props);

</script>

<style scoped lang="less">
@import './index.less';
</style>