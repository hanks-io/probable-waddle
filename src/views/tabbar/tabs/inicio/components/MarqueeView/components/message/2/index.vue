<template>
  <div class="badge" @click.stop="navigateToMessage">
    <ion-icon class="message" :src="loadImage.icon1" />
    <Dot :layout-type="layoutType" />
  </div>
</template>

<script setup lang="ts">
import Dot from '@/views/tabbar/tabs/inicio/components/MarqueeView/components/message/1/index.vue';
import useMessageLogic from '@/views/tabbar/tabs/inicio/components/MarqueeView/components/message/logic';


const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  },
  layoutType: {
    type: String,
    default: 'layout1'
  }
})

const { navigateToMessage } = useMessageLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>
