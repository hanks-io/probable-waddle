<template>
  <div v-if="tenantInfo.switch" :class="['bonus', layoutType]" @click="bonusClick">
    <ImgOrSvg class="bonus-img" :src="loadImage.icon1" />
    <div class="bonus-content">
      <div class="bonus-content-inner"> 
        <ion-label class="bonus-currency">{{ merchantCy }}</ion-label>
        <ion-label class="bonus-money">{{ showMoney }}</ion-label>
      </div>
      <ion-label class="bonus-title">JACKPOT</ion-label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonLabel } from '@ionic/vue';
  import useLogic from '@/components/BonusPool/logic';
  import ImgOrSvg from '@/components/GradientSVG/imgOrSvg.vue';

  const props = defineProps({
    styleId: {
      type: String,
      default: '',
    },
    layoutType: {
      type: String,
      default: 'layout1',
    },
    componentList: {
      type: Array,
      default: () => [],
    },
    loadImage: {
      type: Object,
      default: () => { icon1: () => {} }
    }
  });

  const {
    tenantInfo,
    merchantCy,
    showMoney,
    bonusClick,
  } = useLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
