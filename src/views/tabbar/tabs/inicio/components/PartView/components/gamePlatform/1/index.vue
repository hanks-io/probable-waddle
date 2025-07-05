<template>
  <Layout>
    <template #default="{ gamePartnerPic, ...rest }">
      <ProgressiveImages v-if="gamePlatform && gamePartnerPic" class="partner-img" :src="gamePartnerPic" v-bind="rest" alt="" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../layout.vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';

const props = defineProps({
  gamePlatform: {
    type: Boolean,
    default: true,
  },
})
</script>