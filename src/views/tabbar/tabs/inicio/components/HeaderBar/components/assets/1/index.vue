<template>
  <div v-if="userId" class="assets-box" v-bind="$attrs">
    <ProgressiveImages v-if="loadImage.icon2" class="assets-img" :src="loadImage.icon2"/>
    <ion-label class="currency" :style="currencyStyle">{{ merchantCy }}</ion-label>
    <ion-label class="assets-box-number" :style="numberStyle">{{ asset }}</ion-label>
    <CButton class="deposit" buttonType="text" @click="handleClick">
      <ion-icon class="deposit-icon" v-if="loadImage.icon1" slot="icon-only" :src="loadImage.icon1" />
      <ion-label v-else>{{ $t("main.entrar") }}</ion-label>
    </CButton>
  </div>
</template>

<script setup lang="ts">
import { IonLabel, IonIcon } from '@ionic/vue';
import CButton from '@/views/tabbar/tabs/inicio/components/button/index.vue';
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
  clickType: {
    type: String,
    default: 'apply'
  },
  currencyStyle: {
    type: Object,
    default: () => ({})
  },
  numberStyle: {
    type: Object,
    default: () => ({})
  }
})


const {
  asset,
  userId,
  showLogin,
  merchantCy,
  handleClick,
} = useAssetsLogic(props);

</script>

<style scoped lang="less">
@import './index.less';
</style>