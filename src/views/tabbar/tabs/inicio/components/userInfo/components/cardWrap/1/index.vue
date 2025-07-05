<template>
  <div class="scroll-box">
    <ul class="list-box">
      <template v-for="(listItem, i) in list" :key="listItem.router">
        <component v-for="item in componentList" :tab="listItem" :index="i" :key="item.key" :is="item.component" v-bind="item.options" />
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import useCardWrapLogic from '@/views/tabbar/tabs/inicio/components/userInfo/components/cardWrap/logic';

const props = defineProps({
  listMaps: {
    type: Array,
    default: () => []
  },
  componentList: {
    type: Array,
    default: () => []
  }
})

const { list } = useCardWrapLogic(props);
</script>

<style lang="less" scoped>
.scroll-box {
  width: 100%;
  overflow: auto;

  .list-box {
    display: flex;
    gap: 0.625rem;
  }
}
</style>