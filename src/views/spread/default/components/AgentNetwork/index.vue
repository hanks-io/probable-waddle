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
  @import "@/views/spread/default/styles/AgentNetwork/base.less";
  @import "@/views/spread/default/styles/AgentNetwork/theme-style.less";

  #spread-default-components-agentNetwork.style();

  .blue-default {
    #spread-default-components-agentNetwork.style(
      --color-bg-200
    );
  }

  .green-default,
  .forest-green {
    #spread-default-components-agentNetwork.style(
      --color-bg-300
    );
  }

  .amber-purple {
    #spread-default-components-agentNetwork.style(
      --color-bg-300
    );
  }
</style>
