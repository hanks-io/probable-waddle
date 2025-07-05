<template>
  <div v-if="hotGameList.length" :class="['hot-game-box', layoutType]">
    <component
      v-for="item in componentList"
      :key="item.key"
      :is="item.component"
      v-bind="item.options"
    />
  </div>
</template>


<script setup lang="ts">
import useHotGame from '../logic';


const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout1'
  },
  componentList: {
    type: Array,
    default: () => []
  },
})


const { hotGameList } = useHotGame();


</script>

<style scoped lang="less">
@import './index.less';
</style>
