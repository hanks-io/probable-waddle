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
.card{
  background: var(--color-bg-300);
  border-radius: .625rem;
  padding-bottom: .625rem;
}

ion-item {
  --background: transparent;
  --padding-bottom: 0px;
  --padding-end: 10px;
  --padding-start: 0;
  --padding-top: 0;
  --inner-padding-end: 0;
}

ion-item::part(detail-icon) {
  color: var(--color-link);
  font-size: .875rem;
  margin-right: 5px;
}

ion-label, h6 {
  font-size: .875rem !important;
  text-align: center;
}

h6 {
  margin-bottom: 5px;
}
</style>
