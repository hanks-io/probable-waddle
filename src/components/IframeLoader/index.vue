<template>
  <iframe :name="name" v-if="loading" height="100%" width="100%" iframborder="0" :src="src" @load="onLoad"
    @error="error" />
  <div v-else class="flex flex-col items-center justify-center h-full">
    <div class="text-white">
      {{ loadingText }}
    </div>
    <ion-spinner class="w-10 h-10" name="crescent" />
  </div>
</template>
<script setup lang="ts">

import { IonSpinner } from '@ionic/vue';
withDefaults(
  defineProps<{
    loading: boolean;
    src: string;
    error?: (e: Event) => void;
    onLoad?: (e: Event) => void;
    loadingText?: string;
    name?: string;
  }>(),
  {
    loading: false,
    src: '',
    error: () => { },
    onLoad: () => { },
    loadingText: '',
    name: ''
  },
);
</script>
