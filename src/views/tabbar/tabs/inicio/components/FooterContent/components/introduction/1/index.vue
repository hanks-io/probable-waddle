<template>
  <div :class="['content', layoutType]">
    <ion-label class="content-item" v-for="(item,index) in dataList" :key="index">{{ item }}</ion-label>
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import useIntroductionLogic from '@/views/tabbar/tabs/inicio/components/FooterContent/components/introduction/logic';


const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({}),
  },
  onMarkChange: {
    type: Function,
    default: () => {},
  },
  layoutType: {
    type: String,
    default: 'layout1',
  },
});

const { dataList } = useIntroductionLogic();
</script>

<style scoped lang="less">
@import './index.less';
</style>