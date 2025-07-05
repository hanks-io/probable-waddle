<template>
  <div class="game-wrapper">
    <template v-for="item in componentList" :key="item.key">
      <template v-if="item.componentName === 'tabbar_inicio_GameWrapper_Wrapper'">
        <LazyComponent v-for="(gameArray, i) in gameList" :key="String(gameArray.id) + i">
          <component
            :is="item.component"
            :style="`order:${i * 2}`"
            v-bind="{
              ...item.options,
              ...forTabValueOptions(gameArray),
            }"
            v-intersection-directive="{ observerOptions: {rootMargin: '0px',threshold:0.5}, cb: watchBuoy, index: i, tabKey: gameArray.id }"
          />
        </LazyComponent>
      </template>
      <LazyComponent v-else>
        <component :is="item.component" />
      </LazyComponent>
    </template>
  </div>
</template>

<script setup lang="ts">
import vIntersectionDirective from '@/directives/intersection';
import LazyComponent from '@/components/LazyComponent/index.vue';
import useLogic from './logic';

const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  },
  gameList: {
    type: Array,
    default: () => []
  },
  gameWrapperOptions: {
    type: Object,
    default: () => ({})
  },
  watchBuoy: {
    type: Function,
    default: () => {}
  }
})


const {
  forTabValueOptions,
} = useLogic(props)
</script>
