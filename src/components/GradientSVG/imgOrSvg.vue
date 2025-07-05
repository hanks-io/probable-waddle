<template>
  <div class="wall">
    <ProgressiveImages v-if="isImage" class="img-box" :src="props.src" @updateLoadingSuccess="updateLoadingSuccess"/>
    <ion-icon v-else :src="props.src"/>
  </div>
</template>

<script setup lang="ts">
  import { IonIcon } from '@ionic/vue';
  import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'

  const props = defineProps({
    src: { type: String, default: '' },
  });

  const loadingSuccess = ref(false);

  const isImage = computed(() => {
    const svgPattern = /\.svg$/i;
    return !svgPattern.test(props.src);
  })

  const updateLoadingSuccess = (loadingState: boolean) => {
    loadingSuccess.value = loadingState;
  }

  defineExpose({
    loadingSuccess,
  })
</script>

<style lang="less" scoped>
.wall {
  width: 100%;
  font-size: inherit;

  .img-box {
    width: 0;
    height: 0;

    &.good-img {
      width: 100%;
      height: 100%;
    }
  }

  ion-icon {
    vertical-align: super;
    font-size: inherit;
    color: inherit;
  }

}
</style>