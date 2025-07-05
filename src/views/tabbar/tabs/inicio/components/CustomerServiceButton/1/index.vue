<template>
  <div class="support" @click="router.push('/notification')">
    <ion-icon src="/first/svg/support.svg" />
    <div v-if="showUnRead" class="dot" />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { useRouter } from "vue-router";

const props = defineProps({
  showUnRead: { type: Boolean, default: false },
});

const router = useRouter();

</script>

<style lang="less" scoped>
  @import './index.less';
</style>