<template>
  <div
    v-if="flexibleTabPosition === item.tab"
    class="flexible-tab"
    @click="navigator(item.route)"
    v-hate-keyboard
  >
    <div class="flexible-tab-box">
      <ProgressiveImages class="flexible-img-ring" :src="props.loadImage.icon2" />
      <ProgressiveImages
        class="flexible-img-main"
        :src="props.loadImage.icon1"
      />
    </div>
    <ion-label class="tab-label">{{ $t(item.text) }}</ion-label>
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import vHateKeyboard from '@/directives/hateKeyboard';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  loadImage: {
    type: Object,
    default: () => {}
  },
  navigator: {
    type: Function,
    default: () => {}
  },
  flexibleTabPosition: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="less">
@import './index.less';
</style>
