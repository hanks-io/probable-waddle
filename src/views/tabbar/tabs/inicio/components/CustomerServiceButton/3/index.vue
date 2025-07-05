<template>
  <div class="support" @click="router.push('/notification')">
    <ProgressiveImages class="support-img" src="/images/support.png" />
    <div v-if="showUnRead" class="dot" />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'
import { useRouter } from "vue-router";

const props = defineProps({
  showUnRead: { type: Boolean, default: false },
});

const router = useRouter();

</script>

<style lang="less" scoped>
  @import './index.less';
</style>