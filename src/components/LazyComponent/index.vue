<template>
  <div class="lazy-component">
    <div ref="placeholderRef" class="placeholder" :style="{ height: placeholderHeight }" v-if="!shouldRender">
      <slot name="placeholder"></slot>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { shallowRef, useTemplateRef } from "vue";

const props = withDefaults(
  defineProps<{
    rootMargin?: string; // 触发加载前的提前距离
    placeholderHeight?: string;
  }>(),
  {
    rootMargin: "300px 0px",
    placeholderHeight: "100px"
  },
);

const lazyComponentRef = useTemplateRef<HTMLDivElement>('placeholderRef');
const shouldRender = shallowRef(false);

const { stop } = useIntersectionObserver(
  lazyComponentRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      shouldRender.value = isIntersecting;
      console.log("LazyComponent: isIntersecting", shouldRender.value);
      stop(); // 停止观察
    }
  },
  {
    rootMargin: props.rootMargin,
  }
);
</script>
