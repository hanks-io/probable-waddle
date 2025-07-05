<template>
  <span
    v-if="messageQuantity"
    :class="['dot', layoutType]"
    @click.stop="navigateToMessage"
  >{{messageQuantity}}
  </span>
</template>

<script setup lang="ts">
import useMessageLogic from '@/views/tabbar/tabs/inicio/components/MarqueeView/components/message/logic';

const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout1'
  }
})

const { messageQuantity, navigateToMessage } = useMessageLogic(props);
</script>

<style lang="less" scoped>
@import './index.less';
</style>
