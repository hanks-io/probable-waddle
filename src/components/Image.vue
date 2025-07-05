<template>

  <ion-img class="w-full h-full" :class="loaded ? 'opacity-100' : 'opacity-0'" :src="props.src" @ionError="errorHandle"
    @ionImgWillLoad="loadHandle" @ionImgDidLoad="loadedHandle" />
  <!-- <ion-skeleton-text v-if="!loaded" :animated="true"/> -->

</template>

<script setup lang="ts">
import { IonImg, IonSkeletonText } from "@ionic/vue";
import { ref } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true
  }
});

const loaded = ref(false);  // 是否加载完成
const error = ref(false);   // 是否加载失败

function loadHandle() {
  loaded.value = false;
}

/**
 * @description 图片加载完成
 */
function loadedHandle() {
  loaded.value = true;
}

/**
 * @description 图片加载失败
 */
function errorHandle() {
  error.value = true;
}
</script>

<style scoped></style>
