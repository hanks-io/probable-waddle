<template>
  <div class="drop-down-box">
    <div class="drop-down" :style="dropdownStyle" @click="clickDropdown">
      <div class="label-inner">
        <ion-icon class="before-icon" :icon="loadImage.beforeIcon" />
        <ion-label class="label">{{ label }}</ion-label>
      </div>
      <ion-icon :class="[renderContent ? 'up' : 'down', 'after-icon']" :icon="renderContent ? loadImage.afterIcon.up : loadImage.afterIcon.down" />
    </div>
    <div :class="['drop-down-content']" :style="contentStyle" v-show="renderContent">
      <component v-for="item in componentList" :is="item.component" :key="item.key" v-bind="item.options"/>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    IonIcon,
    IonLabel,
  } from '@ionic/vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const props = defineProps({
    componentList: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: ''
    },
    loadImage: {
      type: Object,
      default: () => ({})
    },
    dropdownStyle: {
      type: Object,
      default: () => ({})
    },
    contentStyle: {
      type: Object,
      default: () => ({})
    }
  })

  const renderContent = ref(false);
  const label = computed(() => t(props.labelKey));
  const clickDropdown = () => {
    renderContent.value = !renderContent.value;
  };
</script>

<style scoped lang="less">
@import './index.less';
</style>