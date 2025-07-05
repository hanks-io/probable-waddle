<template>
  <div class="card h-full overflow-y-auto p-[10px] overflow-x-hidden" v-html="customTutorialHtml" v-if="customTutorial"/>
  <div class="card h-full overflow-y-auto overflow-x-hidden" v-else>
    <New></New>
  </div>
</template>

<script setup lang="ts">
import New from './components/Newest.vue';
import { useAgentNetworkLogic } from '@/views/spread/hooks/agentNetworkLogic'

const {
  customTutorialHtml,
  customTutorial
} = useAgentNetworkLogic();

</script>

<style scoped lang="less">
@import '@/views/spread/first/styles/AgentNetwork/base-index.less';

.new-skin-symbol {
  @import '@/views/spread/first/styles/AgentNetwork/theme-style.less';
}
</style>
