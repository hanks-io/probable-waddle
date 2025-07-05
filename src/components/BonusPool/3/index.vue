<template>
  <div v-if="tenantInfo.switch" :class="['bonus marquee', layoutType, loadingSuccess ? 'bonus-background' : '']" @click="bonusClick">
    <ImgOrSvg ref="imgRef" class="bonus-img" :src="loadImage.icon1" />
    <ion-label v-show="loadingSuccess" ref="moneyRef" class="bonus-money">{{ showMoney }}</ion-label>
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
    moneyRef,
    showMoney,
    tenantInfo,
    bonusClick,
  } = useLogic();

  const imgRef = ref<typeof ImgOrSvg | null>(null);

  const loadingSuccess = computed(() => imgRef.value?.loadingSuccess);

</script>

<style lang="less" scoped>
@import './index.less';
</style>
